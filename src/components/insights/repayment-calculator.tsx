"use client";

import { useMemo, useState } from "react";

const FREQUENCIES = [
  { key: "weekly", label: "Weekly", perYear: 52 },
  { key: "fortnightly", label: "Fortnightly", perYear: 26 },
  { key: "monthly", label: "Monthly", perYear: 12 },
] as const;

type FrequencyKey = (typeof FREQUENCIES)[number]["key"];

const nzd = (n: number, decimals = 0) =>
  new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(Number.isFinite(n) ? n : 0);

/** Level repayment for an amortising loan. */
function periodicPayment(principal: number, ratePerPeriod: number, periods: number) {
  if (periods <= 0) return 0;
  if (ratePerPeriod <= 0) return principal / periods;
  return (principal * ratePerPeriod) / (1 - Math.pow(1 + ratePerPeriod, -periods));
}

/** Amortise until the balance clears, returning periods used and interest paid. */
function amortise(principal: number, ratePerPeriod: number, payment: number, maxPeriods: number) {
  let balance = principal;
  let interest = 0;
  let periods = 0;
  while (balance > 0 && periods < maxPeriods) {
    const charge = balance * ratePerPeriod;
    const principalPart = payment - charge;
    // Payment does not cover the interest — the loan never clears.
    if (principalPart <= 0) return { periods: Infinity, interest: Infinity };
    interest += charge;
    balance -= principalPart;
    periods += 1;
  }
  return { periods, interest };
}

function describeDuration(periods: number, perYear: number) {
  if (!Number.isFinite(periods)) return "—";
  const years = Math.floor(periods / perYear);
  const months = Math.round(((periods % perYear) / perYear) * 12);
  if (years <= 0) return `${months} month${months === 1 ? "" : "s"}`;
  if (months <= 0) return `${years} year${years === 1 ? "" : "s"}`;
  return `${years} yr ${months} mo`;
}

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
    <div data-cmp="RepaymentCalculator.Field" className="flex flex-col gap-2">
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
        aria-label={`${label} slider`}
      />
      {hint && <p className="text-xs text-valar-steel">{hint}</p>}
    </div>
  );
}

export default function RepaymentCalculator() {
  const [amount, setAmount] = useState(650_000);
  const [rate, setRate] = useState(6.15);
  const [years, setYears] = useState(30);
  const [frequency, setFrequency] = useState<FrequencyKey>("fortnightly");
  const [extra, setExtra] = useState(0);

  const result = useMemo(() => {
    const freq = FREQUENCIES.find((f) => f.key === frequency) ?? FREQUENCIES[2];
    const perYear = freq.perYear;
    const ratePerPeriod = rate / 100 / perYear;
    const periods = Math.round(years * perYear);

    const base = periodicPayment(amount, ratePerPeriod, periods);
    const baseInterest = base * periods - amount;

    const withExtra = base + extra;
    const accelerated = amortise(amount, ratePerPeriod, withExtra, periods);
    const usingExtra = extra > 0 && Number.isFinite(accelerated.interest);
    const periodsSaved = usingExtra ? periods - accelerated.periods : 0;
    const interestSaved = usingExtra ? baseInterest - accelerated.interest : 0;

    // Totals describe the plan currently on screen, extra payments included.
    const totalInterest = usingExtra ? accelerated.interest : baseInterest;

    return {
      perYear,
      frequencyLabel: freq.label.toLowerCase(),
      payment: base,
      paymentWithExtra: withExtra,
      totalInterest,
      totalPaid: amount + totalInterest,
      interestShare: totalInterest / (amount + totalInterest),
      periodsSaved,
      interestSaved,
      timeSaved: describeDuration(periodsSaved, perYear),
    };
  }, [amount, rate, years, frequency, extra]);

  return (
    <div
      data-cmp="RepaymentCalculator"
      className="grid gap-8 rounded-2xl border border-valar-concrete bg-white p-6 md:p-8 lg:grid-cols-[1fr_400px]"
    >
      {/* Inputs */}
      <div data-cmp="RepaymentCalculator.Inputs" className="flex flex-col gap-6">
        <Field
          label="Loan amount"
          value={amount}
          min={50_000}
          max={2_000_000}
          step={5_000}
          prefix="$"
          onChange={setAmount}
        />
        <Field
          label="Interest rate"
          value={rate}
          min={1}
          max={12}
          step={0.05}
          suffix="%"
          hint="Use the rate you have been quoted, not the advertised headline."
          onChange={setRate}
        />
        <Field label="Loan term" value={years} min={5} max={30} step={1} suffix="yrs" onChange={setYears} />

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-valar-navy">Repayment frequency</span>
          <div className="flex gap-2" role="group" aria-label="Repayment frequency">
            {FREQUENCIES.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFrequency(f.key)}
                aria-pressed={frequency === f.key}
                className={[
                  "flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                  frequency === f.key
                    ? "border-valar-navy bg-valar-navy text-white"
                    : "border-valar-concrete bg-white text-valar-navy hover:border-valar-amber",
                ].join(" ")}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <Field
          label="Extra per repayment"
          value={extra}
          min={0}
          max={1_000}
          step={10}
          prefix="$"
          hint="Paying a little more, every time — this is where the number moves."
          onChange={setExtra}
        />
      </div>

      {/* Results */}
      <div
        data-cmp="RepaymentCalculator.Results"
        className="flex flex-col gap-5 rounded-xl bg-valar-navy p-6 text-valar-lilac md:p-7"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-valar-amber">
            Your {result.frequencyLabel} repayment
          </p>
          <p className="mt-2 text-4xl font-bold tabular-nums text-white">
            {nzd(result.paymentWithExtra, 2)}
          </p>
          {extra > 0 && (
            <p className="mt-1 text-sm">
              {nzd(result.payment, 2)} required, plus {nzd(extra)} extra
            </p>
          )}
        </div>

        <div className="h-px bg-white/15" />

        <dl className="flex flex-col gap-3 text-sm">
          <div className="flex items-baseline justify-between gap-4">
            <dt>Total interest</dt>
            <dd className="font-semibold tabular-nums text-white">{nzd(result.totalInterest)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt>Total repaid</dt>
            <dd className="font-semibold tabular-nums text-white">{nzd(result.totalPaid)}</dd>
          </div>
        </dl>

        {/* Principal vs interest */}
        <div className="flex flex-col gap-2">
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-white/15">
            <div
              className="bg-valar-horizon"
              style={{ width: `${(1 - result.interestShare) * 100}%` }}
            />
            <div className="bg-valar-amber" style={{ width: `${result.interestShare * 100}%` }} />
          </div>
          <div className="flex justify-between text-xs">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-valar-horizon" /> Amount borrowed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-valar-amber" />
              Interest · {Math.round(result.interestShare * 100)}%
            </span>
          </div>
        </div>

        {extra > 0 && result.periodsSaved > 0 && (
          <div className="rounded-lg border border-valar-amber/40 bg-valar-amber/10 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-valar-amber">
              Paying {nzd(extra)} extra
            </p>
            <p className="mt-2 text-sm text-white">
              Clears the loan <strong className="font-semibold">{result.timeSaved}</strong> early and
              saves <strong className="font-semibold">{nzd(result.interestSaved)}</strong> in interest.
            </p>
          </div>
        )}

        <p className="mt-auto text-xs leading-relaxed text-valar-steel">
          Indicative only. Assumes the rate stays fixed for the full term, which it will not — it is a
          comparison tool, not a quote.
        </p>
      </div>
    </div>
  );
}
