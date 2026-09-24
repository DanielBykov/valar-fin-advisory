"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

import {
  type BorrowInput,
  type YearSplit,
  DEFAULT_RATE,
  DEFAULT_YEARS,
  STRESS_RATE,
  calculateBorrow,
  perYearOf,
} from "@/lib/borrow-from-payment";
import { FREQUENCIES, type FrequencyKey } from "@/lib/split-loan";
import { money, toNumber, withCommas } from "@/lib/affordability";
import type { BorrowSnapshot } from "@/lib/borrow-report";
import SendCalculationForm from "@/components/calculators/send-calculation-form";

/*
 * "How much can I borrow?" from the payment end (Lena, 2026-09-24).
 *
 * The income-based version asked for gross pay, KiwiSaver, dependants,
 * spending and every debt, and real users found it too complicated. This one
 * asks four things: take-home pay, the most you want to pay, the rate and the
 * term. It answers with the loan, what share of take-home pay that payment is,
 * and what the same loan costs if rates reach 7%.
 *
 * Live, no Run button: four fields do not need one.
 */

type Draft = {
  frequency: FrequencyKey;
  income: string;
  payment: string;
  rate: string;
  years: string;
};

const DEFAULT_DRAFT: Draft = {
  frequency: "monthly",
  income: "9,000",
  payment: "3,000",
  rate: String(DEFAULT_RATE),
  years: String(DEFAULT_YEARS),
};

const PERIOD_WORD: Record<FrequencyKey, string> = {
  weekly: "week",
  fortnightly: "fortnight",
  monthly: "month",
};

/*
 * The scale under the share. Thresholds are shareBand() in
 * src/lib/affordability.ts; Lena confirmed them for this version 2026-09-24.
 * A rule of thumb, not any lender's rule.
 */
const SHARE_SCALE = [
  { label: "Comfortable", range: "to 30%", on: "bg-emerald-600 text-white" },
  { label: "Manageable", range: "30–40%", on: "bg-emerald-600 text-white" },
  { label: "Stretched", range: "40–50%", on: "bg-valar-amber text-valar-navy" },
  { label: "High pressure", range: "50%+", on: "bg-orange-500 text-white" },
] as const;

/** The bands in words, one line each (cut short on Lena's call, 2026-09-24). */
const BAND_NOTES = [
  { label: "Comfortable", copy: "a good buffer in your cashflow." },
  { label: "Manageable", copy: "usually workable, depends on your other costs." },
  { label: "Stretched", copy: "sensitive to rising rates or costs." },
  { label: "High pressure", copy: "little room for rate rises, income changes or surprises." },
] as const;

/*
 * Chart colours: the pair balance-chart.tsx validated against the navy card
 * (#061634). The brand tokens fail dataviz checks on their own.
 */
const SURFACE = "#061634";
const PRINCIPAL = "#5B8DEF";
const INTEREST = "#C58329";

/*
 * One row per question (Lena, 2026-09-24): label and explanation on the left,
 * a short input on the right with up/down arrows. Full-width boxes for a
 * four-digit number read as a form to fill, not a number to try.
 */
function Field({
  id,
  label,
  hint,
  prefix,
  suffix,
  decimal,
  step,
  min = 0,
  max,
  value,
  onChange,
}: {
  id: string;
  label: string;
  hint?: React.ReactNode;
  prefix?: string;
  suffix?: string;
  decimal?: boolean;
  /** How far one arrow click moves the value. */
  step: number;
  min?: number;
  max?: number;
  value: string;
  onChange: (v: string) => void;
}) {
  const nudge = (dir: 1 | -1) => {
    const current = decimal ? parseFloat(value) || 0 : toNumber(value);
    let next = Math.round((current + dir * step) / step) * step;
    next = Math.max(min, max === undefined ? next : Math.min(max, next));
    onChange(decimal ? next.toFixed(2) : withCommas(String(next)));
  };

  return (
    <div
      data-cmp="BorrowCalculator.Field"
      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-dashed border-valar-concrete py-4 last:border-0"
    >
      <div className="min-w-0">
        <label
          htmlFor={id}
          className="text-[15px] font-semibold text-valar-navy"
        >
          {label}
        </label>
        {hint && (
          <p className="mt-0.5 text-xs leading-relaxed text-valar-steel">
            {hint}
          </p>
        )}
      </div>
      <div className="flex w-40 items-center rounded-lg border border-valar-concrete bg-white focus-within:border-valar-amber focus-within:ring-2 focus-within:ring-valar-amber/30">
        {prefix && (
          <span className="pl-3 text-sm text-valar-steel">{prefix}</span>
        )}
        <input
          id={id}
          type="text"
          inputMode={decimal ? "decimal" : "numeric"}
          value={value}
          onChange={(e) =>
            onChange(
              decimal
                ? e.target.value.replace(/[^0-9.]/g, "")
                : withCommas(e.target.value),
            )
          }
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") (e.preventDefault(), nudge(1));
            if (e.key === "ArrowDown") (e.preventDefault(), nudge(-1));
          }}
          className="w-full min-w-0 bg-transparent px-2 py-2.5 text-right text-sm font-semibold tabular-nums text-valar-navy focus:outline-none"
        />
        {suffix && (
          <span className="whitespace-nowrap text-xs text-valar-steel">
            {suffix}
          </span>
        )}
        <div className="ml-1 flex flex-col border-l border-valar-concrete">
          <button
            type="button"
            aria-label={`Increase ${label}`}
            onClick={() => nudge(1)}
            className="px-1.5 py-0.5 text-valar-steel hover:text-valar-navy"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label={`Decrease ${label}`}
            onClick={() => nudge(-1)}
            className="border-t border-valar-concrete px-1.5 py-0.5 text-valar-steel hover:text-valar-navy"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-valar-amber">
      {children}
    </p>
  );
}

function ShareScale({ active }: { active: string }) {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {SHARE_SCALE.map((s) => {
        const on = s.label === active;
        return (
          <div
            key={s.label}
            className={`rounded-md px-2 py-2 text-center ${on ? s.on : "bg-valar-fog text-valar-steel"}`}
          >
            <p className="text-[11px] font-bold leading-tight">{s.label}</p>
            <p className="text-[10px] leading-tight opacity-80">{s.range}</p>
          </div>
        );
      })}
    </div>
  );
}

const compact = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}k`;
  return `$${Math.round(n)}`;
};

function axisTicks(max: number, count: number) {
  if (max <= 0) return { top: 1, ticks: [0, 1] };
  const rough = max / count;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rough)));
  const step =
    ([1, 2, 2.5, 5, 10].find((m) => magnitude * m >= rough) ?? 10) * magnitude;
  const top = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = 0; v <= top + step / 2; v += step) ticks.push(v);
  return { top, ticks };
}

/**
 * Principal and interest per year, stacked. Principal at the base.
 *
 * Fills whatever height its column leaves (Lena, 2026-09-24: the two columns
 * should end on one line), so it is drawn at its measured pixel size rather
 * than scaled from a fixed viewBox, which would stretch the labels.
 */
function YearChart({ years }: { years: YearSplit[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 640, h: 260 });
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      if (width > 0 && height > 0) setSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const W = size.w;
  const H = size.h;
  const pad = { l: 48, r: 8, t: 12, b: 28 };
  const max = Math.max(0, ...years.map((y) => y.principal + y.interest));
  const { top, ticks } = axisTicks(max, 4);
  const plotW = W - pad.l - pad.r;
  const plotH = H - pad.t - pad.b;
  const slot = plotW / Math.max(1, years.length);
  const barW = Math.max(2, slot * 0.7);
  const y = (v: number) => pad.t + plotH - (v / top) * plotH;
  const labelEvery = years.length > 20 ? 5 : years.length > 10 ? 2 : 1;
  const hovered = hover === null ? null : years[hover];

  return (
    <div
      className="flex flex-1 flex-col rounded-xl p-4 md:p-5"
      style={{ background: SURFACE }}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-white">
          Where each year&rsquo;s payments go
        </p>
        <div className="flex items-center gap-4 text-xs text-valar-lilac">
          <span className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ background: PRINCIPAL }}
            />
            Principal
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ background: INTEREST }}
            />
            Interest
          </span>
        </div>
      </div>
      <p className="mb-2 h-4 text-xs tabular-nums text-valar-lilac">
        {hovered
          ? `Year ${hovered.year}: ${money(hovered.principal)} principal, ${money(hovered.interest)} interest`
          : ""}
      </p>
      <div ref={box} className="relative min-h-[220px] flex-1">
      <svg
        width={W}
        height={H}
        className="absolute inset-0"
        role="img"
        aria-label="Principal and interest paid each year"
      >
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={pad.l}
              x2={W - pad.r}
              y1={y(t)}
              y2={y(t)}
              stroke="rgba(255,255,255,0.12)"
            />
            <text
              x={pad.l - 8}
              y={y(t) + 4}
              textAnchor="end"
              fontSize="11"
              fill="#B9BCD6"
            >
              {compact(t)}
            </text>
          </g>
        ))}
        {years.map((d, i) => {
          const x = pad.l + i * slot + (slot - barW) / 2;
          const pTop = y(d.principal);
          const iTop = y(d.principal + d.interest);
          const dim = hover !== null && hover !== i;
          return (
            <g
              key={d.year}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              opacity={dim ? 0.5 : 1}
            >
              <rect
                x={pad.l + i * slot}
                y={pad.t}
                width={slot}
                height={plotH}
                fill="transparent"
              />
              <rect
                x={x}
                y={pTop}
                width={barW}
                height={Math.max(0, y(0) - pTop)}
                fill={PRINCIPAL}
              />
              <rect
                x={x}
                y={iTop}
                width={barW}
                height={Math.max(0, pTop - iTop - 1)}
                fill={INTEREST}
              />
              {(d.year === 1 || d.year % labelEvery === 0) && (
                <text
                  x={x + barW / 2}
                  y={H - 10}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#B9BCD6"
                >
                  {d.year}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      </div>
      <p className="mt-1 text-center text-[11px] text-valar-lilac">Year</p>
    </div>
  );
}

export default function BorrowCalculator({
  guideKey,
  guideTitle,
  guideReady,
  pendingNote,
  blurb,
  cover,
  source,
  aside,
}: {
  guideKey?: string;
  guideTitle?: string;
  guideReady?: boolean;
  pendingNote?: string;
  blurb?: React.ReactNode;
  cover?: { src: string; width: number; height: number };
  source?: string;
  /** Beside the send-my-numbers card, on its own row under the calculator. */
  aside?: React.ReactNode;
}) {
  const [draft, setDraft] = useState<Draft>(DEFAULT_DRAFT);
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  /*
   * Switching frequency converts the two money fields, so $3,000 a month
   * becomes $692 a week rather than $3,000 a week.
   */
  const switchFrequency = (next: FrequencyKey) =>
    setDraft((d) => {
      if (d.frequency === next) return d;
      const k = perYearOf(d.frequency) / perYearOf(next);
      const conv = (s: string) =>
        s.trim() === "" ? s : withCommas(String(Math.round(toNumber(s) * k)));
      return {
        ...d,
        frequency: next,
        income: conv(d.income),
        payment: conv(d.payment),
      };
    });

  const input: BorrowInput = useMemo(() => {
    const rate = Math.min(20, Math.max(0, parseFloat(draft.rate) || 0));
    const years = Math.min(
      40,
      Math.max(1, Math.round(parseFloat(draft.years) || 0)),
    );
    return {
      frequency: draft.frequency,
      income: toNumber(draft.income),
      payment: toNumber(draft.payment),
      rate,
      years,
    };
  }, [draft]);

  const result = useMemo(() => calculateBorrow(input), [input]);
  const per = PERIOD_WORD[draft.frequency];
  const pct = (n: number) => `${Math.round(n * 100)}%`;
  const ready = input.payment > 0 && result.loan > 0;
  const alreadyAtStress = input.rate >= STRESS_RATE;

  // Only the inputs travel; the email recomputes the answer (borrow-report.ts).
  const figures: BorrowSnapshot | undefined = ready
    ? { kind: "borrow", ...input }
    : undefined;

  const debtFree = result.debtFree.toLocaleString("en-NZ", {
    month: "short",
    year: "numeric",
  });

  return (
    <div data-cmp="BorrowCalculator">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        {/* Left column: the inputs, and the chart under them (Lena, 2026-09-24). */}
        <div className="flex flex-col gap-8">
          {/* ============ INPUTS ============ */}
          <section className="rounded-xl border border-valar-concrete bg-valar-indigo/[0.04] p-6 md:p-8">
            <h2 className="mb-1 text-2xl font-bold text-valar-navy">
              Start from your payment
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-gray-600">
              Tell us what you&rsquo;d be comfortable paying. We&rsquo;ll show
              the loan it carries.
            </p>

            <div
              role="radiogroup"
              aria-label="How often you pay"
              className="mb-6 grid grid-cols-3 rounded-lg border border-valar-concrete bg-white p-1"
            >
              {FREQUENCIES.map((f) => {
                const on = f.key === draft.frequency;
                return (
                  <button
                    key={f.key}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => switchFrequency(f.key)}
                    className={`rounded-md py-2 text-sm font-semibold transition-colors ${
                      on
                        ? "bg-valar-navy text-white"
                        : "text-valar-steel hover:text-valar-navy"
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col">
              <Field
                id="borrow-income"
                label={`Household take-home pay per ${per}`}
                hint="After tax and KiwiSaver, everyone on the loan together."
                prefix="$"
                step={100}
                value={draft.income}
                onChange={(v) => set("income", v)}
              />
              <Field
                id="borrow-payment"
                label={`Mortgage payments you plan per ${per}`}
                hint="The most you'd put toward the mortgage after everyday living costs."
                prefix="$"
                step={50}
                value={draft.payment}
                onChange={(v) => set("payment", v)}
              />
              <Field
                id="borrow-rate"
                label="Interest rate"
                hint="We calculate at this rate. Check today's rates with your bank or adviser and put in your own."
                suffix="%"
                decimal
                step={0.1}
                max={20}
                value={draft.rate}
                onChange={(v) => set("rate", v)}
              />
              <Field
                id="borrow-years"
                label="Loan term"
                hint="25 to 30 years is standard."
                suffix="years"
                step={1}
                min={1}
                max={40}
                value={draft.years}
                onChange={(v) => set("years", v)}
              />
            </div>
          </section>

          {ready && <YearChart years={result.years} />}
        </div>

        {/* ============ RESULTS ============ */}
        <section
          aria-live="polite"
          className="overflow-hidden rounded-xl border border-valar-concrete bg-white"
        >
          {/* ---- 1. the loan ---- */}
          <div className="bg-valar-navy p-6 md:p-8">
            <Eyebrow>You could borrow</Eyebrow>
            {ready ? (
              <>
                <p className="text-4xl font-bold tabular-nums text-white md:text-5xl">
                  {money(result.loan)}
                </p>
                <p className="mt-2 text-sm text-valar-lilac">
                  Paying{" "}
                  <b className="font-semibold text-white">
                    {money(input.payment)}
                  </b>{" "}
                  a {per} at {input.rate}% over {input.years} years.
                </p>
                <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-white/15 pt-5">
                  <div>
                    <dt className="text-[11px] font-bold uppercase tracking-wider text-valar-steel">
                      Total interest
                    </dt>
                    <dd className="mt-1 text-lg font-bold tabular-nums text-white">
                      {money(result.totalInterest)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-bold uppercase tracking-wider text-valar-steel">
                      Total repaid
                    </dt>
                    <dd className="mt-1 text-lg font-bold tabular-nums text-white">
                      {money(result.totalRepaid)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-bold uppercase tracking-wider text-valar-steel">
                      Debt-free by
                    </dt>
                    <dd className="mt-1 text-lg font-bold tabular-nums text-white">
                      {debtFree}
                    </dd>
                  </div>
                </dl>
                {/*
                 * The send form sits below the fold; this puts the ask where the
                 * number lands (Lena, 2026-09-24: "the form is hard to see").
                 */}
                {guideTitle && (
                  <a
                    href="#send-my-numbers"
                    className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-valar-amber px-6 py-3 text-[15px] font-bold text-valar-navy transition-colors hover:bg-valar-amber-hover"
                  >
                    Send me this calculation
                  </a>
                )}
              </>
            ) : (
              <p className="text-2xl font-bold leading-tight text-white">
                Enter the payment you&rsquo;d be comfortable with.
              </p>
            )}
          </div>

          {ready && (
            <>
              {/* ---- 2. the payment against take-home pay ---- */}
              <div className="border-b border-gray-100 p-6 md:px-8">
                <Eyebrow>Your mortgage payment load</Eyebrow>
                {result.hasIncome ? (
                  <>
                    <p className="mb-4 text-[15px] leading-relaxed text-gray-600">
                      <b className="text-valar-navy">{money(input.payment)}</b>{" "}
                      is <b className="text-valar-navy">{pct(result.share)}</b>{" "}
                      of your take-home pay. That&rsquo;s{" "}
                      <b className="text-valar-navy">
                        {result.band.label.toLowerCase()}
                      </b>
                      .
                    </p>
                    <ShareScale active={result.band.label} />
                  </>
                ) : (
                  <p className="text-[15px] leading-relaxed text-gray-600">
                    Add your take-home pay to see what share of it this payment
                    takes.
                  </p>
                )}
              </div>

              {/* ---- 3. the stress test: same loan, 7% ---- */}
              <div className="border-b border-gray-100 bg-valar-amber/10 p-6 md:px-8">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-valar-amber" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-valar-navy">
                      If rates reach {STRESS_RATE}%
                    </p>
                    {alreadyAtStress ? (
                      <p className="mt-1 text-sm leading-relaxed text-gray-600">
                        Your rate is already at or above {STRESS_RATE}%, the
                        level lenders test at.
                      </p>
                    ) : (
                      <>
                        <p className="mt-1 text-sm leading-relaxed text-gray-600">
                          The same {money(result.loan)} would cost{" "}
                          <b className="text-valar-navy">
                            {money(result.stress.payment)}
                          </b>{" "}
                          a {per},{" "}
                          <b className="text-valar-navy">
                            {money(result.stress.rise)} more
                          </b>
                          {result.hasIncome && (
                            <>
                              . That&rsquo;s{" "}
                              <b className="text-valar-navy">
                                {pct(result.stress.share)}
                              </b>{" "}
                              of your take-home pay:{" "}
                              <b className="text-valar-navy">
                                {result.stress.band.label.toLowerCase()}
                              </b>
                            </>
                          )}
                          .
                        </p>
                        {result.hasIncome && (
                          <div className="mt-4">
                            <ShareScale active={result.stress.band.label} />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/*
               * ---- 4. what the bands mean ----
               * Took the chart's place on Lena's call (2026-09-24); the chart
               * moved under the inputs. Wording built on her 2026-09-11 text
               * for the old "What it means" note.
               */}
              <div className="p-6 md:px-8">
                <Eyebrow>What the bands mean</Eyebrow>
                <dl className="mb-3 grid grid-cols-1 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
                  {BAND_NOTES.map((b) => (
                    <div key={b.label}>
                      <dt className="inline font-bold text-valar-navy">
                        {b.label}
                      </dt>{" "}
                      <dd className="inline text-gray-600">{b.copy}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mb-3 text-sm leading-relaxed text-gray-600">
                  <b className="text-valar-navy">A guide, not a rule.</b>{" "}
                  The higher your income, the bigger the share that can go to a
                  mortgage: food, power and basics don&rsquo;t rise with pay. A
                  bank may lend you more, but you don&rsquo;t have to take it.
                </p>
                <p className="text-xs leading-relaxed text-valar-steel">
                  Indicative only. What you can actually borrow is confirmed by
                  a lender after a full application.
                </p>
              </div>
            </>
          )}
        </section>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        {aside ?? <div />}
        {guideTitle && (
          <div id="send-my-numbers" className="scroll-mt-28">
            <SendCalculationForm
              guideKey={guideKey}
              guideTitle={guideTitle}
              source={source}
              guideReady={Boolean(guideReady)}
              pendingNote={pendingNote}
              blurb={blurb}
              cover={cover}
              figures={figures}
            />
          </div>
        )}
      </div>
    </div>
  );
}
