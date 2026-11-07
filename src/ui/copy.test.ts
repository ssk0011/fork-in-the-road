import { describe, expect, it } from 'vitest';
import { DISHES } from '../data/dishes';
import { origin } from './copy';

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
