/**
 * Checks the refinance maths in src/lib/refinance.ts.
 *
 * Expected values are worked out here independently of the code under test: from
 * the closed-form annuity formula, a separate month-by-month run, and properties
 * that must hold whatever the implementation does.
 *
 * Run:  node scripts/check-refinance.mjs   or   pnpm check:refinance
 */

import {
  CONTRIBUTION_SHARE,
  FIX_MONTHS,
  SAMPLE_RATE,
  calculateRefinance,
  daysBefore,
  describeRefinance,
  monthsBetween,
} from "../src/lib/refinance.ts";

let failures = 0;
let checks = 0;

function near(label, actual, expected, tolerance = 0.5) {
  checks += 1;
  if (!(Math.abs(actual - expected) <= tolerance)) {
    failures += 1;
    console.error(`FAIL ${label}\n   expected: ${expected}\n   actual:   ${actual}`);
  }
}

function is(label, actual, expected) {
  checks += 1;
  if (actual !== expected) {
    failures += 1;
    console.error(`FAIL ${label}\n   expected: ${expected}\n   actual:   ${actual}`);
  }
}

const annuity = (B, annual, n) => {
  const i = annual / 1200;
  return (B * i) / (1 - (1 + i) ** -n);
};

const today = "2026-11-03";
const base = {
  balance: 600_000,
  rate: 4.79,
  repayment: annuity(600_000, 4.79, 300),
  frequency: "monthly",
  fixedEnd: "2027-07-03",
  rise: 0.5,
};

// Eight months left, on a rate below the sample: the page's main case.
const main = calculateRefinance(base, today);
is("low rate, 8 months left is the date state", main.state, "date");
is("8 months counted", main.monthsLeft, 8);
is("staying finishes on the original term", main.stayMonths, 300);
near(
  "new repayment is the annuity on the reduced balance",
  main.newRepayment,
  annuity(600_000 * (1 - CONTRIBUTION_SHARE), SAMPLE_RATE, 300),
);

let stayBalance = 600_000;
for (let m = 0; m < 8; m++) stayBalance = stayBalance * (1 + 4.79 / 1200) - base.repayment;
near(
  "stay repayment is re-amortised at rollover over what is left",
  main.stayRepayment,
  annuity(stayBalance, SAMPLE_RATE + 0.5, 292),
);

// An independent run of the refinance line, paying what staying would pay.
let b = 600_000 * (1 - CONTRIBUTION_SHARE);
let months = 0;
while (b > 0) {
  months += 1;
  const annual = months <= FIX_MONTHS ? SAMPLE_RATE : SAMPLE_RATE + 0.5;
  b = b * (1 + annual / 1200) - (months <= 8 ? base.repayment : main.stayRepayment);
}
is("refinance finish month matches an independent run", main.refinanceMonths, months);
is("months sooner is the difference", main.monthsSooner, 300 - months);

// The sooner figure must come from the refinance, never from a bigger rise alone.
const none = calculateRefinance({ ...base, rise: 0 }, today);
const more = calculateRefinance({ ...base, rise: 1 }, today);
is(
  "a higher rollover rate widens the repayment gap",
  more.stayRepayment - more.newRepayment > none.stayRepayment - none.newRepayment,
  true,
);
is("new repayment does not depend on the scenario", more.newRepayment, none.newRepayment);

// The three answers the page can give.
is(
  "above the sample rate is the gain state",
  calculateRefinance({ ...base, rate: 6.55, repayment: 4070, fixedEnd: "2027-03-03" }, today).state,
  "gain",
);
is(
  "a long fix on a low rate is told to hold",
  calculateRefinance({ ...base, rate: 4.59, repayment: 3366, fixedEnd: "2028-07-03" }, today).state,
  "hold",
);
is(
  "exactly 12 months still counts as the date state",
  calculateRefinance({ ...base, fixedEnd: "2027-11-03" }, today).state,
  "date",
);
is(
  "a repayment below the interest cannot be modelled",
  calculateRefinance({ ...base, repayment: 1000 }, today).state,
  "low",
);

// Floating, and a date already gone, both mean no time left and no date in the words.
const floating = calculateRefinance({ ...base, fixedEnd: "" }, today);
is("blank date is zero months left", floating.monthsLeft, 0);
is("past date is zero months left", monthsBetween(today, "2026-01-01"), 0);
is(
  "floating copy does not name a date",
  describeRefinance(floating, { ...base, fixedEnd: "" }).sub.includes(" on "),
  false,
);

// Frequency changes the unit shown and not the loan.
const monthly = calculateRefinance(base, today);
const fortnightly = calculateRefinance(
  { ...base, repayment: (base.repayment * 12) / 26, frequency: "fortnightly" },
  today,
);
near(
  "fortnightly repayment converts back to the same monthly figure",
  (fortnightly.newRepayment * 26) / 12,
  monthly.newRepayment,
);

// Hold never shows a refinance figure.
const hold = calculateRefinance(
  { ...base, rate: 4.59, repayment: 3366, fixedEnd: "2028-07-03" },
  today,
);
const holdWords = describeRefinance(hold, {
  ...base,
  rate: 4.59,
  repayment: 3366,
  fixedEnd: "2028-07-03",
});
is("hold shows no figure", holdWords.headlineIsFigure, false);
is("hold shows no comparison", holdWords.showComparison, false);

is("the reminder date is 90 days back", daysBefore("2027-07-03", 90), "2027-04-04");

if (failures) {
  console.error(`\n${failures} of ${checks} checks failed.`);
  process.exit(1);
}
console.log(`All ${checks} refinance checks passed.`);
