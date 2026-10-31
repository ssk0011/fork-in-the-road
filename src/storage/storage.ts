import { CUISINES } from '../data/cuisines';
import type { Settings } from '../engine/types';

const KEY = 'fork-in-the-road';
const VERSION = 1;
const DAY_MS = 24 * 60 * 60 * 1000;
export const ACCEPTED_WINDOW_DAYS = 14;
const MAX_TIRED = 4;

export type AcceptedDish = { id: string; at: number };
export type Store = { settings: Settings | null; accepted: AcceptedDish[] };

const EMPTY: Store = { settings: null, accepted: [] };

function getStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function inRange(value: unknown, max: number): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= max;
}

function parseSettings(value: unknown): Settings | null {
  if (!isRecord(value) || !Array.isArray(value.tired)) return null;
  const { hunger, budget, adventure } = value;
  if (!inRange(hunger, 5) || !inRange(budget, 3) || !inRange(adventure, 3)) return null;
  const known: readonly string[] = CUISINES;
  const tired = value.tired.filter((item): item is string => known.includes(item as string));
  return { tired: [...new Set(tired)].slice(0, MAX_TIRED), hunger, budget, adventure };
}

function parseAccepted(value: unknown): AcceptedDish[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is AcceptedDish =>
      isRecord(item) && typeof item.id === 'string' && Number.isFinite(item.at),
  );
}

export function parseStore(raw: string | null): Store {
  if (!raw) return EMPTY;
  try {
    const data: unknown = JSON.parse(raw);
    if (!isRecord(data) || data.version !== VERSION) return EMPTY;
    return { settings: parseSettings(data.settings), accepted: parseAccepted(data.accepted) };
  } catch {
    return EMPTY;
  }
}

export function loadStore(storage = getStorage()): Store {
  try {
    return parseStore(storage?.getItem(KEY) ?? null);
  } catch {
    return EMPTY;
  }
}

function writeStore(store: Store, storage: Storage | null): boolean {
  try {
    if (!storage) return false;
    storage.setItem(KEY, JSON.stringify({ version: VERSION, ...store }));
    return true;
  } catch {
    return false;
  }
}

export function saveSettings(settings: Settings, storage = getStorage()): boolean {
  return writeStore({ ...loadStore(storage), settings }, storage);
}

export function recordAccepted(id: string, now: number, storage = getStorage()): boolean {
  const store = loadStore(storage);
  const accepted = [...store.accepted.filter((item) => item.id !== id), { id, at: now }];
  return writeStore({ ...store, accepted }, storage);
}

export function forgetAccepted(id: string, storage = getStorage()): boolean {
  const store = loadStore(storage);
  const accepted = store.accepted.filter((item) => item.id !== id);
  return writeStore({ ...store, accepted }, storage);
}

export function clearStore(storage = getStorage()): boolean {
  try {
    storage?.removeItem(KEY);
    return storage !== null;
  } catch {
    return false;
  }
}

export function recentlyAcceptedIds(accepted: AcceptedDish[], now: number): string[] {
  const cutoff = now - ACCEPTED_WINDOW_DAYS * DAY_MS;
  return accepted.filter((item) => item.at > cutoff).map((item) => item.id);
}
