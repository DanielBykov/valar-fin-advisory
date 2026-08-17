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
    title: "Using your KiwiSaver for a first home deposit",
    excerpt:
      "What KiwiSaver is, how the first-home withdrawal works, the rules that catch people out, and the one thing worth checking well before you buy.",
    tag: "first-home",
    published: "2026-08-01",
    topics: ["First home", "KiwiSaver", "Deposit", "Settlement timing"],
    image: {
      src: "/images/kiwisaver-deposit.png",
      alt: "A couple at a table looking at a first home deposit breakdown on a laptop, with KiwiSaver shown as part of the total",
    },
    readingMinutes: 6,
    draft: false,
    body: [
      {
        type: "lede",
        text: "For most first home buyers in New Zealand, KiwiSaver is the largest single piece of the deposit. It is also the piece people understand least well, and the one most likely to hold up a settlement.",
      },

      { type: "h2", text: "What KiwiSaver actually is" },
      {
        type: "p",
        text: "A voluntary retirement savings scheme. You contribute a percentage of your pay, your employer contributes alongside you, and the government adds a smaller annual amount. The money sits in a fund chosen by you and managed by a provider, and it is invested rather than held as cash.",
      },
      {
        type: "p",
        text: "It is locked away until you turn 65. Buying your first home is one of the few exceptions, and it is the reason KiwiSaver matters long before retirement does.",
      },

      { type: "h2", text: "How it works for a first home" },
      {
        type: "p",
        text: "The first-home withdrawal is not government money. It is early access to your own KiwiSaver balance, released early so you can put it toward the deposit on a house you are going to live in.",
      },
      {
        type: "p",
        text: "What you can take out includes your own contributions, your employer's, the government contributions you've received over the years, and the investment returns on all of it.",
      },

      { type: "h2", text: "The rules that decide it" },
      {
        type: "deflist",
        items: [
          {
            term: "Three years in the scheme",
            text: "Counted from the date you joined KiwiSaver, not from your first contribution. If you enrolled and then had years with nothing going in, the clock was still running the whole time.",
          },
          {
            term: "$1,000 has to stay behind",
            text: "You can withdraw everything except a thousand dollars. That balance keeps the account open, so buying a house doesn't end your KiwiSaver membership.",
          },
          {
            term: "You don't currently own property",
            text: "That covers land and a share in a property, not only a house.",
          },
          {
            term: "It has to be your home, and you have to live in it",
            text: "The property must be your main residence in New Zealand, and you sign a statutory declaration, witnessed by a JP or a lawyer, that you intend to live in it for at least six months from settlement. Renting out a room while you live there is fine. Renting out the whole house inside those six months is a breach, and it does get noticed: bond registrations, rental income visible to Inland Revenue, and lenders who ask.",
          },
        ],
      },

      { type: "h2", text: "How and when the money moves" },
      {
        type: "p",
        text: "You apply through your KiwiSaver provider, not through a government agency, and you need a signed sale and purchase agreement before they will process anything. Your solicitor usually runs the application and certifies the details, and the money goes into their trust account rather than to you.",
      },
      {
        type: "p",
        text: "Here is the part that catches people hardest: the deposit and the settlement are two different payments. When your offer goes unconditional you normally have to pay a deposit, often around 10%, within a few days. Settlement, when the rest of the money changes hands and the house becomes yours, is usually weeks later.",
      },
      {
        type: "p",
        text: "KiwiSaver can reach either one, but they need different paperwork from your solicitor. A letter of undertaking on a conditional agreement sends the money toward the deposit. A letter of undertaking on an unconditional agreement puts it toward the purchase price at settlement.",
      },
      {
        type: "p",
        text: "In practice most people receive it at settlement, and the reason is timing. The deposit route needs the application lodged roughly fifteen business days before the deposit falls due, and a deposit is usually payable within a few days of going unconditional. If you want KiwiSaver to cover the deposit, that has to be arranged before you make the offer, not after it is accepted.",
      },
      {
        type: "p",
        text: "Otherwise the first payment comes from your own cash, or from a smaller deposit written into the agreement. Deposit amounts aren't fixed by law, they're negotiated, and where a purchase is being funded largely by KiwiSaver a reduced deposit can sometimes be agreed with the vendor. At auction none of this applies: the deposit falls due on the day, on the auction's terms, and there is no going back.",
      },
      {
        type: "p",
        text: "Providers generally take five to ten business days from a complete application, and incomplete paperwork is the usual reason that stretches. If two of you are buying together, that is two separate applications through two providers, and the slower one sets the pace. You can each withdraw as much or as little as you want, so the two amounts don't have to match.",
      },
      {
        type: "callout",
        label: "Three ways this goes wrong",
        text: "Leaving it too late, which is the costly one. Once settlement happens you are the owner, and the withdrawal can no longer be paid out at all — there is no catching up afterwards. Providers work to around ten business days from a complete application, so start the paperwork when the agreement is signed rather than counting backwards from settlement day. Then: submitting an incomplete application, which is the usual reason a straightforward one stretches. And checking the three-year clock only once you're already negotiating, when there is nothing left to do about it.",
      },

      {
        type: "pull",
        text: "Your KiwiSaver isn't a lump sum waiting for you. It's a moving part of the settlement timeline.",
      },

      { type: "h2", text: "Before you buy, check what your money is invested in" },
      {
        type: "p",
        text: "Start with the number itself, because what your app shows is not what lands in your solicitor's account. Take off the $1,000, and remember that the balance keeps moving with the market right up until the day it is paid out.",
      },
      {
        type: "p",
        text: "That last part is the one worth planning around. KiwiSaver funds are not interchangeable. Growth and aggressive funds hold more shares, which is why they tend to do better over long periods and why they fall further when markets drop. Conservative funds hold more cash and bonds, and move less in both directions.",
      },
      {
        type: "p",
        text: "That difference barely matters when the money has decades to recover. It matters a great deal when you are about to spend it.",
      },
      {
        type: "case",
        label: "Buying within a year",
        question:
          "What happens to a $50,000 balance if markets fall and your fund drops 15% before settlement?",
        text: "It becomes $42,500. The deposit is $7,500 short and there is no time to wait for a recovery, so the realistic outcomes are a smaller house, a larger loan, or a purchase that doesn't happen this year. How far your own fund would move is not the same as how far the market moves — some funds fall further, some barely at all — which is exactly why the fund you are in matters. Illustrative figures only.",
      },
      {
        type: "p",
        text: "So the general principle for a purchase inside a year is not complicated: money you are about to spend does not sit comfortably in a fund that can move 15% while you wait. A more conservative fund gives up some potential return in exchange for a balance that holds still, and when the spending date is close that is usually the trade worth making.",
      },
      {
        type: "p",
        text: "Two things make it worth acting early rather than late. Switching after a fall locks the loss in, so the decision is better made while the choice is still open than in reaction to a bad month. And your own circumstances may point somewhere else entirely — whether your current fund suits your timeframe is a question for your provider, or for an adviser who has your full situation in front of them.",
      },
      {
        type: "figure",
        src: "/images/kiwisaver-deposit.png",
        alt: "A couple at a table looking at a first home deposit breakdown on a laptop, with KiwiSaver shown as part of the total",
      },
      { type: "h2", text: "Before you apply, check these" },
      {
        type: "list",
        items: [
          "Your join date, not your first contribution — that is what starts the three-year clock.",
          "What your provider actually needs: certified ID, proof of address, a copy of the agreement, your solicitor's undertaking, and a statutory declaration witnessed by a JP or lawyer.",
          "Whether KiwiSaver is going toward the deposit or toward settlement, because your solicitor writes a different undertaking for each.",
          "What fund you are in, and whether that still fits how soon you plan to buy.",
          "Your real number: the balance in the app, less the $1,000 that stays behind, and knowing it will still move with the market until the day it is paid.",
        ],
      },

    ],
    takeaways: [
      "The first-home withdrawal is early access to your own KiwiSaver balance, not government money.",
      "Three rules catch people out: three years of membership, counted from when you joined rather than your first contribution; $1,000 has to stay in the account; and you have to live in the home yourself for at least six months.",
      "KiwiSaver can go toward the deposit as well as the settlement, but the deposit route needs about fifteen business days' notice, so it has to be set up before you make the offer. Otherwise that first payment comes from your own cash or from a smaller deposit negotiated into the agreement.",
      "Check what your KiwiSaver is invested in well before you buy. How far a balance can fall in the short term depends on the fund it sits in, and the closer your purchase, the less time there is to recover.",
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
