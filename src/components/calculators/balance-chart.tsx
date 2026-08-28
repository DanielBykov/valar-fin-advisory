"use client";

import { useMemo, useState } from "react";
import type { BalancePoint } from "@/lib/repayments";

/*
 * What is left to pay, at a handful of points across the term, with and without
 * the extra repayment.
 *
 * Columns rather than lines, and six or so buckets rather than every year: this
 * sits in a narrow column beside the inputs, and at that size a 30-point line
 * pair is a smear. Paired columns make the comparison the reader is actually
 * making — this year, with and without — in a single glance.
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
}: {
  series: BalancePoint[];
  /** With nothing extra there is one column per year, and no legend. */
  showExtra: boolean;
}) {
  const [hover, setHover] = useState<{ year: number; key: "base" | "withExtra" } | null>(null);

  const term = series.length > 0 ? series[series.length - 1].year : 0;

  /*
   * Six-ish buckets, on a round number of years. Year 0 is left out: both
   * columns are the full balance there, so it would spend the tallest pair of
   * bars in the chart saying nothing.
   */
  const points = useMemo(() => {
    const step = [1, 2, 5, 10].find((s) => term / s <= 7) ?? 10;
    return series.filter((p) => p.year > 0 && p.year % step === 0);
  }, [series, term]);

  const { top, ticks } = useMemo(
    () => axisTicks(Math.max(...points.map((p) => p.base), 1), 3),
    [points],
  );

  const W = 360;
  const H = 190;
  const PAD = { top: 10, right: 6, bottom: 24, left: 40 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const band = plotW / Math.max(points.length, 1);
  // Capped at 24px, and never filling the band — the leftover is air.
  const barW = Math.max(4, Math.min(24, (band - 12) / (showExtra ? 2 : 1)));
  const yOf = (v: number) => PAD.top + plotH - (v / top) * plotH;

  const hovered = hover === null ? null : (points.find((p) => p.year === hover.year) ?? null);

  return (
    <div data-cmp="BalanceChart" className="flex flex-col gap-3">
      <div>
        <h3 className="mb-1 text-base font-bold text-valar-navy">What&rsquo;s left to pay</h3>
        <p className="text-xs leading-relaxed text-gray-600">
          {showExtra
            ? "Each pair is the same year — with and without your extra repayment."
            : "Add an extra repayment above and a second column appears alongside each one."}
        </p>
      </div>

      {showExtra && (
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {(["base", "withExtra"] as const).map((key) => (
            <span key={key} className="flex items-center gap-1.5 text-[11px] text-gray-600">
              <span
                className="h-2.5 w-2.5 rounded-[2px]"
                style={{ backgroundColor: SERIES[key].color }}
                aria-hidden="true"
              />
              {SERIES[key].label}
            </span>
          ))}
        </div>
      )}

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Balance owing across the term${showExtra ? ", with and without extra repayments" : ""}`}
        onPointerLeave={() => setHover(null)}
      >
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

        {points.map((p, i) => {
          const centre = PAD.left + band * i + band / 2;
          const pair: ("base" | "withExtra")[] = showExtra ? ["base", "withExtra"] : ["base"];

          return (
            <g key={p.year}>
              {pair.map((key, k) => {
                // A 2px gap of surface separates the two columns of a pair.
                const x = showExtra ? centre - barW - 1 + k * (barW + 2) : centre - barW / 2;
                const value = p[key];
                const h = Math.max(0, (value / top) * plotH);
                const isHovered = hover?.year === p.year && hover?.key === key;
                const radius = Math.min(4, barW / 2);

                return (
                  <g key={key}>
                    {/* Hit target — bigger than the mark, full column height. */}
                    <rect
                      x={x - 3}
                      y={PAD.top}
                      width={barW + 6}
                      height={plotH}
                      fill="transparent"
                      tabIndex={0}
                      role="button"
                      aria-label={`Year ${p.year}, ${SERIES[key].label}: ${nzd(value)}`}
                      onPointerEnter={() => setHover({ year: p.year, key })}
                      onFocus={() => setHover({ year: p.year, key })}
                      onBlur={() => setHover(null)}
                    />
                    {h > 0 && (
                      /* The opacity sits on the group, not on each rect: the
                         two overlap at the foot, and fading them separately
                         leaves a visible seam where they cross. */
                      <g opacity={isHovered ? 0.8 : 1} pointerEvents="none">
                        <rect
                          x={x}
                          y={yOf(value)}
                          width={barW}
                          height={h}
                          rx={radius}
                          fill={SERIES[key].color}
                        />
                        {/* Square the foot off — the rounding belongs to the
                            data end, not to the baseline. */}
                        {h > radius && (
                          <rect
                            x={x}
                            y={yOf(0) - radius}
                            width={barW}
                            height={radius}
                            fill={SERIES[key].color}
                          />
                        )}
                      </g>
                    )}
                  </g>
                );
              })}

              <text
                x={centre}
                y={H - 8}
                textAnchor="middle"
                className="fill-valar-steel text-[9px] tabular-nums"
              >
                {p.year}
              </text>
            </g>
          );
        })}

        <line
          x1={PAD.left}
          y1={yOf(0)}
          x2={W - PAD.right}
          y2={yOf(0)}
          stroke="#D1D5DB"
          strokeWidth="1"
        />
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
              <span
                className="h-2.5 w-2.5 rounded-[2px]"
                style={{ backgroundColor: SERIES.base.color }}
                aria-hidden="true"
              />
              <b className="tabular-nums text-valar-navy">{nzd(hovered.base)}</b>
            </span>
            {showExtra && (
              <span className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-[2px]"
                  style={{ backgroundColor: SERIES.withExtra.color }}
                  aria-hidden="true"
                />
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
