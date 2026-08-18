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
  /**
   * Small comparison table. Keep it to 2-4 columns: it scrolls sideways on a phone,
   * and anything wider stops being readable there. Every column after the first is
   * right-aligned, on the assumption it holds numbers. `note` sits under the table
   * in small type, for the assumptions behind the figures.
   */
  | { type: "table"; caption?: string; headers: string[]; rows: string[][]; note?: string }
  /**
   * A row of headline numbers and how they moved — the scannable top of a market
   * update. Two to four tiles; past four it stops being scannable, which is the
   * only reason to use this block instead of a table.
   *
   * `delta` is the change since the previous reading ("+0.25", "−1.5%"), and
   * `direction` only picks the arrow glyph. It deliberately does NOT colour the
   * tile green or red: a rate rising is bad for a borrower and good for a saver,
   * so the colour would be lying to half the readers.
   */
  | {
      type: "stats";
      caption?: string;
      items: {
        label: string;
        value: string;
        delta?: string;
        direction?: "up" | "down" | "flat";
        note?: string;
      }[];
    }
  /**
   * One doubt the reader is already having, answered in a fixed shape.
   *
   * The shape is the point: every objection in an article renders identically,
   * so the page can be skimmed by reading only the quotes. Concede first in
   * `fair` — an objection that isn't granted honestly reads as a sales page —
   * then put the counter in `points` as short bullets, not prose.
   */
  | {
      type: "objection";
      /** The doubt in the reader's own words. Rendered large, in quotes. */
      quote: string;
      /** What is genuinely true about it. One or two sentences, no hedging. */
      fair: string;
      /** What the objection misses. Two to four short bullets. */
      points: string[];
      /** Optional one-line bottom line, set in bold under the bullets. */
      bottom?: string;
    }
  /**
   * Side-by-side pros and cons. Two columns is the readable maximum.
   *
   * Deliberately no green/red: this block compares two legitimate choices, and
   * colouring one side "good" would be editorialising. Plus and minus glyphs
   * carry the meaning instead.
   */
  | {
      type: "proscons";
      caption?: string;
      columns: { title: string; pros: string[]; cons: string[] }[];
    }
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
    slug: "rent-vs-buy-what-youre-actually-deciding",
    title: "Rent vs buy: what you're actually deciding",
    excerpt:
      "Renting is cheaper. That part is usually true, and it settles nothing. The comparison that matters isn't this month against this month, and it isn't really about the money at all.",
    tag: "first-home",
    published: "2026-08-18",
    topics: ["First home", "Rent vs buy", "Long-term planning", "How to decide"],
    image: {
      src: "/images/first-home-2.webp",
      alt: "A couple carrying moving boxes through the front door of their first home",
    },
    readingMinutes: 5,
    // Rewritten 2026-08-18: no worked figures anywhere in the body. Every number
    // in this decision is case-by-case, so the article carries the principle and
    // the numbers belong in a calculator and in a conversation, not in the copy.
    draft: true,
    body: [
      {
        type: "lede",
        text: "Renting is cheaper than buying. That part isn't really in dispute, and I'm not going to try to talk you out of it. What I want to argue with is the idea that it settles anything.",
      },
      {
        type: "p",
        text: "Right now, this month, renting almost certainly costs you less than owning the same house. Lower outgoings, more cash in your pocket, and someone else's problem when the hot water cylinder gives up. All true. And none of it tells you anything about where either path leaves you, which is the decision you're actually making.",
      },

      { type: "h2", text: "The comparison everyone runs, and why it settles nothing" },
      {
        type: "p",
        text: "Rent this month against mortgage repayments this month. One number is smaller, so that's that. The trouble is that this comparison answers a question about one month, and then gets used to decide something that plays out over decades.",
      },
      {
        type: "p",
        text: "It also quietly compares two things that aren't the same kind of thing. Rent is a price: you pay it, it's gone, and you've bought a month of living somewhere. A mortgage repayment is a price plus a transfer. Part of it is the cost of borrowing, and part of it moves from one pocket of yours into another. Put the two totals side by side and that distinction disappears, which is exactly why the comparison flatters renting.",
      },

      { type: "h2", text: "The strongest argument for renting, taken seriously" },
      {
        type: "p",
        text: "The best case against buying isn't “rent is cheaper”. It's sharper than that: rent for less, invest the difference every month, and let compounding do the work a mortgage does, without the maintenance, the rates, or the commitment.",
      },
      {
        type: "p",
        text: "That's a real argument. Run properly, it can beat buying, and anyone in my industry who waves it away is selling you something. So let me be straight about where it actually breaks, because it isn't where people expect.",
      },

      {
        type: "pull",
        text: "The plan doesn't fail on the arithmetic. It fails because the difference it depends on doesn't stay the same size.",
      },

      { type: "h2", text: "The asymmetry almost nobody prices in" },
      {
        type: "p",
        text: "Rent resets. It's a price set by the market, renegotiated for as long as you rent, and it climbs with wages and the cost of living. That's not a landlord being difficult. It's what a market price does.",
      },
      {
        type: "p",
        text: "A principal-and-interest mortgage behaves the opposite way. The debt is fixed in dollars from the day you sign. Rates move your repayment around inside that, sometimes uncomfortably, and that's worth planning for properly. But the debt itself never grows because life got more expensive, and inflation quietly eats away at what those dollars are really worth. You end up repaying a shrinking real amount with a growing nominal income.",
      },
      {
        type: "p",
        text: "Follow that through and you get the part that changes the decision. The gap between rent and repayments, the surplus that the whole “invest the difference” plan runs on, is not a constant. It narrows every time the rent resets upward. Eventually it closes. After that there is no difference left to invest, and the renter is the one finding extra money every year just to stay exactly where they are.",
      },
      {
        type: "p",
        text: "That point arrives earlier than most people assume, and it arrives quietly. Nobody sends you a letter the year your strategy stops working.",
      },

      { type: "h2", text: "What each side actually carries" },
      {
        type: "p",
        text: "Both paths have costs people leave out of the story they tell themselves. Here they are, honestly.",
      },
      {
        type: "tracks",
        items: [
          {
            title: "What renting really carries",
            text: "A price that resets for as long as you rent, and no claim on anything at the end of it. In exchange you get genuine mobility, no maintenance risk, no exposure if the market falls, and your deposit stays liquid and invested rather than locked in a house. That flexibility is worth real money, and it's a legitimate thing to choose.",
          },
          {
            title: "What owning really carries",
            text: "Rates, insurance, maintenance and sometimes body corporate fees, none of which a renter pays directly. Real money to get in and real money to get out, which is punishing over a short horizon. And genuine risk: values can fall, and a forced sale in a bad year is how people actually get hurt. In exchange you get a base that stops resetting, and a debt that shrinks in real terms whether you pay attention or not.",
          },
        ],
      },
      {
        type: "callout",
        label: "The part that rarely gets mentioned",
        text: "Investment returns get taxed as they're earned, so the return you see quoted isn't the return that reaches you. The gain on the home you actually live in generally isn't taxed at all in New Zealand. That asymmetry sits quietly underneath every rent-versus-buy comparison you'll read online, and almost none of them account for it.",
      },

      { type: "h2", text: "So what actually decides it" },
      {
        type: "p",
        text: "Not the asset. Four things about you, and you already know most of your own answers.",
      },
      {
        type: "deflist",
        items: [
          {
            term: "Your timeframe",
            text: "Buying costs real money to enter and to exit. Over a short horizon that drag dominates everything else and renting usually wins outright. Stretch the horizon and the same costs become almost irrelevant. This is the single biggest factor, and it's the one people skip.",
          },
          {
            term: "Your discipline",
            text: "The renting case depends on investing a shrinking surplus, every month, for years, through a bad patch and a broken car and a better holiday. A mortgage doesn't ask permission. That's precisely what makes it a reliable wealth-builder for most people rather than a worse one, and it's the variable people overestimate about themselves.",
          },
          {
            term: "Your stability",
            text: "If a job or a relationship could move you in the next couple of years, flexibility has real value and a mortgage fits it badly. Loans can be moved, refinanced and structured with that risk in mind, so it's friction rather than a cage. But it's friction you'd be taking on deliberately.",
          },
          {
            term: "What you believe about the future",
            text: "Every version of this comparison rests on assumptions about property values, returns and rents. Nobody knows those. Anyone who tells you otherwise is guessing with confidence. The useful move is knowing which assumptions your plan depends on, so you notice when they stop being true.",
          },
        ],
      },

      { type: "h2", text: "What are you building?" },
      {
        type: "p",
        text: "The question was never which is cheaper this month. It's what you want to be holding at the end of the next stretch of your life, and which path you'll actually stay on when it gets boring.",
      },
      {
        type: "p",
        text: "For some people, right now, the honest answer is flexibility, and renting is exactly how you get it. For others it's a base that stops moving, and a mortgage is the most reliable forced-savings plan ever invented, precisely because it isn't optional. For plenty of people it's both, at different points. The useful thing is working out which season you're actually in, rather than defaulting to whichever answer is loudest online.",
      },
      {
        type: "p",
        text: "What I'd push back on is drifting. “I'll wait for a better time” is sometimes exactly right, and it's only ever obvious in hindsight. Meanwhile the rent gets paid either way. Waiting isn't free. It just never sends you a bill you notice.",
      },

      { type: "h2", text: "Where the numbers come in" },
      {
        type: "p",
        text: "You'll have noticed there are no figures in this article. That's deliberate. Every number that matters here is yours: your deposit, your rate, your rent, your income and how secure it is, how long you'd realistically stay put, and what your local market does rather than the national average. Published comparisons run on medians, and a median describes nobody in particular. Plug your own numbers into the same argument and the answer can land the other way.",
      },
      {
        type: "p",
        text: "That's the part worth doing properly, and it isn't complicated once someone lays it out. If you want to see your version, with the assumptions written down where you can push back on them, that's the conversation I like having. No pre-decided answer, no pressure. Just a clear view of where you'd stand either way.",
      },
    ],
    takeaways: [
      "Renting is cheaper than owning right now. That's usually true, and on its own it decides nothing: it compares one month to one month, and it compares a pure cost to a cost plus a transfer into something you own.",
      "The “rent and invest the difference” strategy is a serious argument, and its weak point isn't the maths. Rent resets upward with the market while a principal-and-interest debt stays fixed in dollars, so the surplus the plan runs on shrinks every year and eventually disappears.",
      "Both sides carry costs people leave out: for renting, a price that never stops resetting and nothing owned at the end; for owning, rates, insurance, maintenance, real entry and exit costs, and genuine risk if you sell too soon or in a bad year.",
      "What decides it is your timeframe, your discipline, your stability and what you assume about the future. Not which asset is better in the abstract.",
      "The numbers that matter are yours, not the national median. Run your own before you conclude anything.",
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
  {
    slug: "market-update-august-2026",
    title: "Market Update AUG 26: Rates are going up. House prices aren't.",
    excerpt:
      "The OCR rose for the first time in three years, every main bank repriced, and unemployment hit a twelve-year high. Where the numbers sit, and what is driving them.",
    tag: "market",
    published: "2026-08-18",
    topics: ["Market update", "OCR", "Fixed rates", "Property values", "Election 2026"],
    // Series image — reused by every monthly market update. Card thumbnail,
    // social/link preview, and the mid-article figure below all point at this one file.
    image: {
      src: "/images/market-update.png",
      alt: "A woman looking at property listings in a real estate agency window on a New Zealand city street",
    },
    readingMinutes: 7,
    draft: true,
    body: [
      {
        type: "lede",
        text: "Rates are rising while property values fall and unemployment climbs. That is an uncomfortable combination, and it is not the one most households were planning for a year ago. Here is where the numbers sit as at 18 August 2026, and what is pushing them.",
      },

      { type: "h2", text: "The Official Cash Rate" },
      {
        type: "stats",
        items: [
          {
            label: "OCR now",
            value: "2.50%",
            delta: "0.25 on 9 July",
            direction: "up",
            note: "First increase in three years",
          },
          {
            label: "A year ago",
            value: "3.00%",
            note: "August 2025 — higher than today, despite July's rise",
          },
          { label: "Next review", value: "2 Sep", note: "Monetary Policy Statement" },
          {
            label: "By December",
            value: "~3.00%",
            delta: "0.50 further",
            direction: "up",
            note: "Where all five main banks see it",
          },
        ],
      },
      {
        type: "p",
        text: "The Reserve Bank raised the OCR by 25 basis points on 9 July, after holds in February and April. The Committee described the previous 2.25% setting as below neutral — stimulating an economy that no longer needed it — and signalled further increases were likely, without committing to when.",
      },
      { type: "h2", text: "Where mortgage rates sit" },
      {
        type: "table",
        caption: "Advertised special rates, 20% deposit",
        headers: ["Bank", "1 year", "2 years", "3 years"],
        rows: [
          ["ANZ", "4.99%", "5.49%", "5.59%"],
          ["ASB", "4.99%", "5.45%", "5.45%"],
          ["BNZ", "4.99%", "5.45%", "5.45%"],
          ["Kiwibank", "4.95%", "5.39%", "5.49%"],
          ["Westpac", "4.99%", "5.45%", "5.39%"],
        ],
        note: "As at early August 2026. Special rates require 20% equity; rates for smaller deposits sit higher. All five banks repriced upward in the first week of August, with moves in the order of 20 to 30 basis points. Advertised rates are a starting point, not a quote — the rate actually available to you depends on your equity, your income and how the loan is structured, and it can differ from the table above. Ask your mortgage adviser, or the bank directly, for the rate and structure that apply to your situation.",
      },
      {
        type: "pull",
        text: "Rates are rising because of inflation. And this inflation came from oil and global disruption, not from anything happening in the housing market.",
      },

      { type: "h2", text: "What is driving it" },
      {
        type: "stats",
        items: [
          {
            label: "Annual inflation",
            value: "4.1%",
            delta: "from 3.1% in March",
            direction: "up",
            note: "June 2026 quarter",
          },
          {
            label: "Unemployment",
            value: "5.6%",
            delta: "from 5.4%",
            direction: "up",
            note: "Highest since March 2014",
          },
          {
            label: "Average property value",
            value: "$898,799",
            delta: "1.5% over the quarter",
            direction: "down",
            note: "QV House Price Index, July",
          },
          {
            label: "New homes consented",
            value: "40,581",
            delta: "19% on last year",
            direction: "up",
            note: "Year to June 2026",
          },
        ],
      },
      {
        type: "deflist",
        items: [
          {
            term: "Imported inflation, not domestic demand",
            text: "The jump from 3.1% to 4.1% came largely from outside the country — a supply shock pushed fuel and freight costs up, and that fed through to almost everything else. Housing had nothing to do with it. The Reserve Bank responded to the number rather than to its source, which is why this tightening arrives without the hot economy that normally accompanies one.",
          },
          {
            term: "A labour market going the other way",
            text: "Unemployment at 5.6% is the highest in twelve years, and youth unemployment for 15 to 19 year olds is 25.3%. Beyond the headline, more people are working fewer hours than they would like — and reduced or variable hours are exactly the kind of income a bank discounts when it works out what you can service. Ordinarily all of this would argue for cutting rates, not raising them. The Reserve Bank is tightening into a weakening jobs market because the inflation number leaves it little choice, and that tension is the defining feature of this cycle.",
          },
          {
            term: "Borrowing power is falling on its own",
            text: "Banks test your ability to service a loan at a rate well above the one you would actually pay, and that test rate moves with market rates. As advertised rates rise, the amount any given household can borrow falls — regardless of what has happened to their income or to house prices. This is the mechanism quietly reshaping the market.",
          },
          {
            term: "An election on 7 November, with property tax in play",
            text: "How investment property is taxed is on the agenda this election, and the proposals in circulation differ enough from each other, and from the status quo, that the rules governing a purchase made today may not be the rules governing it in two years. The party detail matters less than the effect, which is the same either way: anyone weighing an investment purchase is being asked to commit capital before knowing how the return will be taxed. Uncertainty of that kind tends to stop transactions rather than reprice them.",
          },
        ],
      },

      {
        type: "figure",
        src: "/images/market-update.png",
        alt: "A woman looking at property listings in a real estate agency window on a New Zealand city street",
      },

      { type: "h2", text: "What property did" },
      {
        type: "table",
        caption: "July 2026",
        headers: ["Measure", "Latest", "Change"],
        rows: [
          ["National median price (REINZ)", "$760,000", "−0.7% year on year"],
          ["Average value (QV index)", "$898,799", "−1.5% over the quarter"],
          ["Properties sold", "6,090", "−10% year on year"],
          ["Median days to sell", "50", "+2 days"],
        ],
        note: "REINZ and QV measure different things — a median sale price moves with what is selling, an index tracks value change across the stock. They are pointing the same direction here, which is the useful part.",
      },
      {
        type: "p",
        text: "July was the fifth-slowest July on record by volume. Values are drifting down rather than falling sharply, stock is taking longer to clear, and the gap between what sellers will accept and what buyers will pay is what most of that delay actually is.",
      },
      {
        type: "p",
        text: "Supply, meanwhile, is still arriving. 40,581 new homes were consented in the year to June, up 19% on the year before, split roughly evenly between stand-alone houses and multi-unit developments.",
      },

      { type: "h2", text: "The trends underneath the numbers" },
      {
        type: "deflist",
        items: [
          {
            term: "Conditions favour buyers, but affordability does not",
            text: "Volumes at a multi-year low, 50 days to sell and values easing all mean less competition and more room to negotiate than at any point in recent years. Working against that is borrowing power, which is shrinking as test rates climb. The constraint has moved: it is no longer finding a property or saving the deposit, it is the size of the loan the bank will approve.",
          },
          {
            term: "The curve is flat past two years, not before",
            text: "Moving from a one-year rate to a two-year rate costs around half a percent at every main bank, so that first step out is a real decision with a real price on it. Past that point the shape changes: at two banks the two and three-year rates are identical, at another the three-year sits below the two-year, and elsewhere the gap is a tenth of a percent. If you are considering a longer term, almost all of the cost sits in that first step rather than the later ones. A longer term is still a view on where rates go, and it holds you either way.",
          },
          {
            term: "Investors are waiting on the tax rules, not the rates",
            text: "What is holding investment purchases back is less the cost of borrowing than not knowing how the return will be taxed — including how interest costs are treated, which moves the arithmetic on a rental considerably more than a quarter-point on the mortgage does. That question sits with the election. Worth being realistic about what 7 November delivers, though: election results do not turn investment activity around the following week. On past form the response is gradual, as rules are legislated, tested and priced in. The date removes the uncertainty rather than restarting the market.",
          },
        ],
      },

      {
        type: "callout",
        label: "The question households are asking has changed",
        text: "Late last year the common position was to wait: sit on floating or a very short term, watch for the next cut, and fix somewhere near the bottom. That question has largely gone. The one replacing it is not where the bottom is, but how long to fix for — because the risk being managed has flipped from missing a lower rate to being caught by a higher one. What most people are weighing now is certainty, rather than the last few basis points.",
      },

      { type: "h2", text: "Your numbers, not the national ones" },
      {
        type: "p",
        text: "Everything above is national data, which describes nobody in particular. Your rate, your term structure, your income stability, how long you plan to hold and how much headroom you actually have will move all of it, and some of it a long way.",
      },
      {
        type: "p",
        text: "If you want to see your version — with the assumptions written down where you can argue with them — that is the conversation worth having.",
      },
    ],
    takeaways: [
      "The easing cycle turned. The OCR rose to 2.50% in July, the first increase in three years, and the main banks now expect it near 3.00% by December.",
      "Inflation and unemployment are rising together. Annual inflation reached 4.1% in the June quarter, up from 3.1% in March, while unemployment climbed to 5.6%, the highest since 2014.",
      "Mortgage rates rose this month. All five main banks repriced upward in early August, and one-year rates now sit just under 5% across the board. Moving from one year to two costs around half a percent, though the curve is flat beyond that.",
      "Property values are easing. The average value was $898,799 in July, down 1.5% over the quarter, with sales down 10% and 50 days to sell.",
      "Investors are waiting on tax rules rather than rates. That resolves on 7 November, though activity has historically turned gradually rather than immediately.",
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
