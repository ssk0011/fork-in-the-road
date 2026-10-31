import { MAX_PROPOSALS, type Dish, type Region } from '../engine';
import { SETUP_STEPS } from './appReducer';

const REGION_NAMES: Record<Region, string> = {
  'south-asia': 'South Asia',
  'southeast-asia': 'Southeast Asia',
  'east-asia': 'East Asia',
  'middle-east': 'Middle East',
  mediterranean: 'Mediterranean',
  'caucasus-eastern-europe': 'Caucasus',
  africa: 'Africa',
  'latin-america': 'Latin America',
  caribbean: 'Caribbean',
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
const RICHNESS = ['Very light', 'Light', 'Medium richness', 'Rich', 'Very rich'];

export function rutLine(tired: string[]): string {
  if (tired.includes('Indian')) return "Let's get you out of the curry rut.";
  const [only] = tired;
  if (tired.length === 1 && only) return `Let's get you out of the ${only} rut.`;
  return "Let's get you out of the rut.";
}

export const CHECK_WITH_RESTAURANT =
  'Recipes vary, so always ask the restaurant, especially about allergies.';

export function questionProgress(step: number): string {
  return `Question ${step + 1} of ${SETUP_STEPS}`;
}

export function dishProgress(shown: number): string {
  return `Dish ${shown} of ${MAX_PROPOSALS}`;
}

export function counterLine(shown: number, total: number): string {
  return `Dish ${shown} of ${total}. ${COUNTER_LINES[shown - 1] ?? ''}`.trim();
}

export function origin(dish: Dish): string {
  return `${dish.cuisine}, ${REGION_NAMES[dish.region]}`;
}

export function attributeChips(dish: Dish): string[] {
  return [HEAT[dish.heat] ?? '', RICHNESS[dish.richness - 1] ?? '', '$'.repeat(dish.price)];
}
