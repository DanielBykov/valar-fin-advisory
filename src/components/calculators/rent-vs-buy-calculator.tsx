"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/* ── Formatting ──────────────────────────────────────────────────────────── */

const nzd = (n: number, decimals = 0) =>
  new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(Number.isFinite(n) ? n : 0);

/**
 * Axis labels only — full precision belongs in the tooltip and the table.
 * Keeps a decimal where rounding would print a label that does not match the
 * gridline it sits on: a $1,500 step must read $1.5K, not $2K.
 */
function compactNzd(n: number) {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  // Use the fewest decimals that still print the gridline's actual value:
  // a $1.25M line labelled "$1.3M" is a wrong label, not a rounded one.
  const scaled = (value: number, unit: string) => {
    const places = [0, 1, 2].find((d) => Math.abs(Number(value.toFixed(d)) - value) < 1e-9) ?? 2;
    return sign + "$" + value.toFixed(places) + unit;
  };
  if (abs >= 1_000_000) return scaled(abs / 1_000_000, "M");
  if (abs >= 1_000) return scaled(abs / 1_000, "K");
  return sign + "$" + Math.round(abs);
}

/* ── Model ───────────────────────────────────────────────────────────────── */

type DiffMode = "invest" | "spend";
type PayFrequency = "weekly" | "fortnightly" | "monthly";

const PAY_FREQUENCIES: { key: PayFrequency; label: string; suffix: string; factor: number }[] = [
  { key: "weekly", label: "Weekly", suffix: "/wk", factor: 12 / 52 },
  { key: "fortnightly", label: "Fortnightly", suffix: "/fortnight", factor: 12 / 26 },
  { key: "monthly", label: "Monthly", suffix: "/mo", factor: 1 },
];

type Inputs = {
  price: number;
  depositPct: number;
  ratePct: number;
  termYears: number;
  councilRates: number;
  insurance: number;
  maintenance: number;
  ownCostGrowthPct: number;
  weeklyRent: number;
  rentGrowthPct: number;
  investReturnPct: number;
  propGrowthPct: number;
  horizonYears: number;
  startInvest: number;
  diffMode: DiffMode;
};

type Projection = {
  deposit: number;
  loan: number;
  monthlyMortgage: number;
  monthlyOwnCosts: number;
  monthlyRent: number;
  /** Year 0 … horizon, so index === year. */
  years: number[];
  buyerEquity: number[];
  renterBalance: number[];
  owningCost: number[];
  rentCost: number[];
  mortgageOnly: number[];
  ownCostsOnly: number[];
  equityCrossover: number | null;
  payCrossover: number | null;
};

/** Level P&I repayment. Zero-rate loans divide evenly rather than dividing by zero. */
function monthlyRepayment(loan: number, monthlyRate: number, months: number) {
  if (months <= 0) return 0;
  if (monthlyRate <= 0) return loan / months;
  return (
    (loan * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
  );
}

/** First year where two series swap places, or null if they never do. */
function findCrossover(years: number[], a: number[], b: number[]) {
  for (let i = 1; i < years.length; i++) {
    const before = a[i - 1] - b[i - 1];
    const after = a[i] - b[i];
    if (before !== 0 && after !== 0 && before > 0 !== after > 0) return years[i];
  }
  return null;
}

/**
 * Month-by-month projection, sampled annually.
 *
 * Both sides start from the same place: the buyer puts the deposit into a house,
 * the renter puts the same sum into the market. From there the buyer's position
 * is property value less loan balance, and the renter's is the invested balance
 * plus — in "invest" mode — whatever owning costs above the rent.
 *
 * Where owning is cheaper than renting the monthly gap is clamped at zero rather
 * than run in reverse: a buyer investing their surplus is a different scenario
 * again, and modelling it silently would flatter one side without saying so.
 */
function project(i: Inputs): Projection {
  const deposit = i.price * (i.depositPct / 100);
  const loan = i.price - deposit;
  const monthlyRate = i.ratePct / 100 / 12;
  const loanMonths = Math.round(i.termYears * 12);
  const monthlyMortgage = monthlyRepayment(loan, monthlyRate, loanMonths);

  // Annual rates converted to a monthly equivalent, so 6% means 6% a year.
  const monthlyInvestRate = Math.pow(1 + i.investReturnPct / 100, 1 / 12) - 1;
  const monthlyRent0 = (i.weeklyRent * 52) / 12;
  const monthlyOwnCosts0 = (i.councilRates + i.insurance + i.maintenance) / 12;

  let balance = loan;
  let invested = i.startInvest;

  const years = [0];
  const buyerEquity = [deposit];
  const renterBalance = [i.startInvest];
  const owningCost = [monthlyMortgage + monthlyOwnCosts0];
  const rentCost = [monthlyRent0];
  const mortgageOnly = [monthlyMortgage];
  const ownCostsOnly = [monthlyOwnCosts0];

  const totalMonths = Math.round(i.horizonYears * 12);

  for (let m = 1; m <= totalMonths; m++) {
    // Rent and ownership costs step once a year, not every month.
    const yearElapsed = Math.floor((m - 1) / 12);
    const rentThisMonth = monthlyRent0 * Math.pow(1 + i.rentGrowthPct / 100, yearElapsed);
    const ownCostsThisMonth = monthlyOwnCosts0 * Math.pow(1 + i.ownCostGrowthPct / 100, yearElapsed);
    const mortgageThisMonth = m <= loanMonths ? monthlyMortgage : 0;
    const owningThisMonth = mortgageThisMonth + ownCostsThisMonth;

    if (m <= loanMonths) {
      const interest = balance * monthlyRate;
      balance = Math.max(0, balance - (monthlyMortgage - interest));
    }

    const gap = Math.max(0, owningThisMonth - rentThisMonth);
    invested = invested * (1 + monthlyInvestRate) + (i.diffMode === "invest" ? gap : 0);

    if (m % 12 === 0) {
      const year = m / 12;
      const propertyValue = i.price * Math.pow(1 + i.propGrowthPct / 100, year);
      years.push(year);
      buyerEquity.push(propertyValue - balance);
      renterBalance.push(invested);
      owningCost.push(owningThisMonth);
      rentCost.push(rentThisMonth);
      mortgageOnly.push(mortgageThisMonth);
      ownCostsOnly.push(ownCostsThisMonth);
    }
  }

  return {
    deposit,
    loan,
    monthlyMortgage,
    monthlyOwnCosts: monthlyOwnCosts0,
    monthlyRent: monthlyRent0,
    years,
    buyerEquity,
    renterBalance,
    owningCost,
    rentCost,
    mortgageOnly,
    ownCostsOnly,
    equityCrossover: findCrossover(years, buyerEquity, renterBalance),
    payCrossover: findCrossover(years, owningCost, rentCost),
  };
}

/* ── Chart ───────────────────────────────────────────────────────────────── */

const BUY_COLOR = "var(--color-valar-horizon)";
const RENT_COLOR = "var(--color-valar-amber)";

/**
 * The chart draws at the container's real pixel width rather than a fixed
 * viewBox. A fixed 900-unit box scaled down to a phone takes the axis type down
 * with it — 13px becomes 5px on a 360px screen. Measuring instead keeps every
 * label the same size at every width.
 */
function useMeasuredWidth(fallback = 900) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(fallback);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.max(300, Math.round(entry.contentRect.width)));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, width };
}

/**
 * Axis bounds that sit just above the data rather than at the next round
 * number. Rounding the maximum alone pushes $1.05M up to $2M and throws away
 * half the plot — which is exactly where the gap between the two lines lives.
 */
function niceAxis(rawMin: number, rawMax: number) {
  const range = rawMax - rawMin || Math.abs(rawMax) || 1;
  const roughStep = range / 5;
  const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const normalised = roughStep / magnitude;
  const step =
    (normalised <= 1
      ? 1
      : normalised <= 1.5
        ? 1.5
        : normalised <= 2
          ? 2
          : normalised <= 2.5
            ? 2.5
            : normalised <= 5
              ? 5
              : 10) * magnitude;
  const max = Math.ceil(rawMax / step) * step;
  const min = Math.min(0, Math.floor(rawMin / step) * step);
  return { min, max, count: Math.max(1, Math.round((max - min) / step)) };
}

/** Year ticks on a 1/2/5/10 ladder, so the axis reads 0, 5, 10 … not 0, 3, 7. */
function niceYearTicks(horizon: number, targetCount = 6) {
  const rough = horizon / targetCount;
  const step = [1, 2, 5, 10].find((c) => c >= rough) ?? Math.ceil(rough / 10) * 10;
  const ticks: number[] = [];
  for (let year = 0; year <= horizon; year += step) ticks.push(year);
  // Always land on the horizon, unless doing so would crowd the previous tick.
  if (ticks[ticks.length - 1] !== horizon && horizon - ticks[ticks.length - 1] > step / 2) {
    ticks.push(horizon);
  }
  return ticks;
}

type ChartSeries = { label: string; color: string; values: number[] };

/**
 * Two-series line chart, drawn on the navy panel. Navy rather than white
 * because amber carries "renting" everywhere on this page, and amber on white
 * sits under the 3:1 contrast floor for a 2px line.
 */
function LineChart({ years, series }: { years: number[]; series: ChartSeries[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const { ref: wrapRef, width } = useMeasuredWidth();

  const narrow = width < 560;
  const VIEW_W = width;
  const VIEW_H = narrow ? 300 : 360;
  const PAD = { top: 20, right: narrow ? 14 : 26, bottom: 36, left: narrow ? 54 : 78 };
  const PLOT_W = VIEW_W - PAD.left - PAD.right;
  const PLOT_H = VIEW_H - PAD.top - PAD.bottom;

  const all = series.flatMap((s) => s.values);
  const { min, max, count } = niceAxis(Math.min(...all, 0), Math.max(...all, 0));
  const horizon = years[years.length - 1] || 1;

  const xOf = (year: number) => PAD.left + (year / horizon) * PLOT_W;
  const yOf = (value: number) => PAD.top + PLOT_H - ((value - min) / (max - min)) * PLOT_H;

  const gridValues = Array.from({ length: count + 1 }, (_, i) => min + ((max - min) * i) / count);
  const tickYears = niceYearTicks(horizon, narrow ? 3 : 6);

  const pathFor = (values: number[]) =>
    years
      .map((yr, i) => (i === 0 ? "M" : "L") + xOf(yr).toFixed(1) + "," + yOf(values[i]).toFixed(1))
      .join(" ");

  // Shaded band between the two series — at realistic settings the lines run
  // close together, and the gap is the whole answer.
  const gapBand =
    series.length === 2
      ? pathFor(series[0].values) +
        " " +
        years
          .map(
            (yr, i) =>
              "L" +
              xOf(years[years.length - 1 - i]).toFixed(1) +
              "," +
              yOf(series[1].values[years.length - 1 - i]).toFixed(1)
          )
          .join(" ") +
        " Z"
      : null;

  const tooltipLeftPct = hover === null ? 0 : (xOf(years[hover]) / VIEW_W) * 100;
  const flip = tooltipLeftPct > 62;

  return (
    <div ref={wrapRef} data-cmp="RentVsBuyCalculator.Chart" className="relative">
      <svg
        viewBox={"0 0 " + VIEW_W + " " + VIEW_H}
        className="h-auto w-full"
        role="img"
        aria-label={series.map((s) => s.label).join(" compared with ") + " over " + horizon + " years"}
      >
        {gridValues.map((value, i) => (
          <g key={value}>
            <line
              x1={PAD.left}
              x2={VIEW_W - PAD.right}
              y1={yOf(value)}
              y2={yOf(value)}
              stroke={i === 0 ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.10)"}
              strokeWidth={1}
            />
            <text
              x={PAD.left - 12}
              y={yOf(value) + 4}
              textAnchor="end"
              fontSize={13}
              fill="var(--color-valar-steel)"
            >
              {compactNzd(value)}
            </text>
          </g>
        ))}

        {tickYears.map((year) => (
          <text
            key={year}
            x={xOf(year)}
            y={VIEW_H - PAD.bottom + 24}
            textAnchor="middle"
            fontSize={13}
            fill="var(--color-valar-steel)"
          >
            Yr {year}
          </text>
        ))}

        {gapBand && <path d={gapBand} fill="rgba(255,255,255,0.07)" stroke="none" />}

        {series.map((s) => (
          <path
            key={s.label}
            d={pathFor(s.values)}
            fill="none"
            stroke={s.color}
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}

        {series.map((s) => (
          <circle
            key={s.label + "-end"}
            cx={xOf(years[years.length - 1])}
            cy={yOf(s.values[s.values.length - 1])}
            r={5}
            fill={s.color}
            stroke="var(--color-valar-navy)"
            strokeWidth={2}
          />
        ))}

        {hover !== null && (
          <g pointerEvents="none">
            <line
              x1={xOf(years[hover])}
              x2={xOf(years[hover])}
              y1={PAD.top}
              y2={VIEW_H - PAD.bottom}
              stroke="rgba(255,255,255,0.45)"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            {series.map((s) => (
              <circle
                key={s.label + "-hover"}
                cx={xOf(years[hover])}
                cy={yOf(s.values[hover])}
                r={5}
                fill={s.color}
                stroke="var(--color-valar-navy)"
                strokeWidth={2}
              />
            ))}
          </g>
        )}

        <rect
          x={PAD.left}
          y={PAD.top}
          width={PLOT_W}
          height={PLOT_H}
          fill="transparent"
          onPointerMove={(e) => {
            const box = e.currentTarget.getBoundingClientRect();
            const fraction = (e.clientX - box.left) / box.width;
            const index = Math.round(fraction * (years.length - 1));
            setHover(Math.max(0, Math.min(years.length - 1, index)));
          }}
          onPointerLeave={() => setHover(null)}
        />
      </svg>

      {hover !== null && (
        <div
          className="pointer-events-none absolute top-2 min-w-[180px] max-w-[calc(100%-1rem)] rounded-xl border border-valar-concrete bg-white p-3 shadow-lg"
          style={{
            left: tooltipLeftPct + "%",
            transform: flip ? "translateX(-108%)" : "translateX(8%)",
          }}
        >
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-valar-steel">
            Year {years[hover]}
          </p>
          {series.map((s) => (
            <div key={s.label} className="flex items-baseline justify-between gap-4 py-0.5">
              <span className="flex items-center gap-2 text-sm text-valar-indigo">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: s.color }} />
                {s.label}
              </span>
              <span className="text-sm font-semibold tabular-nums text-valar-navy">
                {nzd(s.values[hover])}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Legend({ series }: { series: ChartSeries[] }) {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2">
      {series.map((s) => (
        <span key={s.label} className="flex items-center gap-2 text-sm text-valar-lilac">
          <span className="h-0.5 w-4 rounded-full" style={{ background: s.color }} />
          {s.label}
        </span>
      ))}
    </div>
  );
}

function DataTable({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {head.map((h, i) => (
              <th
                key={h}
                className={[
                  "border-b border-white/15 px-3 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-valar-steel",
                  i === 0 ? "text-left" : "text-right",
                ].join(" ")}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, i) => (
                <td
                  key={i}
                  className={[
                    "border-b border-white/10 px-3 py-2 tabular-nums",
                    i === 0 ? "text-left text-valar-lilac" : "text-right text-white",
                  ].join(" ")}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Inputs ──────────────────────────────────────────────────────────────── */

type FieldProps = {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  onChange: (value: number) => void;
};

function Field({ label, hint, value, min, max, step, prefix, suffix, onChange }: FieldProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  return (
    <div data-cmp="RentVsBuyCalculator.Field" className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <label className="text-sm font-semibold text-valar-navy">{label}</label>
        <div className="flex items-center gap-1 text-valar-navy">
          {prefix && <span className="text-sm text-valar-steel">{prefix}</span>}
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(clamp(Number(e.target.value)))}
            className="w-28 rounded-lg border border-valar-concrete bg-white px-3 py-1.5 text-right text-sm font-semibold tabular-nums focus:border-valar-amber focus:outline-none focus:ring-2 focus:ring-valar-amber/30"
            aria-label={label}
          />
          {suffix && <span className="text-sm text-valar-steel">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-valar-concrete accent-valar-amber"
        aria-label={label + " slider"}
      />
      {hint && <p className="text-xs text-valar-steel">{hint}</p>}
    </div>
  );
}

function FieldGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-valar-concrete/70 pt-7 first:border-t-0 first:pt-0">
      <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.14em] text-valar-amber">{title}</h3>
      <div className="grid gap-x-10 gap-y-6 md:grid-cols-2">{children}</div>
    </section>
  );
}

function StatTile({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-xl border border-valar-concrete bg-white p-5">
      <p className="mb-1.5 text-sm text-valar-indigo">{label}</p>
      <p className="text-2xl font-bold tabular-nums text-valar-navy">{value}</p>
      {note && <p className="mt-1 text-xs text-valar-steel">{note}</p>}
    </div>
  );
}

/* ── Calculator ──────────────────────────────────────────────────────────── */

export default function RentVsBuyCalculator() {
  const [price, setPrice] = useState(760_000);
  const [depositPct, setDepositPct] = useState(20);
  const [ratePct, setRatePct] = useState(5.5);
  const [termYears, setTermYears] = useState(30);
  const [councilRates, setCouncilRates] = useState(3_600);
  const [insurance, setInsurance] = useState(2_950);
  const [maintenance, setMaintenance] = useState(3_000);
  const [ownCostGrowthPct, setOwnCostGrowthPct] = useState(4);
  const [weeklyRent, setWeeklyRent] = useState(580);
  const [rentGrowthPct, setRentGrowthPct] = useState(4);
  const [investReturnPct, setInvestReturnPct] = useState(6);
  const [propGrowthPct, setPropGrowthPct] = useState(3);
  const [horizonYears, setHorizonYears] = useState(20);
  const [diffMode, setDiffMode] = useState<DiffMode>("invest");

  // Null means "track the deposit" — the renter starts from the same sum the
  // buyer puts down, which is the only fair way to line the two up.
  const [startInvestOverride, setStartInvestOverride] = useState<number | null>(null);
  const [showStartInvest, setShowStartInvest] = useState(false);

  const [payFrequency, setPayFrequency] = useState<PayFrequency>("monthly");
  const [showPositionTable, setShowPositionTable] = useState(false);
  const [showPaymentTable, setShowPaymentTable] = useState(false);

  const deposit = price * (depositPct / 100);
  const startInvest = startInvestOverride ?? deposit;

  const p = useMemo(
    () =>
      project({
        price,
        depositPct,
        ratePct,
        termYears,
        councilRates,
        insurance,
        maintenance,
        ownCostGrowthPct,
        weeklyRent,
        rentGrowthPct,
        investReturnPct,
        propGrowthPct,
        horizonYears,
        startInvest,
        diffMode,
      }),
    [
      price,
      depositPct,
      ratePct,
      termYears,
      councilRates,
      insurance,
      maintenance,
      ownCostGrowthPct,
      weeklyRent,
      rentGrowthPct,
      investReturnPct,
      propGrowthPct,
      horizonYears,
      startInvest,
      diffMode,
    ]
  );

  const last = p.years.length - 1;
  const finalBuy = p.buyerEquity[last];
  const finalRent = p.renterBalance[last];
  const difference = finalBuy - finalRent;
  const monthlyGap = p.monthlyMortgage + p.monthlyOwnCosts - p.monthlyRent;

  // Inside 2% of each other, calling a winner reads as precision the model does
  // not have.
  const lineBall = Math.abs(difference) < Math.max(finalBuy, finalRent) * 0.02;
  const aheadLabel = difference >= 0 ? "Buying" : "Renting";

  const frequency = PAY_FREQUENCIES.find((f) => f.key === payFrequency) ?? PAY_FREQUENCIES[2];

  const positionSeries: ChartSeries[] = [
    { label: "Buying — equity", color: BUY_COLOR, values: p.buyerEquity },
    { label: "Renting — investments", color: RENT_COLOR, values: p.renterBalance },
  ];

  const paymentSeries: ChartSeries[] = [
    {
      label: "Cost of owning" + frequency.suffix,
      color: BUY_COLOR,
      values: p.owningCost.map((v) => v * frequency.factor),
    },
    {
      label: "Rent" + frequency.suffix,
      color: RENT_COLOR,
      values: p.rentCost.map((v) => v * frequency.factor),
    },
  ];

  const segmentButton = (active: boolean) =>
    [
      "rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors",
      active
        ? "border-valar-navy bg-valar-navy text-white"
        : "border-valar-concrete bg-white text-valar-navy hover:border-valar-amber",
    ].join(" ");

  const panelButton =
    "rounded-lg border border-white/25 px-3 py-1.5 text-xs font-semibold text-valar-lilac transition-colors hover:border-valar-amber hover:text-valar-amber";

  return (
    <div data-cmp="RentVsBuyCalculator" className="flex flex-col gap-6">
      {/* ── Inputs ──────────────────────────────────────────── */}
      <div
        data-cmp="RentVsBuyCalculator.Inputs"
        className="flex flex-col gap-7 rounded-2xl border border-valar-concrete bg-white p-6 md:p-8"
      >
        <FieldGroup title="Property & loan">
          <Field
            label="Property price"
            value={price}
            min={300_000}
            max={2_500_000}
            step={10_000}
            prefix="$"
            hint="NZ median sits near $760,000 — use the price you are actually looking at."
            onChange={setPrice}
          />
          <Field
            label="Deposit"
            value={depositPct}
            min={5}
            max={60}
            step={1}
            suffix="%"
            hint={nzd(deposit) + " — below 20% most lenders add a low-equity margin."}
            onChange={setDepositPct}
          />
          <Field
            label="Mortgage rate"
            value={ratePct}
            min={3}
            max={10}
            step={0.05}
            suffix="%"
            hint="Held flat for the whole projection, which is not how rates behave."
            onChange={setRatePct}
          />
          <Field
            label="Loan term"
            value={termYears}
            min={10}
            max={30}
            step={1}
            suffix="yrs"
            hint="Repayments stop once the loan is cleared; rates and upkeep do not."
            onChange={setTermYears}
          />
          <Field
            label="Council rates"
            value={councilRates}
            min={0}
            max={10_000}
            step={100}
            prefix="$"
            suffix="/yr"
            onChange={setCouncilRates}
          />
          <Field
            label="House insurance"
            value={insurance}
            min={0}
            max={8_000}
            step={50}
            prefix="$"
            suffix="/yr"
            onChange={setInsurance}
          />
          <Field
            label="Maintenance"
            value={maintenance}
            min={0}
            max={20_000}
            step={100}
            prefix="$"
            suffix="/yr"
            hint={
              "The cost owners forget. A common rule of thumb is 1% of the value a year — " +
              nzd(price * 0.01) +
              " here."
            }
            onChange={setMaintenance}
          />
          <Field
            label="Ownership cost growth"
            value={ownCostGrowthPct}
            min={0}
            max={10}
            step={0.5}
            suffix="%/yr"
            hint="Rates and insurance have both been rising faster than general inflation."
            onChange={setOwnCostGrowthPct}
          />
        </FieldGroup>

        <FieldGroup title="Renting">
          <Field
            label="Weekly rent"
            value={weeklyRent}
            min={250}
            max={2_000}
            step={10}
            prefix="$"
            suffix="/wk"
            hint="Rent on a comparable home, not the cheapest thing available."
            onChange={setWeeklyRent}
          />
          <Field
            label="Rent growth"
            value={rentGrowthPct}
            min={0}
            max={10}
            step={0.5}
            suffix="%/yr"
            onChange={setRentGrowthPct}
          />
        </FieldGroup>

        <FieldGroup title="Assumptions">
          <Field
            label="Investment return"
            value={investReturnPct}
            min={0}
            max={12}
            step={0.5}
            suffix="%/yr"
            hint="What the renter earns on invested money. An average, before tax and fees — not a promise."
            onChange={setInvestReturnPct}
          />
          <Field
            label="Property growth"
            value={propGrowthPct}
            min={-3}
            max={10}
            step={0.5}
            suffix="%/yr"
            hint="A scenario, not a forecast. Try a negative number and watch what happens."
            onChange={setPropGrowthPct}
          />
          <Field
            label="Time horizon"
            value={horizonYears}
            min={5}
            max={30}
            step={1}
            suffix="yrs"
            hint="How long before you would realistically sell or move on."
            onChange={setHorizonYears}
          />

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-valar-navy">
              If renting costs less each month
            </span>
            <div className="flex gap-2" role="group" aria-label="What happens to the monthly difference">
              <button
                type="button"
                onClick={() => setDiffMode("invest")}
                aria-pressed={diffMode === "invest"}
                className={segmentButton(diffMode === "invest") + " flex-1"}
              >
                Invest the difference
              </button>
              <button
                type="button"
                onClick={() => setDiffMode("spend")}
                aria-pressed={diffMode === "spend"}
                className={segmentButton(diffMode === "spend") + " flex-1"}
              >
                Spend it
              </button>
            </div>
            <p className="text-xs text-valar-steel">
              {diffMode === "invest"
                ? "Every month the gap goes into investments, without exception. This is the renter's best case."
                : "Only the starting sum keeps growing. Closer to what most people actually do."}
            </p>
          </div>
        </FieldGroup>

        <div className="border-t border-valar-concrete/70 pt-6">
          <button
            type="button"
            onClick={() => {
              const next = !showStartInvest;
              setShowStartInvest(next);
              if (!next) setStartInvestOverride(null);
            }}
            className="text-sm font-semibold text-valar-indigo underline underline-offset-4 hover:text-valar-navy"
          >
            {showStartInvest
              ? "Reset the renter's starting sum to the deposit"
              : "The renter starts with the same sum as the deposit — change that"}
          </button>
          {showStartInvest && (
            <div className="mt-5 md:max-w-[calc(50%-1.25rem)]">
              <Field
                label="Renter's starting investment"
                value={startInvest}
                min={0}
                max={800_000}
                step={1_000}
                prefix="$"
                hint="Both sides start level by default. Lower it if the deposit came from somewhere a renter would not have."
                onChange={setStartInvestOverride}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Stats ───────────────────────────────────────────── */}
      <div
        data-cmp="RentVsBuyCalculator.Stats"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      >
        <StatTile label="Mortgage" value={nzd(p.monthlyMortgage) + "/mo"} note="Principal & interest" />
        <StatTile
          label="Rates, insurance, upkeep"
          value={nzd(p.monthlyOwnCosts) + "/mo"}
          note="On top of the mortgage"
        />
        <StatTile label="Rent today" value={nzd(p.monthlyRent) + "/mo"} note={nzd(weeklyRent) + " a week"} />
        <StatTile
          label="Monthly gap"
          value={(monthlyGap >= 0 ? "+" : "−") + nzd(Math.abs(monthlyGap))}
          note={monthlyGap >= 0 ? "Owning costs more" : "Renting costs more"}
        />
        <StatTile
          label="Equity crossover"
          value={p.equityCrossover ? "Year " + p.equityCrossover : "None"}
          note={p.equityCrossover ? "Where the lines swap" : "Lines never cross in this window"}
        />
      </div>

      {/* ── Headline ────────────────────────────────────────── */}
      <div
        data-cmp="RentVsBuyCalculator.Headline"
        className="rounded-2xl bg-valar-navy p-6 md:p-8"
      >
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-valar-amber">
          After {horizonYears} years
        </p>
        <p className="text-2xl font-bold text-white md:text-3xl">
          {lineBall ? (
            <>
              Too close to call<span className="text-valar-amber">.</span>
            </>
          ) : (
            <>
              {aheadLabel} is ahead by {nzd(Math.abs(difference))}
              <span className="text-valar-amber">.</span>
            </>
          )}
        </p>
        <p className="mt-3 max-w-[70ch] text-[15px] leading-relaxed text-valar-lilac">
          Buyer&rsquo;s equity {nzd(finalBuy)} against the renter&rsquo;s {nzd(finalRent)}, with the
          renter {diffMode === "invest" ? "investing" : "spending"} the monthly difference. Change one
          assumption and this number moves — that is the point of it.
        </p>
      </div>

      {/* ── Position over time ──────────────────────────────── */}
      <div
        data-cmp="RentVsBuyCalculator.Position"
        className="rounded-2xl bg-valar-navy p-6 md:p-8"
      >
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="mb-1.5 text-xl font-bold text-white">Where you stand</h3>
            <p className="text-sm leading-relaxed text-valar-lilac">
              The buyer&rsquo;s equity — loan paid down plus any growth — against the renter&rsquo;s
              investment balance.
            </p>
          </div>
          <button type="button" onClick={() => setShowPositionTable((v) => !v)} className={panelButton}>
            {showPositionTable ? "Show chart" : "Show table"}
          </button>
        </div>

        <div className="mb-5">
          <Legend series={positionSeries} />
        </div>

        {showPositionTable ? (
          <DataTable
            head={["Year", "Buyer equity", "Renter balance", "Difference"]}
            rows={p.years.map((yr, i) => [
              String(yr),
              nzd(p.buyerEquity[i]),
              nzd(p.renterBalance[i]),
              nzd(p.buyerEquity[i] - p.renterBalance[i]),
            ])}
          />
        ) : (
          <LineChart years={p.years} series={positionSeries} />
        )}
      </div>

      {/* ── What you actually pay ───────────────────────────── */}
      <div
        data-cmp="RentVsBuyCalculator.Payments"
        className="rounded-2xl bg-valar-navy p-6 md:p-8"
      >
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="mb-1.5 text-xl font-bold text-white">What you actually pay</h3>
            <p className="max-w-[62ch] text-sm leading-relaxed text-valar-lilac">
              The mortgage itself never moves. Rates, insurance, upkeep and rent all do — which is why
              these two lines eventually meet.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {PAY_FREQUENCIES.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setPayFrequency(f.key)}
                aria-pressed={payFrequency === f.key}
                className={[
                  "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors",
                  payFrequency === f.key
                    ? "border-valar-amber bg-valar-amber text-valar-navy"
                    : "border-white/25 text-valar-lilac hover:border-valar-amber hover:text-valar-amber",
                ].join(" ")}
              >
                {f.label}
              </button>
            ))}
            <button type="button" onClick={() => setShowPaymentTable((v) => !v)} className={panelButton}>
              {showPaymentTable ? "Show chart" : "Show table"}
            </button>
          </div>
        </div>

        <div className="mb-5">
          <Legend series={paymentSeries} />
        </div>

        {showPaymentTable ? (
          <DataTable
            head={[
              "Year",
              "Mortgage",
              "Rates, ins. & upkeep",
              "Total owning",
              "Rent",
              "Difference",
            ]}
            rows={p.years.map((yr, i) => [
              String(yr),
              nzd(p.mortgageOnly[i] * frequency.factor),
              nzd(p.ownCostsOnly[i] * frequency.factor),
              nzd(p.owningCost[i] * frequency.factor),
              nzd(p.rentCost[i] * frequency.factor),
              nzd((p.owningCost[i] - p.rentCost[i]) * frequency.factor),
            ])}
          />
        ) : (
          <LineChart years={p.years} series={paymentSeries} />
        )}

        <p className="mt-6 text-sm leading-relaxed text-valar-lilac">
          {p.payCrossover
            ? "On these numbers, rent overtakes the total cost of owning around year " +
              p.payCrossover +
              "."
            : p.owningCost[last] >= p.rentCost[last]
              ? "On these numbers, owning stays the larger monthly cost for the whole period."
              : "On these numbers, rent stays below the cost of owning for the whole period."}
        </p>
      </div>

      {/* ── Notes ───────────────────────────────────────────── */}
      <div
        data-cmp="RentVsBuyCalculator.Notes"
        className="rounded-2xl border border-valar-concrete bg-valar-fog p-6 md:p-8"
      >
        <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-valar-amber">
          What this does and does not include
        </h3>
        <div className="flex flex-col gap-4 text-sm leading-relaxed text-valar-indigo">
          <p>
            <strong className="font-semibold text-valar-navy">
              Indicative only — not personal financial advice.
            </strong>{" "}
            Every rate here is held flat for the full period: the mortgage rate, rent growth,
            investment return, property growth and the growth in rates and insurance. None of them
            behave that way in real life. Property growth is a scenario you set, not a forecast, and
            values can fall as well as rise.
          </p>
          <p>
            Included on the owning side: principal and interest at the rate and term you set, council
            rates, insurance and maintenance, all growing each year. Not included: the one-off costs of
            buying and selling — legal fees, building reports, agent commission — or any low-equity
            margin on a deposit under 20%.
          </p>
          <p>
            On the renting side, the starting investment defaults to the buyer&rsquo;s deposit so both
            sides begin level, and returns are shown before tax and fees. Where owning costs more each
            month, that gap is invested in full and on time, every month — which is the renter&rsquo;s
            best case rather than the usual one.
          </p>
        </div>
      </div>
    </div>
  );
}
