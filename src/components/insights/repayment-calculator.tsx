"use client";

import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import BalanceChart from "@/components/calculators/balance-chart";
import NumberField from "@/components/calculators/number-field";
import SendCalculationForm from "@/components/calculators/send-calculation-form";
import { EXTRA_CAP_PERCENT, FREQUENCIES, describeDuration } from "@/lib/split-loan";
import { calculateRepayments, type RepaymentExtraMode } from "@/lib/repayments";
import type { FrequencyKey } from "@/lib/split-loan";

const nzd = (n: number, decimals = 0) =>
  new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(Number.isFinite(n) ? n : 0);

/*
 * The capture card is rendered here rather than passed in as a ReactNode.
 * It has to carry the numbers currently on screen, and those only exist inside
 * this component — a prebuilt element handed down from the page cannot see
 * them. The page still owns the copy; it passes the words, not the element.
 */
/**
 * The round payments sitting just above the scheduled one.
 *
 * Three steps, because which number is "round" depends on the size of the
 * payment: at $966 a week the memorable figure is $1,000, at $340 a fortnight
 * it is $350. Duplicates collapse — $966 rounds to $1,000 at both the $50 and
 * the $100 step, and offering it twice would be noise.
 */
function roundUpTargets(base: number): number[] {
  const out: number[] = [];
  for (const step of [10, 50, 100]) {
    const value = Math.ceil((base + 0.01) / step) * step;
    if (!out.includes(value)) out.push(value);
  }
  return out;
}

export default function RepaymentCalculator({
  guideKey,
  guideTitle,
  guideReady,
  cover,
  source,
}: {
  /** Which lead magnet the card offers — decides the MailerLite group. */
  guideKey?: string;
  /** Named on the capture card and in the email. Omit to hide the card. */
  guideTitle?: string;
  /** False while the guide PDF is still being written. */
  guideReady?: boolean;
  /** The guide's cover art, shown at the top of the capture card. */
  cover?: { src: string; width: number; height: number };
  /** Which page asked, recorded against the subscriber. */
  source?: string;
}) {
  const [amount, setAmount] = useState(650_000);
  // 5.00% is roughly where the one-year fixed rate sits. It is a placeholder
  // and should track Lena's own rate sheets, not the market in general.
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(30);
  const [frequency, setFrequency] = useState<FrequencyKey>("fortnightly");
  const [extraMode, setExtraMode] = useState<RepaymentExtraMode>("amount");
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
      : extraMode === "target"
        ? Math.ceil((result.basePayment + result.allowancePerPeriod * 1.5) / 50) * 50
        : Math.max(1_000, Math.ceil((result.allowancePerPeriod * 1.5) / 50) * 50);

  const targets = roundUpTargets(result.basePayment);

  const usingExtra = result.extraPerPeriod > 0;
  const clearsEarly = usingExtra && result.periods < result.scheduledPeriods;
  const payoffAtYears = clearsEarly ? result.periods / result.perYear : null;
  const payoffLabel = clearsEarly ? describeDuration(result.periods, result.perYear) : null;
  const earlyLabel = clearsEarly
    ? describeDuration(result.periodsSaved, result.perYear)
    : null;

  return (
    <div
      data-cmp="RepaymentCalculator"
      className="grid gap-6 lg:grid-cols-[1fr_400px]"
    >
      {/* Row 1, left — the controls. */}
      <div
          data-cmp="RepaymentCalculator.Inputs"
          className="flex flex-col gap-6 rounded-2xl border border-valar-concrete bg-white p-6 md:p-8"
        >
          <NumberField
            cmp="RepaymentCalculator.Field"
            label="Loan amount"
            value={amount}
            min={50_000}
            max={2_000_000}
            step={5_000}
            unit="$"
            onChange={setAmount}
          />
          <NumberField
            cmp="RepaymentCalculator.Field"
            label="Interest rate"
            value={rate}
            min={1}
            max={12}
            step={0.05}
            unit="%"
            decimals={2}
            hint="Use the rate you have been quoted, not the advertised headline."
            onChange={setRate}
          />
          <NumberField
            cmp="RepaymentCalculator.Field"
            label="Loan term"
            value={years}
            min={5}
            max={30}
            step={1}
            unit="yrs"
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
                aria-label="Extra repayment as an amount, a percentage, or a total payment"
              >
                {(["amount", "percent", "target"] as RepaymentExtraMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    aria-pressed={extraMode === mode}
                    onClick={() => {
                      setExtraMode(mode);
                      /*
                       * Zero is the right empty state for an extra, and the
                       * wrong one for a target: a target of nothing reads as a
                       * broken field and produces no extra. Land on the next
                       * round hundred instead, which is the move this mode
                       * exists for.
                       */
                      setExtraValue(
                        mode === "target" ? Math.ceil((result.basePayment + 0.01) / 100) * 100 : 0,
                      );
                    }}
                    className={`rounded-md px-3 py-1 text-xs font-bold transition-colors ${
                      extraMode === mode
                        ? "bg-valar-navy text-white"
                        : "text-valar-steel hover:text-valar-navy"
                    }`}
                  >
                    {mode === "amount" ? "$" : mode === "percent" ? "%" : "Total"}
                  </button>
                ))}
              </div>
            </div>
            <NumberField
              cmp="RepaymentCalculator.Field"
              label={
                extraMode === "amount"
                  ? "Per repayment"
                  : extraMode === "percent"
                    ? "Of the loan, per year"
                    : "Payment you want to make"
              }
              value={extraValue}
              min={0}
              max={extraMax}
              step={extraMode === "percent" ? 0.25 : 10}
              unit={extraMode === "percent" ? "%" : "$"}
              decimals={extraMode === "percent" ? 2 : 0}
              hint={
                extraMode === "amount"
                  ? `Paying a little more, every time — this is where the number moves. On a fixed rate most lenders let you pay up to about ${EXTRA_CAP_PERCENT}% of the loan a year, which is ${nzd(result.allowancePerPeriod)} per payment here.`
                  : extraMode === "percent"
                    ? `A share of the loan each year, spread across your payments — ${nzd(result.extraPerPeriod, 2)} per payment here. On a fixed rate most lenders allow up to about ${EXTRA_CAP_PERCENT}%.`
                    : `Your scheduled payment is ${nzd(result.basePayment)}. Pay a round ${nzd(extraValue)} instead and ${nzd(result.extraPerPeriod)} of every payment comes straight off the loan — a number you can hold in your head, which is most of why it gets paid.`
              }
              onChange={setExtraValue}
            />
            {extraMode === "target" && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-valar-steel">Round up to</span>
                {targets.map((target) => (
                  <button
                    key={target}
                    type="button"
                    aria-pressed={Math.round(extraValue) === target}
                    onClick={() => setExtraValue(target)}
                    className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
                      Math.round(extraValue) === target
                        ? "border-valar-navy bg-valar-navy text-white"
                        : "border-valar-concrete bg-white text-valar-navy hover:border-valar-navy"
                    }`}
                  >
                    {nzd(target)}
                  </button>
                ))}
              </div>
            )}
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

      {/* Row 1, right — the answer. */}
      <div
        data-cmp="RepaymentCalculator.Results"
        className="flex flex-col rounded-2xl bg-valar-navy p-6 text-white md:p-8"
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
          {/* What it costs across a year — the figure people actually budget
              against, and the one the per-payment number hides. */}
          <div className="flex justify-between gap-4">
            <span className="text-valar-lilac">Paid per year</span>
            <span className="font-semibold tabular-nums">
              {nzd(result.totalPayment * result.perYear)}
            </span>
          </div>
          {usingExtra && (
            <div className="flex justify-between gap-4 text-xs text-valar-lilac">
              <span>{nzd(result.basePayment * result.perYear)} required</span>
              <span className="tabular-nums text-valar-amber">
                + {nzd(result.extraPerPeriod * result.perYear)} extra
              </span>
            </div>
          )}
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
              Paying {extraMode === "percent" ? `${extraValue}%` : nzd(result.extraPerPeriod)} extra
            </p>
            <p className="text-sm leading-relaxed">
              Clears the loan <b>{describeDuration(result.periodsSaved, result.perYear)}</b> early
              and saves <b>{nzd(result.interestSaved)}</b> in interest.
            </p>
          </div>
        )}

        <p className="mt-auto pt-6 text-xs leading-relaxed text-valar-lilac">
          Indicative only. Assumes the rate stays fixed for the full term, which it will not — it is
          a comparison tool, not a quote.
        </p>
      </div>

      {/* Row 2, left — the chart. Sharing the grid's row line with the form
          beside it is the whole point: nesting each column in its own flex
          stack let the results panel grow and push the form out of line. */}
      <div className="rounded-2xl bg-valar-navy p-6">
        <BalanceChart
          series={result.series}
          showExtra={usingExtra}
          payoffAtYears={payoffAtYears}
          payoffLabel={payoffLabel}
          earlyLabel={earlyLabel}
        />
      </div>

      {/* Row 2, right — the ask, level with the chart. */}
      {guideTitle && (
        <SendCalculationForm
          guideKey={guideKey}
          guideTitle={guideTitle}
          source={source}
          guideReady={Boolean(guideReady)}
          cover={cover}
          figures={{ amount, rate, years, frequency, extraMode, extraValue }}
        />
      )}
    </div>
  );
}
