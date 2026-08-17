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
  // Label only — the key stays `guides` so no article data has to change.
  // "Explained" covers general how-it-works pieces as well as step-by-step guides.
  guides: "Explained",
  market: "Market",
  "case-studies": "Case Studies",
  "first-home": "First Home",
};

export const TAG_ORDER: InsightTag[] = ["guides", "market", "case-studies", "first-home"];

export type ArticleBlock =
  | { type: "lede"; text: string }
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] }
  /** Boxed aside the reader must not miss. One or two per article, no more. */
  | { type: "callout"; label: string; text: string }
  /** Full-width emphasis line — the sentence where the argument turns. One per article. */
  | { type: "pull"; text: string }
  /**
   * Anonymised worked example. `question` is the point, pulled out and set large
   * so it survives a skim; `text` is what actually gets decided and why.
   */
  | { type: "case"; label: string; question: string; text: string }
  /** Two (or more) side-by-side options, each on its own stripe. */
  | { type: "tracks"; items: { title: string; text: string }[] }
  /** Term-and-definition rows on a grey panel. For qualities, criteria, checklists. */
  | { type: "deflist"; items: { term: string; text: string }[] }
  /** In-article image. `src` is a path under /public, e.g. "/images/adviser-client.png". */
  | { type: "figure"; src: string; alt: string; caption?: string };

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  tag: InsightTag;
  /** ISO date, e.g. "2026-08-20" */
  published: string;
  /** Small topic chips shown on the article page. Display only — filtering uses `tag`. */
  topics?: string[];
  /** Thumbnail for the article card on /insights and in Related reading. */
  image?: { src: string; alt: string };
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
    title: "What a mortgage adviser actually does, and whether you need one",
    excerpt:
      "The paperwork is the smallest part of it. What comparison, lending policy and loan structure actually change, plus the two questions almost nobody asks.",
    tag: "guides",
    published: "2026-08-27",
    topics: ["Mortgage advice", "Choosing an adviser", "Loan structure", "Fees & commission"],
    // Finished and approved by Lena, 2026-08-17.
    image: {
      src: "/images/adviser-client.png",
      alt: "An adviser sitting across a table from a couple, pointing at printed figures and charts between them",
    },
    readingMinutes: 6,
    draft: false,
    body: [
      {
        type: "lede",
        text: "It's a fair question: what's my actual benefit here? Is a mortgage adviser just someone who collects my documents and forwards them to the bank, or is there something more I'm getting out of this?",
      },
      {
        type: "p",
        text: "Short answer: the paperwork is the smallest part of it. Here's what a professional mortgage adviser actually adds, and how to tell which kind of help you need.",
      },

      { type: "h2", text: "Whose side are they actually on?" },
      {
        type: "p",
        text: "A bank's mortgage manager can only sell you that bank. A mortgage adviser compares several, and has to put in writing what they're recommending and how they're paid. That one difference decides everything downstream: which lenders get compared, and what gets flagged before you sign rather than after.",
      },

      { type: "h2", text: "Access across a panel of lenders" },
      {
        type: "p",
        text: "An adviser isn't tied to one lender's product shelf. Nobody in New Zealand is accredited with every lender, so ask which ones. It should be a straight answer. But good access means your options get compared properly instead of measured against a single bank's offer.",
      },

      { type: "h2", text: "A live read on the market" },
      {
        type: "p",
        text: "Rates, lending policy, and bank appetite shift constantly, sometimes week to week. A professional is tracking that in real time, not quoting you last quarter's numbers.",
      },
      {
        type: "p",
        text: "And not all of it is public. Some pricing and some lender products never appear on a website. They sit in the adviser channel, and you'd have no way of knowing to ask for them.",
      },

      { type: "h2", text: "Knowing how to structure a loan, not just apply for one" },
      {
        type: "p",
        text: "Split loans, offset accounts, staged drawdowns: the tools exist. The value is knowing when using one actually saves you money, and when it's just complexity for its own sake.",
      },

      { type: "h2", text: "And how they get paid" },
      {
        type: "p",
        text: "Worth asking, and most people don't. On most home loans in New Zealand the lender pays the adviser a commission when the loan settles, so you don't pay a fee. Some cases do carry one: complex structures, commercial or short-term lending. Either way it comes to you in writing before you commit to anything.",
      },
      {
        type: "callout",
        label: "Ask this before you sign",
        text: "What happens with clawback? If the loan is repaid or refinanced early, the lender takes that commission back off the adviser. Many adviser agreements allow that cost to be passed on to you. Not everyone passes it on, but it's in the paperwork you sign, and it's a much better thing to understand at the start than to discover two years later when you want to move your loan.",
      },

      {
        type: "pull",
        text: "That's the baseline. It isn't yet what makes one worth going out of your way for.",
      },

      { type: "h2", text: "Two ways to work with an adviser" },
      {
        type: "p",
        text: "Not everyone wants the same thing from this relationship, and that's fine. Roughly, clients fall into two groups.",
      },
      {
        type: "tracks",
        items: [
          {
            title: "The fast track",
            text: "You know what you want, whether that's buying this home or refinancing this loan, and you want it done well and quickly, without a long strategy conversation. A professional should be able to do this cleanly, with no extra process tacked on.",
          },
          {
            title: "The strategic route",
            text: "You want to understand not just this loan, but where it fits into the next several years of your finances. This is where an adviser's real value shows up.",
          },
        ],
      },
      {
        type: "p",
        text: "Neither is the “right” way to do this. It depends on what you actually need right now. You can also start on the fast track and move into strategy later, once the first purchase or refinance is settled.",
      },

      {
        type: "figure",
        src: "/images/adviser-client.png",
        alt: "An adviser sitting across a table from a couple, pointing at printed figures and charts between them",
      },

      { type: "h2", text: "What the strategic route actually looks like" },
      {
        type: "p",
        text: "If you want to go further than a single transaction, here's what a proper strategy conversation covers:",
      },
      {
        type: "list",
        items: [
          "Is this the right house for the next several years, or the next twenty? A loan that fits your budget now can look very different if your circumstances or the market shift. How far ahead you need to look is your call, not a standard three-year answer.",
          "What happens if rates rise? Not a vague worry, an actual number. You should be able to see, in dollars, what a rate increase does to your repayments.",
          "Several structures, compared side by side. A professional builds more than one version of your loan and shows you what each one actually costs, not just the headline rate.",
          "Your maximum realistic cost. Knowing the ceiling, not just the current payment, is what lets you plan around it instead of being surprised by it.",
          "A plan for what comes after settlement. Relocating the loan when you move, adding a renovation or green loan, refinancing as your situation changes: these should be planned for in advance, not figured out under pressure later.",
        ],
      },
      {
        type: "case",
        label: "In practice: a family with a mid-sized deposit",
        question:
          "Buy now at a higher price with a smaller deposit, or wait, build the deposit to 20%, and buy differently?",
        text: "The answer isn't really about the house. It moves with their income and how secure it is, what they want the next several years to look like, and where rates and the market are heading. There isn't one right answer here. There is a number attached to each option, and a conversation about which one they can actually live with.",
      },
      {
        type: "case",
        label: "In practice: an investor planning a renovation",
        question:
          "Which lender, and how should the loan be split so the renovation can be funded later without breaking the structure?",
        text: "Lenders differ a lot on renovation lending and on releasing equity afterwards, so that choice gets made before the purchase, not after it. How long to fix matters too, given the work is coming. Get it wrong at the start and you pay to unpick it later.",
      },
      {
        type: "p",
        text: "By the end of that process, you're not just holding a mortgage. You understand your own numbers: your opportunities, your risk, and what you'd need to do to pay the loan down faster or restructure it down the track.",
      },

      { type: "h2", text: "Five qualities that separate a professional from a document-forwarder" },
      {
        type: "deflist",
        items: [
          {
            term: "Strategic vision",
            text: "Thinking about where you'll be in ten or twenty years, not just where you are today.",
          },
          {
            term: "Market knowledge",
            text: "Understanding lender behaviour and rate movement well enough to time and structure decisions properly.",
          },
          {
            term: "Analytical ability",
            text: "Turning “what if rates rise” into an actual number you can plan around, not a vague worry.",
          },
          {
            term: "A financial mindset",
            text: "Reading your mortgage as one piece of your broader financial position, not an isolated transaction.",
          },
          {
            term: "Working with information well",
            text: "Synthesising your situation, the market, and the lender's fine print into something you can actually decide from.",
          },
        ],
      },
      {
        type: "p",
        text: "None of this shows up if all an adviser does is submit an application on your behalf. It only shows up when someone is willing to build the fuller picture with you, and tell you honestly when a bigger, more expensive house isn't the better move.",
      },

      { type: "h2", text: "Why work with me" },
      {
        type: "p",
        text: "I built Valar around exactly this idea: clarity as the actual product, not a marketing line. If you just want your loan sorted quickly and well, I'll do that cleanly, without dragging you through more process than you asked for.",
      },
      {
        type: "p",
        text: "But if you want a partner who thinks about your loan the way you'd think about any long-term financial decision, with several structures, risk laid out in real numbers, and a plan for what comes after settlement, that's the work Valar is built for. Twenty years in finance, accounting, business valuation and investment analysis came before the mortgage advice, and that's the lens I bring to your loan. You leave with more than a mortgage: a clear picture of your numbers, your risk, and your options for what's next.",
      },
      {
        type: "p",
        text: "This article is general information only and does not take your personal circumstances into account. It is not personalised financial advice.",
      },
    ],
    takeaways: [
      "The work that changes your outcome is comparison, current lending policy, and a loan structured for the long view. The document handling is the smallest part of it.",
      "An adviser can put your situation in front of several lenders instead of one, which widens the set of options you get to choose between. Ask which lenders they are accredited with.",
      "On most home loans the lender pays the adviser, not you. The clawback terms sit in the same agreement, and they are worth reading before you sign.",
      "Decide which service you actually want. The fast track gets the loan done properly and quickly. The strategic route adds what a rate rise would do to your repayments, several structures costed side by side, your realistic ceiling, and a plan for after settlement. Both are legitimate, and you can start with one and come back for the other.",
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

// FAQ content now lives in content/faqs.md — see src/lib/faqs.ts.

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
