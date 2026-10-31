import { describe, expect, it } from 'vitest';
import {
  clearStore,
  loadStore,
  parseStore,
  recentlyAcceptedIds,
  recordAccepted,
  saveSettings,
} from './storage';

function fakeStorage(): Storage {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
  } as Storage;
}

const settings = { tired: ['Thai'], hunger: 3, budget: 2, adventure: 1 };
const DAY = 24 * 60 * 60 * 1000;

describe('parseStore', () => {
  const empty = { settings: null, accepted: [] };

  it.each([
    ['nothing', null],
    ['broken JSON', '{nope'],
    ['a JSON array', '[]'],
    ['a JSON null', 'null'],
    ['the wrong version', '{"version":99,"settings":{}}'],
  ])('falls back to empty for %s', (_, raw) => {
    expect(parseStore(raw)).toEqual(empty);
  });

  it('drops settings with out-of-range values', () => {
    const raw = JSON.stringify({
      version: 1,
      settings: { tired: [], hunger: 9, budget: 1, adventure: 1 },
    });
    expect(parseStore(raw).settings).toBeNull();
  });

  it('removes unknown, duplicate and excess cuisines', () => {
    const tired = ['Thai', 'Thai', 'Nope', 'Greek', 'Korean', 'Mexican', 'Indian'];
    const raw = JSON.stringify({
      version: 1,
      settings: { tired, hunger: 1, budget: 1, adventure: 1 },
    });
    expect(parseStore(raw).settings?.tired).toEqual(['Thai', 'Greek', 'Korean', 'Mexican']);
  });

  it('keeps only well-formed accepted entries', () => {
    const accepted = [{ id: 'a', at: 5 }, { id: 3, at: 5 }, 'x', { id: 'b', at: 'soon' }];
    expect(parseStore(JSON.stringify({ version: 1, accepted })).accepted).toEqual([
      { id: 'a', at: 5 },
    ]);
  });
});

describe('storage round trip', () => {
  it('saves settings and accepted dishes together, then clears', () => {
    const storage = fakeStorage();
    expect(saveSettings(settings, storage)).toBe(true);
    expect(recordAccepted('momo', 100, storage)).toBe(true);
    expect(loadStore(storage)).toEqual({ settings, accepted: [{ id: 'momo', at: 100 }] });
    clearStore(storage);
    expect(loadStore(storage)).toEqual({ settings: null, accepted: [] });
  });

  it('keeps one entry per dish', () => {
    const storage = fakeStorage();
    recordAccepted('momo', 1, storage);
    recordAccepted('momo', 2, storage);
    expect(loadStore(storage).accepted).toEqual([{ id: 'momo', at: 2 }]);
  });

  it('reports failure instead of throwing when storage is blocked', () => {
    const blocked = {
      getItem() {
        throw new Error('blocked');
      },
      setItem() {
        throw new Error('blocked');
      },
      removeItem() {
        throw new Error('blocked');
      },
    } as unknown as Storage;
    expect(loadStore(blocked)).toEqual({ settings: null, accepted: [] });
    expect(saveSettings(settings, blocked)).toBe(false);
    expect(clearStore(blocked)).toBe(false);
  });
});

describe('recentlyAcceptedIds', () => {
  it('only keeps dishes from the last 14 days', () => {
    const now = 100 * DAY;
    const accepted = [
      { id: 'recent', at: now - 13 * DAY },
      { id: 'old', at: now - 15 * DAY },
    ];
    expect(recentlyAcceptedIds(accepted, now)).toEqual(['recent']);
  });
});
