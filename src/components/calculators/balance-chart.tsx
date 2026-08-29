"use client";

import { useId, useMemo, useState } from "react";
import type { BalancePoint } from "@/lib/repayments";

/*
 * What is left to pay, across the term, with and without the extra repayment.
 *
 * Two lines with the saving washed in between them. Columns were tried and
 * dropped: at six buckets they lost the shape of the curve, and the shape is
 * the argument — a mortgage barely moves for years and then falls off a cliff.
 * The line pair shows that; paired columns flattened it into five comparisons.
 *
 * Colours are darker steps of the brand indigo and amber, not the tokens
 * themselves: valar-indigo sits outside the required lightness band and
 * valar-amber falls below 3:1 on a white card. This pair passes all six checks
 * (lightness, chroma, CVD separation on protan and tritan, the normal-vision
 * floor, and contrast) against #FFFFFF.
 */
const SERIES = {
  base: { color: "#4A6BAF", label: "Without extra" },
  withExtra: { color: "#C77D1F", label: "With extra" },
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
}: {
  series: BalancePoint[];
  /** With nothing extra there is one line, and no legend. */
  showExtra: boolean;
  /** Where along the x-axis the extra plan clears, in years. Null if it runs full term. */
  payoffAtYears: number | null;
  /** How long that is, in words — "21 yr 4 mo". */
  payoffLabel: string | null;
}) {
  const gradientId = useId();
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

  // Keep the payoff label inside the plot rather than letting it run off the
  // right edge on a plan that clears late.
  const labelX = payoffAtYears === null ? 0 : xOf(payoffAtYears);
  const labelAnchor = labelX > W - 120 ? "end" : "start";
  const labelOffset = labelAnchor === "end" ? -8 : 8;

  return (
    <div data-cmp="BalanceChart" className="flex flex-col gap-3">
      <div>
        <h3 className="mb-1 text-base font-bold text-valar-navy">What&rsquo;s left to pay</h3>
        <p className="text-xs leading-relaxed text-gray-600">
          {showExtra
            ? "The gap between the lines is what the extra repayment is doing."
            : "Add an extra repayment above and a second line appears, showing how much sooner the balance reaches zero."}
        </p>
      </div>

      {showExtra && (
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {(["base", "withExtra"] as const).map((key) => (
            <span key={key} className="flex items-center gap-1.5 text-[11px] text-gray-600">
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
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={SERIES.withExtra.color} stopOpacity="0.16" />
            <stop offset="100%" stopColor={SERIES.withExtra.color} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Gridlines — hairline, solid, recessive. */}
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={PAD.left}
              y1={yOf(t)}
              x2={W - PAD.right}
              y2={yOf(t)}
              stroke="#E5E7EB"
              strokeWidth="1"
            />
            <text
              x={PAD.left - 7}
              y={yOf(t) + 3.5}
              textAnchor="end"
              className="fill-valar-steel text-[9px] tabular-nums"
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
            className="fill-valar-steel text-[9px] tabular-nums"
          >
            {y}
          </text>
        ))}

        {/* The saving, washed in between the two lines. */}
        {showExtra && (
          <path
            d={`${line("base")} ${series
              .slice()
              .reverse()
              .map((p) => `L ${xOf(p.year)} ${yOf(p.withExtra)}`)
              .join(" ")} Z`}
            fill={`url(#${gradientId})`}
          />
        )}

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
              stroke="#9CA3AF"
              strokeWidth="1"
            />
            <circle
              cx={xOf(hovered.year)}
              cy={yOf(hovered.base)}
              r="4"
              fill={SERIES.base.color}
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            {showExtra && (
              <circle
                cx={xOf(hovered.year)}
                cy={yOf(hovered.withExtra)}
                r="4"
                fill={SERIES.withExtra.color}
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            )}
          </>
        )}

        {/* The one direct label: when it is actually paid off. */}
        {showExtra && payoffAtYears !== null && payoffLabel && (
          <g>
            <circle
              cx={labelX}
              cy={yOf(0)}
              r="4"
              fill={SERIES.withExtra.color}
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <text
              x={labelX + labelOffset}
              y={yOf(0) - 9}
              textAnchor={labelAnchor}
              className="fill-valar-navy text-[10px] font-bold"
            >
              Paid off in {payoffLabel}
            </text>
          </g>
        )}
      </svg>

      {/* Readout — values lead, labels follow. */}
      <div
        aria-live="polite"
        className={`rounded-lg bg-valar-fog px-3 py-2 text-xs transition-opacity ${hovered ? "opacity-100" : "opacity-0"}`}
      >
        {hovered && (
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <b className="text-valar-navy">Year {hovered.year}</b>
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
              <b className="tabular-nums text-valar-navy">{nzd(hovered.base)}</b>
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
                <b className="tabular-nums text-valar-navy">{nzd(hovered.withExtra)}</b>
                <span className="text-gray-600">
                  · {nzd(hovered.base - hovered.withExtra)} less
                </span>
              </span>
            )}
          </span>
        )}
      </div>

      {/* Table view — every value reachable without a pointer. */}
      <details className="rounded-lg border border-gray-100">
        <summary className="cursor-pointer px-3 py-2 text-xs font-semibold text-valar-navy">
          See it as a table
        </summary>
        <div className="max-h-56 overflow-auto border-t border-gray-100">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-valar-fog">
              <tr className="text-left">
                <th className="px-3 py-1.5 font-bold uppercase tracking-wider text-valar-steel">
                  Year
                </th>
                <th className="px-3 py-1.5 font-bold uppercase tracking-wider text-valar-steel">
                  No extra
                </th>
                {showExtra && (
                  <th className="px-3 py-1.5 font-bold uppercase tracking-wider text-valar-steel">
                    With extra
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {series.map((p) => (
                <tr key={p.year} className="border-b border-gray-50 last:border-0">
                  <td className="px-3 py-1.5 tabular-nums text-gray-700">{p.year}</td>
                  <td className="px-3 py-1.5 tabular-nums text-gray-700">{nzd(p.base)}</td>
                  {showExtra && (
                    <td className="px-3 py-1.5 tabular-nums text-gray-700">{nzd(p.withExtra)}</td>
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
