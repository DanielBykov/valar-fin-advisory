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

/** Named here, mapped to components on the hub — this file stays icon-free. */
export type CalculatorIconKey = "home" | "trending-down" | "split" | "scale";

export type Calculator = {
  slug: CalculatorSlug;
  /** Card heading on the hub, and the menu row. */
  title: string;
  /**
   * One line under the title on the hub card — and the same sentence the page
   * itself opens with. Keep them identical: a card that promises one thing and
   * a hero that says another is the drift this replaced.
   */
  blurb: string;
  /**
   * The card icon on the hub. One per calculator, because three identical
   * calculator glyphs in a row tell the eye nothing about which is which.
   */
  icon: CalculatorIconKey;
  /** Shorter line for the navbar dropdown, where the column is narrow. */
  menuBlurb: string;
  live: boolean;
};

export const CALCULATORS_LIVE = true;

/*
 * Hub and menu order. Lena's call (2026-09-14): simplest first, and the
 * borrowing calculator last among the live ones because it asks the most of
 * the visitor.
 */
export const CALCULATORS: Calculator[] = [
  {
    slug: "repayments",
    title: "Mortgage repayments",
    blurb:
      "Set the loan, the rate and the term. Then add your extra and see what it saves.",
    menuBlurb: "What it costs, and what extra payments save",
    icon: "trending-down",
    live: true,
  },
  {
    slug: "split-loan",
    title: "Split home loan",
    blurb:
      "Splitting isn't about chasing the best rate. It's about spreading the risk.",
    menuBlurb: "Three parts, three rates, one real cost",
    icon: "split",
    live: true,
  },
  {
    slug: "what-can-i-buy",
    title: "How much can I borrow?",
    blurb:
      "Run your numbers to see what your income, deposit and commitments support.",
    menuBlurb: "Your maximum loan, and what it buys",
    icon: "home",
    live: true,
  },
  {
    slug: "rent-vs-buy",
    title: "Rent vs buy",
    blurb:
      "How long you would have to stay for buying to come out ahead, and what the money would have done instead.",
    menuBlurb: "Where the two actually cross over",
    icon: "scale",
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
