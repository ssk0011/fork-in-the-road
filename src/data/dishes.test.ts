import { describe, expect, it } from 'vitest';
import { contrastLine } from '../engine/contrast';
import { applyReason, reasonsFor } from '../engine/reasons';
import { candidates, createSession, finalPicks, proposeNext } from '../engine/select';
import type { Dish, Settings } from '../engine/types';
import { CUISINES } from './cuisines';
import { DISHES } from './dishes';

const REGIONS = [
  'south-asia',
  'southeast-asia',
  'east-asia',
  'middle-east',
  'mediterranean',
  'caucasus-eastern-europe',
  'africa',
  'latin-america',
  'caribbean',
  'north-america',
];
const FORMATS = [
  'soup',
  'stew',
  'bowl',
  'noodles',
  'dumpling',
  'handheld',
  'bread',
  'plate',
  'grill',
  'salad',
];
const TEXTURES = ['crunchy', 'creamy', 'chewy', 'brothy', 'tender', 'fresh'];

function tiredCombos(): string[][] {
  const combos: string[][] = [];
  const walk = (start: number, picked: string[]) => {
    if (picked.length > 0) combos.push(picked);
    if (picked.length === 4) return;
    for (let index = start; index < CUISINES.length; index += 1) {
      walk(index + 1, [...picked, CUISINES[index]!]);
    }
  };
  walk(0, []);
  return combos;
}

describe('dish data', () => {
  it('has about 60 dishes', () => {
    expect(DISHES.length).toBeGreaterThanOrEqual(60);
  });

  it('has unique ids', () => {
    expect(new Set(DISHES.map((dish) => dish.id)).size).toBe(DISHES.length);
  });

  it.each(DISHES.map((dish) => [dish.name, dish] as const))('%s is valid', (_, dish) => {
    expect(CUISINES as readonly string[]).toContain(dish.cuisine);
    expect(REGIONS).toContain(dish.region);
    expect(FORMATS).toContain(dish.format);
    expect(TEXTURES).toContain(dish.texture);
    expect(dish.blurb.length).toBeGreaterThan(0);
    expect(dish.blurb.length).toBeLessThanOrEqual(90);
    expect(dish.richness).toBeGreaterThanOrEqual(1);
    expect(dish.richness).toBeLessThanOrEqual(5);
    expect(dish.heat).toBeGreaterThanOrEqual(0);
    expect(dish.heat).toBeLessThanOrEqual(4);
    expect(dish.size).toBeGreaterThanOrEqual(1);
    expect(dish.size).toBeLessThanOrEqual(5);
    expect(dish.price).toBeGreaterThanOrEqual(1);
    expect(dish.price).toBeLessThanOrEqual(3);
    expect(dish.familiarity).toBeGreaterThanOrEqual(1);
    expect(dish.familiarity).toBeLessThanOrEqual(5);
    expect(dish.searchName.length).toBeGreaterThan(0);
  });

  it('gives every cuisine at least 3 dishes', () => {
    for (const cuisine of CUISINES) {
      expect(DISHES.filter((dish) => dish.cuisine === cuisine).length).toBeGreaterThanOrEqual(3);
    }
  });
});

describe('dish data with the engine', () => {
  it('always has a first dish, for every possible setup', () => {
    for (const tired of tiredCombos()) {
      for (const hunger of [1, 2, 3, 4, 5]) {
        for (const budget of [1, 2, 3]) {
          const session = createSession({ tired, hunger, budget, adventure: 2 }, [], 1);
          if (candidates(session, DISHES).length === 0) {
            throw new Error(`No dish for ${tired.join(', ')} / ${hunger} / ${budget}`);
          }
        }
      }
    }
  });

  it('never lies in a contrast line', () => {
    const tiredSets = [['Indian'], ['Mexican', 'Chinese'], ['Korean', 'Jamaican', 'Greek']];
    for (const tired of tiredSets) {
      const pool = DISHES.filter((dish) => tired.includes(dish.cuisine));
      for (const dish of DISHES) {
        const text = contrastLine(dish, tired, DISHES).toLowerCase();
        const most = (past: (other: Dish) => boolean) =>
          expect(pool.filter(past).length).toBeGreaterThan(pool.length / 2);
        if (text.includes('lighter')) most((other) => other.richness > dish.richness);
        if (text.includes('richer')) most((other) => other.richness < dish.richness);
        if (text.includes('milder')) most((other) => other.heat > dish.heat);
        if (text.includes('hotter')) most((other) => other.heat < dish.heat);
      }
    }
  });

  it('ends within 5 proposals for random sessions, with no crashes', () => {
    let state = 7;
    const next = (limit: number) => {
      state = (state * 31 + 11) % 10007;
      return state % limit;
    };
    for (let round = 0; round < 500; round += 1) {
      const settings: Settings = {
        tired: [CUISINES[next(20)]!, CUISINES[next(20)]!],
        hunger: next(5) + 1,
        budget: next(3) + 1,
        adventure: next(3) + 1,
      };
      let session = createSession(settings, [], round);
      let proposals = 0;
      for (let result = proposeNext(session, DISHES); result; ) {
        proposals += 1;
        const options = reasonsFor(result.dish);
        const reason = options[next(options.length)]!;
        session = applyReason(result.session, result.dish, reason.id);
        result = proposeNext(session, DISHES);
      }
      expect(proposals).toBeLessThanOrEqual(5);
      expect(Array.isArray(finalPicks(session, DISHES))).toBe(true);
    }
  });
});
