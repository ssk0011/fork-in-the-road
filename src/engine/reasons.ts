import type { Constraints, Dish, ReasonId, Session } from './types';

export type Reason = { id: ReasonId; label: string };

const LABELS: Record<ReasonId, string> = {
  'too-heavy': 'Too heavy',
  'not-filling': 'Not filling enough',
  'too-spicy': 'Too spicy',
  'too-pricey': 'Too pricey',
  'too-unfamiliar': 'Too unfamiliar',
  ingredient: 'Not into the main ingredient or texture',
  'too-similar': "Too similar to what I'm tired of",
  'not-feeling': 'Just not feeling it',
};

const MAX_REASONS = 6;

// Listed in priority order. Two slots always go to the closing reasons.
export function reasonsFor(dish: Dish): Reason[] {
  const specific: ReasonId[] = [];
  if (dish.richness >= 3) specific.push('too-heavy');
  if (dish.size <= 3) specific.push('not-filling');
  if (dish.heat >= 2) specific.push('too-spicy');
  if (dish.price >= 2) specific.push('too-pricey');
  if (dish.familiarity <= 3) specific.push('too-unfamiliar');
  specific.push('ingredient');

  const closing: ReasonId[] = ['too-similar', 'not-feeling'];
  return [...specific.slice(0, MAX_REASONS - closing.length), ...closing].map((id) => ({
    id,
    label: LABELS[id],
  }));
}

function tighten(current: number | undefined, next: number, pick: typeof Math.min): number {
  return current === undefined ? next : pick(current, next);
}

function addConstraint(constraints: Constraints, dish: Dish, reason: ReasonId): Constraints {
  switch (reason) {
    case 'too-heavy':
      return {
        ...constraints,
        maxRichness: tighten(constraints.maxRichness, dish.richness - 1, Math.min),
      };
    case 'not-filling':
      return { ...constraints, minSize: tighten(constraints.minSize, dish.size + 1, Math.max) };
    case 'too-spicy':
      return { ...constraints, maxHeat: tighten(constraints.maxHeat, dish.heat - 1, Math.min) };
    case 'too-pricey':
      return { ...constraints, maxPrice: tighten(constraints.maxPrice, dish.price - 1, Math.min) };
    case 'too-unfamiliar':
      return {
        ...constraints,
        minFamiliarity: tighten(constraints.minFamiliarity, dish.familiarity + 1, Math.max),
      };
    case 'ingredient':
      return {
        ...constraints,
        excludedIngredients: [...constraints.excludedIngredients, dish.mainIngredient],
        penalizedTextures: [...constraints.penalizedTextures, dish.texture],
      };
    case 'too-similar':
      return {
        ...constraints,
        noveltyBoost: constraints.noveltyBoost + 0.15,
        excludedFormats: [...constraints.excludedFormats, dish.format],
      };
    case 'not-feeling':
      return {
        ...constraints,
        penalizedCuisines: [...constraints.penalizedCuisines, dish.cuisine],
      };
  }
}

export function applyReason(session: Session, dish: Dish, reason: ReasonId): Session {
  return {
    ...session,
    rejected: new Set([...session.rejected, dish.id]),
    constraints: addConstraint(session.constraints, dish, reason),
    consecutiveNos: session.consecutiveNos + 1,
  };
}
