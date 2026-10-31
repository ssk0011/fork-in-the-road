import { useReducer, useState } from 'react';
import { DISHES } from '../data/dishes';
import { finalPicks, MAX_PROPOSALS, type Dish } from '../engine';
import {
  clearStore,
  loadStore,
  recentlyAcceptedIds,
  recordAccepted,
  saveSettings,
} from '../storage/storage';
import { appReducer, initialState, SETUP_STEPS, type AppState } from './appReducer';
import { FinalPick, YesScreen } from './Endings';
import { Proposal } from './Proposal';
import { Setup } from './Setup';

function announcement(state: AppState): string {
  if (state.screen === 'setup') return `Question ${state.step + 1} of ${SETUP_STEPS}`;
  if (state.screen === 'proposal' && state.dish && state.session) {
    return `Dish ${state.session.shown} of ${MAX_PROPOSALS}: ${state.dish.name}. ${state.dish.blurb}`;
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

  const back = () => dispatch({ type: 'back' });
  const startOver = () => dispatch({ type: 'start-over' });
  const tone = state.screen === 'yes' ? 'go' : 'decide';

  return (
    <div className="app" data-tone={tone}>
      <div className="column">
        {state.screen === 'setup' && (
          <Setup
            step={state.step}
            settings={state.settings}
            storageFailed={storageFailed}
            onToggleTired={(cuisine) => dispatch({ type: 'toggle-tired', cuisine })}
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
          <YesScreen dish={state.dish} onBack={back} onStartOver={startOver} />
        )}
        {state.screen === 'final' && state.session && (
          <FinalPick
            picks={finalPicks(state.session, DISHES)}
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
