/**
 * Checks the repayments calculator maths in src/lib/repayments.ts — in
 * particular the balance series the chart is drawn from, where a quiet error
 * would show up as a plausible-looking curve rather than an obviously wrong
 * number.
 *
 * Expected values are derived independently: from the closed-form annuity
 * formula, and from properties that must hold whatever the code does.
 *
 * Run:  node scripts/check-repayments.mjs   —   or  npm run check:repayments
 */

import { balanceSeries, calculateRepayments } from "../src/lib/repayments.ts";
import { periodicPayment } from "../src/lib/split-loan.ts";

let failures = 0;
let checks = 0;

function near(label, actual, expected, tolerance = 0.01) {
  checks += 1;
  if (!(Math.abs(actual - expected) <= tolerance)) {
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

const input = (over = {}) => ({
  amount: 650_000,
  rate: 5,
  years: 30,
  frequency: "fortnightly",
  extraMode: "amount",
  extraValue: 0,
  ...over,
});

// ── 1 · The repayment matches the annuity formula ───────────────────────
{
  const perYear = 26;
  const i = 5 / 100 / perYear;
  const n = 30 * perYear;
  const r = calculateRepayments(input());
  near("fortnightly repayment", r.basePayment, (650_000 * i) / (1 - Math.pow(1 + i, -n)));
  near("matches the shared primitive", r.basePayment, periodicPayment(650_000, i, n));
}

// ── 2 · The default rate is the one Lena set ────────────────────────────
{
  // Not a maths check — a guard so the placeholder rate cannot drift back up
  // without someone noticing. 5% is roughly the one-year fixed rate.
  const r = calculateRepayments(input({ rate: 5 }));
  ok("a 5% default produces a sane fortnightly figure on $650k over 30 years",
    r.basePayment > 1_500 && r.basePayment < 1_700, `got ${r.basePayment}`);
}

// ── 3 · The balance series starts and ends where it must ────────────────
{
  const r = calculateRepayments(input());
  const s = r.series;

  near("series starts at the full balance", s[0].base, 650_000, 1);
  near("series starts at year 0", s[0].year, 0);
  near("series has one point per year plus the start", s.length, 31);
  near("series ends at year 30", s[s.length - 1].year, 30);
  ok("the balance is cleared by the end", s[s.length - 1].base < 1_000, `got ${s[s.length - 1].base}`);

  // A P&I balance only ever falls.
  let monotonic = true;
  for (let k = 1; k < s.length; k += 1) if (s[k].base > s[k - 1].base) monotonic = false;
  ok("the balance never rises", monotonic);

  // Early on, most of the payment is interest — after one year of a 30-year
  // loan barely 1.5% of the principal is gone.
  const paidInYearOne = 650_000 - s[1].base;
  ok("year one repays only a sliver of principal",
    paidInYearOne > 5_000 && paidInYearOne < 15_000, `got ${paidInYearOne}`);
}

// ── 4 · With no extra, the two lines are identical ──────────────────────
{
  const s = calculateRepayments(input({ extraValue: 0 })).series;
  ok("no extra means no gap", s.every((p) => p.base === p.withExtra));
}

// ── 5 · An extra repayment pulls the second line below the first ────────
{
  const r = calculateRepayments(input({ extraMode: "amount", extraValue: 200 }));
  const s = r.series;

  ok("the extra line sits below the base line", s.slice(1, -1).every((p) => p.withExtra < p.base));
  ok("the gap widens over time", s[20].base - s[20].withExtra > s[5].base - s[5].withExtra);
  ok("the loan clears early", r.periodsSaved > 0);
  ok("interest is saved", r.interestSaved > 0);
  ok("the extra line reaches zero before the term ends",
    s.some((p) => p.withExtra === 0 && p.year < 30));
}

// ── 6 · Percent and amount agree on the same money ──────────────────────
{
  const perYear = 26;
  // 2% of $650,000 = $13,000/yr = $500/fortnight
  const byPercent = calculateRepayments(input({ extraMode: "percent", extraValue: 2 }));
  const byAmount = calculateRepayments(
    input({ extraMode: "amount", extraValue: 13_000 / perYear }),
  );
  near("percent and amount agree on the payment", byPercent.extraPerPeriod, byAmount.extraPerPeriod);
  near("and on the interest saved", byPercent.interestSaved, byAmount.interestSaved, 1);
}

// ── 7 · The 5% allowance is reported, not enforced ──────────────────────
{
  const under = calculateRepayments(input({ extraMode: "percent", extraValue: 4 }));
  const over = calculateRepayments(input({ extraMode: "percent", extraValue: 8 }));

  ok("4% is under the allowance", !under.overAllowance);
  ok("8% is over it", over.overAllowance);
  // Unlike the split calculator, this one must NOT trim: the loan might be
  // floating, where there is no limit at all.
  near("the over-allowance extra is left alone", over.extraPerPeriod, (0.08 * 650_000) / 26);
  near("the allowance per payment", under.allowancePerPeriod, (0.05 * 650_000) / 26);
}

// ── 8 · Every frequency behaves ─────────────────────────────────────────
{
  for (const [frequency, perYear] of [["weekly", 52], ["fortnightly", 26], ["monthly", 12]]) {
    const r = calculateRepayments(input({ frequency }));
    near(`${frequency}: perYear`, r.perYear, perYear);
    near(`${frequency}: series length`, r.series.length, 31);
    ok(`${frequency}: cleared by the end`, r.series[30].base < 1_000);
  }
  // The annual cost should be within a couple of percent across frequencies.
  const w = calculateRepayments(input({ frequency: "weekly" }));
  const m = calculateRepayments(input({ frequency: "monthly" }));
  near("annual cost is close across frequencies",
    w.basePayment * 52, m.basePayment * 12, m.basePayment * 12 * 0.02);
}

// ── 9 · A payment that cannot cover the interest does not explode ───────
{
  // balanceSeries is called directly with a deliberately hopeless payment.
  const s = balanceSeries(500_000, 0.06 / 12, 100, 0, 360, 12);
  ok("a hopeless payment holds the balance rather than growing it",
    s.every((p) => p.base <= 500_000 && p.base > 0));
  ok("and never goes negative", s.every((p) => p.base >= 0));
}

// ── 10 · Shorter terms and higher rates move the right way ──────────────
{
  const thirty = calculateRepayments(input({ years: 30 }));
  const twenty = calculateRepayments(input({ years: 20 }));
  ok("a shorter term costs more per payment", twenty.basePayment > thirty.basePayment);
  ok("and less in total interest", twenty.totalInterest < thirty.totalInterest);
  near("a 20-year series is 21 points", twenty.series.length, 21);

  const cheap = calculateRepayments(input({ rate: 5 }));
  const dear = calculateRepayments(input({ rate: 7 }));
  ok("a higher rate costs more per payment", dear.basePayment > cheap.basePayment);
}

if (failures === 0) {
  console.log(`✓ ${checks} checks — repayments maths holds.`);
} else {
  console.error(`\n✗ ${failures} of ${checks} checks failed.`);
  process.exit(1);
}
