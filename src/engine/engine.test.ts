import { describe, expect, it } from 'vitest';
import { contrastLine } from './contrast';
import { novelty, regionDistance } from './novelty';
import { applyReason, reasonsFor } from './reasons';
import {
  candidates,
  createSession,
  finalPicks,
  MAX_PROPOSALS,
  noveltyTarget,
  proposeNext,
  score,
} from './select';
import type { Dish, Session, Settings } from './types';

function dish(id: string, overrides: Partial<Dish> = {}): Dish {
  return {
    id,
    name: id,
    cuisine: 'Thai',
    region: 'southeast-asia',
    blurb: 'A test dish.',
    richness: 3,
    heat: 2,
    size: 3,
    price: 2,
    familiarity: 3,
    format: 'bowl',
    mainIngredient: `ingredient-${id}`,
    texture: 'tender',
    searchName: id,
    contains: [],
    ...overrides,
  };
}

const settings: Settings = {
  tired: ['Indian'],
  restrictions: [],
  hunger: 3,
  budget: 3,
  adventure: 2,
};
const tiredDish = dish('tired', {
  cuisine: 'Indian',
  region: 'south-asia',
  richness: 4,
  heat: 3,
  format: 'stew',
  mainIngredient: 'chicken',
  texture: 'creamy',
});

function session(overrides: Partial<Session> = {}): Session {
  return { ...createSession(settings, [], 1), ...overrides };
}

function ids(dishes: Dish[]): string[] {
  return dishes.map((item) => item.id);
}

describe('hard filters', () => {
  it('drops tired cuisines, over-budget, rejected and recently accepted dishes', () => {
    const dishes = [
      tiredDish,
      dish('keep'),
      dish('pricey', { price: 3 }),
      dish('seen'),
      dish('eaten'),
    ];
    const current = session({
      budget: 2,
      rejected: new Set(['seen']),
      recentlyAccepted: ['eaten'],
    });
    expect(ids(candidates(current, dishes))).toEqual(['keep']);
  });

  it('keeps size within 1 of hunger, widening to 2 after 3 nos', () => {
    const dishes = [dish('near', { size: 4 }), dish('far', { size: 5 })];
    expect(ids(candidates(session(), dishes))).toEqual(['near']);
    expect(ids(candidates(session({ consecutiveNos: 3 }), dishes))).toEqual(['near', 'far']);
  });
});

describe('dietary restrictions', () => {
  const pork = dish('pork', { contains: ['pork'] });
  const egg = dish('egg', { contains: ['egg'] });
  const plain = dish('plain');

  it('removes dishes containing a restricted ingredient', () => {
    expect(ids(candidates(session({ restrictions: ['vegetarian'] }), [pork, egg, plain]))).toEqual([
      'egg',
      'plain',
    ]);
    expect(ids(candidates(session({ restrictions: ['vegan'] }), [pork, egg, plain]))).toEqual([
      'plain',
    ]);
  });

  it('combines restrictions', () => {
    const current = session({ restrictions: ['no-beef', 'no-gluten'] });
    const dishes = [dish('beef', { contains: ['beef'] }), dish('wheat', { contains: ['gluten'] })];
    expect(candidates(current, [...dishes, plain])).toEqual([plain]);
  });

  it('is never relaxed for the final pick', () => {
    const current = session({ restrictions: ['vegetarian'], hunger: 1 });
    const huge = dish('huge', { size: 5 });
    expect(candidates(current, [pork, huge])).toEqual([]);
    expect(ids(finalPicks(current, [pork, huge]))).toEqual(['huge']);
  });
});

describe('reasons', () => {
  const heavy = dish('shown', { richness: 4, heat: 3, size: 2, price: 3, familiarity: 2 });

  it('caps the list at 6 and always keeps the closing reasons', () => {
    const reasons = reasonsFor(heavy).map((reason) => reason.id);
    expect(reasons).toHaveLength(6);
    expect(reasons.slice(-2)).toEqual(['too-similar', 'not-feeling']);
    expect(reasons).toEqual([
      'too-heavy',
      'not-filling',
      'too-spicy',
      'too-pricey',
      'too-similar',
      'not-feeling',
    ]);
  });

  it('only offers reasons that apply to the dish', () => {
    const plain = dish('plain', { richness: 1, heat: 0, size: 4, price: 1, familiarity: 5 });
    expect(reasonsFor(plain).map((reason) => reason.id)).toEqual([
      'ingredient',
      'too-similar',
      'not-feeling',
    ]);
  });

  it('too heavy requires lower richness', () => {
    const dishes = [dish('rich', { richness: 3 }), dish('light', { richness: 2 })];
    const next = applyReason(session(), dish('shown', { richness: 3 }), 'too-heavy');
    expect(ids(candidates(next, dishes))).toEqual(['light']);
  });

  it('not filling requires a bigger dish', () => {
    const dishes = [dish('same', { size: 3 }), dish('big', { size: 4 })];
    const next = applyReason(session(), dish('shown', { size: 3 }), 'not-filling');
    expect(ids(candidates(next, dishes))).toEqual(['big']);
  });

  it('not filling beats the hunger window instead of emptying it', () => {
    const peckish = session({ hunger: 1 });
    const next = applyReason(peckish, dish('shown', { size: 2 }), 'not-filling');
    expect(ids(candidates(next, [dish('bigger', { size: 3 })]))).toEqual(['bigger']);
  });

  it('too spicy requires lower heat', () => {
    const dishes = [dish('hot', { heat: 2 }), dish('mild', { heat: 1 })];
    const next = applyReason(session(), dish('shown', { heat: 2 }), 'too-spicy');
    expect(ids(candidates(next, dishes))).toEqual(['mild']);
  });

  it('too pricey caps price', () => {
    const dishes = [dish('same', { price: 2 }), dish('cheap', { price: 1 })];
    const next = applyReason(session(), dish('shown', { price: 2 }), 'too-pricey');
    expect(ids(candidates(next, dishes))).toEqual(['cheap']);
  });

  it('too unfamiliar requires higher familiarity', () => {
    const dishes = [dish('odd', { familiarity: 2 }), dish('known', { familiarity: 3 })];
    const next = applyReason(session(), dish('shown', { familiarity: 2 }), 'too-unfamiliar');
    expect(ids(candidates(next, dishes))).toEqual(['known']);
  });

  it('ingredient excludes the ingredient and penalizes the texture', () => {
    const shown = dish('shown', { mainIngredient: 'lamb', texture: 'chewy' });
    const dishes = [
      dish('lamb', { mainIngredient: 'lamb' }),
      dish('chewy', { texture: 'chewy' }),
      dish('other'),
    ];
    const next = applyReason(session(), shown, 'ingredient');
    expect(ids(candidates(next, dishes))).toEqual(['chewy', 'other']);
    expect(score(dishes[1]!, next, dishes)).toBeCloseTo(score(dishes[1]!, session(), dishes) - 0.1);
  });

  it('too similar raises the target and excludes the format, capped at 1', () => {
    const adventurous = session({ adventure: 3 });
    const next = applyReason(adventurous, dish('shown', { format: 'soup' }), 'too-similar');
    expect(noveltyTarget(next)).toBe(1);
    expect(noveltyTarget(applyReason(session(), dish('a'), 'too-similar'))).toBeCloseTo(0.75);
    expect(ids(candidates(next, [dish('soup', { format: 'soup' }), dish('bowl')]))).toEqual([
      'bowl',
    ]);
  });

  it('not feeling it excludes the dish and lightly penalizes its cuisine', () => {
    const shown = dish('shown', { cuisine: 'Korean' });
    const twin = dish('twin', { cuisine: 'Korean' });
    const next = applyReason(session(), shown, 'not-feeling');
    expect(ids(candidates(next, [shown, twin]))).toEqual(['twin']);
    expect(score(twin, next, [twin])).toBeCloseTo(score(twin, session(), [twin]) - 0.1);
  });

  it('keeps the tightest limit across repeated reasons', () => {
    const first = applyReason(session(), dish('a', { heat: 3 }), 'too-spicy');
    const second = applyReason(first, dish('b', { heat: 4 }), 'too-spicy');
    expect(second.constraints.maxHeat).toBe(2);
  });
});

describe('novelty', () => {
  it('scores region distance as same, adjacent or far', () => {
    expect(regionDistance('south-asia', 'south-asia')).toBe(0);
    expect(regionDistance('south-asia', 'southeast-asia')).toBe(0.5);
    expect(regionDistance('south-asia', 'latin-america')).toBe(1);
  });

  it('treats adjacency as symmetric', () => {
    expect(regionDistance('africa', 'caribbean')).toBe(regionDistance('caribbean', 'africa'));
  });

  it('ranks a far, different dish above a close, similar one', () => {
    const close = dish('close', {
      region: 'south-asia',
      format: 'stew',
      mainIngredient: 'chicken',
      texture: 'creamy',
    });
    const far = dish('far', { region: 'latin-america', format: 'salad', texture: 'fresh' });
    const dishes = [tiredDish, close, far];
    expect(novelty(far, ['Indian'], dishes)).toBe(1);
    expect(novelty(close, ['Indian'], dishes)).toBe(0);
  });

  it('targets novelty by adventure level', () => {
    expect(noveltyTarget(session({ adventure: 1 }))).toBe(0.35);
    expect(noveltyTarget(session({ adventure: 2 }))).toBe(0.6);
    expect(noveltyTarget(session({ adventure: 3 }))).toBe(0.85);
  });

  it('penalizes low familiarity only on the gentlest setting', () => {
    const known = dish('known', { familiarity: 5 });
    const odd = dish('odd', { familiarity: 1 });
    const gentle = session({ adventure: 1 });
    expect(score(known, gentle, [known]) - score(odd, gentle, [odd])).toBeCloseTo(0.15);
    const bold = session({ adventure: 3 });
    expect(score(known, bold, [known])).toBe(score(odd, bold, [odd]));
  });
});

describe('termination and empty sets', () => {
  const many = Array.from({ length: 12 }, (_, index) => dish(`dish-${index}`));

  it('stops after 5 proposals', () => {
    let current = session();
    for (let count = 0; count < MAX_PROPOSALS; count += 1) {
      const result = proposeNext(current, many);
      expect(result).not.toBeNull();
      current = applyReason(result!.session, result!.dish, 'not-feeling');
    }
    expect(current.shown).toBe(5);
    expect(proposeNext(current, many)).toBeNull();
  });

  it('never repeats a dish within a session', () => {
    let current = session();
    const seen = new Set<string>();
    for (let count = 0; count < MAX_PROPOSALS; count += 1) {
      const result = proposeNext(current, many)!;
      expect(seen.has(result.dish.id)).toBe(false);
      seen.add(result.dish.id);
      current = applyReason(result.session, result.dish, 'not-feeling');
    }
  });

  it('returns null rather than crashing on an empty set', () => {
    expect(proposeNext(session(), [])).toBeNull();
    expect(finalPicks(session(), [])).toEqual([]);
  });

  it('relaxes soft constraints for the final pick but keeps hard ones', () => {
    const current = applyReason(
      session({ tired: ['Indian'], budget: 2 }),
      dish('shown', { heat: 2 }),
      'too-spicy',
    );
    const dishes = [
      tiredDish,
      dish('shown', { heat: 2 }),
      dish('over', { price: 3 }),
      dish('spicy', { heat: 3 }),
      dish('huge', { size: 5, heat: 0 }),
    ];
    expect(candidates(current, dishes)).toEqual([]);
    expect(ids(finalPicks(current, dishes)).sort()).toEqual(['huge', 'spicy']);
  });

  it('prefers dishes that break fewer constraints in the final pick', () => {
    const current = applyReason(session(), dish('shown', { heat: 2 }), 'too-spicy');
    const dishes = [dish('spicy', { heat: 3 }), dish('mild', { heat: 0 })];
    expect(ids(finalPicks(current, dishes))).toEqual(['mild', 'spicy']);
  });

  it('shows at most 3 final picks', () => {
    expect(finalPicks(session(), many)).toHaveLength(3);
  });
});

describe('determinism', () => {
  const many = Array.from({ length: 12 }, (_, index) =>
    dish(`dish-${index}`, { format: index % 2 ? 'soup' : 'salad', texture: 'fresh' }),
  );

  it('gives the same dish for the same seed', () => {
    const one = proposeNext(session({ seed: 42 }), many);
    const two = proposeNext(session({ seed: 42 }), many);
    expect(one?.dish.id).toBe(two?.dish.id);
  });

  it('varies across seeds', () => {
    const picks = new Set(
      Array.from({ length: 40 }, (_, seed) => proposeNext(session({ seed }), many)?.dish.id),
    );
    expect(picks.size).toBeGreaterThan(1);
  });
});

describe('contrast line', () => {
  const line = (candidate: Dish) => contrastLine(candidate, ['Indian'], [tiredDish, candidate]);

  it('calls a dish lighter and milder from far away', () => {
    expect(line(dish('a', { richness: 1, heat: 0, region: 'latin-america' }))).toBe(
      "Lighter and milder than most of what you've been eating, and from a different corner of the map.",
    );
  });

  it('uses but when the differences pull apart', () => {
    expect(line(dish('a', { richness: 1, heat: 4 }))).toContain('Lighter but hotter');
  });

  it('calls a dish richer when it is', () => {
    expect(line(dish('a', { richness: 5, heat: 3 }))).toContain('Richer than');
  });

  it('does not claim a difference that is not in the data', () => {
    const text = line(dish('a', { richness: 4, heat: 3, region: 'latin-america' }));
    expect(text).toBe(
      "Similar weight and heat to what you've been eating, but from a different corner of the map.",
    );
  });

  it('names a neighboring region correctly', () => {
    expect(line(dish('a', { richness: 4, heat: 3 }))).toContain('from one region over');
  });

  it('only says "than most" when most dishes really are past it', () => {
    const tired = [0, 4, 0].map((heat, index) =>
      dish(`tired-${index}`, {
        cuisine: 'Chinese',
        region: 'east-asia',
        heat: heat as Dish['heat'],
      }),
    );
    const mild = dish('mild', { heat: 0, region: 'latin-america', richness: 3 });
    expect(contrastLine(mild, ['Chinese'], [...tired, mild])).not.toContain('Milder');
  });

  it('handles the same region with the same or a different format', () => {
    const near = { richness: 4, heat: 3, region: 'south-asia' } as const;
    expect(line(dish('a', { ...near, format: 'stew' }))).toBe(
      'Same part of the map, different kitchen.',
    );
    expect(line(dish('a', { ...near, format: 'salad' }))).toBe(
      'Same part of the map, but a different kind of dish entirely.',
    );
  });
});
