/*
 * The arithmetic behind the plain mortgage repayments calculator.
 *
 * The primitives — periodicPayment, amortise, the frequencies — are imported
 * from ./split-loan rather than redefined here, so the two calculators can
 * never quote two different repayments for the same loan. That file is where
 * they happen to live; it is not a dependency on splits.
 */

import {
  EXTRA_CAP_PERCENT,
  FREQUENCIES,
  amortise,
  periodicPayment,
  type FrequencyKey,
} from "./split-loan.ts";

export type ExtraMode = "amount" | "percent";

export type RepaymentInput = {
  amount: number;
  /** Nominal annual rate, as a percentage. */
  rate: number;
  years: number;
  frequency: FrequencyKey;
  extraMode: ExtraMode;
  /** Dollars per payment when mode is "amount"; percent of the loan per year when "percent". */
  extraValue: number;
};

/** One point on the balance-over-time chart. */
export type BalancePoint = {
  /** Whole years from the start of the loan. */
  year: number;
  /** Balance owing with no extra repayment. */
  base: number;
  /** Balance owing with the extra repayment applied. */
  withExtra: number;
};

/**
 * Balance owing at the end of each year, under both plans.
 *
 * Sampled yearly rather than per period: a 30-year weekly loan is 1,560 points,
 * which is more line detail than a chart this size can show and more DOM than it
 * needs. The payoff year is carried separately so the chart can label the exact
 * crossing rather than infer it from the samples.
 */
export function balanceSeries(
  principal: number,
  ratePerPeriod: number,
  basePayment: number,
  extraPerPeriod: number,
  totalPeriods: number,
  perYear: number,
): BalancePoint[] {
  const points: BalancePoint[] = [];
  let base = principal;
  let withExtra = principal;

  const step = (balance: number, payment: number) => {
    if (balance <= 0) return 0;
    const charge = balance * ratePerPeriod;
    const off = payment - charge;
    // A payment that does not cover the interest leaves the balance where it is
    // rather than growing it — this chart is not the place to model a loan going
    // backwards, and the calculator warns about it elsewhere.
    if (off <= 0) return balance;
    return Math.max(0, balance - off);
  };

  for (let period = 0; period <= totalPeriods; period += 1) {
    if (period % perYear === 0) {
      points.push({
        year: period / perYear,
        base: Math.round(base),
        withExtra: Math.round(withExtra),
      });
    }
    base = step(base, basePayment);
    withExtra = step(withExtra, basePayment + extraPerPeriod);
  }

  return points;
}

export type RepaymentResult = {
  perYear: number;
  frequencyLabel: string;
  /** The scheduled repayment, before anything extra. */
  basePayment: number;
  /** The extra actually applied each period. */
  extraPerPeriod: number;
  /** basePayment + extraPerPeriod. */
  totalPayment: number;
  /** Interest over the life of the loan, on the plan currently on screen. */
  totalInterest: number;
  totalPaid: number;
  interestShare: number;
  periodsSaved: number;
  interestSaved: number;
  /** Periods the loan actually takes on the plan on screen. */
  periods: number;
  /** The scheduled number of periods, with no extra. */
  scheduledPeriods: number;
  /** The usual fixed-rate early-repayment allowance, per payment. */
  allowancePerPeriod: number;
  /** True when the extra entered is above that allowance. */
  overAllowance: boolean;
  series: BalancePoint[];
};

export function calculateRepayments(input: RepaymentInput): RepaymentResult {
  const freq = FREQUENCIES.find((f) => f.key === input.frequency) ?? FREQUENCIES[2];
  const perYear = freq.perYear;
  const ratePerPeriod = input.rate / 100 / perYear;
  const periods = Math.max(1, Math.round(input.years * perYear));

  const basePayment = periodicPayment(input.amount, ratePerPeriod, periods);

  const extraAnnual =
    input.extraMode === "amount"
      ? Math.max(0, input.extraValue) * perYear
      : (Math.max(0, input.extraValue) / 100) * input.amount;
  const extraPerPeriod = extraAnnual / perYear;

  const base = amortise(input.amount, ratePerPeriod, basePayment, periods);
  const applied =
    extraPerPeriod > 0
      ? amortise(input.amount, ratePerPeriod, basePayment + extraPerPeriod, periods)
      : base;

  const allowanceAnnual = (EXTRA_CAP_PERCENT / 100) * input.amount;

  return {
    perYear,
    frequencyLabel: freq.label.toLowerCase(),
    basePayment,
    extraPerPeriod,
    totalPayment: basePayment + extraPerPeriod,
    totalInterest: applied.interest,
    totalPaid: input.amount + applied.interest,
    interestShare: applied.interest / (input.amount + applied.interest),
    periodsSaved: Math.max(0, base.periods - applied.periods),
    interestSaved: Math.max(0, base.interest - applied.interest),
    periods: applied.periods,
    scheduledPeriods: base.periods,
    allowancePerPeriod: allowanceAnnual / perYear,
    overAllowance: extraAnnual > allowanceAnnual + 0.01,
    series: balanceSeries(
      input.amount,
      ratePerPeriod,
      basePayment,
      extraPerPeriod,
      periods,
      perYear,
    ),
  };
}
