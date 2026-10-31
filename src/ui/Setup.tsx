import { CUISINES } from '../data/cuisines';
import type { Settings } from '../engine';
import { MAX_TIRED, SETUP_STEPS } from './appReducer';
import { Header, RadioButtons, RoadProgress, ScreenHeading, type RadioOption } from './components';
import { rutLine } from './copy';

type Field = 'hunger' | 'budget' | 'adventure';

const QUESTIONS: { field: Field; title: string; options: RadioOption[] }[] = [
  {
    field: 'hunger',
    title: 'How hungry?',
    options: [
      { value: 1, label: 'Peckish' },
      { value: 2, label: 'Snacky' },
      { value: 3, label: 'Hungry' },
      { value: 4, label: 'Very hungry' },
      { value: 5, label: 'Ravenous' },
    ],
  },
  {
    field: 'budget',
    title: 'Budget?',
    options: [
      { value: 1, label: '$', hint: 'Keep it cheap' },
      { value: 2, label: '$$', hint: 'A regular night out' },
      { value: 3, label: '$$$', hint: 'Treat myself' },
    ],
  },
  {
    field: 'adventure',
    title: 'How adventurous?',
    options: [
      { value: 1, label: 'Gentle nudge', hint: 'New, but not too strange' },
      { value: 2, label: 'Fresh territory', hint: 'Something properly different' },
      { value: 3, label: 'Surprise me', hint: 'As far from the rut as we can go' },
    ],
  },
];

export function Setup({
  step,
  settings,
  storageFailed,
  hasSavedData,
  onToggleTired,
  onAnswer,
  onNext,
  onStart,
  onBack,
  onStartOver,
  onClearData,
}: {
  step: number;
  settings: Settings;
  storageFailed: boolean;
  hasSavedData: boolean;
  onToggleTired: (cuisine: string) => void;
  onAnswer: (field: Field, value: number) => void;
  onNext: () => void;
  onStart: (settings: Settings) => void;
  onBack: () => void;
  onStartOver: () => void;
  onClearData: () => void;
}) {
  const label = `Question ${step + 1} of ${SETUP_STEPS}`;
  const question = QUESTIONS[step - 1];
  const atLimit = settings.tired.length >= MAX_TIRED;

  return (
    <>
      <Header
        onBack={step > 0 ? onBack : undefined}
        onStartOver={step > 0 ? onStartOver : undefined}
      >
        <RoadProgress done={step + 1} total={SETUP_STEPS} label={label} />
      </Header>

      {question ? (
        <main className="screen" key={question.field}>
          <ScreenHeading className="question">{question.title}</ScreenHeading>
          <p className="lede">Tap one to keep going.</p>
          <RadioButtons
            label={question.title}
            options={question.options}
            value={settings[question.field]}
            onChange={(value) => onAnswer(question.field, value)}
            onConfirm={(value) => {
              onAnswer(question.field, value);
              if (step === SETUP_STEPS - 1) onStart({ ...settings, [question.field]: value });
              else onNext();
            }}
          />
        </main>
      ) : (
        <main className="screen" key="tired">
          <ScreenHeading className="question">What are you tired of?</ScreenHeading>
          <p className="lede">{rutLine(settings.tired)}</p>
          <div className="chips" role="group" aria-label="Cuisines you're tired of">
            {CUISINES.map((cuisine) => {
              const selected = settings.tired.includes(cuisine);
              const disabled = atLimit && !selected;
              return (
                <button
                  key={cuisine}
                  type="button"
                  className="chip"
                  aria-pressed={selected}
                  aria-disabled={disabled}
                  onClick={() => onToggleTired(cuisine)}
                >
                  {cuisine}
                </button>
              );
            })}
          </div>
          <p className="hint" role="status">
            {atLimit ? "That's the limit: four at most." : 'Pick up to four.'}
          </p>
          {storageFailed && (
            <p className="hint">This browser is blocking storage, so your picks won't be saved.</p>
          )}
          {hasSavedData && (
            <button type="button" className="text-button text-button-start" onClick={onClearData}>
              Clear my data
            </button>
          )}
          <div className="actions">
            <button
              type="button"
              className="button button-primary"
              disabled={settings.tired.length === 0}
              onClick={onNext}
            >
              Next
            </button>
          </div>
        </main>
      )}
    </>
  );
}
