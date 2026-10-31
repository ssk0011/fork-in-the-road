import { describe, expect, it } from 'vitest';
import { DISHES } from '../data/dishes';
import { appReducer, initialState, type AppState } from './appReducer';

const settings = { tired: ['Indian'], restrictions: [], hunger: 3, budget: 3, adventure: 2 };

function started(seed = 1): AppState {
  return appReducer(initialState(settings), { type: 'start', recentlyAccepted: [], seed });
}

function rejectTimes(state: AppState, times: number): AppState {
  let current = state;
  for (let count = 0; count < times; count += 1) {
    current = appReducer(current, { type: 'reject', reason: 'not-feeling' });
  }
  return current;
}

describe('appReducer', () => {
  it('reaches the final pick after the 5th no', () => {
    const state = started();
    expect(rejectTimes(state, 4).screen).toBe('proposal');
    expect(rejectTimes(state, 5).screen).toBe('final');
  });

  it('back undoes the last rejection and its constraint', () => {
    const first = started();
    const second = appReducer(first, { type: 'reject', reason: 'not-feeling' });
    const undone = appReducer(second, { type: 'back' });
    expect(undone.dish).toEqual(first.dish);
    expect(undone.session).toEqual(first.session);
    expect(undone.history).toEqual([]);
  });

  it('back from the final pick returns to the 5th dish', () => {
    const fifth = rejectTimes(started(), 4);
    const final = rejectTimes(fifth, 1);
    const back = appReducer(final, { type: 'back' });
    expect(back.screen).toBe('proposal');
    expect(back.dish).toEqual(fifth.dish);
  });

  it('back from the first dish returns to the last question', () => {
    const back = appReducer(started(), { type: 'back' });
    expect(back.screen).toBe('setup');
    expect(back.step).toBe(4);
  });

  it('back from yes returns to where the dish was chosen', () => {
    const final = rejectTimes(started(), 5);
    const yes = appReducer(final, { type: 'accept', dish: DISHES[0]! });
    expect(yes.screen).toBe('yes');
    expect(appReducer(yes, { type: 'back' }).screen).toBe('final');
  });

  it('caps tired cuisines at 4', () => {
    let state = initialState(null);
    for (const cuisine of ['Thai', 'Greek', 'Korean', 'Mexican', 'Indian']) {
      state = appReducer(state, { type: 'toggle-tired', cuisine });
    }
    expect(state.settings.tired).toEqual(['Thai', 'Greek', 'Korean', 'Mexican']);
  });

  it('start over keeps settings but clears the session', () => {
    const state = appReducer(rejectTimes(started(), 2), { type: 'start-over' });
    expect(state.screen).toBe('setup');
    expect(state.settings).toEqual(settings);
    expect(state.session).toBeNull();
    expect(state.history).toEqual([]);
  });
});
