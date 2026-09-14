/*
 * The arithmetic behind the "How much can I borrow?" calculator.
 *
 * Kept apart from the component on purpose: these are pure functions over
 * plain numbers, so they can be checked against the original file without a
 * browser or React in the way. scripts/check-affordability.mjs does exactly
 * that and must stay passing.
 */

/*
 * Ported from ws-valar/calculators/fhb-affordability.html (14 Aug 2026).
 * The SERVICING ENGINE below is a faithful transcription of that file — the
 * constants, the tax bands and the servicing test are unchanged, and the check
 * script holds them to it.
 *
 * What has moved on from the original is what happens after the loan is known.
 * The original headlined a purchase price built on a full 20% deposit, which
 * quoted most first home buyers a price far below what they can actually buy.
 * The answer now leads with the loan, and the price is shown at each deposit
 * level — 20%, 10% and 5% — so the deposit is a choice on screen rather than an
 * assumption buried in the maths.
 *
 * The other change (8 Sep 2026): the original quietly took upfront costs off
 * the deposit before pricing anything, so someone who entered $120,000 was
 * quoted on $116,500 with nothing on screen to explain the difference. The
 * whole deposit now goes in. Settlement costs are still real, and the page
 * says so in words — see the note under the deposit field.
 */

// ---------- assumptions ----------
const TEST_RATE = 0.07; // annual, what we stress at
const TERM_YEARS = 30;
const MIN_SURPLUS = 150; // $/month left over
/*
 * What a revolving limit is assessed at, per month.
 *
 * 3.8%, not the 3% carried over from the original file. Lena's own Borrowing
 * Power Estimator puts it at 3.8% — "bank convention, ~3.8%/month of the
 * limit" — and the same sheet notes the limit counted this way "includes
 * buy-now-pay-later", which is why the field asks for those and overdrafts
 * too rather than cards alone.
 *
 * It is the stricter end, and that is the right direction for an indicative
 * tool: quoting someone more than they will get is the expensive mistake. On
 * a $20,000 limit the difference is about $24,000 of borrowing power.
 */
const CARD_FACTOR = 0.038;
const STD_LVR = 0.8; // the comfortable path — 20% down, no low-equity cost
const DTI_CAP = 6; // loan as a multiple of gross income
const ACC_RATE = 0.0175;
const ACC_CAP = 156_641;

/**
 * The deposit levels a purchase price is quoted at, biggest first.
 *
 * 20% leads because it is the only one of the three that costs nothing extra.
 * The other two are real — first home buyers do buy at 10%, and 5% exists
 * through the First Home Loan — but both carry a low-equity margin, tighter
 * criteria and a shorter list of lenders willing to write them.
 */
export const DEPOSIT_TIERS = [0.2, 0.1, 0.05] as const;

/*
 * Minimum living costs, $/month excluding housing, banded by household income
 * as well as by size.
 *
 * Replaces three flat constants — 1200 for one adult, 1850 for two, plus 250 a
 * dependant — which said a household on $300,000 has the same minimum living
 * costs as one on $80,000. Lenders do not assess it that way and neither
 * should this: the floor rises with income, and at the top of the range the
 * difference is around $740 a month, which is roughly $111,000 of borrowing
 * power.
 *
 * Rows are the monthly gross income ($'000) at which each band STARTS; the
 * band that applies is the last one the income clears. Columns run
 * [1 adult: 0,1,2,3 dependants][2 adults: 0,1,2,3 dependants]. Four or more
 * dependants use the three-dependant figure — the table does not break them
 * out, and pretending otherwise would invent precision.
 *
 * Source: Lena's own working figures (Borrowing Power Estimator.xlsx),
 * rounded and averaged across several lenders' models rather than taken from
 * any one of them. NOT to be displayed — the numbers drive the engine, they
 * are not published on the page.
 */
const LIVING_BANDS: { from: number; costs: readonly number[] }[] = [
  { from: 0, costs: [1000, 1160, 1310, 1440, 1500, 1620, 1740, 1850] },
  { from: 4, costs: [1130, 1310, 1480, 1630, 1690, 1830, 1960, 2090] },
  { from: 6, costs: [1230, 1430, 1610, 1770, 1840, 2000, 2140, 2270] },
  { from: 8, costs: [1320, 1530, 1720, 1890, 1970, 2130, 2280, 2430] },
  { from: 10, costs: [1490, 1720, 1940, 2140, 2220, 2400, 2580, 2740] },
  { from: 15, costs: [1620, 1880, 2110, 2330, 2420, 2620, 2810, 2980] },
  { from: 20, costs: [1730, 2010, 2260, 2490, 2590, 2800, 3000, 3190] },
];

/**
 * The minimum a household this size, with this income, is assessed on.
 *
 * Exported because the form pre-fills the spending box with it: someone who has
 * not typed anything should still see a plausible figure rather than a blank or
 * a fixed number that has nothing to do with them.
 */
export function livingBenchmark(grossMonthly: number, couple: boolean, deps: number): number {
  const column = (couple ? 4 : 0) + Math.min(Math.max(0, Math.round(deps)), 3);
  const thousands = grossMonthly / 1000;
  let costs = LIVING_BANDS[0].costs;
  for (const band of LIVING_BANDS) if (thousands >= band.from) costs = band.costs;
  return costs[column];
}

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

export const toNumber = (raw: string | undefined) => {
  if (!raw) return 0;
  const v = parseFloat(raw.replace(/[^0-9.]/g, ""));
  return Number.isNaN(v) ? 0 : v;
};

/**
 * The employee contribution rates KiwiSaver actually offers, plus opting out.
 *
 * 3.5% is the default rate from April 2026 and so the default here. It is a
 * question rather than an assumption because it comes straight off take-home
 * pay: two identical incomes contributing 3% and 10% do not service the same
 * loan, and lenders count the difference.
 */
export const KIWISAVER_RATES = ["0", "3", "3.5", "4", "6", "8", "10"] as const;

/**
 * How a repayment sits against take-home pay. General rule of thumb rather
 * than any lender's rule — no bank publishes a share-of-income cap — but it is
 * the number people actually feel, and the one a maximum loan hides.
 */
export function shareBand(share: number): { label: string; tone: "ok" | "warn" | "high" } {
  if (share <= 0.3) return { label: "Comfortable", tone: "ok" };
  if (share <= 0.4) return { label: "Manageable", tone: "ok" };
  if (share <= 0.5) return { label: "Stretched", tone: "warn" };
  return { label: "High risk", tone: "high" };
}

// ---------- inputs ----------
export type Inputs = {
  who: "1" | "2";
  inc1: string;
  inc2: string;
  deps: string;
  /**
   * KiwiSaver employee contribution, per person, as a percentage of gross pay.
   * One of a couple can be contributing 10% while the other is not in the
   * scheme at all, and it is a real difference in what they can service.
   */
  kiwi1: string;
  kiwi2: string;
  spend: string;
  dep: string;
  cc: string;
  car: string;
  stud: string;
  other: string;
  rate: string;
  rins: string;
  /** Life, health and income protection cover, per month. */
  ins: string;
  /** Anything else that goes out every month and isn't a debt repayment. */
  extra: string;
  detailed: boolean;
};

export const DEFAULTS: Inputs = {
  who: "2",
  inc1: "85,000",
  inc2: "70,000",
  deps: "0",
  kiwi1: "3.5",
  kiwi2: "3.5",
  spend: "2,200",
  dep: "120,000",
  cc: "0",
  car: "0",
  stud: "0",
  other: "0",
  rate: "5.59",
  rins: "400",
  ins: "0",
  extra: "0",
  detailed: true,
};

/**
 * One row of the answer: what the same numbers buy at a given deposit level.
 *
 * Two things can stop a price, and which one it is matters more than the price
 * itself. `cappedBy: "income"` means the loan ran out first — a bigger deposit
 * would not move it. `cappedBy: "deposit"` means the deposit ran out first, and
 * every dollar saved moves the price by a multiple of itself.
 */
export type Tier = {
  /** 0.2 | 0.1 | 0.05 */
  pct: number;
  label: string;
  price: number;
  loan: number;
  /** Always the whole deposit — nobody holds some of it back to hit a ratio. */
  deposit: number;
  /** What the deposit actually works out as against this price. */
  depositPct: number;
  cappedBy: "income" | "deposit";
  /** The loan as a share of the price — what a bank actually assesses. */
  lvr: number;
  /** Above 80% LVR: a low-equity margin and a shorter list of lenders. */
  lowEquity: boolean;
  /**
   * This level reaches the same price as one with a bigger deposit, so it adds
   * nothing: the income ran out before the deposit rule did. Printing the same
   * figure twice reads as a bug, so the row says why instead.
   */
  redundant: boolean;
};

/**
 * The shares of take-home pay the answer is priced at.
 *
 * Deliberately stops at 50%. Above it every figure is one a lender might still
 * approve and nobody should plan around, and putting a row there would read as
 * an option rather than a warning.
 */
export const AFFORD_SHARES = [0.3, 0.4, 0.5] as const;

/**
 * One affordability level: the question asked backwards.
 *
 * Every other number on the page starts from what a lender would allow and
 * works down. This starts from what the household would actually live with —
 * a share of take-home pay — and works out what that buys.
 */
export type AffordLevel = {
  /** 0.3 | 0.4 | 0.5 — of ALL repayments, the mortgage and the loans they already have. */
  share: number;
  label: string;
  /**
   * The mortgage repayment that keeps all repayments at that share: the share
   * of take-home pay, less what their cards and loans already take. Zero when
   * those take the whole share on their own.
   */
  payment: number;
  loan: number;
  price: number;
  lvr: number;
  /** The share would buy more than a lender would actually lend. */
  overCap: boolean;
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
  const personalIns = toNumber(input.ins);
  const extraSpend = toNumber(input.extra);

  /*
   * KiwiSaver comes out of take-home pay, so it comes out here too. It is
   * calculated on gross and deducted after tax, which is how a payslip does it
   * and how a lender reads it — a contribution is not money available to
   * service a mortgage with.
   */
  const kiwi1 = toNumber(input.kiwi1) / 100;
  const kiwi2 = couple ? toNumber(input.kiwi2) / 100 : 0;
  const kiwiMonthly = (inc1 * kiwi1 + inc2 * kiwi2) / 12;
  const netMonthly = (netAnnual(inc1) + netAnnual(inc2)) / 12 - kiwiMonthly;

  /*
   * The benchmark reads off GROSS monthly income, matching how the table was
   * built. Declared spending is floored against it, which is what a lender does
   * with a number someone types about themselves.
   */
  const floor = livingBenchmark((inc1 + inc2) / 12, couple, deps);
  const livingUsed = Math.max(spend, floor);
  const floored = livingUsed > spend;

  /*
   * What they already owe, a month. Cards at 3.8% of the limit — roughly the
   * payment a lender assumes on it, used or not.
   *
   * One figure, used twice: in the servicing test, and against take-home pay
   * beside the mortgage. Card limits briefly stayed out of the second use on
   * the grounds that a limit is not a payment; Lena put them back the same day
   * (2026-09-11) — the same number the lender counts is the one to live with.
   */
  const debtMonthly = cc * CARD_FACTOR + car + stud + other;

  const umi = netMonthly - livingUsed - ratesIns - personalIns - extraSpend - debtMonthly;
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

  /*
   * The whole deposit goes into the purchase. Settlement costs — lawyer, LIM,
   * a builder's report — are real money, but they are not quietly taken off
   * the deposit here. Bank cashback commonly covers some or all of them, how
   * much is a lender-by-lender question, and a deduction nobody can see on
   * screen is worse than no deduction at all. The page says it in words.
   */
  const depAvail = Math.max(0, deposit);

  /*
   * The price at a deposit level is whichever of two limits bites first:
   *
   *   the loan plus the whole deposit   — the most the income can reach, or
   *   the deposit divided by the level  — the most that deposit is enough for.
   *
   * The deposit is never held back to hit a ratio, so the loan is always the
   * price less the deposit, and price = loan + deposit reconciles on screen.
   */
  const tierFor = (pct: number): Tier => {
    /*
     * The rounding hangs off the loan, not the price. Rounding the price down
     * instead left the loan on an income-capped row $500 above the maximum
     * loan quoted at the top of the same panel — true to the cent, and
     * nonsense to read.
     */
    const incomeLoan = down1k(maxLoan);
    const byIncome = incomeLoan + depAvail;
    const byDeposit = down1k(depAvail / pct);
    const cappedBy = byIncome <= byDeposit ? "income" : "deposit";
    const price = Math.min(byIncome, byDeposit);
    const loan = cappedBy === "income" ? incomeLoan : Math.max(0, price - depAvail);
    const depositPct = price > 0 ? depAvail / price : 0;
    return {
      pct,
      label: `${Math.round(pct * 100)}% deposit`,
      price,
      loan,
      deposit: depAvail,
      depositPct,
      cappedBy,
      lvr: price > 0 ? loan / price : 0,
      lowEquity: depositPct < 1 - STD_LVR,
      redundant: false,
    };
  };

  const tiers = DEPOSIT_TIERS.map(tierFor);

  /*
   * Levels are biggest deposit first, so a level matching the one above it is
   * the redundant one — putting less down bought nothing.
   */
  for (let i = 1; i < tiers.length; i += 1) {
    if (tiers[i].price === tiers[i - 1].price) tiers[i].redundant = true;
  }

  /*
   * The row to lead with is simply the biggest price on offer. With a thin
   * deposit that is the 5% row; with a healthy one every row is capped by
   * income and they are all the same, so the strict comparison leaves the 20%
   * row highlighted — the one that costs least to borrow at.
   */
  const best = tiers.reduce((a, b) => (b.price > a.price ? b : a));

  // Kept for the check script, which rebuilds the original file's headline
  // price from these two and holds the servicing engine to it.
  const priceByIncome = avail > 0 ? maxLoan + depAvail : 0;
  const priceByDeposit = depAvail / (1 - STD_LVR);
  const depositBinds = priceByDeposit < priceByIncome;

  const blocked = avail <= 0 || depAvail <= 0;
  const shortfall = MIN_SURPLUS - umi;

  /** True when the loan, not the deposit, is what stops every row. */
  const incomeCapsAll = tiers.every((t) => t.cappedBy === "income");
  const tier20 = tiers[0];

  /*
   * What another $10,000 of deposit is worth — and only ever quoted against a
   * row the deposit is actually capping. On an income-capped row it is worth
   * $10,000 and nothing more: the loan does not move, so the price cannot.
   */
  const savingTier = best.cappedBy === "deposit" ? best : tier20.cappedBy === "deposit" ? tier20 : null;
  const leverage = savingTier ? down1k(10_000 / savingTier.pct) : 0;

  /** "a 20% deposit" but "an 11% deposit". */
  const pctPhrase = (fraction: number) => {
    const whole = Math.round(fraction * 100);
    return `${whole === 8 || whole === 11 || whole === 18 ? "an" : "a"} ${whole}% deposit`;
  };

  // ----- verdict -----
  let title: string;
  const body: string[] = [];

  if (depAvail <= 0) {
    title = "Start with the deposit";
    body.push(
      "There's no deposit in these numbers yet, so there's no price to put against your income. Count everything you could put in: savings, your KiwiSaver balance, help from family, anything you'd sell.",
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
        `We've also used ${money(livingUsed)} a month for living costs rather than the ${money(spend)} you entered. That's the minimum a household your size is assessed on.`,
      );
    }
    /*
     * The six-times cap is only the story when it is what actually stops the
     * answer. A high earner with a very thin deposit hits the cap on paper and
     * the deposit in practice, and telling them their income is the ceiling
     * when $2,000 is buying them a $40,000 house reads as nonsense.
     */
  } else if (dtiBinds && best.cappedBy === "income") {
    title = "Six times your income is your cap";
    body.push(
      `Your budget could cover repayments on about ${money0(servLoan)}, but there is a limit on how much lending above six times income banks are allowed to write, so that is where we stop. On ${money0(gross)} between you, that caps the loan at ${money0(maxLoan)} — around ${money(best.price)} once your deposit goes in, at ${pctPhrase(best.depositPct)}.`,
    );
    if (tier20.cappedBy === "deposit") {
      body.push(
        `With a full 20% deposit you'd be shopping at ${money(tier20.price)} instead. Same income, same loan on offer — the deposit is what decides which of those two prices you're actually looking at.`,
      );
    }
    body.push(
      "Raising income moves this number; saving harder mostly doesn't. It's also the limit with the most exceptions attached, which makes it worth a proper conversation.",
    );
  } else if (incomeCapsAll) {
    title = "Your income sets the ceiling, not your deposit";
    body.push(
      `You can borrow about ${money0(maxLoan)}. With your ${money(depAvail)} deposit that's a purchase price of around ${money(best.price)} — ${pctPhrase(best.depositPct)}, so the deposit rules aren't what's stopping you.`,
    );
    body.push(
      "Saving more from here buys you a better loan rather than a bigger one: less borrowed, a lower rate band, a smaller repayment. What lifts the loan itself is income, spending, and anything you already owe.",
    );
    if (debtMonthly > 0) {
      const lost = pv(mTest, n, debtMonthly);
      body.push(
        `Your existing repayments of ${money(debtMonthly)} a month cost you roughly ${money0(lost)} of borrowing power.${cc > 0 ? ` Card limits alone account for ${money0(pv(mTest, n, cc * CARD_FACTOR))} of that — whether or not you use them.` : ""}`,
      );
    }
  } else if (tier20.cappedBy === "deposit" && best.price > tier20.price) {
    title = "Your deposit decides which door you go through";
    body.push(
      `A full 20% deposit holds you to ${money(tier20.price)} — that's simply what ${money(depAvail)} is 20% of. Your income supports a loan of about ${money0(maxLoan)}, which is around ${money(best.price)} once your deposit goes in, at ${pctPhrase(best.depositPct)}.`,
    );
    body.push(
      `Twenty percent is still the cheapest way to borrow — no low-equity margin, the best rate cards, every lender in play. Going under it is a real option, not a free one. Staying at 20%, every ${money(10_000)} more you save adds about ${money(leverage)} to what you can buy.`,
    );
    if (debtMonthly > 0) {
      body.push(
        `Your repayments of ${money(debtMonthly)} a month aren't the problem here — you have income to spare. Save first; tidy the debt closer to applying.`,
      );
    }
  } else {
    title = "Your deposit is what's holding you back";
    body.push(
      `Your income supports a loan of about ${money0(maxLoan)}. Your deposit is what caps you — even at ${Math.round(best.pct * 100)}% down it stops at ${money(best.price)}.`,
    );
    body.push(
      `At that level every ${money(10_000)} you save adds roughly ${money(leverage)} to what you can buy. Saving is the highest-leverage thing you can do right now — nothing else moves this number as fast.`,
    );
    if (floored) {
      body.push(
        `Note we've used ${money(livingUsed)} a month for living costs, not the ${money(spend)} you entered. That's the floor a household your size is assessed against.`,
      );
    }
  }

  /*
   * What each share of take-home pay buys, at the rate they expect to pay
   * rather than the 7% test — this is the repayment they would actually make,
   * not the one a lender stress-tests.
   *
   * Capped at the maximum loan: a comfortable share is not an offer, and a row
   * quoting more than any lender would write is a fantasy. When the cap bites,
   * `overCap` says so.
   *
   * The share is of ALL repayments (Lena, 2026-09-11). A mortgage at 30% of pay
   * beside a car loan at 15% is a household at 45%, and a row calling that
   * "comfortable" is the exact trap this table exists to catch. So cards and
   * loans come off the share first and the mortgage gets what is left.
   */
  const levels: AffordLevel[] = AFFORD_SHARES.map((share) => {
    const payment = Math.max(0, netMonthly * share - debtMonthly);
    const rawLoan = avail > 0 && payment > 0 ? pv(expRate / 12, n, payment) : 0;
    const loan = down1k(Math.min(rawLoan, maxLoan));
    const price = loan + depAvail;
    return {
      share,
      label: shareBand(share).label,
      payment,
      loan,
      price,
      lvr: price > 0 ? loan / price : 0,
      overCap: rawLoan > maxLoan,
    };
  });

  const payAtRate = pmt(expRate / 12, n, best.loan);
  const payAtTest = pmt(mTest, n, best.loan);

  /*
   * What the repayment takes out of what actually lands in the bank account.
   *
   * This is the counterweight to a maximum loan. A ceiling is a true number and
   * a terrible target: at the top of the range the repayment can be most of
   * take-home pay, and nothing else on the page says so.
   */
  const shareAtRate = netMonthly > 0 ? payAtRate / netMonthly : 0;
  const shareAtTest = netMonthly > 0 ? payAtTest / netMonthly : 0;

  /*
   * The same, with their cards and loans on top — and this is the figure that gets
   * the Comfortable-to-High-risk label, on screen, in the caution and in the
   * email. A mortgage at 30% can sit in a household paying out 50%.
   *
   * Whole percentages, rounded ONCE here, for two reasons. The loans figure is
   * the total less the mortgage, so the three numbers on screen always add up
   * rather than landing a point apart after separate rounding. And the band is
   * read off the rounded total, so "30%" never sits beside "Manageable" on a
   * scale whose Comfortable box says "to 30%".
   */
  const mortgagePct = Math.round(shareAtRate * 100);
  const allPct = netMonthly > 0 ? Math.round(((payAtRate + debtMonthly) / netMonthly) * 100) : 0;
  const repaymentShare = {
    mortgage: mortgagePct,
    loans: allPct - mortgagePct,
    all: allPct,
    allAtTest: netMonthly > 0 ? Math.round(((payAtTest + debtMonthly) / netMonthly) * 100) : 0,
    band: shareBand(allPct / 100),
  };

  /*
   * What is left of take-home pay once the mortgage and everything already
   * owed have come off — the money that pays for actually living. At the rate
   * they expect and at the 7% test, because a rate rise only ever comes out of
   * this. `pct` is the rest of the same rounded 100, so the bar on screen adds
   * up to exactly the figures beside it.
   */
  const leftToLive = {
    atRate: Math.max(0, netMonthly - payAtRate - debtMonthly),
    atTest: Math.max(0, netMonthly - payAtTest - debtMonthly),
    pct: Math.max(0, 100 - allPct),
  };

  /*
   * The counterweight to a maximum, and it now runs at every level rather than
   * only above 40% of take-home pay.
   *
   * A ceiling is a true number and a terrible target. The old version stayed
   * silent when the share was comfortable, which meant the one screen that
   * quotes a maximum said nothing about whether to take it in exactly the cases
   * where someone feels safest reading it. It always says it now; only the
   * second half changes with the band.
   */
  const caution = blocked
    ? null
    : {
        /* The point, in one sentence, set in bold on screen. */
        lead: "This is what a lender could stretch to, not what you should take on.",
        /*
         * One line, not a paragraph. The long version said the same thing four
         * ways and nobody read it; what matters is the share and where to look.
         */
        /*
         * Shortened on Lena's call (2026-09-11). The band closes it as a
         * one-word label, the way it reads on the badge further down.
         */
        detail: `Repayments would take ${repaymentShare.all}% of your take-home pay. ${repaymentShare.band.label}.`,
      };

  /*
   * Two paragraphs, hard. Everything the verdict used to carry as a third and
   * fourth paragraph is either in a figure on screen or in the one explainer at
   * the foot of the results.
   */
  const verdict = body.slice(0, 2);

  return {
    blocked,
    depAvail,
    netMonthly,
    kiwiMonthly,
    kiwi1,
    kiwi2,
    shareAtRate,
    shareAtTest,
    debtMonthly,
    repaymentShare,
    leftToLive,
    maxLoan: down1k(maxLoan),
    servLoan,
    dtiLoan,
    dtiBinds,
    tiers,
    levels,
    best,
    incomeCapsAll,
    leverage,
    expRate,
    payAtRate,
    payAtTest,
    priceByIncome: Math.max(0, priceByIncome),
    priceByDeposit: Math.max(0, priceByDeposit),
    depositBinds,
    headline:
      depAvail <= 0
        ? "No deposit in these numbers yet"
        : "Not there on these numbers yet",
    title,
    body: verdict,
    caution,
  };
}
