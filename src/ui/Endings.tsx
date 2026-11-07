import type { Dish } from '../engine';
import { Header, ScreenHeading } from './components';
import { CHECK_WITH_RESTAURANT, origin } from './copy';
import { mapsUrl, recipeUrl } from './links';

export function YesScreen({
  dish,
  storageFailed,
  restricted,
  dislikeNote,
  onBack,
  onStartOver,
}: {
  dish: Dish;
  storageFailed: boolean;
  restricted: boolean;
  dislikeNote: string | null;
  onBack: () => void;
  onStartOver: () => void;
}) {
  return (
    <>
      <Header onBack={onBack} />
      <main className="screen">
        <div className="dish">
          <p className="counter">Good call. Go get it.</p>
          <ScreenHeading className="dish-name">{dish.name}</ScreenHeading>
          <p className="dish-origin">{origin(dish)}</p>
          <p className="dish-blurb">{dish.blurb}</p>
          {dislikeNote && <p className="check-note">{dislikeNote}</p>}
          {restricted && <p className="check-note">{CHECK_WITH_RESTAURANT}</p>}
          {storageFailed && (
            <p className="hint">This browser is blocking storage, so this pick won't be saved.</p>
          )}
        </div>
        <div className="actions">
          <a
            className="button button-go"
            href={mapsUrl(dish.searchName)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Find it nearby
          </a>
          <a
            className="button button-go"
            href={recipeUrl(dish.searchName)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Find a recipe
          </a>
          <button type="button" className="text-button" onClick={onStartOver}>
            Start over
          </button>
        </div>
      </main>
    </>
  );
}

export function FinalPick({
  picks,
  restricted,
  noteFor,
  onPick,
  onBack,
  onStartOver,
}: {
  picks: Dish[];
  restricted: boolean;
  noteFor: (dish: Dish) => string | null;
  onPick: (dish: Dish) => void;
  onBack: () => void;
  onStartOver: () => void;
}) {
  return (
    <>
      <Header onBack={onBack} />
      <main className="screen">
        {picks.length > 0 ? (
          <>
            <ScreenHeading className="question">
              Okay, I'll stop making you work for it.
            </ScreenHeading>
            <p className="lede">Here's the best of what's left. Pick one.</p>
            {restricted && <p className="check-note">{CHECK_WITH_RESTAURANT}</p>}
            <ul className="picks">
              {picks.map((dish) => (
                <li key={dish.id}>
                  <button type="button" className="pick" onClick={() => onPick(dish)}>
                    <span className="pick-name">{dish.name}</span>
                    <span className="pick-origin">{origin(dish)}</span>
                    <span className="pick-blurb">{dish.blurb}</span>
                    {noteFor(dish) && <span className="pick-note">{noteFor(dish)}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <ScreenHeading className="question">I've run out of road.</ScreenHeading>
            <p className="lede">
              Nothing fits those answers. Start over with fewer tired cuisines, fewer restrictions
              or a bigger budget.
            </p>
          </>
        )}
        <div className="actions">
          <button type="button" className="button button-secondary" onClick={onStartOver}>
            Start over
          </button>
        </div>
      </main>
    </>
  );
}
