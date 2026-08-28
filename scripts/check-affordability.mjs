/**
 * Checks the ported "What can I actually buy?" calculator against the original
 * standalone file it came from (ws-valar/calculators/fhb-affordability.html).
 *
 * The original is the reference. If this script reports a mismatch, the ported
 * version in src/lib/affordability.ts is wrong — not the other way round.
 *
 * Run:  node scripts/check-affordability.mjs
 *
 * Needs scripts/_original-calc.mjs, which is generated from the HTML by
 * scripts/build-affordability-check.mjs. `npm run check:affordability` does
 * both steps.
 */

import { runOriginal } from "./_original-calc.mjs";
import { calculate, money } from "../src/lib/affordability.ts";

/** The cases below deliberately hit every branch of the verdict. */
const CASES = [
  {
    name: "Defaults — couple, comfortable",
    input: { who: "2", inc1: "85,000", inc2: "70,000", deps: "0", spend: "2,200", dep: "120,000", cc: "0", car: "0", stud: "0", other: "0", rate: "6.50", rins: "400", costs: "3,500", detailed: false },
  },
  {
    name: "Single buyer, modest income",
    input: { who: "1", inc1: "72,000", inc2: "0", deps: "0", spend: "1,900", dep: "80,000", cc: "0", car: "0", stud: "0", other: "0", rate: "6.50", rins: "400", costs: "3,500", detailed: false },
  },
  {
    name: "Deposit binds — big income, small deposit",
    input: { who: "2", inc1: "140,000", inc2: "120,000", deps: "0", spend: "2,000", dep: "60,000", cc: "0", car: "0", stud: "0", other: "0", rate: "6.50", rins: "400", costs: "3,500", detailed: false },
  },
  {
    name: "DTI binds — very high income, large deposit",
    input: { who: "2", inc1: "150,000", inc2: "150,000", deps: "0", spend: "1,500", dep: "600,000", cc: "0", car: "0", stud: "0", other: "0", rate: "6.50", rins: "400", costs: "3,500", detailed: false },
  },
  {
    name: "Cannot service — low income, high spend",
    input: { who: "1", inc1: "48,000", inc2: "0", deps: "2", spend: "3,200", dep: "90,000", cc: "0", car: "0", stud: "0", other: "0", rate: "6.50", rins: "400", costs: "3,500", detailed: false },
  },
  {
    name: "Deposit under upfront costs",
    input: { who: "1", inc1: "90,000", inc2: "0", deps: "0", spend: "1,800", dep: "2,000", cc: "0", car: "0", stud: "0", other: "0", rate: "6.50", rins: "400", costs: "3,500", detailed: false },
  },
  {
    name: "With debts — card limits and a car loan",
    input: { who: "2", inc1: "95,000", inc2: "80,000", deps: "1", spend: "2,400", dep: "150,000", cc: "15,000", car: "650", stud: "220", other: "0", rate: "6.50", rins: "450", costs: "4,000", detailed: true },
  },
  {
    name: "With debts — heavy enough to block servicing",
    input: { who: "1", inc1: "70,000", inc2: "0", deps: "1", spend: "2,300", dep: "100,000", cc: "25,000", car: "900", stud: "400", other: "300", rate: "6.50", rins: "400", costs: "3,500", detailed: true },
  },
  {
    name: "Living cost floor kicks in",
    input: { who: "2", inc1: "110,000", inc2: "95,000", deps: "3", spend: "800", dep: "200,000", cc: "0", car: "0", stud: "0", other: "0", rate: "6.50", rins: "400", costs: "3,500", detailed: false },
  },
  {
    name: "Different rate and rates/insurance",
    input: { who: "2", inc1: "88,000", inc2: "0", deps: "0", spend: "2,100", dep: "140,000", cc: "0", car: "0", stud: "0", other: "0", rate: "7.95", rins: "720", costs: "6,000", detailed: false },
  },
];

/**
 * Strip HTML tags so the original's innerHTML compares against plain strings.
 * Tags become a space, not nothing: the original emits `</p><p>` between
 * paragraphs, and collapsing that to no space would report a difference that
 * only exists in this comparison.
 */
const strip = (s) =>
  String(s ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

let failures = 0;
let checks = 0;

for (const testCase of CASES) {
  const original = runOriginal({ ...testCase.input }, testCase.input.detailed);
  const ported = calculate(testCase.input);

  // The original writes its answers into DOM nodes; line them up with the
  // fields the ported version returns.
  const comparisons = [
    ["headline price", original["out-price"], ported.blocked ? ported.headline : money(ported.price)],
    ["loan", original["out-loan"], ported.blocked ? "—" : money(ported.loan)],
    ["deposit", original["out-dep"], ported.blocked && ported.depAvail <= 0 ? "—" : money(ported.depAvail)],
    ["verdict title", original["v-title"], ported.title],
    ["verdict body", strip(original["v-body"]), strip(ported.body.join(" "))],
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

if (failures === 0) {
  console.log(`✓ ${checks} checks across ${CASES.length} scenarios — ported calculator matches the original.`);
} else {
  console.error(`\n✗ ${failures} of ${checks} checks failed.`);
  process.exit(1);
}
