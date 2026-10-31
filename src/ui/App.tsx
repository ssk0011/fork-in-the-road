import { useEffect, useLayoutEffect, useReducer, useRef, useState, type MouseEvent } from 'react';
import { DISHES } from '../data/dishes';
import { finalPicks, type Dish } from '../engine';
import {
  clearStore,
  forgetAccepted,
  loadStore,
  recentlyAcceptedIds,
  recordAccepted,
  saveSettings,
} from '../storage/storage';
import { appReducer, initialState, type AppState } from './appReducer';
import { dishProgress, questionProgress } from './copy';
import { FinalPick, YesScreen } from './Endings';
import { Proposal } from './Proposal';
import { Setup } from './Setup';

const REPEAT_TAP_MS = 250;

function announcement(state: AppState): string {
  if (state.screen === 'setup') return questionProgress(state.step);
  if (state.screen === 'proposal' && state.dish && state.session) {
    return `${dishProgress(state.session.shown)}: ${state.dish.name}. ${state.dish.blurb}`;
  }
  if (state.screen === 'yes' && state.dish) return `${state.dish.name} it is.`;
  return 'Final pick';
}

export function App() {
  const [state, dispatch] = useReducer(appReducer, null, () => initialState(loadStore().settings));
  const [storageFailed, setStorageFailed] = useState(false);

  function start() {
    dispatch({
      type: 'start',
      recentlyAccepted: recentlyAcceptedIds(loadStore().accepted, Date.now()),
      seed: Math.floor(Math.random() * 2 ** 32),
    });
  }

  function accept(dish: Dish) {
    if (!recordAccepted(dish.id, Date.now())) setStorageFailed(true);
    dispatch({ type: 'accept', dish });
  }

  function clearData() {
    if (!clearStore()) setStorageFailed(true);
    dispatch({ type: 'reset-settings' });
  }

  // Backing out of a yes means it wasn't one, so the dish shouldn't be hidden for 14 days.
  function backFromYes(dish: Dish) {
    forgetAccepted(dish.id);
    dispatch({ type: 'back' });
  }

  const back = () => dispatch({ type: 'back' });
  const startOver = () => dispatch({ type: 'start-over' });
  const tone = state.screen === 'yes' ? 'go' : 'decide';

  const viewChangedAt = useRef(-Infinity);
  useLayoutEffect(() => {
    viewChangedAt.current = performance.now();
  }, [state.screen, state.step, state.dish, state.sheetOpen]);

  // A double tap's second tap would land on whatever just appeared under the finger.
  // Keyboard clicks have detail 0 and always count.
  function dropRepeatTap(event: MouseEvent) {
    if (event.detail > 0 && event.timeStamp - viewChangedAt.current < REPEAT_TAP_MS) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  useEffect(() => {
    document.documentElement.dataset.tone = tone;
  }, [tone]);

  return (
    <div className="app" data-tone={tone} onClickCapture={dropRepeatTap}>
      <div className="column">
        {state.screen === 'setup' && (
          <Setup
            step={state.step}
            settings={state.settings}
            storageFailed={storageFailed}
            hasSavedData={loadStore().settings !== null}
            onToggleTired={(cuisine) => dispatch({ type: 'toggle-tired', cuisine })}
            onToggleRestriction={(id) => dispatch({ type: 'toggle-restriction', id })}
            onAnswer={(field, value) => dispatch({ type: 'answer', field, value })}
            onNext={() => dispatch({ type: 'next-step' })}
            onStart={(settings) => {
              if (!saveSettings(settings)) setStorageFailed(true);
              start();
            }}
            onBack={back}
            onStartOver={startOver}
            onClearData={clearData}
          />
        )}
        {state.screen === 'proposal' && state.dish && state.session && (
          <Proposal
            dish={state.dish}
            session={state.session}
            sheetOpen={state.sheetOpen}
            onYes={() => state.dish && accept(state.dish)}
            onNo={() => dispatch({ type: 'open-sheet' })}
            onCloseSheet={() => dispatch({ type: 'close-sheet' })}
            onReason={(reason) => dispatch({ type: 'reject', reason })}
            onBack={back}
            onStartOver={startOver}
          />
        )}
        {state.screen === 'yes' && state.dish && (
          <YesScreen
            dish={state.dish}
            storageFailed={storageFailed}
            restricted={state.settings.restrictions.length > 0}
            onBack={() => state.dish && backFromYes(state.dish)}
            onStartOver={startOver}
          />
        )}
        {state.screen === 'final' && state.session && (
          <FinalPick
            picks={finalPicks(state.session, DISHES)}
            restricted={state.settings.restrictions.length > 0}
            onPick={accept}
            onBack={back}
            onStartOver={startOver}
          />
        )}
      </div>
      <div className="visually-hidden" aria-live="polite">
        {announcement(state)}
      </div>
    </div>
  );
}
