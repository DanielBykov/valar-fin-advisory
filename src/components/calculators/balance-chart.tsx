"use client";

import { useId, useMemo, useState } from "react";
import type { BalancePoint } from "@/lib/repayments";

/*
 * Balance owing over the life of the loan, with and without the extra
 * repayment. The point of the chart is the gap between the two lines and where
 * the amber one reaches zero.
 *
 * Colours are two darker steps of the brand's indigo and amber. They are not
 * the brand tokens themselves: valar-indigo is too dark to sit in the required
 * lightness band and valar-amber falls below 3:1 against a white card. This
 * pair passes all six checks — lightness, chroma, CVD separation on both
 * protan and tritan, the normal-vision floor, and contrast — against #FFFFFF.
 */
const SERIES = {
  base: { color: "#4A6BAF", label: "Without extra repayments" },
  withExtra: { color: "#C77D1F", label: "With your extra repayment" },
} as const;

const nzd = (n: number) =>
  new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);

const compact = (n: number) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}m`
    : n >= 1_000
      ? `$${Math.round(n / 1_000)}k`
      : `$${Math.round(n)}`;

/**
 * Axis ticks on round numbers.
 *
 * Dividing the maximum into four gives ticks like $488k and $163k, which nobody
 * reads. Instead the step is snapped to 1 / 2 / 2.5 / 5 x 10^n and the top is
 * the first multiple of that step at or above the data — so a $650,000 loan is
 * labelled 0 / 200k / 400k / 600k / 800k.
 */
function axisTicks(max: number) {
  if (max <= 0) return { top: 1, ticks: [0, 1] };
  const rough = max / 4;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rough)));
  const step =
    ([1, 2, 2.5, 5, 10].find((m) => magnitude * m >= rough) ?? 10) * magnitude;
  const top = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = 0; v <= top + step / 2; v += step) ticks.push(v);
  return { top, ticks };
}

export default function BalanceChart({
  series,
  showExtra,
  payoffYears,
  scheduledYears,
}: {
  series: BalancePoint[];
  /** When there is no extra repayment there is only one line, and no legend. */
  showExtra: boolean;
  payoffYears: number | null;
  scheduledYears: number;
}) {
  const gradientId = useId();
  const [hoverYear, setHoverYear] = useState<number | null>(null);

  const W = 720;
  const H = 300;
  const PAD = { top: 16, right: 20, bottom: 34, left: 58 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const { maxYear, xOf, yOf, ticks } = useMemo(() => {
    const { top, ticks: t } = axisTicks(Math.max(...series.map((p) => p.base), 1));
    const my = Math.max(...series.map((p) => p.year), 1);
    return {
      maxYear: my,
      xOf: (year: number) => PAD.left + (year / my) * plotW,
      yOf: (value: number) => PAD.top + plotH - (value / top) * plotH,
      ticks: t,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [series, plotW, plotH]);

  const path = (key: "base" | "withExtra") =>
    series.map((p, i) => `${i === 0 ? "M" : "L"} ${xOf(p.year)} ${yOf(p[key])}`).join(" ");

  const hovered = hoverYear === null ? null : series.find((p) => p.year === hoverYear) ?? null;

  // Year labels: every 5 years reads cleanly at this width on any term.
  const yearStep = maxYear > 20 ? 5 : maxYear > 10 ? 2 : 1;
  const yearTicks = series.map((p) => p.year).filter((y) => y % yearStep === 0);

  return (
    <div data-cmp="BalanceChart" className="flex flex-col gap-4">
      <div>
        <h3 className="mb-1 text-lg font-bold text-valar-navy">What you still owe, year by year</h3>
        <p className="max-w-[70ch] text-sm leading-relaxed text-gray-600">
          {showExtra
            ? "The gap between the two lines is what the extra repayment is doing. Where the amber line reaches the bottom is the day you are done."
            : "Add an extra repayment above and a second line appears here, showing how much sooner the balance reaches zero."}
        </p>
      </div>

      {/* Legend — always present once there are two series. */}
      {showExtra && (
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {(["base", "withExtra"] as const).map((key) => (
            <span key={key} className="flex items-center gap-2 text-xs text-gray-600">
              <svg width="18" height="8" aria-hidden="true">
                <line
                  x1="1"
                  y1="4"
                  x2="17"
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

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full min-w-[560px]"
          role="img"
          aria-label={`Loan balance over ${maxYear} years${showExtra ? ", with and without extra repayments" : ""}`}
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
              <stop offset="0%" stopColor={SERIES.withExtra.color} stopOpacity="0.14" />
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
                x={PAD.left - 10}
                y={yOf(t) + 4}
                textAnchor="end"
                className="fill-valar-steel text-[11px] tabular-nums"
              >
                {compact(t)}
              </text>
            </g>
          ))}

          {/* Year axis */}
          {yearTicks.map((y) => (
            <text
              key={y}
              x={xOf(y)}
              y={H - 12}
              textAnchor="middle"
              className="fill-valar-steel text-[11px] tabular-nums"
            >
              {y}
            </text>
          ))}
          <text
            x={PAD.left + plotW / 2}
            y={H - 12}
            textAnchor="middle"
            className="fill-transparent text-[11px]"
          >
            .
          </text>

          {/* The saving, as a wash between the lines. */}
          {showExtra && (
            <path
              d={`${path("base")} L ${xOf(series[series.length - 1].year)} ${yOf(series[series.length - 1].withExtra)} ${series
                .slice()
                .reverse()
                .map((p) => `L ${xOf(p.year)} ${yOf(p.withExtra)}`)
                .join(" ")} Z`}
              fill={`url(#${gradientId})`}
            />
          )}

          <path
            d={path("base")}
            fill="none"
            stroke={SERIES.base.color}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {showExtra && (
            <path
              d={path("withExtra")}
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
                r="4.5"
                fill={SERIES.base.color}
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              {showExtra && (
                <circle
                  cx={xOf(hovered.year)}
                  cy={yOf(hovered.withExtra)}
                  r="4.5"
                  fill={SERIES.withExtra.color}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              )}
            </>
          )}

          {/* The one direct label worth having: where it is paid off. */}
          {showExtra && payoffYears !== null && payoffYears < scheduledYears && (
            <g>
              <circle
                cx={xOf(payoffYears)}
                cy={yOf(0)}
                r="4.5"
                fill={SERIES.withExtra.color}
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              <text
                x={Math.min(xOf(payoffYears) + 10, W - PAD.right - 4)}
                y={yOf(0) - 12}
                textAnchor={xOf(payoffYears) > W - 140 ? "end" : "start"}
                className="fill-valar-navy text-[11px] font-bold"
              >
                Paid off, year {payoffYears}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Tooltip readout — values lead, labels follow. */}
      <div
        aria-live="polite"
        className={`flex flex-wrap gap-x-8 gap-y-2 rounded-lg bg-valar-fog px-4 py-3 text-sm transition-opacity ${hovered ? "opacity-100" : "opacity-0"}`}
      >
        {hovered && (
          <>
            <span className="font-semibold text-valar-navy">
              Year {hovered.year}
            </span>
            <span className="flex items-center gap-2">
              <svg width="14" height="8" aria-hidden="true">
                <line x1="1" y1="4" x2="13" y2="4" stroke={SERIES.base.color} strokeWidth="2" strokeLinecap="round" />
              </svg>
              <b className="tabular-nums text-valar-navy">{nzd(hovered.base)}</b>
              <span className="text-gray-600">owing</span>
            </span>
            {showExtra && (
              <span className="flex items-center gap-2">
                <svg width="14" height="8" aria-hidden="true">
                  <line x1="1" y1="4" x2="13" y2="4" stroke={SERIES.withExtra.color} strokeWidth="2" strokeLinecap="round" />
                </svg>
                <b className="tabular-nums text-valar-navy">{nzd(hovered.withExtra)}</b>
                <span className="text-gray-600">
                  owing — {nzd(hovered.base - hovered.withExtra)} less
                </span>
              </span>
            )}
          </>
        )}
      </div>

      {/* Table view — every value reachable without hovering. */}
      <details className="rounded-lg border border-gray-100 bg-white">
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-valar-navy">
          See these numbers as a table
        </summary>
        <div className="max-h-72 overflow-auto border-t border-gray-100">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-valar-fog">
              <tr className="text-left">
                <th className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-valar-steel">
                  Year
                </th>
                <th className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-valar-steel">
                  Owing, no extra
                </th>
                {showExtra && (
                  <th className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-valar-steel">
                    Owing, with extra
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {series.map((p) => (
                <tr key={p.year} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-2 tabular-nums text-gray-700">{p.year}</td>
                  <td className="px-4 py-2 tabular-nums text-gray-700">{nzd(p.base)}</td>
                  {showExtra && (
                    <td className="px-4 py-2 tabular-nums text-gray-700">{nzd(p.withExtra)}</td>
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
