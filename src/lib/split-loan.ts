/*
 * The arithmetic behind the split home loan calculator.
 *
 * Kept apart from the component so scripts/check-split-loan.mjs can run it
 * without React in the way. Unlike the affordability calculator there is no
 * original file to check against, so the tests there are built from closed-form
 * amortisation results worked out independently.
 *
 * Conventions match src/components/insights/repayment-calculator.tsx so the two
 * calculators never disagree on the same loan: the periodic rate is the nominal
 * annual rate divided by the number of periods in a year, and the term is a
 * whole number of periods.
 */

export const FREQUENCIES = [
  { key: "weekly", label: "Weekly", perYear: 52 },
  { key: "fortnightly", label: "Fortnightly", perYear: 26 },
  { key: "monthly", label: "Monthly", perYear: 12 },
] as const;

export type FrequencyKey = (typeof FREQUENCIES)[number]["key"];

/** Interest-only parts never reduce the principal on their own. */
export type PartType = "pi" | "io";

/** An extra repayment is either dollars per payment, or a share of the part. */
export type ExtraMode = "amount" | "percent";

/**
 * How much extra a lender will accept on a fixed part before break costs apply,
 * as a percentage of that part's original balance per year.
 *
 * 5% is Lena's figure and it is a working assumption, not a rule: the real
 * allowance is set by each lender and each fixed contract. The calculator caps
 * at it and says so rather than quietly modelling an overpayment that would
 * cost the borrower a break fee.
 */
export const EXTRA_CAP_PERCENT = 5;

export type LoanPart = {
  amount: number;
  /** Nominal annual rate, as a percentage. */
  rate: number;
  /**
   * How long this part's RATE is locked for — not how long the loan runs.
   *
   * This is the distinction the whole calculator turns on. A part fixed for one
   * year is not repaid in one year: it amortises over the loan term like every
   * other part, and after a year it comes off its rate and has to be re-fixed
   * at whatever the market is then. Treating the fixed period as the repayment
   * term produces a repayment several times too large.
   */
  fixedYears: number;
  type: PartType;
  extraMode: ExtraMode;
  /** Dollars per payment when mode is "amount"; percent of the part per year when "percent". */
  extraValue: number;
};

/**
 * A balance below half a cent is paid off. Without this, a loan that amortises
 * to 1e-9 on its final scheduled payment reports as "never clears" — which is
 * floating point, not finance.
 */
const SETTLED = 0.005;

/** Level repayment for an amortising loan. */
export function periodicPayment(principal: number, ratePerPeriod: number, periods: number) {
  if (periods <= 0) return 0;
  if (principal <= 0) return 0;
  if (ratePerPeriod <= 0) return principal / periods;
  return (principal * ratePerPeriod) / (1 - Math.pow(1 + ratePerPeriod, -periods));
}

/**
 * Amortise until the balance clears or the term runs out.
 *
 * Returns the periods actually used, the interest charged, and whatever is
 * still owed at the end — which is the whole point for an interest-only part.
 */
export function amortise(
  principal: number,
  ratePerPeriod: number,
  payment: number,
  maxPeriods: number,
) {
  let balance = principal;
  let interest = 0;
  let periods = 0;

  while (balance > SETTLED && periods < maxPeriods) {
    const charge = balance * ratePerPeriod;
    let principalPart = payment - charge;

    // The payment does not cover the interest, so the balance never falls.
    // Charge the interest for the remaining term and report what is still owed.
    if (principalPart <= 0) {
      const remaining = maxPeriods - periods;
      return {
        periods: maxPeriods,
        interest: interest + charge * remaining,
        balanceRemaining: balance,
        clears: false,
      };
    }

    // Final payment: never overpay past the balance.
    if (principalPart > balance) principalPart = balance;

    interest += charge;
    balance -= principalPart;
    periods += 1;
  }

  return {
    periods,
    interest,
    balanceRemaining: balance <= SETTLED ? 0 : balance,
    clears: balance <= SETTLED,
  };
}

/**
 * "19 years 6 months" — spelled out, not "19 yr 6 mo".
 *
 * The abbreviated form read as a typo at a glance: two-letter units next to
 * two-digit numbers give "19 yr 6 mo", which scans as four numbers rather than
 * a duration. Singulars are handled, so a plan can clear in "1 year 1 month".
 */
export function describeDuration(periods: number, perYear: number) {
  if (!Number.isFinite(periods) || periods <= 0) return "—";

  let years = Math.floor(periods / perYear);
  let months = Math.round(((periods % perYear) / perYear) * 12);

  // Rounding can push the remainder to a full year — carry it rather than
  // printing "19 years 12 months".
  if (months >= 12) {
    years += 1;
    months = 0;
  }

  const y = `${years} year${years === 1 ? "" : "s"}`;
  const m = `${months} month${months === 1 ? "" : "s"}`;

  if (years <= 0) return m;
  if (months <= 0) return y;
  return `${y} ${m}`;
}


export type PartResult = {
  /** The scheduled repayment, before anything extra. */
  basePayment: number;
  /** The extra actually applied each period, after the cap. */
  extraPerPeriod: number;
  /** basePayment + extraPerPeriod. */
  totalPayment: number;
  /** True when the requested extra was trimmed to the cap. */
  extraCapped: boolean;
  /** The most this part accepts per period under the cap. */
  extraCapPerPeriod: number;
  /**
   * Interest charged while THIS part's rate is locked. Genuinely known — but
   * only comparable within the part, since every part's fix ends on its own
   * date. Never sum this across parts.
   */
  interestDuringFixed: number;
  /**
   * Interest charged by this part up to the first re-fix in the whole split.
   * One shared horizon, so this one IS safe to sum across parts.
   */
  interestToFirstRefix: number;
  /**
   * What is still owed on the day the fixed period ends — the amount that has
   * to be re-fixed at whatever the market is then. For a split, this is the
   * number that actually matters.
   */
  balanceAtRefix: number;
  /**
   * Interest over the whole loan term IF this rate held the entire way, which
   * it will not. Shown to compare structures, never as a forecast.
   */
  interestIfRateHeld: number;
  interestSaved: number;
  /** Periods taken to clear, if the rate held. */
  periods: number;
  periodsSaved: number;
  /** Still owed at the end of the loan term — non-zero for interest-only. */
  balanceRemaining: number;
  clears: boolean;
};

/**
 * Normalise an extra repayment to dollars per period, applying the cap.
 *
 * "amount" is already per period. "percent" is a share of the part's original
 * balance per year, so it is spread across the periods in a year.
 */
export function resolveExtra(part: LoanPart, perYear: number) {
  const requestedAnnual =
    part.extraMode === "amount"
      ? Math.max(0, part.extraValue) * perYear
      : (Math.max(0, part.extraValue) / 100) * part.amount;

  const capAnnual = (EXTRA_CAP_PERCENT / 100) * part.amount;
  const allowedAnnual = Math.min(requestedAnnual, capAnnual);

  return {
    extraPerPeriod: allowedAnnual / perYear,
    extraCapPerPeriod: capAnnual / perYear,
    // A hair of tolerance so floating point never reports a phantom cap.
    extraCapped: requestedAnnual > capAnnual + 0.01,
  };
}

/**
 * @param loanYears the term of the whole loan, shared by every part. A part's
 *        own `fixedYears` sets only when its rate expires — never how fast it
 *        amortises.
 */
export function calculatePart(
  part: LoanPart,
  perYear: number,
  loanYears: number,
  firstRefixYears: number = part.fixedYears,
): PartResult {
  const ratePerPeriod = part.rate / 100 / perYear;
  const termPeriods = Math.max(1, Math.round(loanYears * perYear));
  // A fixed period cannot outlast the loan it sits inside.
  const fixedPeriods = Math.max(1, Math.min(termPeriods, Math.round(part.fixedYears * perYear)));

  const basePayment =
    part.type === "io"
      ? part.amount * ratePerPeriod
      : periodicPayment(part.amount, ratePerPeriod, termPeriods);

  const { extraPerPeriod, extraCapPerPeriod, extraCapped } = resolveExtra(part, perYear);
  const payment = basePayment + extraPerPeriod;

  /**
   * An interest-only part with nothing extra never touches the principal, so
   * amortise() would report it as "never clears" — true, but it hides the
   * interest. Compute that case directly instead.
   */
  const runInterestOnly = (periods: number) => ({
    periods,
    interest: part.amount * ratePerPeriod * periods,
    balanceRemaining: part.amount,
    clears: false,
  });

  const isFlatInterestOnly = part.type === "io" && extraPerPeriod <= 0;

  // What is knowable: the fixed period, run at this rate.
  const duringFixed = isFlatInterestOnly
    ? runInterestOnly(fixedPeriods)
    : amortise(part.amount, ratePerPeriod, payment, fixedPeriods);

  // The same, measured to the earliest re-fix anywhere in the split, so the
  // summary can add the parts together over one shared horizon.
  const sharedPeriods = Math.max(
    1,
    Math.min(termPeriods, Math.round(firstRefixYears * perYear)),
  );
  const toFirstRefix = isFlatInterestOnly
    ? runInterestOnly(sharedPeriods)
    : amortise(part.amount, ratePerPeriod, payment, sharedPeriods);

  // The full-term view, assuming the rate holds. For comparison only.
  const runFullTerm = (pmt: number) =>
    part.type === "io" && pmt <= basePayment
      ? runInterestOnly(termPeriods)
      : amortise(part.amount, ratePerPeriod, pmt, termPeriods);

  const withExtra = runFullTerm(payment);
  const withoutExtra = extraPerPeriod > 0 ? runFullTerm(basePayment) : withExtra;

  return {
    basePayment,
    extraPerPeriod,
    totalPayment: payment,
    extraCapped,
    extraCapPerPeriod,
    interestDuringFixed: duringFixed.interest,
    interestToFirstRefix: toFirstRefix.interest,
    balanceAtRefix: duringFixed.balanceRemaining,
    interestIfRateHeld: withExtra.interest,
    interestSaved: Math.max(0, withoutExtra.interest - withExtra.interest),
    periods: withExtra.periods,
    periodsSaved: Math.max(0, withoutExtra.periods - withExtra.periods),
    balanceRemaining: withExtra.balanceRemaining,
    clears: withExtra.clears,
  };
}

export type SplitResult = {
  perYear: number;
  frequencyLabel: string;
  loanYears: number;
  parts: PartResult[];
  totalPrincipal: number;
  totalBasePayment: number;
  totalPayment: number;
  totalExtra: number;
  /**
   * Interest across every part up to the first re-fix in the split. One shared
   * horizon, so the parts genuinely add up.
   */
  totalInterestToFirstRefix: number;
  /** Interest across the full term if every rate held. Comparison only. */
  totalInterestIfRateHeld: number;
  totalInterestSaved: number;
  /** Owed at the end of the loan term — non-zero when a part is interest-only. */
  totalBalanceRemaining: number;
  /**
   * The blended rate across the whole structure, weighted by size. This is the
   * one honest single-number summary of a split.
   */
  weightedAverageRate: number;
  /**
   * The shortest fixed period in the split — when the structure next has to be
   * re-decided. Deliberately shown instead of an "average term", which mixes a
   * 1-year fix and a 5-year fix into a number that means nothing.
   */
  nextRefixYears: number;
  /** How much comes off its rate at that first re-fix. */
  nextRefixAmount: number;
  /** True when at least one part had its extra repayment trimmed to the cap. */
  anyExtraCapped: boolean;
};

export function calculateSplit(
  parts: LoanPart[],
  frequency: FrequencyKey,
  loanYears: number,
): SplitResult {
  const freq = FREQUENCIES.find((f) => f.key === frequency) ?? FREQUENCIES[2];
  const perYear = freq.perYear;

  // The earliest re-fix has to be known before the parts are costed, because it
  // is the shared horizon they are all measured against.
  const fundedParts = parts.filter((p) => p.amount > 0);
  const nextRefixYears =
    fundedParts.length > 0 ? Math.min(...fundedParts.map((p) => p.fixedYears)) : 0;

  const results = parts.map((part) =>
    calculatePart(part, perYear, loanYears, nextRefixYears || part.fixedYears),
  );

  const fundedPairs = parts
    .map((part, i) => ({ part, result: results[i] }))
    .filter(({ part }) => part.amount > 0);

  const funded = fundedPairs.map(({ part }) => part);
  const fundedResults = fundedPairs.map(({ result }) => result);

  const totalPrincipal = funded.reduce((sum, p) => sum + p.amount, 0);

  const nextRefixAmount = fundedPairs
    .filter(({ part }) => part.fixedYears === nextRefixYears)
    .reduce((sum, { result }) => sum + result.balanceAtRefix, 0);

  return {
    perYear,
    frequencyLabel: freq.label.toLowerCase(),
    loanYears,
    parts: results,
    totalPrincipal,
    totalBasePayment: fundedResults.reduce((s, r) => s + r.basePayment, 0),
    totalPayment: fundedResults.reduce((s, r) => s + r.totalPayment, 0),
    totalExtra: fundedResults.reduce((s, r) => s + r.extraPerPeriod, 0),
    totalInterestToFirstRefix: fundedResults.reduce((s, r) => s + r.interestToFirstRefix, 0),
    totalInterestIfRateHeld: fundedResults.reduce((s, r) => s + r.interestIfRateHeld, 0),
    totalInterestSaved: fundedResults.reduce((s, r) => s + r.interestSaved, 0),
    totalBalanceRemaining: fundedResults.reduce((s, r) => s + r.balanceRemaining, 0),
    weightedAverageRate:
      totalPrincipal > 0
        ? funded.reduce((sum, p) => sum + p.amount * p.rate, 0) / totalPrincipal
        : 0,
    nextRefixYears,
    nextRefixAmount,
    anyExtraCapped: fundedResults.some((r) => r.extraCapped),
  };
}
