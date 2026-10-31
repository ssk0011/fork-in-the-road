import { useEffect, useRef } from 'react';
import { DISHES } from '../data/dishes';
import {
  contrastLine,
  MAX_PROPOSALS,
  reasonsFor,
  type Dish,
  type ReasonId,
  type Session,
} from '../engine';
import { firstTap, Header, RoadProgress, ScreenHeading } from './components';
import { attributeChips, counterLine, origin } from './copy';

function ReasonSheet({
  dish,
  open,
  onClose,
  onReason,
}: {
  dish: Dish;
  open: boolean;
  onClose: () => void;
  onReason: (reason: ReasonId) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  // showModal gives us the focus trap, Escape and an inert page behind the sheet.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="sheet"
      aria-labelledby="sheet-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      <div className="sheet-body">
        <h2 id="sheet-title">Fair enough. What put you off?</h2>
        <div className="sheet-reasons">
          {reasonsFor(dish).map((reason) => (
            <button
              key={reason.id}
              type="button"
              className="button button-reason"
              onClick={firstTap(() => onReason(reason.id))}
            >
              {reason.label}
            </button>
          ))}
        </div>
        <button type="button" className="text-button" onClick={onClose}>
          Actually, go back
        </button>
      </div>
    </dialog>
  );
}

export function Proposal({
  dish,
  session,
  sheetOpen,
  onYes,
  onNo,
  onCloseSheet,
  onReason,
  onBack,
  onStartOver,
}: {
  dish: Dish;
  session: Session;
  sheetOpen: boolean;
  onYes: () => void;
  onNo: () => void;
  onCloseSheet: () => void;
  onReason: (reason: ReasonId) => void;
  onBack: () => void;
  onStartOver: () => void;
}) {
  return (
    <>
      <Header onBack={onBack} onStartOver={onStartOver}>
        <RoadProgress
          done={session.shown}
          total={MAX_PROPOSALS}
          label={`Dish ${session.shown} of ${MAX_PROPOSALS}`}
        />
      </Header>
      <main className="screen" key={dish.id}>
        <div className="dish">
          <p className="counter">{counterLine(session.shown, MAX_PROPOSALS)}</p>
          <ScreenHeading className="dish-name">{dish.name}</ScreenHeading>
          <p className="dish-origin">{origin(dish)}</p>
          <p className="dish-blurb">{dish.blurb}</p>
          <p className="dish-contrast">{contrastLine(dish, session.tired, DISHES)}</p>
          <ul className="attributes" aria-label="About this dish">
            {attributeChips(dish).map((chip) => (
              <li key={chip}>{chip}</li>
            ))}
          </ul>
        </div>
        <div className="actions">
          <button type="button" className="button button-primary" onClick={firstTap(onYes)}>
            Yes, that's the one
          </button>
          <button type="button" className="button button-secondary" onClick={firstTap(onNo)}>
            Not this
          </button>
        </div>
      </main>
      <ReasonSheet
        key={`sheet-${dish.id}`}
        dish={dish}
        open={sheetOpen}
        onClose={onCloseSheet}
        onReason={onReason}
      />
    </>
  );
}
