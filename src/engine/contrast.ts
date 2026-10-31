import { regionDistance, tiredDishes } from './novelty';
import type { Dish } from './types';

const RICHNESS_GAP = 0.75;
const HEAT_GAP = 1;

function average(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function joinComparisons(richness: string | null, heat: string | null): string | null {
  if (richness && heat) {
    // "and" when both pull the same way, "but" when they pull apart.
    const sameWay = (richness === 'lighter') === (heat === 'milder');
    return `${capitalize(richness)} ${sameWay ? 'and' : 'but'} ${heat}`;
  }
  const single = richness ?? heat;
  return single ? capitalize(single) : null;
}

// Every clause is derived from the data, so the line can't contradict the dish.
export function contrastLine(dish: Dish, tired: string[], dishes: readonly Dish[]): string {
  const pool = tiredDishes(tired, dishes);
  if (pool.length === 0) return 'A fresh direction for tonight.';

  const richnessGap = dish.richness - average(pool.map((other) => other.richness));
  const heatGap = dish.heat - average(pool.map((other) => other.heat));
  const richness =
    richnessGap <= -RICHNESS_GAP ? 'lighter' : richnessGap >= RICHNESS_GAP ? 'richer' : null;
  const heat = heatGap <= -HEAT_GAP ? 'milder' : heatGap >= HEAT_GAP ? 'hotter' : null;

  const distance = Math.min(...pool.map((other) => regionDistance(dish.region, other.region)));
  const comparison = joinComparisons(richness, heat);
  const familiarShape = pool.some((other) => other.format === dish.format);

  if (distance === 0) {
    if (comparison) return `${comparison} than most of what you've been eating, from a new kitchen.`;
    return familiarShape
      ? 'Same part of the map, different kitchen.'
      : 'Same part of the map, but a different kind of dish entirely.';
  }

  const place = distance === 1 ? 'a different corner of the map' : 'a neighboring part of the map';
  if (comparison) return `${comparison} than most of what you've been eating, and from ${place}.`;
  return `Similar weight and heat to what you've been eating, but from ${place}.`;
}
