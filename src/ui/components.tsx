import { useEffect, useRef, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';

const REPEAT_TAP_MS = 250;
let lastTapAt = -Infinity;

// The next screen's button can land under a double tap, so a repeat within a
// moment is ignored. Keyboard presses have detail 0 and always count.
export function firstTap(action: () => void) {
  return (event: MouseEvent) => {
    if (event.detail > 0 && event.timeStamp - lastTapAt < REPEAT_TAP_MS) return;
    lastTapAt = event.timeStamp;
    action();
  };
}

export function ScreenHeading({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <h1 ref={ref} tabIndex={-1} className={className}>
      {children}
    </h1>
  );
}

export function RoadProgress({
  done,
  total,
  label,
}: {
  done: number;
  total: number;
  label: string;
}) {
  return (
    <div className="road" role="img" aria-label={label}>
      {Array.from({ length: total }, (_, index) => (
        <span key={index} className={index < done ? 'road-dash is-done' : 'road-dash'} />
      ))}
    </div>
  );
}

function ForkSign() {
  return (
    <svg className="sign" viewBox="0 0 32 32" aria-hidden="true">
      <rect x="6" y="6" width="20" height="20" rx="2" transform="rotate(45 16 16)" />
      <path d="M16 25v-8M16 17l-5.5-7M16 17l5.5-7" />
    </svg>
  );
}

export function Header({
  onBack,
  onStartOver,
  children,
}: {
  onBack?: () => void;
  onStartOver?: () => void;
  children?: ReactNode;
}) {
  return (
    <header className="masthead">
      <div className="header">
        <div className="header-slot">
          {onBack && (
            <button type="button" className="text-button" onClick={onBack}>
              Back
            </button>
          )}
        </div>
        <span className="brand">
          <ForkSign />
          <span className="visually-hidden">Fork In the Road</span>
        </span>
        <div className="header-slot header-slot-end">
          {onStartOver && (
            <button type="button" className="text-button" onClick={onStartOver}>
              Start over
            </button>
          )}
        </div>
      </div>
      {children}
    </header>
  );
}

export type RadioOption = { value: number; label: string; hint?: string };

// One tap or Enter answers and moves on, so arrow keys only move the selection.
export function RadioButtons({
  label,
  options,
  value,
  onChange,
  onConfirm,
}: {
  label: string;
  options: RadioOption[];
  value: number;
  onChange: (value: number) => void;
  onConfirm: (value: number) => void;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const answered = options.some((option) => option.value === value);

  function onKeyDown(event: KeyboardEvent, index: number) {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const nextIndex = (index + step + options.length) % options.length;
    const next = options[nextIndex];
    if (!next) return;
    onChange(next.value);
    refs.current[nextIndex]?.focus();
  }

  return (
    <div role="radiogroup" aria-label={label} className="options">
      {options.map((option, index) => (
        <button
          key={option.value}
          ref={(element) => {
            refs.current[index] = element;
          }}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          tabIndex={option.value === value || (!answered && index === 0) ? 0 : -1}
          className="option"
          onClick={firstTap(() => onConfirm(option.value))}
          onKeyDown={(event) => onKeyDown(event, index)}
        >
          <span className="option-label">{option.label}</span>
          {option.hint && <span className="option-hint">{option.hint}</span>}
        </button>
      ))}
    </div>
  );
}
