import { novelty } from './novelty';
import { createRng } from './rng';
import type { Constraints, Dish, Session, Settings } from './types';

export const MAX_PROPOSALS = 5;
export const WIDEN_AFTER_NOS = 3;

const NOVELTY_TARGETS = [0.35, 0.6, 0.85];
const TOP_POOL = 5;
const FINAL_PICKS = 3;

export function emptyConstraints(): Constraints {
  return {
    excludedIngredients: [],
    excludedFormats: [],
    penalizedTextures: [],
    penalizedCuisines: [],
    noveltyBoost: 0,
  };
}

export function createSession(
  settings: Settings,
  recentlyAccepted: string[],
  seed: number,
): Session {
  return {
    ...settings,
    seed,
    recentlyAccepted,
    rejected: new Set(),
    constraints: emptyConstraints(),
    consecutiveNos: 0,
    shown: 0,
  };
}

export function noveltyTarget(session: Session): number {
  const base = NOVELTY_TARGETS[session.adventure - 1] ?? 0.6;
  return Math.min(1, base + session.constraints.noveltyBoost);
}

function isWidened(session: Session): boolean {
  return session.consecutiveNos >= WIDEN_AFTER_NOS;
}

// Never relaxed, not even for the final pick.
function passesHardFilters(dish: Dish, session: Session): boolean {
  return (
    !session.rejected.has(dish.id) &&
    !session.recentlyAccepted.includes(dish.id) &&
    !session.tired.includes(dish.cuisine) &&
    dish.price <= session.budget
  );
}

// A reason the user just gave outranks the hunger they picked in setup, so
// "not filling enough" lifts the floor of the size window instead of emptying it.
function fitsHunger(dish: Dish, session: Session): boolean {
  const reach = isWidened(session) ? 2 : 1;
  const { minSize } = session.constraints;
  const low = minSize ?? session.hunger - reach;
  const high = Math.max(session.hunger + reach, (minSize ?? 0) + 1);
  return dish.size >= low && dish.size <= high;
}

function softViolations(dish: Dish, session: Session): number {
  const c = session.constraints;
  const broken = [
    !fitsHunger(dish, session),
    c.maxRichness !== undefined && dish.richness > c.maxRichness,
    c.maxHeat !== undefined && dish.heat > c.maxHeat,
    c.maxPrice !== undefined && dish.price > c.maxPrice,
    c.minFamiliarity !== undefined && dish.familiarity < c.minFamiliarity,
    c.excludedIngredients.includes(dish.mainIngredient),
    c.excludedFormats.includes(dish.format),
  ];
  return broken.filter(Boolean).length;
}

export function candidates(session: Session, dishes: readonly Dish[]): Dish[] {
  return dishes.filter(
    (dish) => passesHardFilters(dish, session) && softViolations(dish, session) === 0,
  );
}

export function score(dish: Dish, session: Session, dishes: readonly Dish[]): number {
  const tolerance = isWidened(session) ? 0.15 : 0;
  const gap = Math.abs(novelty(dish, session.tired, dishes) - noveltyTarget(session));
  let result = 1 - Math.max(0, gap - tolerance);

  if (session.adventure === 1) result -= (0.15 * (5 - dish.familiarity)) / 4;
  if (session.constraints.penalizedTextures.includes(dish.texture)) result -= 0.1;
  if (session.constraints.penalizedCuisines.includes(dish.cuisine)) result -= 0.1;
  return result;
}

function byScore(session: Session, dishes: readonly Dish[]) {
  return (a: Dish, b: Dish) =>
    score(b, session, dishes) - score(a, session, dishes) || a.id.localeCompare(b.id);
}

function weightedPick(pool: Dish[], weights: number[], roll: number): Dish | null {
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let remaining = roll * total;
  for (const [index, dish] of pool.entries()) {
    remaining -= weights[index] ?? 0;
    if (remaining < 0) return dish;
  }
  return pool[pool.length - 1] ?? null;
}

// Returns the next dish and the session that counts it as shown, or null when
// the session is over and the final pick should take over.
export function proposeNext(
  session: Session,
  dishes: readonly Dish[],
): { dish: Dish; session: Session } | null {
  if (session.shown >= MAX_PROPOSALS) return null;

  const pool = candidates(session, dishes).sort(byScore(session, dishes)).slice(0, TOP_POOL);
  // A lower exponent flattens the odds, which is the "more randomness" after 3 nos.
  const sharpness = isWidened(session) ? 1 : 4;
  const weights = pool.map((dish) => Math.max(0.01, score(dish, session, dishes)) ** sharpness);
  const rng = createRng(session.seed + session.shown);
  const dish = weightedPick(pool, weights, rng());

  return dish ? { dish, session: { ...session, shown: session.shown + 1 } } : null;
}

// Soft constraints stop being filters here but still push worse matches down.
export function finalPicks(session: Session, dishes: readonly Dish[]): Dish[] {
  const rank = (dish: Dish) => score(dish, session, dishes) - 0.25 * softViolations(dish, session);
  return dishes
    .filter((dish) => passesHardFilters(dish, session))
    .sort((a, b) => rank(b) - rank(a) || a.id.localeCompare(b.id))
    .slice(0, FINAL_PICKS);
}
