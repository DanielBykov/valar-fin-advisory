"use client";

import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import BalanceChart from "@/components/calculators/balance-chart";
import { EXTRA_CAP_PERCENT, FREQUENCIES, describeDuration } from "@/lib/split-loan";
import { calculateRepayments, type ExtraMode } from "@/lib/repayments";
import type { FrequencyKey } from "@/lib/split-loan";

const nzd = (n: number, decimals = 0) =>
  new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(Number.isFinite(n) ? n : 0);

type FieldProps = {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  /** Decimal places to show. 0 also turns on thousands separators. */
  decimals?: number;
  onChange: (value: number) => void;
};

function Field({
  label,
  hint,
  value,
  min,
  max,
  step,
  prefix,
  suffix,
  decimals = 0,
  onChange,
}: FieldProps) {
  /*
   * While the box is being typed into, the raw keystrokes are held here and the
   * committed value is left alone.
   *
   * The previous version clamped on every keystroke, which made the box
   * unusable: with a $50,000 minimum, clearing it and typing the first digit of
   * "650000" snapped the value straight back to 50,000, so the only way to
   * change the number was the slider. Clamping now happens when the field is
   * left, not while it is being filled in.
   */
  const [draft, setDraft] = useState<string | null>(null);

  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const format = (n: number) =>
    decimals > 0 ? n.toFixed(decimals) : Math.round(n).toLocaleString("en-NZ");
  const parse = (raw: string) => Number(raw.replace(/[^0-9.]/g, ""));

  const commit = () => {
    if (draft === null) return;
    const parsed = parse(draft);
    onChange(draft.trim() === "" || !Number.isFinite(parsed) ? value : clamp(parsed));
    setDraft(null);
  };

  return (
    <div data-cmp="RepaymentCalculator.Field" className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <label className="text-sm font-semibold text-valar-navy">{label}</label>
        <div className="flex items-center gap-1 text-valar-navy">
          {prefix && <span className="text-sm text-valar-steel">{prefix}</span>}
          <input
            type="text"
            inputMode={decimals > 0 ? "decimal" : "numeric"}
            value={draft ?? format(value)}
            onChange={(e) => {
              const raw = e.target.value;
              setDraft(raw);
              const parsed = parse(raw);
              // Update the results live, but only once what has been typed is
              // actually a usable number. A half-typed "6" on its way to
              // "650,000" must not drag the whole calculator down to the floor.
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
              }
            }}
            className="w-32 rounded-lg border border-valar-concrete bg-white px-3 py-1.5 text-right text-sm font-semibold tabular-nums focus:border-valar-amber focus:outline-none focus:ring-2 focus:ring-valar-amber/30"
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
        onChange={(e) => {
          setDraft(null);
          onChange(Number(e.target.value));
        }}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-valar-concrete accent-valar-amber"
        aria-label={`${label} slider`}
      />
      {hint && <p className="text-xs leading-relaxed text-valar-steel">{hint}</p>}
    </div>
  );
}

export default function RepaymentCalculator({
  onSendReport,
}: {
  onSendReport?: () => void;
}) {
  const [amount, setAmount] = useState(650_000);
  // 5.00% is roughly where the one-year fixed rate sits. It is a placeholder
  // and should track Lena's own rate sheets, not the market in general.
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(30);
  const [frequency, setFrequency] = useState<FrequencyKey>("fortnightly");
  const [extraMode, setExtraMode] = useState<ExtraMode>("amount");
  const [extraValue, setExtraValue] = useState(0);

  const result = useMemo(
    () => calculateRepayments({ amount, rate, years, frequency, extraMode, extraValue }),
    [amount, rate, years, frequency, extraMode, extraValue],
  );

  // The slider has to reach past the allowance, or the warning below can never
  // be triggered and the interesting half of the range is unreachable.
  const extraMax =
    extraMode === "percent"
      ? Math.max(10, EXTRA_CAP_PERCENT * 1.5)
      : Math.max(1_000, Math.ceil((result.allowancePerPeriod * 1.5) / 50) * 50);

  const usingExtra = result.extraPerPeriod > 0;

  return (
    <div
      data-cmp="RepaymentCalculator"
      className="grid items-start gap-6 lg:grid-cols-[1fr_400px]"
    >
      {/* Left column — the controls, the chart, and the ask. */}
      <div className="flex flex-col gap-6">
        <div
          data-cmp="RepaymentCalculator.Inputs"
          className="flex flex-col gap-6 rounded-2xl border border-valar-concrete bg-white p-6 md:p-8"
        >
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
            decimals={2}
            hint="Use the rate you have been quoted, not the advertised headline."
            onChange={setRate}
          />
          <Field
            label="Loan term"
            value={years}
            min={5}
            max={30}
            step={1}
            suffix="yrs"
            onChange={setYears}
          />

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-valar-navy">Repayment frequency</span>
            <div className="flex gap-2" role="group" aria-label="Repayment frequency">
              {FREQUENCIES.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFrequency(f.key)}
                  aria-pressed={frequency === f.key}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    frequency === f.key
                      ? "border-valar-navy bg-valar-navy text-white"
                      : "border-valar-concrete bg-white text-gray-700 hover:border-valar-amber"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-valar-navy">Extra repayment</span>
              <div
                className="flex rounded-lg border border-valar-concrete bg-white p-0.5"
                role="group"
                aria-label="Extra repayment as an amount or a percentage"
              >
                {(["amount", "percent"] as ExtraMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    aria-pressed={extraMode === mode}
                    onClick={() => {
                      setExtraMode(mode);
                      setExtraValue(0);
                    }}
                    className={`rounded-md px-3 py-1 text-xs font-bold transition-colors ${
                      extraMode === mode
                        ? "bg-valar-navy text-white"
                        : "text-valar-steel hover:text-valar-navy"
                    }`}
                  >
                    {mode === "amount" ? "$" : "%"}
                  </button>
                ))}
              </div>
            </div>
            <Field
              label={extraMode === "amount" ? "Per repayment" : "Of the loan, per year"}
              value={extraValue}
              min={0}
              max={extraMax}
              step={extraMode === "amount" ? 10 : 0.25}
              prefix={extraMode === "amount" ? "$" : undefined}
              suffix={extraMode === "percent" ? "%" : undefined}
              decimals={extraMode === "percent" ? 2 : 0}
              hint={
                extraMode === "amount"
                  ? `Paying a little more, every time — this is where the number moves. On a fixed rate most lenders let you pay up to about ${EXTRA_CAP_PERCENT}% of the loan a year, which is ${nzd(result.allowancePerPeriod)} per payment here.`
                  : `A share of the loan each year, spread across your payments — ${nzd(result.extraPerPeriod, 2)} per payment here. On a fixed rate most lenders allow up to about ${EXTRA_CAP_PERCENT}%.`
              }
              onChange={setExtraValue}
            />
            {result.overAllowance && (
              <p className="flex items-start gap-2 rounded-lg bg-valar-amber/10 p-3 text-xs leading-relaxed text-valar-navy">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-valar-amber" />
                <span>
                  That is more than {EXTRA_CAP_PERCENT}% of the loan a year. On a <b>fixed</b> rate
                  most lenders charge a break cost above roughly that, so the saving below may not be
                  available to you. On a <b>floating</b> loan there is usually no limit at all. The
                  exact allowance is in your loan contract — worth checking before you set up a
                  payment you intend to keep.
                </span>
              </p>
            )}
          </div>
        </div>

        {/* The chart — compact, under the controls, on the left. */}
        <div className="rounded-2xl border border-valar-concrete bg-white p-6">
          <BalanceChart series={result.series} showExtra={usingExtra} />
        </div>

        {/* The ask — also on the left, under the chart. */}
        {onSendReport && (
          <div className="rounded-2xl bg-valar-navy p-6">
            <h3 className="mb-2 text-lg font-bold text-white">
              Want this in writing<span className="text-valar-amber">?</span>
            </h3>
            <p className="mb-5 text-sm leading-relaxed text-valar-lilac">
              I&rsquo;ll send your figures alongside the ten mistakes I see most often before an
              application — the ones that quietly cost people either the loan or the rate.
            </p>
            <button
              type="button"
              onClick={onSendReport}
              className="w-full rounded-lg bg-valar-amber px-6 py-3 text-sm font-bold text-valar-navy transition-colors hover:bg-valar-amber-hover sm:w-auto"
            >
              Send me my calculation
            </button>
          </div>
        )}
      </div>

      {/* Right column — the answer, held in view while the inputs move. */}
      <div
        data-cmp="RepaymentCalculator.Results"
        className="flex flex-col rounded-2xl bg-valar-navy p-6 text-white md:p-8 lg:sticky lg:top-24"
      >
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-valar-amber">
          Your {result.frequencyLabel} repayment
        </p>
        <p className="text-4xl font-bold tabular-nums">{nzd(result.totalPayment, 2)}</p>
        {usingExtra && (
          <p className="mt-1 text-sm text-valar-lilac">
            {nzd(result.basePayment, 2)} required, plus {nzd(result.extraPerPeriod, 2)} extra
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 border-t border-white/15 pt-5 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-valar-lilac">Total interest</span>
            <span className="font-semibold tabular-nums">{nzd(result.totalInterest)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-valar-lilac">Total repaid</span>
            <span className="font-semibold tabular-nums">{nzd(result.totalPaid)}</span>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex h-2 overflow-hidden rounded-full">
            <div
              className="bg-valar-horizon"
              style={{ width: `${(1 - result.interestShare) * 100}%` }}
            />
            <div className="w-[2px] shrink-0 bg-valar-navy" />
            <div className="flex-1 bg-valar-amber" />
          </div>
          <div className="mt-2 flex justify-between text-xs text-valar-lilac">
            <span>Amount borrowed</span>
            <span>Interest · {Math.round(result.interestShare * 100)}%</span>
          </div>
        </div>

        {usingExtra && result.periodsSaved > 0 && (
          <div className="mt-6 rounded-lg bg-white/10 p-4">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.1em] text-valar-amber">
              Paying {extraMode === "amount" ? nzd(result.extraPerPeriod) : `${extraValue}%`} extra
            </p>
            <p className="text-sm leading-relaxed">
              Clears the loan <b>{describeDuration(result.periodsSaved, result.perYear)}</b> early
              and saves <b>{nzd(result.interestSaved)}</b> in interest.
            </p>
          </div>
        )}

        <p className="mt-6 pt-5 text-xs leading-relaxed text-valar-lilac">
          Indicative only. Assumes the rate stays fixed for the full term, which it will not — it is
          a comparison tool, not a quote.
        </p>
      </div>
    </div>
  );
}
