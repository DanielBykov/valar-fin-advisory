/**
 * Checks the split home loan maths in src/lib/split-loan.ts.
 *
 * There is no original file to compare against here, so every expected value
 * below is worked out independently of the code it is testing — from the
 * closed-form annuity formula, or from a property that must hold whatever the
 * implementation does (splitting one loan into identical parts must cost
 * exactly what the single loan costs, and so on).
 *
 * Run:  node scripts/check-split-loan.mjs   —   or  npm run check:split-loan
 */

import {
  EXTRA_CAP_PERCENT,
  calculatePart,
  calculateSplit,
  periodicPayment,
  resolveExtra,
} from "../src/lib/split-loan.ts";

let failures = 0;
let checks = 0;

function near(label, actual, expected, tolerance = 0.01) {
  checks += 1;
  if (!(Math.abs(actual - expected) <= tolerance)) {
    failures += 1;
    console.error(`✗ ${label}\n   expected: ${expected}\n   actual:   ${actual}`);
  }
}

function is(label, actual, expected) {
  checks += 1;
  if (actual !== expected) {
    failures += 1;
    console.error(`✗ ${label}\n   expected: ${expected}\n   actual:   ${actual}`);
  }
}

function ok(label, condition, detail = "") {
  checks += 1;
  if (!condition) {
    failures += 1;
    console.error(`✗ ${label}${detail ? `\n   ${detail}` : ""}`);
  }
}

const part = (over = {}) => ({
  amount: 300_000,
  rate: 6,
  fixedYears: 3,
  type: "pi",
  extraMode: "amount",
  extraValue: 0,
  ...over,
});

// ── 1 · The scheduled payment matches the annuity formula ───────────────
{
  const P = 500_000;
  const annual = 6.15;
  const perYear = 12;
  const i = annual / 100 / perYear;
  const n = 30 * perYear;
  const expected = (P * i) / (1 - Math.pow(1 + i, -n));

  near("monthly payment matches the annuity formula", periodicPayment(P, i, n), expected);
  near(
    "calculatePart uses the same payment",
    calculatePart(part({ amount: P, rate: annual }), perYear, 30).basePayment,
    expected,
  );
}

// ── 2 · THE ONE THIS CALCULATOR EXISTS TO GET RIGHT ─────────────────────
// The fixed period is a rate lock, not a repayment term. A part fixed for one
// year inside a 30-year loan must repay at the 30-year rate, not be crushed
// into twelve months. Getting this wrong produced a repayment ~8x too large.
{
  const perYear = 26;
  const oneYearFix = calculatePart(part({ amount: 300_000, rate: 5.79, fixedYears: 1 }), perYear, 30);
  const fiveYearFix = calculatePart(part({ amount: 300_000, rate: 5.79, fixedYears: 5 }), perYear, 30);

  near(
    "the fixed period does not change the repayment",
    oneYearFix.basePayment,
    fiveYearFix.basePayment,
  );

  const i = 5.79 / 100 / perYear;
  const n = 30 * perYear;
  near(
    "a 1-year fix still amortises over the loan term",
    oneYearFix.basePayment,
    (300_000 * i) / (1 - Math.pow(1 + i, -n)),
  );

  ok(
    "a 1-year fix on $300k is a sane fortnightly figure",
    oneYearFix.basePayment > 500 && oneYearFix.basePayment < 1200,
    `got ${oneYearFix.basePayment}`,
  );

  // The shorter fix leaves more owing at its re-fix date, because less time passed.
  ok(
    "less is repaid by a 1-year re-fix than a 5-year one",
    oneYearFix.balanceAtRefix > fiveYearFix.balanceAtRefix,
  );
  ok("the balance at re-fix is below the original", oneYearFix.balanceAtRefix < 300_000);
}

// ── 3 · Interest-only ───────────────────────────────────────────────────
{
  const P = 400_000;
  const annual = 7;
  const perYear = 26;
  const i = annual / 100 / perYear;

  const r = calculatePart(part({ amount: P, rate: annual, fixedYears: 5, type: "io" }), perYear, 30);

  near("interest-only payment is the interest charge", r.basePayment, P * i);
  near("interest-only interest over the fix", r.interestDuringFixed, P * i * 5 * perYear);
  near("interest-only still owes the whole principal at re-fix", r.balanceAtRefix, P);
  near("interest-only never clears over the term", r.balanceRemaining, P);
  is("interest-only does not clear", r.clears, false);
}

// ── 4 · A split into identical parts costs the same as the whole ────────
{
  const whole = calculatePart(part({ amount: 600_000, rate: 6.5 }), 12, 25);
  const split = calculateSplit(
    [
      part({ amount: 200_000, rate: 6.5 }),
      part({ amount: 200_000, rate: 6.5 }),
      part({ amount: 200_000, rate: 6.5 }),
    ],
    "monthly",
    25,
  );

  near("identical split — same total payment", split.totalPayment, whole.basePayment, 0.02);
  near(
    "identical split — same interest before re-fix",
    split.totalInterestToFirstRefix,
    whole.interestToFirstRefix,
    1,
  );
  near("identical split — weighted rate is the rate", split.weightedAverageRate, 6.5);
}

// ── 5 · Weighted average rate and the first re-fix ──────────────────────
// (300k×5% + 200k×6% + 100k×7%) / 600k
{
  const split = calculateSplit(
    [
      part({ amount: 300_000, rate: 5, fixedYears: 2 }),
      part({ amount: 200_000, rate: 6, fixedYears: 3 }),
      part({ amount: 100_000, rate: 7, fixedYears: 5 }),
    ],
    "monthly",
    30,
  );

  near("weighted average rate", split.weightedAverageRate, ((15_000 + 12_000 + 7_000) / 600_000) * 100);
  near("total principal", split.totalPrincipal, 600_000);
  near("first re-fix is the shortest fix", split.nextRefixYears, 2);
  ok(
    "the re-fix amount is the 2-year part's balance, not the whole loan",
    split.nextRefixAmount > 250_000 && split.nextRefixAmount < 300_000,
    `got ${split.nextRefixAmount}`,
  );
}

// ── 5b · The summary figure uses ONE horizon, not each part's own ───────
// Three parts fixed for 1, 3 and 5 years. The headline interest figure must
// cover the first year for all three — not 1yr + 3yr + 5yr added together,
// which is what the first version of this page did.
{
  const parts = [
    part({ amount: 300_000, rate: 5.79, fixedYears: 1 }),
    part({ amount: 200_000, rate: 5.99, fixedYears: 3 }),
    part({ amount: 100_000, rate: 6.45, fixedYears: 5 }),
  ];
  const split = calculateSplit(parts, "fortnightly", 30);

  near("the shared horizon is the earliest fix", split.nextRefixYears, 1);

  // One year of interest on $600k at roughly 5.97% is about $35k. The old
  // apples-and-oranges sum came to more than twice that.
  ok(
    "headline interest covers one year, not three horizons",
    split.totalInterestToFirstRefix > 30_000 && split.totalInterestToFirstRefix < 40_000,
    `got ${split.totalInterestToFirstRefix}`,
  );

  // Each part's own fixed-period figure still stands on its own.
  ok(
    "a part's own fixed-period interest is longer than the shared one",
    split.parts[2].interestDuringFixed > split.parts[2].interestToFirstRefix,
  );
}

// ── 6 · The 5% cap ──────────────────────────────────────────────────────
{
  const perYear = 12;
  const amount = 200_000;
  const capAnnual = (EXTRA_CAP_PERCENT / 100) * amount; // $10,000/yr

  const over = resolveExtra(part({ amount, extraMode: "amount", extraValue: 2_000 }), perYear);
  near("cap trims an over-large amount", over.extraPerPeriod * perYear, capAnnual);
  is("cap reports itself", over.extraCapped, true);

  const under = resolveExtra(part({ amount, extraMode: "amount", extraValue: 500 }), perYear);
  near("under the cap passes through", under.extraPerPeriod, 500);
  is("under the cap is not flagged", under.extraCapped, false);

  const exact = resolveExtra(part({ amount, extraMode: "percent", extraValue: 5 }), perYear);
  near("5 percent equals the cap", exact.extraPerPeriod * perYear, capAnnual);
  is("exactly at the cap is not flagged", exact.extraCapped, false);

  const tooMuch = resolveExtra(part({ amount, extraMode: "percent", extraValue: 10 }), perYear);
  near("10 percent trims to the cap", tooMuch.extraPerPeriod * perYear, capAnnual);
  is("10 percent is flagged", tooMuch.extraCapped, true);
}

// ── 7 · Percent and amount modes agree on the same money ────────────────
{
  const perYear = 26;
  const amount = 400_000;
  const byPercent = resolveExtra(part({ amount, extraMode: "percent", extraValue: 3 }), perYear);
  const byAmount = resolveExtra(
    part({ amount, extraMode: "amount", extraValue: 12_000 / perYear }),
    perYear,
  );
  near("percent and amount agree", byPercent.extraPerPeriod, byAmount.extraPerPeriod);
}

// ── 8 · Extra repayments shorten the term and cut interest ──────────────
{
  const perYear = 12;
  const base = calculatePart(part({ amount: 500_000, rate: 6.5 }), perYear, 30);
  const withExtra = calculatePart(
    part({ amount: 500_000, rate: 6.5, extraMode: "amount", extraValue: 400 }),
    perYear,
    30,
  );

  ok(
    "extra repayment shortens the term",
    withExtra.periods < base.periods,
    `${withExtra.periods} vs ${base.periods}`,
  );
  ok("extra repayment reduces interest", withExtra.interestIfRateHeld < base.interestIfRateHeld);
  near(
    "interest saved is the difference",
    withExtra.interestSaved,
    base.interestIfRateHeld - withExtra.interestIfRateHeld,
  );
  near("periods saved is the difference", withExtra.periodsSaved, base.periods - withExtra.periods);
  is("still clears with extra", withExtra.clears, true);
  ok("extra leaves less owing at the re-fix", withExtra.balanceAtRefix < base.balanceAtRefix);
}

// ── 8b · A loan that runs its full term reports as paid off ─────────────
// Floating point left a residue of ~1e-9 on the final payment, which made an
// ordinary 30-year loan report "never clears".
{
  for (const rate of [5.79, 5.99, 6.45, 7.25]) {
    for (const freq of ["weekly", "fortnightly", "monthly"]) {
      const split = calculateSplit([part({ amount: 300_000, rate })], freq, 30);
      ok(
        `a plain 30-year loan at ${rate}% (${freq}) is paid off`,
        split.parts[0].clears,
        `balance left: ${split.parts[0].balanceRemaining}`,
      );
    }
  }
}

// ── 9 · The final payment never overshoots ──────────────────────────────
{
  const r = calculatePart(
    part({ amount: 100_000, rate: 6, extraMode: "percent", extraValue: 5 }),
    12,
    30,
  );
  ok("balance never goes negative", r.balanceRemaining >= 0, `got ${r.balanceRemaining}`);
  ok("interest never goes negative", r.interestIfRateHeld >= 0, `got ${r.interestIfRateHeld}`);
  ok("interest during the fix never goes negative", r.interestDuringFixed >= 0);
}

// ── 10 · Zero parts are ignored, not counted ────────────────────────────
{
  const split = calculateSplit(
    [
      part({ amount: 400_000, rate: 6, fixedYears: 3 }),
      part({ amount: 0, rate: 0, fixedYears: 30 }),
      part({ amount: 0, rate: 0, fixedYears: 30 }),
    ],
    "weekly",
    30,
  );
  near("zero parts do not change the principal", split.totalPrincipal, 400_000);
  near("zero parts do not drag the weighted rate", split.weightedAverageRate, 6);
  near("zero parts do not become the first re-fix", split.nextRefixYears, 3);
}

// ── 11 · Frequency changes the payment but not the shape ────────────────
{
  const monthly = calculateSplit([part({ amount: 500_000, rate: 6 })], "monthly", 25);
  const weekly = calculateSplit([part({ amount: 500_000, rate: 6 })], "weekly", 25);

  near(
    "annual cost is close across frequencies",
    weekly.totalPayment * 52,
    monthly.totalPayment * 12,
    monthly.totalPayment * 12 * 0.02,
  );
}

// ── 12 · An extra on an interest-only part does reduce the balance ──────
{
  const r = calculatePart(
    part({ amount: 300_000, rate: 6, fixedYears: 5, type: "io", extraMode: "percent", extraValue: 5 }),
    12,
    30,
  );
  ok(
    "extra on interest-only reduces the balance at re-fix",
    r.balanceAtRefix < 300_000,
    `got ${r.balanceAtRefix}`,
  );
  ok("extra on interest-only cuts interest", r.interestSaved > 0);
}

// ── 13 · A fixed period longer than the loan is clamped ─────────────────
{
  const r = calculatePart(part({ amount: 200_000, rate: 6, fixedYears: 40 }), 12, 30);
  ok("a 40-year fix inside a 30-year loan clears at the end", r.balanceAtRefix < 1);
  ok("and does not report nonsense interest", Number.isFinite(r.interestDuringFixed));
}

if (failures === 0) {
  console.log(`✓ ${checks} checks — split loan maths holds.`);
} else {
  console.error(`\n✗ ${failures} of ${checks} checks failed.`);
  process.exit(1);
}
