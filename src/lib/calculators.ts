/**
 * The one place the /calculators section is described.
 *
 * Two switches, deliberately separate:
 *
 *   CALCULATORS_LIVE  gates the whole section — the hub page, the menu item
 *                     and the sitemap entries.
 *   calculator.live   gates one calculator. A calculator with `live: false`
 *                     is built but not announced: its page 404s in production
 *                     and it never appears on the hub or in the menu.
 *
 * Both always render when running locally, so unfinished work can be reviewed
 * before anyone else can reach it.
 *
 * Why per-calculator and not one flag: Rent vs Buy is finished and staying
 * dark for now, so publishing the other two cannot be allowed to drag it out
 * with them.
 */

export type CalculatorSlug = "what-can-i-buy" | "repayments" | "split-loan" | "rent-vs-buy";

export type Calculator = {
  slug: CalculatorSlug;
  /** Card heading on the hub, and the menu row. */
  title: string;
  /** One line under the title on the hub card. */
  blurb: string;
  /** Shorter line for the navbar dropdown, where the column is narrow. */
  menuBlurb: string;
  live: boolean;
};

export const CALCULATORS_LIVE = true;

export const CALCULATORS: Calculator[] = [
  {
    slug: "what-can-i-buy",
    title: "What can I actually buy?",
    blurb:
      "Put in what you earn, what you spend and what you have saved. You get a realistic price — and the one thing standing between you and a bigger one.",
    menuBlurb: "A realistic price, and what is capping it",
    live: true,
  },
  {
    slug: "repayments",
    title: "Mortgage repayments",
    blurb:
      "Weekly, fortnightly or monthly — and what paying a little extra each time actually takes off the term and the interest.",
    menuBlurb: "What it costs, and what extra payments save",
    live: true,
  },
  {
    slug: "split-loan",
    title: "Split home loan",
    blurb:
      "Split a loan into three parts, each with its own rate, term and extra repayment, and see the combined cost and the weighted average rate across the whole structure.",
    menuBlurb: "Three parts, three rates, one real cost",
    live: true,
  },
  {
    slug: "rent-vs-buy",
    title: "Rent vs buy",
    blurb:
      "How long you would have to stay for buying to come out ahead, and what the money would have done instead.",
    menuBlurb: "Where the two actually cross over",
    live: false,
  },
];

/** Calculators that may be shown to the public, in hub and menu order. */
export function liveCalculators(): Calculator[] {
  return CALCULATORS.filter((c) => c.live);
}

export function getCalculator(slug: string): Calculator | undefined {
  return CALCULATORS.find((c) => c.slug === slug);
}

export function calculatorHref(slug: CalculatorSlug): string {
  return `/calculators/${slug}`;
}

/**
 * Whether a calculator page should render at all. Local development ignores
 * both switches so the work is reviewable; production honours them.
 */
export function calculatorVisible(slug: string): boolean {
  if (process.env.NODE_ENV === "development") return true;
  const calculator = getCalculator(slug);
  return Boolean(CALCULATORS_LIVE && calculator?.live);
}
