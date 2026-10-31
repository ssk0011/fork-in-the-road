import type { Dish, Region } from '../engine';

const REGION_NAMES: Record<Region, string> = {
  'south-asia': 'South Asia',
  'southeast-asia': 'Southeast Asia',
  'east-asia': 'East Asia',
  'middle-east': 'the Middle East',
  mediterranean: 'the Mediterranean',
  'caucasus-eastern-europe': 'the Caucasus',
  africa: 'Africa',
  'latin-america': 'Latin America',
  caribbean: 'the Caribbean',
  'north-america': 'North America',
};

const COUNTER_LINES = [
  "Let's see how this one sits.",
  "We'll find it, I promise.",
  'Getting warmer, I can tell.',
  'Almost there. Stay with me.',
  'Last one from me.',
];

const HEAT = ['No heat', 'A little heat', 'Some heat', 'Hot', 'Very hot'];
const RICHNESS = ['Very light', 'Light', 'Medium', 'Rich', 'Very rich'];

export function rutLine(tired: string[]): string {
  if (tired.includes('Indian')) return "Let's get you out of the curry rut.";
  const [only] = tired;
  if (tired.length === 1 && only) return `Let's get you out of the ${only} rut.`;
  return "Let's get you out of the rut.";
}

export function counterLine(shown: number, total: number): string {
  return `Dish ${shown} of ${total}. ${COUNTER_LINES[shown - 1] ?? ''}`.trim();
}

export function origin(dish: Dish): string {
  const region = REGION_NAMES[dish.region];
  return `${dish.cuisine}, from ${region}`;
}

export function attributeChips(dish: Dish): string[] {
  return [HEAT[dish.heat] ?? '', RICHNESS[dish.richness - 1] ?? '', '$'.repeat(dish.price)];
}
