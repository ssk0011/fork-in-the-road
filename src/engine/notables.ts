import type { Dish, Notable, Session } from './types';

export const NOTABLES: readonly { id: Notable; label: string }[] = [
  { id: 'mushrooms', label: 'Mushrooms' },
  { id: 'cilantro', label: 'Cilantro' },
  { id: 'olives', label: 'Olives' },
  { id: 'eggplant', label: 'Eggplant' },
  { id: 'coconut', label: 'Coconut' },
  { id: 'okra', label: 'Okra' },
  { id: 'raw-fish', label: 'Raw fish' },
  { id: 'organ-meat', label: 'Organ meats' },
  { id: 'raw-onion', label: 'Raw onion' },
  { id: 'blue-cheese', label: 'Blue cheese' },
];

export function notableLabel(id: string): string {
  return NOTABLES.find((item) => item.id === id)?.label ?? id;
}

// Disliked ingredients this dish still has. Only the final pick can show one.
export function dislikedIn(dish: Dish, session: Session): string[] {
  return dish.notable.filter((id) => session.constraints.avoidedNotables.includes(id));
}
