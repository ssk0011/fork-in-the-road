import type { Dish } from '../engine';
import { Header, ScreenHeading } from './components';
import { origin } from './copy';
import { mapsUrl, recipeUrl } from './links';

export function YesScreen({
  dish,
  onBack,
  onStartOver,
}: {
  dish: Dish;
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
  onPick,
  onBack,
  onStartOver,
}: {
  picks: Dish[];
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
            <ul className="picks">
              {picks.map((dish) => (
                <li key={dish.id}>
                  <button type="button" className="pick" onClick={() => onPick(dish)}>
                    <span className="pick-name">{dish.name}</span>
                    <span className="pick-origin">{origin(dish)}</span>
                    <span className="pick-blurb">{dish.blurb}</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <ScreenHeading className="question">I've run out of road.</ScreenHeading>
            <p className="lede">
              Nothing fits those answers. Start over with fewer tired cuisines or a bigger budget.
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
