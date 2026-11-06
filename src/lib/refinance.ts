/*
 * The maths and the wording of the refinance page.
 *
 * The wording lives beside the maths because the page and the email have to say
 * the same thing about the same result, and because which sentence appears is
 * itself a calculation: a person on a low rate with a long fix left is told to
 * hold it, however much the page exists to promote refinancing.
 *
 * What this deliberately does NOT do, after the teardown of the competing lead
 * sites (calculators/refinance-review/00_clientconnection-teardown.md):
 *
 *   - It never holds the old rate for the rest of the loan. Their "$180,000
 *     saved, six years sooner" comes from comparing a refinance with a fixed rate
 *     that lasts 25 years. In New Zealand the fix ends and the bank resets the
 *     rate and the repayment, so staying is modelled that way here.
 *   - It never holds the sample rate for the rest of the loan either. It applies
 *     for the fixed period, then both loans carry the same rate.
 *   - It never lets paying more pass as a saving. Both lines pay the same dollars
 *     in the finish-date comparison.
 */

import type { FrequencyKey } from "./split-loan";

/** Off until /page-launch has passed. Local development always renders the page. */
export const REFINANCE_LIVE = false;

/*
 * PLACEHOLDERS, both of them. Lena replaces these with her own rate sheet and the
 * confirmed lender terms before the page goes live.
 */
export const SAMPLE_RATE = 5.0;
export const CONTRIBUTION_SHARE = 0.01;

/** How long the sample rate is assumed to last. */
export const FIX_MONTHS = 24;

/** Further out than this, on a rate below the sample, the page says to hold. */
export const HOLD_BEYOND_MONTHS = 12;

/** A loan that would take longer than this is not one the page can say anything useful about. */
const MAX_MONTHS = 600;

const AVERAGE_DAYS_IN_MONTH = 30.44;
const DAY_MS = 86_400_000;

export const PER_YEAR: Record<FrequencyKey, number> = {
  weekly: 52,
  fortnightly: 26,
  monthly: 12,
};

export const PER_PERIOD_LABEL: Record<FrequencyKey, string> = {
  weekly: "a week",
  fortnightly: "a fortnight",
  monthly: "a month",
};

/** The rate scenarios offered, in percentage points above the sample rate. */
export const RISE_OPTIONS = [
  { value: 0, label: "Same as today" },
  { value: 0.5, label: "0.50% higher" },
  { value: 1, label: "1.00% higher" },
] as const;

export type RefinanceInputs = {
  balance: number;
  /** Annual percentage, e.g. 4.79. */
  rate: number;
  /** Per payment, at `frequency`. */
  repayment: number;
  frequency: FrequencyKey;
  /** ISO date the fixed rate ends. Empty means floating. */
  fixedEnd: string;
  /** Percentage points above the sample rate when the current fix ends. */
  rise: number;
};

export type RefinanceState = "low" | "gain" | "date" | "hold";

export type RefinanceResult =
  | { state: "low" }
  | {
      state: Exclude<RefinanceState, "low">;
      monthsLeft: number;
      rollRate: number;
      /** Per payment at the chosen frequency, so the page can show them untouched. */
      repayment: number;
      newRepayment: number;
      stayRepayment: number;
      /** Months to finish. */
      stayMonths: number;
      refinanceMonths: number | null;
      monthsSooner: number;
    };

function monthlyPayment(balance: number, annualRate: number, months: number): number {
  const i = annualRate / 1200;
  return i === 0 ? balance / months : (balance * i) / (1 - Math.pow(1 + i, -months));
}

/** Whole months from one ISO date to another, never below zero. */
export function monthsBetween(fromIso: string, toIso: string): number {
  const from = Date.parse(`${fromIso}T00:00:00Z`);
  const to = Date.parse(`${toIso}T00:00:00Z`);
  if (!Number.isFinite(from) || !Number.isFinite(to)) return 0;
  return Math.max(0, Math.round((to - from) / DAY_MS / AVERAGE_DAYS_IN_MONTH));
}

/** The ISO date a number of days before another, for the reminder Lena sets. */
export function daysBefore(iso: string, days: number): string {
  const at = Date.parse(`${iso}T00:00:00Z`);
  return Number.isFinite(at) ? new Date(at - days * DAY_MS).toISOString().slice(0, 10) : "";
}

export function calculateRefinance(input: RefinanceInputs, todayIso: string): RefinanceResult {
  const { balance, rate, frequency, rise } = input;
  const toMonthly = PER_YEAR[frequency] / 12;
  const monthly = input.repayment * toMonthly;

  // An interest-only loan, or a typo. The term below would be undefined.
  const monthlyInterest = (balance * rate) / 1200;
  if (!(balance > 0) || !(rate > 0) || monthly <= monthlyInterest) return { state: "low" };

  const term = Math.ceil(
    Math.log(monthly / (monthly - monthlyInterest)) / Math.log(1 + rate / 1200),
  );
  if (term > MAX_MONTHS) return { state: "low" };

  const monthsLeft = input.fixedEnd ? monthsBetween(todayIso, input.fixedEnd) : 0;
  const rollRate = SAMPLE_RATE + rise;

  // The contribution is modelled as paid onto the loan, which is the visitor's
  // choice in real life. The assumptions line says so.
  const refinancedBalance = balance * (1 - CONTRIBUTION_SHARE);
  const newMonthly = monthlyPayment(refinancedBalance, SAMPLE_RATE, term);

  let stayBalance = balance;
  for (let m = 0; m < monthsLeft && stayBalance > 0; m++) {
    stayBalance = stayBalance * (1 + rate / 1200) - monthly;
  }
  const stayMonthly =
    term > monthsLeft && stayBalance > 0
      ? monthlyPayment(stayBalance, rollRate, term - monthsLeft)
      : 0;

  /*
   * Staying finishes on the original term, because the bank resets the repayment
   * at rollover. Holding the old repayment instead showed a 25-year loan
   * stretching to 29 years, which is not what happens and which nobody could read.
   */
  let b = refinancedBalance;
  let refinanceMonths: number | null = 0;
  while (b > 0) {
    refinanceMonths += 1;
    if (refinanceMonths > MAX_MONTHS) {
      refinanceMonths = null;
      break;
    }
    const annual = refinanceMonths <= FIX_MONTHS ? SAMPLE_RATE : rollRate;
    const paid = refinanceMonths <= monthsLeft ? monthly : stayMonthly;
    b = b * (1 + annual / 1200) - paid;
  }

  const state = rate > SAMPLE_RATE ? "gain" : monthsLeft <= HOLD_BEYOND_MONTHS ? "date" : "hold";

  return {
    state,
    monthsLeft,
    rollRate,
    repayment: input.repayment,
    newRepayment: newMonthly / toMonthly,
    stayRepayment: stayMonthly / toMonthly,
    stayMonths: term,
    refinanceMonths,
    monthsSooner: refinanceMonths === null ? 0 : Math.max(0, term - refinanceMonths),
  };
}

const money = (n: number) => `$${Math.round(n).toLocaleString("en-NZ")}`;

export function formatDuration(months: number): string {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const y = years ? `${years} year${years === 1 ? "" : "s"}` : "";
  const m = rest || !years ? `${rest} month${rest === 1 ? "" : "s"}` : "";
  return [y, m].filter(Boolean).join(" ");
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export type RefinanceWords = {
  label: string;
  /** The large figure. */
  headline: string;
  /** Sits beside the headline when it is a figure. */
  headlineUnit?: string;
  headlineIsFigure: boolean;
  sub: string;
  pills: string[];
  note?: string;
  rollLabel?: string;
  showComparison: boolean;
};

/** What the result says, shared by the page and the email. */
export function describeRefinance(result: RefinanceResult, input: RefinanceInputs): RefinanceWords {
  if (result.state === "low") {
    return {
      label: "Check your repayment",
      headline: "This repayment does not cover the interest",
      headlineIsFigure: false,
      sub: "An interest-only loan needs a conversation rather than this calculator.",
      pills: [],
      showComparison: false,
    };
  }

  const unit = PER_PERIOD_LABEL[input.frequency];
  const hasDate = result.monthsLeft > 0 && Boolean(input.fixedEnd);
  const date = hasDate ? formatDate(input.fixedEnd) : "";

  if (result.state === "hold") {
    return {
      label: "Your rate is working for you",
      headline: `Hold it until ${date}`,
      headlineIsFigure: false,
      sub: `You pay ${input.rate.toFixed(2)}% and the sample rate is ${SAMPLE_RATE.toFixed(2)}%. On rate alone, moving now would cost you more. A lender contribution could change that.`,
      pills: ["Look again about 90 days before your date"],
      showComparison: false,
    };
  }

  const sooner =
    result.monthsSooner >= 1
      ? `${formatDuration(result.monthsSooner)} sooner if you pay what staying would cost`
      : null;

  const common = {
    label: "With refinancing, your repayment could be",
    headline: money(result.newRepayment),
    headlineUnit: unit,
    headlineIsFigure: true,
    rollLabel: hasDate ? `If rates on ${date} are` : "If rates are",
    showComparison: result.refinanceMonths !== null,
  };

  if (result.state === "gain") {
    const less = input.repayment - result.newRepayment;
    return {
      ...common,
      sub: `You pay ${money(input.repayment)} ${unit} today.`,
      pills: [`${money(less)} less ${unit}`, ...(sooner ? [sooner] : [])],
      note: hasDate
        ? `Your own rate also changes on ${date}, and leaving before then can bring a break cost. On that date you could reach about ${money(result.stayRepayment)} ${unit} without moving.`
        : undefined,
    };
  }

  const afterDate = result.stayRepayment - result.newRepayment;
  const moreForNow = result.newRepayment - input.repayment;
  return {
    ...common,
    sub: `If you stay and your rate moves to ${result.rollRate.toFixed(2)}%${hasDate ? ` on ${date}` : ""}, your repayment would be about ${money(result.stayRepayment)} ${unit}.`,
    pills: [
      ...(afterDate >= 1
        ? [`${money(afterDate)} less ${unit}${hasDate ? " after your date" : ""}`]
        : []),
      ...(sooner ? [sooner] : []),
    ],
    note:
      hasDate && moreForNow >= 1
        ? `Until ${date} you would pay about ${money(moreForNow)} ${unit} more than today.`
        : undefined,
  };
}

/** The small print that makes the headline figure honest. Page and email use the same words. */
export function assumptionsLine(): string {
  return `Assumes a sample rate of ${SAMPLE_RATE.toFixed(2)}% for ${FIX_MONTHS / 12} years, and a lender contribution of ${Math.round(CONTRIBUTION_SHARE * 100)}% of the loan paid onto the mortgage, repayable if you leave within the clawback period. Break costs and legal fees are not included. The rate scenario is an example, not a forecast.`;
}
