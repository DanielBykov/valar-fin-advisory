/*
 * The arithmetic behind "How much can I borrow?", asked from the payment end.
 *
 * Replaced the income-based servicing engine on 2026-09-24 (Lena): real users
 * found that one too complicated. This one starts from the repayment the
 * household chooses and works out the loan it carries. The old engine is kept
 * in src/lib/affordability.ts (it still feeds the emailed calculation) and,
 * as it stood, under the git tag `what-can-i-buy-v1`.
 *
 * Three numbers come out:
 *   1. The loan the chosen payment supports at the entered rate.
 *   2. That payment as a share of take-home pay, banded with shareBand().
 *   3. The stress test: the SAME loan at 7%, what the payment becomes and what
 *      share of take-home pay that is. Lena's option (a): the payment rising is
 *      what people feel, not a smaller loan.
 */

import { shareBand as baseBand } from "./affordability";
import { FREQUENCIES, type FrequencyKey } from "./split-loan";

/*
 * The old engine's bands, with the top one renamed (Lena, 2026-09-24):
 * "High risk" read like a formal risk classification, which this is not.
 * It is a payment pressure indicator, so the top band says pressure.
 */
export function shareBand(share: number) {
  const b = baseBand(share);
  return b.label === "High risk" ? { ...b, label: "High pressure" } : b;
}

/** The rate the same loan is re-priced at for the stress test. */
export const STRESS_RATE = 7;

export const DEFAULT_RATE = 4.99;
export const DEFAULT_YEARS = 30;

export type BorrowInput = {
  frequency: FrequencyKey;
  /** Household take-home pay, per period, after tax and KiwiSaver. */
  income: number;
  /** The most they want to put into the mortgage, per period. */
  payment: number;
  /** Nominal annual rate, as a percentage. */
  rate: number;
  years: number;
};

/** One bar on the chart: what a year of payments goes to. */
export type YearSplit = { year: number; principal: number; interest: number };

export const perYearOf = (f: FrequencyKey) =>
  FREQUENCIES.find((x) => x.key === f)?.perYear ?? 12;

/** Present value of a level payment: the loan that payment carries. */
export function loanFromPayment(payment: number, annualRatePct: number, periods: number, perYear: number) {
  if (payment <= 0 || periods <= 0) return 0;
  const r = annualRatePct / 100 / perYear;
  if (r === 0) return payment * periods;
  return (payment * (1 - Math.pow(1 + r, -periods))) / r;
}

/** Level payment on a principal. */
export function paymentOnLoan(loan: number, annualRatePct: number, periods: number, perYear: number) {
  if (loan <= 0 || periods <= 0) return 0;
  const r = annualRatePct / 100 / perYear;
  if (r === 0) return loan / periods;
  return (loan * r) / (1 - Math.pow(1 + r, -periods));
}

export function calculateBorrow(input: BorrowInput) {
  const perYear = perYearOf(input.frequency);
  const periods = Math.round(input.years * perYear);
  const r = input.rate / 100 / perYear;

  const loan = loanFromPayment(input.payment, input.rate, periods, perYear);
  const totalRepaid = input.payment * periods;
  const totalInterest = Math.max(0, totalRepaid - loan);

  // Principal vs interest, a year at a time, for the chart.
  const years: YearSplit[] = [];
  let balance = loan;
  for (let y = 1; y <= input.years; y++) {
    let principal = 0;
    let interest = 0;
    for (let p = 0; p < perYear && balance > 0.005; p++) {
      const i = balance * r;
      const toPrincipal = Math.min(balance, input.payment - i);
      interest += i;
      principal += toPrincipal;
      balance -= toPrincipal;
    }
    years.push({ year: y, principal, interest });
  }

  const now = new Date();
  const debtFree = new Date(now.getFullYear() + input.years, now.getMonth(), 1);

  const hasIncome = input.income > 0;
  const share = hasIncome ? input.payment / input.income : 0;

  const stressPayment = paymentOnLoan(loan, STRESS_RATE, periods, perYear);
  const stressShare = hasIncome ? stressPayment / input.income : 0;

  return {
    perYear,
    periods,
    loan,
    totalRepaid,
    totalInterest,
    debtFree,
    years,
    hasIncome,
    share,
    band: shareBand(share),
    stress: {
      rate: STRESS_RATE,
      payment: stressPayment,
      rise: stressPayment - input.payment,
      share: stressShare,
      band: shareBand(stressShare),
    },
  };
}

export type BorrowResult = ReturnType<typeof calculateBorrow>;
