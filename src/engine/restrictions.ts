import type { ContainsTag, Dish } from './types';

const ANIMAL_FLESH: ContainsTag[] = ['pork', 'beef', 'meat', 'poultry', 'fish', 'shellfish'];

export const RESTRICTIONS = [
  { id: 'vegetarian', label: 'Vegetarian', excludes: ANIMAL_FLESH },
  { id: 'vegan', label: 'Vegan', excludes: [...ANIMAL_FLESH, 'egg', 'dairy'] },
  {
    id: 'halal-friendly',
    label: 'Halal-friendly: no pork or alcohol',
    excludes: ['pork', 'alcohol'],
  },
  { id: 'no-beef', label: 'No beef', excludes: ['beef'] },
  { id: 'no-shellfish', label: 'No shellfish', excludes: ['shellfish'] },
  { id: 'no-gluten', label: 'No gluten', excludes: ['gluten'] },
  { id: 'no-dairy', label: 'No dairy', excludes: ['dairy'] },
  { id: 'no-peanuts', label: 'No peanuts', excludes: ['peanut'] },
  { id: 'no-tree-nuts', label: 'No tree nuts', excludes: ['tree-nut'] },
] as const satisfies readonly { id: string; label: string; excludes: readonly ContainsTag[] }[];

export type RestrictionId = (typeof RESTRICTIONS)[number]['id'];

export function fitsRestrictions(dish: Dish, restrictions: readonly string[]): boolean {
  const excluded = RESTRICTIONS.filter((item) => restrictions.includes(item.id)).flatMap(
    (item): readonly ContainsTag[] => item.excludes,
  );
  return !dish.contains.some((tag) => excluded.includes(tag));
}
