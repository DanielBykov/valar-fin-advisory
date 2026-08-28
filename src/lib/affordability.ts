/*
 * The arithmetic behind the "What can I actually buy?" calculator.
 *
 * Kept apart from the component on purpose: these are pure functions over
 * plain numbers, so they can be checked against the original file without a
 * browser or React in the way. scripts/check-affordability.mjs does exactly
 * that and must stay passing.
 */

/*
 * Ported from ws-valar/calculators/fhb-affordability.html (14 Aug 2026).
 * The arithmetic below is a faithful transcription of that file — the constants,
 * the tax bands, the servicing test and the verdict wording are unchanged.
 * If a number here ever disagrees with that file, that file is the original.
 */

// ---------- assumptions ----------
const TEST_RATE = 0.07; // annual, what we stress at
const TERM_YEARS = 30;
const MIN_SURPLUS = 150; // $/month left over
const CARD_FACTOR = 0.03; // % of card limit charged per month
const STD_LVR = 0.8; // the comfortable path — 20% down, no low-equity cost
const MAX_LVR = 0.9; // how far a first home buyer can realistically stretch
const DTI_CAP = 6; // loan as a multiple of gross income
const ACC_RATE = 0.0175;
const ACC_CAP = 156_641;

// living cost floor, $/month, excluding housing
const FLOOR_1 = 1200;
const FLOOR_2 = 1850;
const FLOOR_DEP = 250;

// ---------- tax ----------
const BANDS: [number, number][] = [
  [15_600, 0.105],
  [53_500, 0.175],
  [78_100, 0.3],
  [180_000, 0.33],
  [Infinity, 0.39],
];

function annualTax(gross: number) {
  let tax = 0;
  let prev = 0;
  for (const [cap, rate] of BANDS) {
    if (gross <= prev) break;
    tax += (Math.min(gross, cap) - prev) * rate;
    prev = cap;
  }
  return tax;
}

function netAnnual(gross: number) {
  if (gross <= 0) return 0;
  return gross - annualTax(gross) - Math.min(gross, ACC_CAP) * ACC_RATE;
}

// ---------- money maths ----------
/** Present value of a level monthly payment — the loan that payment supports. */
function pv(monthlyRate: number, n: number, payment: number) {
  if (payment <= 0) return 0;
  return (payment * (1 - Math.pow(1 + monthlyRate, -n))) / monthlyRate;
}

/** Level monthly repayment on a principal. */
function pmt(monthlyRate: number, n: number, principal: number) {
  if (principal <= 0) return 0;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
}

// ---------- formatting ----------
export const money = (n: number) => "$" + Math.round(n).toLocaleString("en-NZ");

/**
 * Prices are indicative — always round down to the nearest $1,000 so the
 * headline price, the loan and the deposit reconcile exactly on screen.
 */
export const down1k = (n: number) => Math.max(0, Math.floor(n / 1000) * 1000);
export const money0 = (n: number) => money(down1k(n));

export const withCommas = (raw: string) => {
  const digits = raw.replace(/[^0-9]/g, "");
  return digits === "" ? "" : parseInt(digits, 10).toLocaleString("en-NZ");
};

export const toNumber = (raw: string) => {
  const v = parseFloat(raw.replace(/[^0-9.]/g, ""));
  return Number.isNaN(v) ? 0 : v;
};

// ---------- inputs ----------
export type Inputs = {
  who: "1" | "2";
  inc1: string;
  inc2: string;
  deps: string;
  spend: string;
  dep: string;
  cc: string;
  car: string;
  stud: string;
  other: string;
  rate: string;
  rins: string;
  costs: string;
  detailed: boolean;
};

export const DEFAULTS: Inputs = {
  who: "2",
  inc1: "85,000",
  inc2: "70,000",
  deps: "0",
  spend: "2,200",
  dep: "120,000",
  cc: "0",
  car: "0",
  stud: "0",
  other: "0",
  rate: "6.50",
  rins: "400",
  costs: "3,500",
  detailed: false,
};

export type Result = ReturnType<typeof calculate>;

export function calculate(input: Inputs) {
  const couple = input.who === "2";
  const inc1 = toNumber(input.inc1);
  const inc2 = couple ? toNumber(input.inc2) : 0;
  const deps = parseInt(input.deps, 10) || 0;
  const spend = toNumber(input.spend);
  const deposit = toNumber(input.dep);

  const cc = input.detailed ? toNumber(input.cc) : 0;
  const car = input.detailed ? toNumber(input.car) : 0;
  const stud = input.detailed ? toNumber(input.stud) : 0;
  const other = input.detailed ? toNumber(input.other) : 0;

  const expRate = (toNumber(input.rate) || 6.5) / 100;
  const ratesIns = toNumber(input.rins);
  const upfront = toNumber(input.costs);

  const netMonthly = (netAnnual(inc1) + netAnnual(inc2)) / 12;

  const floor = (couple ? FLOOR_2 : FLOOR_1) + deps * FLOOR_DEP;
  const livingUsed = Math.max(spend, floor);
  const floored = livingUsed > spend;

  const debtMonthly = cc * CARD_FACTOR + car + stud + other;

  const umi = netMonthly - livingUsed - ratesIns - debtMonthly;
  const avail = umi - MIN_SURPLUS;

  const mTest = TEST_RATE / 12;
  const n = TERM_YEARS * 12;
  const servLoan = avail > 0 ? pv(mTest, n, avail) : 0;

  // Most lenders are capped at 6x income for owner-occupiers, so whichever
  // bites first — the repayment test or the income multiple — sets the loan.
  const gross = inc1 + inc2;
  const dtiLoan = gross * DTI_CAP;
  const maxLoan = Math.min(servLoan, dtiLoan);
  const dtiBinds = dtiLoan < servLoan && gross > 0;

  const depAvail = Math.max(0, deposit - upfront);

  // If the repayment test isn't cleared, income supports nothing — say zero
  // rather than quietly reporting the deposit back as buying power.
  const priceByIncome = avail > 0 ? maxLoan + depAvail : 0;
  const priceByDeposit = depAvail / (1 - STD_LVR); // deposit is 20% of price
  const priceStretch = Math.min(priceByIncome, depAvail / (1 - MAX_LVR));

  // Headline the comfortable 20%-down number; the low-deposit stretch is shown
  // underneath so the bigger figure never leads.
  const price = down1k(Math.min(priceByIncome, priceByDeposit));
  const loan = Math.max(0, price - depAvail);
  const lvr = price > 0 ? loan / price : 0;

  const depositBinds = priceByDeposit < priceByIncome;
  const stretch = down1k(priceStretch);
  const hasStretch = stretch > price + 1000;

  const blocked = avail <= 0 || depAvail <= 0;
  const shortfall = MIN_SURPLUS - umi;

  // ----- verdict -----
  let title: string;
  const body: string[] = [];

  if (depAvail <= 0) {
    title = "Start with the deposit";
    body.push(
      `Before anything else, you need enough set aside to cover the upfront costs — lawyer, LIM, builder's report and moving, about ${money0(upfront)}. Everything after that becomes your actual deposit.`,
    );
    body.push("Check your KiwiSaver balance first. It's the piece most people forget to count.");
  } else if (avail <= 0) {
    title = `About ${money(shortfall)} a month short`;
    body.push(
      `On these numbers, what's left after living costs${debtMonthly > 0 ? " and repayments" : ""} doesn't yet clear the margin a lender wants to see. That's a gap you can close, and it's smaller than it looks.`,
    );
    if (debtMonthly > 0) {
      body.push(
        `Your existing commitments take ${money(debtMonthly)} a month${cc > 0 ? `, ${money(cc * CARD_FACTOR)} of that from card limits alone` : ""}. Clearing them is usually the fastest route.`,
      );
    }
    if (floored) {
      body.push(
        `We've also used ${money(livingUsed)} a month for living costs rather than the ${money(spend)} you entered — that's the minimum a household your size is assessed on.`,
      );
    }
  } else if (depositBinds) {
    title = "Your deposit is what's holding you back";
    body.push(
      `Your income could support a loan of about ${money0(maxLoan)} — enough for a home around ${money0(priceByIncome)}. Your deposit is what caps you at ${money(price)}.`,
    );
    body.push(
      "Every extra $10,000 you save adds roughly $50,000 to what you can buy. That's the highest-leverage thing you can do right now.",
    );
    if (debtMonthly > 0) {
      body.push(
        `Your repayments of ${money(debtMonthly)} a month aren't the problem here — you have income to spare. Save first; tidy the debt closer to applying.`,
      );
    }
    if (hasStretch) {
      body.push(
        `The other route is buying with less than 20% down, which would take you to around ${money(stretch)}. It costs more and the criteria are tighter — worth talking through rather than deciding off a calculator.`,
      );
    }
  } else if (dtiBinds) {
    title = "The income multiple is what's holding you back";
    body.push(
      `Your budget could stretch to repayments on about ${money0(servLoan)}, but most lenders won't write a loan of more than six times your income. On ${money0(gross)} between you, that caps the loan at ${money0(dtiLoan)} and the price at ${money(price)}.`,
    );
    body.push(
      "Raising income moves this number; saving harder mostly doesn't. It's also the limit with the most exceptions attached, which makes it worth a proper conversation.",
    );
  } else {
    title = "Your income is what's holding you back";
    body.push(
      `You have enough deposit for a home worth about ${money0(priceByDeposit)}. What you can service is what caps you at ${money(price)}.`,
    );
    if (debtMonthly > 0) {
      const lost = pv(mTest, n, debtMonthly);
      body.push(
        `Your existing repayments of ${money(debtMonthly)} a month cost you roughly ${money0(lost)} of borrowing power.${cc > 0 ? ` Card limits alone account for ${money0(pv(mTest, n, cc * CARD_FACTOR))} of that — whether or not you use them.` : ""}`,
      );
    }
    if (floored) {
      body.push(
        `Note we've used ${money(livingUsed)} a month for living costs, not the ${money(spend)} you entered. That's the floor a household your size is assessed against.`,
      );
    }
  }

  return {
    blocked,
    depAvail,
    price,
    loan,
    lvr,
    expRate,
    payAtRate: pmt(expRate / 12, n, loan),
    payAtTest: pmt(mTest, n, loan),
    priceByIncome: Math.max(0, priceByIncome),
    priceByDeposit: Math.max(0, priceByDeposit),
    depositBinds,
    stretch,
    hasStretch,
    headline:
      depAvail <= 0
        ? "Deposit doesn't cover the upfront costs yet"
        : "Not there on these numbers — yet",
    title,
    body,
  };
}

