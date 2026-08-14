/**
 * Insights section — content + config.
 *
 * ─────────────────────────────────────────────────────────────
 * FOR LENA: this file is where articles live. To publish a new
 * article, copy an entry in ARTICLES, change the fields, and set
 * `draft: false`. Nothing else needs touching.
 *
 * `draft: true`  → visible only when running the site locally.
 * `draft: false` → live on the public site.
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Master switch for the whole Insights section.
 * false → /insights and its sub-pages 404 in production, and the
 *         Insights menu stays out of the header.
 * Flip to true when there are at least 3 published articles.
 */
export const INSIGHTS_LIVE = false;

export type InsightTag = "guides" | "market" | "case-studies" | "first-home";

export const TAG_LABELS: Record<InsightTag, string> = {
  guides: "Guides",
  market: "Market",
  "case-studies": "Case Studies",
  "first-home": "First Home",
};

export const TAG_ORDER: InsightTag[] = ["guides", "market", "case-studies", "first-home"];

export type ArticleBlock =
  | { type: "lede"; text: string }
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] };

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  tag: InsightTag;
  /** ISO date, e.g. "2026-08-20" */
  published: string;
  readingMinutes: number;
  draft: boolean;
  body: ArticleBlock[];
  takeaways: string[];
};

/**
 * The three entries below are OUTLINES, not articles — headings to
 * write into. They are all `draft: true`, so none of them can reach
 * the public site until Lena writes the body and flips the flag.
 */
export const ARTICLES: Article[] = [
  {
    slug: "why-two-banks-lend-different-amounts",
    title: "Why two banks lend you different amounts",
    excerpt:
      "Same income, same deposit, two very different answers. What each bank actually tests, and why the gap can be six figures.",
    tag: "guides",
    published: "2026-08-20",
    readingMinutes: 6,
    draft: true,
    body: [
      {
        type: "lede",
        text: "Draft outline — body still to be written. The headings below are the structure; the paragraphs under them are notes, not copy.",
      },
      { type: "h2", text: "The same file, two different answers" },
      { type: "p", text: "Open with a concrete example: one household, two banks, the size of the gap." },
      { type: "h2", text: "What the bank is actually testing" },
      { type: "p", text: "Test rate, living costs, how existing debts are counted, how income types are treated." },
      { type: "h2", text: "What moves your number" },
      { type: "p", text: "The levers a borrower can actually pull, in order of impact." },
      { type: "h2", text: "What to do with a no" },
      { type: "p", text: "One bank's answer is not the market's answer." },
    ],
    takeaways: [
      "Every bank applies its own test rate, and the gap between them is real money.",
      "Existing debts are weighted more heavily than most people expect.",
      "A decline from one lender is one opinion, not a verdict.",
    ],
  },
  {
    slug: "what-a-mortgage-adviser-actually-does",
    title: "What a mortgage adviser actually does — and whether you need one",
    excerpt:
      "Where an adviser changes the outcome, where they don't, and what it costs you to use one.",
    tag: "guides",
    published: "2026-08-27",
    readingMinutes: 5,
    draft: true,
    body: [
      { type: "lede", text: "Draft outline — body still to be written." },
      { type: "h2", text: "What actually happens between enquiry and settlement" },
      { type: "p", text: "The steps, in order, with who does what." },
      { type: "h2", text: "Where an adviser changes the outcome" },
      { type: "p", text: "Structuring, lender fit, presenting a file, handling a decline." },
      { type: "h2", text: "Where they don't" },
      { type: "p", text: "Be honest about this — it builds more trust than the previous section." },
      { type: "h2", text: "What it costs you" },
      { type: "p", text: "Plain answer on how advisers are paid." },
    ],
    takeaways: [
      "Most of the work happens before an application is ever submitted.",
      "Lender fit matters more than rate for anyone with a non-standard file.",
      "Know how your adviser is paid before you start.",
    ],
  },
  {
    slug: "kiwisaver-for-your-deposit",
    title: "Using KiwiSaver for your deposit: what counts and what doesn't",
    excerpt:
      "The withdrawal rules in plain terms, plus the parts people find out about too late.",
    tag: "first-home",
    published: "2026-09-03",
    readingMinutes: 7,
    draft: true,
    body: [
      { type: "lede", text: "Draft outline — body still to be written." },
      { type: "h2", text: "What you can actually withdraw" },
      { type: "p", text: "The rules, stated plainly, with the parts that trip people up." },
      { type: "h2", text: "Timing — the part people get wrong" },
      { type: "p", text: "When to start the process relative to making an offer." },
      { type: "h2", text: "How the bank sees it" },
      { type: "p", text: "How a KiwiSaver withdrawal is treated inside a deposit." },
    ],
    takeaways: [
      "Start the withdrawal process before you need the money, not when.",
      "Not every dollar in the account is withdrawable.",
      "Your KiwiSaver provider's timeline is not the same as your settlement timeline.",
    ],
  },
];

export type Faq = { q: string; a: string };

/** FAQ accordion on the Insights hub. Answers are placeholders — Lena writes these. */
export const FAQS: Faq[] = [
  {
    q: "How much deposit do I actually need?",
    a: "Placeholder — Lena to write. Structure: the general rule first, then the exceptions, then what to do next.",
  },
  {
    q: "Can I use KiwiSaver towards my first home?",
    a: "Placeholder — Lena to write. One paragraph, no jargon, then link through to the full article.",
  },
  {
    q: "Why do two banks lend me different amounts?",
    a: "Placeholder — Lena to write. Short answer here, full explanation in the article of the same name.",
  },
  {
    q: "What does a mortgage adviser cost me?",
    a: "Placeholder — Lena to write. Direct answer, no hedging.",
  },
  {
    q: "Do I need pre-approval before I start looking?",
    a: "Placeholder — Lena to write.",
  },
  {
    q: "How long does the whole process take?",
    a: "Placeholder — Lena to write. Give a realistic range, not a best case.",
  },
];

const byNewest = (a: Article, b: Article) => (a.published < b.published ? 1 : -1);

/** Articles that are live on the public site. */
export function publishedArticles(): Article[] {
  return ARTICLES.filter((a) => !a.draft).sort(byNewest);
}

/** Published articles, plus drafts when running locally, so layout can be reviewed. */
export function visibleArticles(): Article[] {
  const list = process.env.NODE_ENV === "development" ? [...ARTICLES] : ARTICLES.filter((a) => !a.draft);
  return list.sort(byNewest);
}

export function getArticle(slug: string): Article | undefined {
  return visibleArticles().find((a) => a.slug === slug);
}

/** Up to `limit` other articles, preferring the same tag. */
export function relatedArticles(slug: string, limit = 3): Article[] {
  const current = getArticle(slug);
  if (!current) return visibleArticles().slice(0, limit);
  const others = visibleArticles().filter((a) => a.slug !== slug);
  const sameTag = others.filter((a) => a.tag === current.tag);
  const rest = others.filter((a) => a.tag !== current.tag);
  return [...sameTag, ...rest].slice(0, limit);
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
