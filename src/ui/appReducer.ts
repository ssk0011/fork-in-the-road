import { DISHES } from '../data/dishes';
import {
  applyReason,
  createSession,
  proposeNext,
  type Dish,
  type ReasonId,
  type Session,
  type Settings,
} from '../engine';

export const SETUP_STEPS = 4;
export const MAX_TIRED = 4;
// 0 means not answered yet, so no option starts out looking chosen.
export const DEFAULT_SETTINGS: Settings = { tired: [], hunger: 0, budget: 0, adventure: 0 };

type Snapshot = { session: Session; dish: Dish };

export type AppState = {
  screen: 'setup' | 'proposal' | 'yes' | 'final';
  step: number;
  settings: Settings;
  session: Session | null;
  dish: Dish | null;
  acceptedFrom: 'proposal' | 'final';
  sheetOpen: boolean;
  history: Snapshot[]; // each entry is a proposal that was turned down
};

export type Action =
  | { type: 'toggle-tired'; cuisine: string }
  | { type: 'answer'; field: 'hunger' | 'budget' | 'adventure'; value: number }
  | { type: 'next-step' }
  | { type: 'start'; recentlyAccepted: string[]; seed: number }
  | { type: 'open-sheet' }
  | { type: 'close-sheet' }
  | { type: 'reject'; reason: ReasonId }
  | { type: 'accept'; dish: Dish }
  | { type: 'back' }
  | { type: 'start-over' }
  | { type: 'reset-settings' };

export function initialState(settings: Settings | null): AppState {
  return {
    screen: 'setup',
    step: 0,
    settings: settings ?? DEFAULT_SETTINGS,
    session: null,
    dish: null,
    acceptedFrom: 'proposal',
    sheetOpen: false,
    history: [],
  };
}

function propose(state: AppState, session: Session): AppState {
  const next = proposeNext(session, DISHES);
  if (!next) return { ...state, screen: 'final', session, dish: null, sheetOpen: false };
  return {
    ...state,
    screen: 'proposal',
    session: next.session,
    dish: next.dish,
    sheetOpen: false,
  };
}

function goBack(state: AppState): AppState {
  if (state.screen === 'setup') return { ...state, step: Math.max(0, state.step - 1) };
  if (state.screen === 'yes') return { ...state, screen: state.acceptedFrom };

  const previous = state.history[state.history.length - 1];
  if (!previous) return { ...state, screen: 'setup', step: SETUP_STEPS - 1, dish: null };
  return {
    ...state,
    screen: 'proposal',
    session: previous.session,
    dish: previous.dish,
    history: state.history.slice(0, -1),
  };
}

export function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'toggle-tired': {
      const { tired } = state.settings;
      if (tired.includes(action.cuisine)) {
        const remaining = tired.filter((cuisine) => cuisine !== action.cuisine);
        return { ...state, settings: { ...state.settings, tired: remaining } };
      }
      if (tired.length >= MAX_TIRED) return state;
      return {
        ...state,
        settings: { ...state.settings, tired: [...tired, action.cuisine] },
      };
    }
    case 'answer':
      return {
        ...state,
        settings: { ...state.settings, [action.field]: action.value },
      };
    case 'next-step':
      return { ...state, step: Math.min(SETUP_STEPS - 1, state.step + 1) };
    case 'start': {
      const session = createSession(state.settings, action.recentlyAccepted, action.seed);
      return propose({ ...state, history: [] }, session);
    }
    case 'open-sheet':
      return { ...state, sheetOpen: true };
    case 'close-sheet':
      return { ...state, sheetOpen: false };
    case 'reject': {
      if (!state.session || !state.dish) return state;
      const history = [...state.history, { session: state.session, dish: state.dish }];
      const session = applyReason(state.session, state.dish, action.reason);
      return propose({ ...state, history }, session);
    }
    case 'accept':
      return {
        ...state,
        screen: 'yes',
        dish: action.dish,
        acceptedFrom: state.screen === 'final' ? 'final' : 'proposal',
      };
    case 'back':
      return goBack(state);
    case 'start-over':
      return initialState(state.settings);
    case 'reset-settings':
      return initialState(null);
  }
}
