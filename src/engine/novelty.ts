import type { Dish, Region } from './types';

const ADJACENT: Record<Region, Region[]> = {
  'south-asia': ['southeast-asia', 'middle-east', 'east-asia'],
  'southeast-asia': ['south-asia', 'east-asia'],
  'east-asia': ['southeast-asia', 'south-asia'],
  'middle-east': ['south-asia', 'mediterranean', 'caucasus-eastern-europe', 'africa'],
  mediterranean: ['middle-east', 'caucasus-eastern-europe', 'africa'],
  'caucasus-eastern-europe': ['middle-east', 'mediterranean'],
  africa: ['middle-east', 'mediterranean', 'caribbean'],
  'latin-america': ['caribbean', 'north-america'],
  caribbean: ['latin-america', 'north-america', 'africa'],
  'north-america': ['latin-america', 'caribbean'],
};

export function regionDistance(a: Region, b: Region): number {
  if (a === b) return 0;
  return ADJACENT[a].includes(b) ? 0.5 : 1;
}

export function tiredDishes(tired: string[], dishes: readonly Dish[]): Dish[] {
  return dishes.filter((dish) => tired.includes(dish.cuisine));
}

function shareOf(pool: Dish[], matches: (dish: Dish) => boolean): number {
  return pool.filter(matches).length / pool.length;
}

// 1 means nothing like the tired cuisines, 0 means right on top of them.
export function novelty(dish: Dish, tired: string[], dishes: readonly Dish[]): number {
  const pool = tiredDishes(tired, dishes);
  if (pool.length === 0) return 1;

  const region = Math.min(...pool.map((other) => regionDistance(dish.region, other.region)));
  const format = 1 - shareOf(pool, (other) => other.format === dish.format);
  const ingredient = 1 - shareOf(pool, (other) => other.mainIngredient === dish.mainIngredient);
  const texture = 1 - shareOf(pool, (other) => other.texture === dish.texture);

  return 0.5 * region + 0.25 * format + 0.25 * ((ingredient + texture) / 2);
}
