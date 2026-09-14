"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

/*
 * The one numeric input the calculators share.
 *
 * It was written inside the repayments calculator and stayed there, so the
 * split calculator grew its own — a plain <input type="number"> that clamped on
 * every keystroke. Clearing a $200,000 box and typing "3" snapped it straight
 * back to the minimum, which made the amounts effectively untypeable. Same
 * behaviour in both places now, from here.
 *
 * Two shapes:
 *   slider + label beside the box   — a page-level figure you scrub (loan, term)
 *   stacked, no slider              — one cell of a grid where a row is a part
 */

type Props = {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  /** "$", "%", "yrs" — placed in front for money, behind for everything else. */
  unit?: string;
  /** Decimal places to show. 0 also turns on thousands separators. */
  decimals?: number;
  onChange: (value: number) => void;
  /** Off in dense grids, where three sliders per row is noise, not control. */
  slider?: boolean;
  /** Label above the box rather than beside it. */
  stacked?: boolean;
  /**
   * Keep the label for screen readers but not on screen — for a grid where one
   * column header already names every box under it, and repeating it three
   * times is the noise the layout was tightened to remove.
   */
  hideLabel?: boolean;
  /** Overrides the debug attribute so existing selectors keep working. */
  cmp?: string;
};

export default function NumberField({
  label,
  hint,
  value,
  min,
  max,
  step,
  unit,
  decimals = 0,
  onChange,
  slider = true,
  stacked = false,
  hideLabel = false,
  cmp = "NumberField",
}: Props) {
  /*
   * While the box is being typed into, the raw keystrokes are held here and the
   * committed value is left alone. Clamping happens when the field is left, not
   * while it is being filled in — otherwise the first digit of a long number is
   * always below the minimum and gets snapped away.
   */
  const [draft, setDraft] = useState<string | null>(null);

  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const format = (n: number) =>
    decimals > 0 ? n.toFixed(decimals) : Math.round(n).toLocaleString("en-NZ");
  const parse = (raw: string) => Number(raw.replace(/[^0-9.]/g, ""));

  /*
   * One step up or down.
   *
   * It reads from the draft when there is one, so typing "1200" and then
   * pressing the arrow moves off 1200 rather than off whatever the field held
   * before the typing started.
   *
   * The rounding matters at decimals > 0: 5.05 + 0.05 lands on
   * 5.100000000000001 in binary floating point, and a rate box is not the place
   * to show that.
   */
  const nudge = (direction: 1 | -1) => {
    const typed = draft === null ? null : parse(draft);
    const from = typed !== null && Number.isFinite(typed) ? typed : value;
    const raw = from + direction * step;
    const snapped = decimals > 0 ? Number(raw.toFixed(decimals)) : Math.round(raw);
    setDraft(null);
    onChange(clamp(snapped));
  };

  /*
   * Up and down, beside the box. The field is type="text" — it has to be, for
   * thousands separators and for half-typed numbers to survive — so the
   * browser's own number spinner is not available and this is it.
   *
   * The same arrows work from the keyboard on the input itself, which is where
   * anyone who has just typed a figure will reach for them.
   *
   * `bare` is for the stacked shape, where the stepper sits INSIDE the box that
   * already has the border and only needs a divider on its left.
   */
  const stepperEl = (bare: boolean) => (
    <div
      className={
        bare
          ? "flex shrink-0 flex-col self-stretch justify-center border-l border-valar-concrete"
          : "flex shrink-0 flex-col overflow-hidden rounded-md border border-valar-concrete bg-white"
      }
    >
      <button
        type="button"
        tabIndex={-1}
        disabled={value >= max}
        onClick={() => nudge(1)}
        aria-label={`Increase ${label}`}
        className="flex h-[15px] w-5 items-center justify-center text-valar-steel transition-colors hover:bg-valar-fog hover:text-valar-navy disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <ChevronUp className="h-3 w-3" />
      </button>
      <button
        type="button"
        tabIndex={-1}
        disabled={value <= min}
        onClick={() => nudge(-1)}
        aria-label={`Decrease ${label}`}
        className="flex h-[15px] w-5 items-center justify-center border-t border-valar-concrete text-valar-steel transition-colors hover:bg-valar-fog hover:text-valar-navy disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <ChevronDown className="h-3 w-3" />
      </button>
    </div>
  );

  const commit = () => {
    if (draft === null) return;
    const parsed = parse(draft);
    onChange(draft.trim() === "" || !Number.isFinite(parsed) ? value : clamp(parsed));
    setDraft(null);
  };

  const input = (
    <input
      type="text"
      inputMode={decimals > 0 ? "decimal" : "numeric"}
      value={draft ?? format(value)}
      onChange={(e) => {
        const raw = e.target.value;
        setDraft(raw);
        const parsed = parse(raw);
        // Update the results live, but only once what has been typed is
        // actually a usable number. A half-typed "6" on its way to "650,000"
        // must not drag the whole calculator down to the floor.
        if (Number.isFinite(parsed) && parsed >= min && parsed <= max) onChange(parsed);
      }}
      onFocus={(e) => {
        setDraft(format(value));
        e.currentTarget.select();
      }}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          commit();
          e.currentTarget.blur();
          return;
        }
        // preventDefault, or the caret jumps to one end of the text as well.
        if (e.key === "ArrowUp") {
          e.preventDefault();
          nudge(1);
          return;
        }
        if (e.key === "ArrowDown") {
          e.preventDefault();
          nudge(-1);
        }
      }}
      className={
        stacked
          ? "w-full bg-transparent px-2 py-2 text-right text-sm font-semibold tabular-nums text-valar-navy focus:outline-none"
          : "w-32 rounded-lg border border-valar-concrete bg-white px-3 py-1.5 text-right text-sm font-semibold tabular-nums focus:border-valar-amber focus:outline-none focus:ring-2 focus:ring-valar-amber/30"
      }
      aria-label={label}
    />
  );

  if (stacked) {
    // Money reads with its sign in front; a rate or a term reads with its unit
    // behind. Both sit inside the box so a grid column lines up on both edges.
    const prefix = unit === "$" ? unit : undefined;
    const suffix = unit && unit !== "$" ? unit : undefined;

    return (
      <div data-cmp={cmp} className="flex flex-col gap-1.5">
        <label className={hideLabel ? "sr-only" : "text-xs font-semibold text-valar-navy"}>
          {label}
        </label>
        <div className="flex items-center rounded-lg border border-valar-concrete bg-white focus-within:border-valar-amber focus-within:ring-2 focus-within:ring-valar-amber/30">
          {prefix && <span className="pl-2.5 text-sm text-valar-steel">{prefix}</span>}
          {input}
          {suffix && <span className="pr-2.5 text-sm text-valar-steel">{suffix}</span>}
          {stepperEl(true)}
        </div>
        {hint && <p className="text-[11px] leading-snug text-valar-steel">{hint}</p>}
      </div>
    );
  }

  return (
    <div data-cmp={cmp} className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <label className="text-sm font-semibold text-valar-navy">{label}</label>
        <div className="flex items-center gap-1 text-valar-navy">
          {/*
           * The unit sits in a fixed-width slot to the LEFT of the box so that
           * every input in a column starts and ends on the same line — a
           * trailing "%" or "yrs" pushed its box out of step with the one above.
           */}
          <span className="w-7 shrink-0 text-right text-sm text-valar-steel">{unit}</span>
          {input}
          {stepperEl(false)}
        </div>
      </div>
      {slider && (
        <input
          type="range"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            setDraft(null);
            onChange(Number(e.target.value));
          }}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-valar-concrete accent-valar-amber"
          aria-label={`${label} slider`}
        />
      )}
      {hint && <p className="text-xs leading-relaxed text-valar-steel">{hint}</p>}
    </div>
  );
}
