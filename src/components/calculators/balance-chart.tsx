"use client";

import { useMemo, useState } from "react";
import type { BalancePoint } from "@/lib/repayments";

/*
 * What is left to pay, across the term, with and without the extra repayment.
 *
 * Two lines with the saving washed in between them. Columns were tried and
 * dropped: at six buckets they lost the shape of the curve, and the shape is
 * the argument — a mortgage barely moves for years and then falls off a cliff.
 * The line pair shows that; paired columns flattened it into five comparisons.
 *
 * The card is navy. On white the amber read muddy — a dark ochre on a light
 * ground is the one place that hue goes wrong — and dropping the plot onto the
 * brand navy fixes it without inventing a colour: against a dark surface the
 * same family reads clean.
 *
 * Validated against #061634 in dark mode, not chosen by eye: this pair passes
 * lightness, chroma, CVD separation on protan and tritan, the normal-vision
 * floor, and contrast. The brand tokens themselves do not — valar-amber sits
 * above the dark-mode lightness band and valar-horizon reads grey.
 */
const SURFACE = "#061634";
const SERIES = {
  base: { color: "#5B8DEF", label: "Without extra" },
  withExtra: { color: "#C58329", label: "With extra" },
} as const;

const nzd = (n: number) =>
  new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);

const compact = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}k`;
  return `$${n}`;
};

/**
 * Axis ticks on round numbers. Dividing the maximum into equal parts gives
 * labels like $488k, which nobody reads; the step is snapped to 1/2/2.5/5 x
 * 10^n instead, so a $650,000 loan is labelled 0 / 250k / 500k / 750k.
 */
function axisTicks(max: number, count: number) {
  if (max <= 0) return { top: 1, ticks: [0, 1] };
  const rough = max / count;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rough)));
  const step = ([1, 2, 2.5, 5, 10].find((m) => magnitude * m >= rough) ?? 10) * magnitude;
  const top = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = 0; v <= top + step / 2; v += step) ticks.push(v);
  return { top, ticks };
}

export default function BalanceChart({
  series,
  showExtra,
  payoffAtYears,
  payoffLabel,
  earlyLabel,
}: {
  series: BalancePoint[];
  /** With nothing extra there is one line, and no legend. */
  showExtra: boolean;
  /** Where along the x-axis the extra plan clears, in years. Null if it runs full term. */
  payoffAtYears: number | null;
  /** How long that is, in words — "21 yr 4 mo". */
  payoffLabel: string | null;
  /** How much sooner than the scheduled term — "8 yr 8 mo". */
  earlyLabel: string | null;
}) {
  const [hoverYear, setHoverYear] = useState<number | null>(null);

  const W = 380;
  const H = 210;
  const PAD = { top: 14, right: 12, bottom: 26, left: 42 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const { maxYear, xOf, yOf, ticks } = useMemo(() => {
    const { top, ticks: t } = axisTicks(Math.max(...series.map((p) => p.base), 1), 3);
    const my = Math.max(...series.map((p) => p.year), 1);
    return {
      maxYear: my,
      xOf: (year: number) => PAD.left + (year / my) * plotW,
      yOf: (value: number) => PAD.top + plotH - (value / top) * plotH,
      ticks: t,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [series, plotW, plotH]);

  const line = (key: "base" | "withExtra") =>
    series.map((p, i) => `${i === 0 ? "M" : "L"} ${xOf(p.year)} ${yOf(p[key])}`).join(" ");

  const hovered = hoverYear === null ? null : (series.find((p) => p.year === hoverYear) ?? null);

  const yearStep = maxYear > 20 ? 5 : maxYear > 10 ? 5 : 2;
  const yearTicks = series.map((p) => p.year).filter((y) => y % yearStep === 0);

  return (
    <div data-cmp="BalanceChart" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="mb-1 text-base font-bold text-white">What&rsquo;s left to pay</h3>
          <p className="max-w-[42ch] text-xs leading-relaxed text-valar-lilac">
            {showExtra
              ? "The gap between the lines is what the extra repayment is doing."
              : "Add an extra repayment above and a second line appears here."}
          </p>
        </div>

        {/* The payoff, lifted out of the plot. It was a label sitting on the
            baseline, crowded by the axis and the line it belonged to; it is
            the headline of this card, so it is treated as one. */}
        {payoffLabel && (
          <div className="rounded-lg border border-valar-amber/40 bg-valar-amber/10 px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-valar-amber">
              Paid off in
            </p>
            <p className="text-lg font-bold leading-tight text-white">{payoffLabel}</p>
            {earlyLabel && (
              <p className="text-[11px] text-valar-lilac">{earlyLabel} early</p>
            )}
          </div>
        )}
      </div>

      {showExtra && (
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {(["base", "withExtra"] as const).map((key) => (
            <span key={key} className="flex items-center gap-1.5 text-[11px] text-valar-lilac">
              <svg width="14" height="8" aria-hidden="true">
                <line
                  x1="1"
                  y1="4"
                  x2="13"
                  y2="4"
                  stroke={SERIES[key].color}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              {SERIES[key].label}
            </span>
          ))}
        </div>
      )}

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Balance owing over ${maxYear} years${showExtra ? ", with and without extra repayments" : ""}`}
        onPointerLeave={() => setHoverYear(null)}
        onPointerMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * W;
          const year = Math.round(((x - PAD.left) / plotW) * maxYear);
          setHoverYear(series.some((p) => p.year === year) ? year : null);
        }}
      >
        {/* Gridlines — hairline, solid, recessive. */}
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={PAD.left}
              y1={yOf(t)}
              x2={W - PAD.right}
              y2={yOf(t)}
              stroke="#FFFFFF"
              strokeOpacity="0.14"
              strokeWidth="1"
            />
            <text
              x={PAD.left - 7}
              y={yOf(t) + 3.5}
              textAnchor="end"
              className="fill-valar-lilac text-[9px] tabular-nums"
            >
              {compact(t)}
            </text>
          </g>
        ))}

        {yearTicks.map((y) => (
          <text
            key={y}
            x={xOf(y)}
            y={H - 9}
            textAnchor="middle"
            className="fill-valar-lilac text-[9px] tabular-nums"
          >
            {y}
          </text>
        ))}

        {/* No wash between the lines. Amber at any opacity over navy reads as
            a grey smear rather than a tint — the muddiness Lena flagged. Two
            bright lines on a dark ground already show the gap, and the payoff
            figure in the header says how much it is worth. */}
        <path
          d={line("base")}
          fill="none"
          stroke={SERIES.base.color}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {showExtra && (
          <path
            d={line("withExtra")}
            fill="none"
            stroke={SERIES.withExtra.color}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {/* Crosshair */}
        {hovered && (
          <>
            <line
              x1={xOf(hovered.year)}
              y1={PAD.top}
              x2={xOf(hovered.year)}
              y2={PAD.top + plotH}
              stroke="#FFFFFF"
              strokeOpacity="0.35"
              strokeWidth="1"
            />
            <circle
              cx={xOf(hovered.year)}
              cy={yOf(hovered.base)}
              r="4"
              fill={SERIES.base.color}
              stroke={SURFACE}
              strokeWidth="2"
            />
            {showExtra && (
              <circle
                cx={xOf(hovered.year)}
                cy={yOf(hovered.withExtra)}
                r="4"
                fill={SERIES.withExtra.color}
                stroke={SURFACE}
                strokeWidth="2"
              />
            )}
          </>
        )}

        {/* Where the amber line lands. The words moved to the header — down
            here they sat on the baseline, crowded by the axis and by the line
            they belonged to. */}
        {showExtra && payoffAtYears !== null && (
          <circle
            cx={xOf(payoffAtYears)}
            cy={yOf(0)}
            r="4"
            fill={SERIES.withExtra.color}
            stroke={SURFACE}
            strokeWidth="2"
          />
        )}
      </svg>

      {/* Readout — values lead, labels follow. */}
      <div
        aria-live="polite"
        className={`rounded-lg bg-white/10 px-3 py-2 text-xs transition-opacity ${hovered ? "opacity-100" : "opacity-0"}`}
      >
        {hovered && (
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <b className="text-white">Year {hovered.year}</b>
            <span className="flex items-center gap-1.5">
              <svg width="12" height="8" aria-hidden="true">
                <line
                  x1="1"
                  y1="4"
                  x2="11"
                  y2="4"
                  stroke={SERIES.base.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <b className="tabular-nums text-white">{nzd(hovered.base)}</b>
            </span>
            {showExtra && (
              <span className="flex items-center gap-1.5">
                <svg width="12" height="8" aria-hidden="true">
                  <line
                    x1="1"
                    y1="4"
                    x2="11"
                    y2="4"
                    stroke={SERIES.withExtra.color}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <b className="tabular-nums text-white">{nzd(hovered.withExtra)}</b>
                <span className="text-valar-lilac">
                  · {nzd(hovered.base - hovered.withExtra)} less
                </span>
              </span>
            )}
          </span>
        )}
      </div>

      {/* Table view — every value reachable without a pointer. */}
      <details className="rounded-lg border border-white/15">
        <summary className="cursor-pointer px-3 py-2 text-xs font-semibold text-white">
          See it as a table
        </summary>
        <div className="max-h-56 overflow-auto border-t border-white/15">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-valar-navy">
              <tr className="text-left">
                <th className="px-3 py-1.5 font-bold uppercase tracking-wider text-valar-lilac">
                  Year
                </th>
                <th className="px-3 py-1.5 font-bold uppercase tracking-wider text-valar-lilac">
                  No extra
                </th>
                {showExtra && (
                  <th className="px-3 py-1.5 font-bold uppercase tracking-wider text-valar-lilac">
                    With extra
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {series.map((p) => (
                <tr key={p.year} className="border-b border-white/10 last:border-0">
                  <td className="px-3 py-1.5 tabular-nums text-valar-lilac">{p.year}</td>
                  <td className="px-3 py-1.5 tabular-nums text-valar-lilac">{nzd(p.base)}</td>
                  {showExtra && (
                    <td className="px-3 py-1.5 tabular-nums text-valar-lilac">{nzd(p.withExtra)}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
