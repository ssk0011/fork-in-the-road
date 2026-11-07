import { describe, expect, it } from 'vitest';
import { DISHES } from '../data/dishes';
import { dislikeNote, origin } from './copy';

describe('origin', () => {
  it('names the subregion when a dish has one', () => {
    const avial = DISHES.find((dish) => dish.name === 'Avial')!;
    expect(origin(avial)).toBe('Indian (Kerala), South Asia');
  });

  it('leaves other dishes as cuisine and region', () => {
    const dosa = DISHES.find((dish) => dish.name === 'Masala Dosa')!;
    expect(origin(dosa)).toBe('Indian, South Asia');
  });
});

describe('dislikeNote', () => {
  it('names the disliked ingredients and suggests asking', () => {
    expect(dislikeNote(['mushrooms', 'raw-onion'])).toBe(
      'Usually has mushrooms and raw onion. Many places will leave that out if you ask.',
    );
    expect(dislikeNote([])).toBeNull();
  });
});
