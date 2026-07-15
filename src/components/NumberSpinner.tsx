import { useEffect, useRef, useState, type ChangeEvent } from "react";

type NumberSpinnerProps = {
  value: number;
  min: number;
  max: number;
  step: number;
  precision?: number;
  editable?: boolean;
  onChange: (value: number) => void;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function NumberSpinner({
  value,
  min,
  max,
  step,
  precision = 0,
  editable = true,
  onChange,
}: NumberSpinnerProps) {
  const round = (v: number) => Number(v.toFixed(precision));

  const decrement = () => onChange(round(clamp(value - step, min, max)));
  const increment = () => onChange(round(clamp(value + step, min, max)));

  const [text, setText] = useState(value.toFixed(precision));
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) {
      setText(value.toFixed(precision));
    }
  }, [value, precision]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    setText(raw);

    const normalized = raw.replace(",", ".");
    const next = Number(normalized);
    if (normalized.trim() !== "" && !Number.isNaN(next)) {
      onChange(round(clamp(next, min, max)));
    }
  };

  const handleBlur = () => {
    focused.current = false;
    setText(value.toFixed(precision));
  };

  return (
    <div className="flex items-stretch overflow-hidden rounded border border-neutral-600 bg-neutral-800">
      <button
        type="button"
        onClick={decrement}
        className="bg-neutral-600 px-3 py-2 font-bold text-white hover:bg-neutral-500 active:bg-neutral-400"
      >
        −
      </button>
      {editable ? (
        <input
          type="text"
          inputMode="decimal"
          value={text}
          onFocus={() => {
            focused.current = true;
          }}
          onBlur={handleBlur}
          onChange={handleInputChange}
          className="w-full min-w-0 flex-1 bg-transparent text-center text-white outline-none"
        />
      ) : (
        <span className="flex flex-1 items-center justify-center text-white">
          {value.toFixed(precision)}
        </span>
      )}
      <button
        type="button"
        onClick={increment}
        className="bg-neutral-600 px-3 py-2 font-bold text-white hover:bg-neutral-500 active:bg-neutral-400"
      >
        +
      </button>
    </div>
  );
}
