/**
 * Checks the servicing engine behind the "How much can I borrow?" calculator
 * against the original standalone file it came from
 * (ws-valar/calculators/fhb-affordability.html).
 *
 * The original is the reference for the ARITHMETIC — the tax, the living cost
 * floor, the 7% test, the six-times-income cap. If a number here mismatches,
 * src/lib/affordability.ts is wrong.
 *
 * It is deliberately no longer the reference for the WORDING or for how the
 * answer is presented. The original headlined a price built on a full 20%
 * deposit; the page now leads with the loan and prices it at 20%, 10% and 5%,
 * and the verdict copy changed with it. So the original's headline price is
 * rebuilt here from the parts rather than read off the new result.
 *
 * Two arithmetic divergences, both deliberate.
 *
 * 8 Sep 2026 — the original took upfront costs off the deposit before pricing
 * anything. The page now puts the whole deposit in and explains settlement
 * costs in words instead. So the original is run with its upfront costs forced
 * to zero, which makes the two agree on the deposit again.
 *
 * 10 Sep 2026 — the original floored living costs with three flat constants
 * (1200 / 1850 / +250 a dependant), which said a household on $300,000 has the
 * same minimum living costs as one on $80,000. That is now a table banded by
 * income as well as household size. The floor cannot be switched off in the
 * original, so instead the original is handed a DECLARED SPEND already raised
 * to whatever the new table produces — both engines then work from the same
 * living-cost figure, and everything downstream of it stays compared.
 *
 * 10 Sep 2026 — the original assesses revolving limits at 3%/month; the page
 * now uses 3.8%, per Lena's own workbook. The original is handed a limit
 * scaled by 3.8/3.0 so both engines charge the same monthly commitment.
 *
 * ⚠️ That trick is also why the floor itself needs its own tests below. Until
 * 10 Sep the scenario named "Living cost floor kicks in" did not test the floor
 * at all: the six-times-income cap bound in every case, so the living-cost
 * number never reached the figures being compared. A green check that does not
 * exercise the thing it is named after is worse than a red one.
 *
 * Run:  node scripts/check-affordability.mjs
 *
 * Needs scripts/_original-calc.mjs, which is generated from the HTML by
 * scripts/build-affordability-check.mjs. `npm run check:affordability` does
 * both steps.
 */

import { runOriginal } from "./_original-calc.mjs";
import { calculate, down1k, livingBenchmark, money, shareBand } from "../src/lib/affordability.ts";

/*
 * Every case carries `kiwi1: "0", kiwi2: "0"`. The original file had no KiwiSaver question —
 * the deduction was added on 2026-09-02 — so zero is the only setting under
 * which the two can be compared at all. It is not the calculator's default,
 * which is 3.5%.
 *
 * The cases below deliberately hit every branch of the verdict.
 */
const CASES = [
  {
    name: "Defaults — couple, comfortable",
    input: { who: "2", inc1: "85,000", inc2: "70,000", deps: "0", kiwi1: "0", kiwi2: "0", spend: "2,200", dep: "120,000", cc: "0", car: "0", stud: "0", other: "0", rate: "6.50", rins: "400", ins: "0", extra: "0", detailed: false },
  },
  {
    name: "Single buyer, modest income",
    input: { who: "1", inc1: "72,000", inc2: "0", deps: "0", kiwi1: "0", kiwi2: "0", spend: "1,900", dep: "80,000", cc: "0", car: "0", stud: "0", other: "0", rate: "6.50", rins: "400", ins: "0", extra: "0", detailed: false },
  },
  {
    name: "Deposit binds — big income, small deposit",
    input: { who: "2", inc1: "140,000", inc2: "120,000", deps: "0", kiwi1: "0", kiwi2: "0", spend: "2,000", dep: "60,000", cc: "0", car: "0", stud: "0", other: "0", rate: "6.50", rins: "400", ins: "0", extra: "0", detailed: false },
  },
  {
    name: "DTI binds — very high income, large deposit",
    input: { who: "2", inc1: "150,000", inc2: "150,000", deps: "0", kiwi1: "0", kiwi2: "0", spend: "1,500", dep: "600,000", cc: "0", car: "0", stud: "0", other: "0", rate: "6.50", rins: "400", ins: "0", extra: "0", detailed: false },
  },
  {
    name: "Cannot service — low income, high spend",
    input: { who: "1", inc1: "48,000", inc2: "0", deps: "2", kiwi1: "0", kiwi2: "0", spend: "3,200", dep: "90,000", cc: "0", car: "0", stud: "0", other: "0", rate: "6.50", rins: "400", ins: "0", extra: "0", detailed: false },
  },
  {
    name: "Very small deposit",
    input: { who: "1", inc1: "90,000", inc2: "0", deps: "0", kiwi1: "0", kiwi2: "0", spend: "1,800", dep: "2,000", cc: "0", car: "0", stud: "0", other: "0", rate: "6.50", rins: "400", ins: "0", extra: "0", detailed: false },
  },
  {
    name: "With debts — card limits and a car loan",
    input: { who: "2", inc1: "95,000", inc2: "80,000", deps: "1", kiwi1: "0", kiwi2: "0", spend: "2,400", dep: "150,000", cc: "15,000", car: "650", stud: "220", other: "0", rate: "6.50", rins: "450", ins: "0", extra: "0", detailed: true },
  },
  {
    name: "With debts — heavy enough to block servicing",
    input: { who: "1", inc1: "70,000", inc2: "0", deps: "1", kiwi1: "0", kiwi2: "0", spend: "2,300", dep: "100,000", cc: "25,000", car: "900", stud: "400", other: "300", rate: "6.50", rins: "400", ins: "0", extra: "0", detailed: true },
  },
  {
    name: "Living cost floor kicks in",
    input: { who: "2", inc1: "110,000", inc2: "95,000", deps: "3", kiwi1: "0", kiwi2: "0", spend: "800", dep: "200,000", cc: "0", car: "0", stud: "0", other: "0", rate: "6.50", rins: "400", ins: "0", extra: "0", detailed: false },
  },
  {
    name: "Different rate and rates/insurance",
    input: { who: "2", inc1: "88,000", inc2: "0", deps: "0", kiwi1: "0", kiwi2: "0", spend: "2,100", dep: "140,000", cc: "0", car: "0", stud: "0", other: "0", rate: "7.95", rins: "720", ins: "0", extra: "0", detailed: false },
  },
];

/*
 * A blocked answer shows a message instead of a price, and the comparison
 * checks the ported engine blocks exactly where the original did. The message
 * wording is ours to change: on 2026-09-11 the em dash came out of it (Lena —
 * em dashes read as AI-written). Mapped back to the original's text here so a
 * copy edit is not reported as a maths failure.
 */
const LEGACY_HEADLINES = {
  "Not there on these numbers yet": "Not there on these numbers — yet",
};

let failures = 0;
let checks = 0;

for (const testCase of CASES) {
  /*
   * Both divergences applied: no upfront costs, and a declared spend already
   * lifted to the new banded floor so the original's flat floor cannot bind.
   */
  const grossMonthly =
    (Number(String(testCase.input.inc1).replace(/[^0-9.]/g, "")) +
      (testCase.input.who === "2"
        ? Number(String(testCase.input.inc2).replace(/[^0-9.]/g, ""))
        : 0)) /
    12;
  const banded = livingBenchmark(
    grossMonthly,
    testCase.input.who === "2",
    parseInt(testCase.input.deps, 10) || 0,
  );
  const declared = Number(String(testCase.input.spend).replace(/[^0-9.]/g, ""));
  const cardLimit = Number(String(testCase.input.cc).replace(/[^0-9.]/g, "")) || 0;
  const original = runOriginal(
    {
      ...testCase.input,
      costs: "0",
      spend: String(Math.max(declared, banded)),
      cc: String((cardLimit * 0.038) / 0.03),
    },
    testCase.input.detailed,
  );
  const ported = calculate(testCase.input);

  /*
   * The original's headline was the smaller of what the income supports and
   * what a 20% deposit supports. Both parts are still returned, so the old
   * number can be rebuilt and compared even though the page no longer shows it.
   */
  const legacyPrice = down1k(Math.min(ported.priceByIncome, ported.priceByDeposit));
  const legacyLoan = Math.max(0, legacyPrice - ported.depAvail);

  // The original writes its answers into DOM nodes; line them up with the
  // fields the ported version returns.
  const comparisons = [
    ["headline price", original["out-price"], ported.blocked ? (LEGACY_HEADLINES[ported.headline] ?? ported.headline) : money(legacyPrice)],
    ["loan", original["out-loan"], ported.blocked ? "—" : money(legacyLoan)],
    ["deposit", original["out-dep"], ported.blocked && ported.depAvail <= 0 ? "—" : money(ported.depAvail)],
  ];

  for (const [label, expected, actual] of comparisons) {
    checks += 1;
    // The blocked-state deposit line differs by design: the original prints the
    // deposit even when blocked, so only compare it when both produced one.
    if (label === "deposit" && (expected === "—" || actual === "—")) continue;
    if (String(expected) !== String(actual)) {
      failures += 1;
      console.error(`\n✗ ${testCase.name} — ${label}`);
      console.error(`   original: ${expected}`);
      console.error(`   ported:   ${actual}`);
    }
  }
}

// ── The living-cost table, against the workbook it came from ────────────
//
// Spot values transcribed from Lena's Borrowing Power Estimator, benchmark tab.
// These are the numbers the engine is supposed to hold; the comparison against
// the original file cannot check them, because the original has no such table.
{
  const cases = [
    // [gross $/month, couple, dependants, expected $/month]
    [3_000, false, 0, 1000],
    [3_000, true, 3, 1850],
    [6_500, true, 0, 1840],
    [6_000, false, 0, 1230],
    [12_916.67, true, 0, 2220],
    [15_000, false, 2, 2110],
    [25_000, true, 3, 3190],
    // Four or more dependants deliberately reuse the three-dependant figure.
    [12_916.67, true, 5, 2740],
    // A band applies from its threshold up, so the boundary belongs to it.
    [4_000, false, 0, 1130],
    [3_999, false, 0, 1000],
  ];
  for (const [gross, couple, deps, expected] of cases) {
    checks += 1;
    const got = livingBenchmark(gross, couple, deps);
    if (got !== expected) {
      failures += 1;
      console.error(
        `\n✗ living benchmark — ${couple ? "2 adults" : "1 adult"}, ${deps} dep, $${gross}/mo`,
      );
      console.error(`   expected: ${expected}`);
      console.error(`   got:      ${got}`);
    }
  }
}

// ── And that the floor actually reaches the answer ───────────────────────
//
// The scenario list above cannot show this: the six-times cap binds in all of
// them, so the living-cost figure never moves a compared number. This one is
// built so servicing is what limits the loan.
{
  const base = {
    who: "1", inc1: "70,000", inc2: "0", deps: "2", kiwi1: "0", kiwi2: "0",
    spend: "800", dep: "90,000", cc: "0", car: "0", stud: "0", other: "0",
    rate: "6.50", rins: "400", ins: "0", extra: "0", detailed: false,
  };

  const r = calculate(base);
  checks += 1;
  if (!(r.servLoan < r.dtiLoan)) {
    failures += 1;
    console.error("\n✗ floor test scenario is capped by DTI, so it proves nothing");
  }

  // $800 declared is below any band, so the floor is what is used.
  const floored = calculate({ ...base, spend: "800" });
  const declared = calculate({ ...base, spend: "9,000" });
  checks += 1;
  if (!(declared.maxLoan < floored.maxLoan)) {
    failures += 1;
    console.error("\n✗ declaring more than the floor should lower the loan");
  }

  // The two extra outgoings have to reach the servicing test as well.
  const withIns = calculate({ ...base, ins: "150" });
  const withBoth = calculate({ ...base, ins: "150", extra: "200" });
  checks += 1;
  if (!(withIns.maxLoan < floored.maxLoan && withBoth.maxLoan < withIns.maxLoan)) {
    failures += 1;
    console.error("\n✗ personal insurance and other spending are not reducing the loan");
  }
}

// ── The share of take-home pay counts ALL repayments ─────────────────────
//
// Lena, 2026-09-11: a mortgage at 30% of pay beside a large car loan is not a
// comfortable household. The band, the caution and the 30/40/50% table all
// read off the mortgage PLUS everything they already owe — cards at 3.8% of the
// limit included, the same monthly figure the servicing test uses.
{
  const base = {
    who: "1", inc1: "90,000", inc2: "0", deps: "0", kiwi1: "0", kiwi2: "0",
    spend: "2,000", dep: "100,000", cc: "0", car: "0", stud: "0", other: "0",
    rate: "5.59", rins: "400", ins: "0", extra: "0", detailed: true,
  };
  const fail = (msg) => {
    failures += 1;
    console.error(`\n✗ ${msg}`);
  };

  // No loans: nothing changes — the total is the mortgage, the rows are a
  // straight share of pay.
  const plain = calculate(base);
  checks += 1;
  if (plain.debtMonthly !== 0 || plain.repaymentShare.loans !== 0 || plain.repaymentShare.all !== plain.repaymentShare.mortgage) {
    fail("with no loans the total share should equal the mortgage share");
  }
  checks += 1;
  if (plain.levels.some((l) => Math.abs(l.payment - plain.netMonthly * l.share) > 0.005)) {
    fail("with no loans each row should be a straight share of take-home pay");
  }

  // With loans and a card limit: $10,000 of limit is $380 a month.
  const loaded = calculate({ ...base, cc: "10,000", car: "600", stud: "250", other: "150" });
  const s = loaded.repaymentShare;
  const owed = 10000 * 0.038 + 600 + 250 + 150;
  checks += 1;
  if (Math.abs(loaded.debtMonthly - owed) > 0.005) {
    fail(`monthly debt should be cards at 3.8% + car + student + other = ${owed}, got ${loaded.debtMonthly}`);
  }
  checks += 1;
  const expectAll = Math.round(((loaded.payAtRate + owed) / loaded.netMonthly) * 100);
  if (s.all !== expectAll || s.mortgage !== Math.round(loaded.shareAtRate * 100) || s.mortgage + s.loans !== s.all) {
    fail(`shares do not add up: mortgage ${s.mortgage} + loans ${s.loans} vs all ${s.all} (expected ${expectAll})`);
  }
  checks += 1;
  if (s.band.label !== shareBand(s.all / 100).label) {
    fail(`band ${s.band.label} is not the band of the ${s.all}% total`);
  }
  checks += 1;
  if (!loaded.caution.detail.includes(`${s.all}%`) || !loaded.caution.detail.includes(s.band.label)) {
    fail(`caution does not quote the total: ${loaded.caution.detail}`);
  }
  checks += 1;
  if (loaded.levels.some((l) => Math.abs(l.payment - Math.max(0, loaded.netMonthly * l.share - owed)) > 0.005)) {
    fail("each row's mortgage payment should be the share of pay less cards and loans");
  }

  // Left to live on: the rest of take-home pay, and the rest of the same 100.
  checks += 1;
  const left = loaded.leftToLive;
  if (
    Math.abs(left.atRate - (loaded.netMonthly - loaded.payAtRate - owed)) > 0.005 ||
    Math.abs(left.atTest - (loaded.netMonthly - loaded.payAtTest - owed)) > 0.005 ||
    left.pct + s.all !== 100 ||
    !(left.atTest < left.atRate)
  ) {
    fail(`left to live on does not add up: ${JSON.stringify(left)} with all ${s.all}%`);
  }

  // A card limit alone is enough to switch the three-line view on.
  const cardsOnly = calculate({ ...base, cc: "20,000" });
  checks += 1;
  if (!(cardsOnly.debtMonthly > 0 && cardsOnly.repaymentShare.loans > 0)) {
    fail(`a card limit on its own should count: debt ${cardsOnly.debtMonthly}, loans share ${cardsOnly.repaymentShare.loans}%`);
  }

  // Loans bigger than the whole 30% share: that row has no mortgage in it.
  const buried = calculate({ ...base, car: "2,400" });
  const first = buried.levels[0];
  checks += 1;
  if (!(buried.netMonthly * 0.3 < 2400) || first.payment !== 0 || first.loan !== 0) {
    fail(`30% row should be empty when loans exceed it: payment ${first.payment}, loan ${first.loan}`);
  }
}

if (failures === 0) {
  console.log(`✓ ${checks} checks across ${CASES.length} scenarios — the servicing engine still matches the original.`);
} else {
  console.error(`\n✗ ${failures} of ${checks} checks failed.`);
  process.exit(1);
}
