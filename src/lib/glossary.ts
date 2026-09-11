/**
 * Glossary — the terms behind /insights/glossary.
 *
 * ─────────────────────────────────────────────────────────────
 * This file is what the site reads. The reading copy of the same
 * definitions — with sources, review notes and what was left out —
 * is `Valar website/pages/insights/glossary.md`. Change a
 * definition here and mirror it there, or the two drift.
 * ─────────────────────────────────────────────────────────────
 *
 * The page is switched by GLOSSARY_LIVE in src/lib/insights.ts.
 */

export type GlossaryCategory = "mortgages" | "kiwisaver" | "investing";

/**
 * The filter chips, in display order.
 *
 * Three, not four. "Financial planning" had its own chip until 2026-09-11,
 * when Lena merged it into investing: on its own it held eight terms next to
 * 56 for mortgages, and read as an afterthought. The label keeps "planning"
 * because an emergency fund is, by definition, money that is not invested.
 */
export const GLOSSARY_CATEGORIES: { id: GlossaryCategory; title: string }[] = [
  { id: "mortgages", title: "Mortgages" },
  { id: "kiwisaver", title: "KiwiSaver" },
  { id: "investing", title: "Investing & planning" },
];

export type GlossaryTerm = {
  /** As displayed. A bracketed abbreviation such as "(LVR)" stays out of the anchor. */
  term: string;
  /** One or more — a term shows under every chip it carries. */
  categories: GlossaryCategory[];
  /** Paragraphs. A **double-asterisk** run renders bold (Deposit uses it to name its two meanings). */
  body: string[];
  /** Other terms by name, without their bracketed abbreviation. Checked when the page builds. */
  seeAlso: string[];
};

export type GlossaryEntry = GlossaryTerm & {
  slug: string;
  letter: string;
  related: { term: string; slug: string }[];
};

function foldAccents(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/** "Loan-to-value ratio (LVR)" → "loan-to-value-ratio"; "Kāinga Ora" → "kainga-ora". */
export function glossarySlug(term: string): string {
  return foldAccents(term.replace(/\(.*?\)/g, ""))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** The definition as plain text, for search and for structured data. */
export function glossaryPlainText(term: GlossaryTerm): string {
  return term.body.join(" ").replace(/\*\*/g, "");
}

const TERMS: GlossaryTerm[] = [
  {
    term: "Asset",
    categories: ["investing"],
    body: [
      "Something you own that has financial value: a home, an investment property, KiwiSaver, savings, shares or a business. Some assets earn income or grow in value over time; others, like a car, mostly lose value. What you own minus what you owe is your net worth.",
    ],
    seeAlso: ["Net worth", "Asset allocation", "Equity"],
  },
  {
    term: "Asset allocation",
    categories: ["investing", "kiwisaver"],
    body: [
      "How an investment is split between the main types of asset. Shares and property are usually called growth assets: they can rise more over time, and fall further along the way. Cash and bonds are income assets: steadier, with lower expected returns. KiwiSaver fund types, from defensive through to aggressive, are defined by the share of growth assets they hold, so choosing a fund type is mostly choosing an asset allocation.",
    ],
    seeAlso: ["Diversification", "Risk profile", "Managed fund", "KiwiSaver"],
  },
  {
    term: "Auction",
    categories: ["mortgages"],
    body: [
      "A sale where buyers bid against each other on a set day. Once bidding passes the seller's reserve price the highest bid wins, and when the hammer falls the sale is unconditional, with the purchase deposit usually due that same day. There is no finance condition and no time for checks afterwards, so finance, the LIM, a building inspection and often a registered valuation all have to be done before auction day.",
    ],
    seeAlso: ["Conditional and unconditional", "Deposit", "Due diligence", "Registered valuation"],
  },
  {
    term: "Body corporate",
    categories: ["mortgages"],
    body: [
      "The group every owner in a unit title development, such as an apartment block or a set of townhouses, automatically belongs to. It looks after the shared parts of the property and charges owners a levy, which typically covers insurance, management costs and contributions to a long-term maintenance fund. It must keep a long-term maintenance plan and hold an annual general meeting where owners vote. Before you buy, the seller's disclosure statement (financial statements, maintenance, meeting minutes) shows what you would be joining, including any large repair work coming up.",
    ],
    seeAlso: ["Unit title", "Due diligence"],
  },
  {
    term: "Break fee",
    categories: ["mortgages"],
    body: [
      "The cost of ending a fixed rate early, by repaying the fixed part, refinancing or selling before the fixed term is up. Also called a break cost. It covers what the lender loses when rates have fallen since you fixed, and it is based on how far rates have moved and how much time is left. If rates have risen instead, there is usually no break fee, or only a small admin charge. Many lenders let you repay a limited amount extra each year without triggering one, and if you are selling and buying at the same time, a substitution of security can sometimes move the fixed loan to the new property instead of breaking it.",
    ],
    seeAlso: ["Fixed rate", "Refix", "Security", "Refinancing"],
  },
  {
    term: "Bridging finance",
    categories: ["mortgages"],
    body: [
      "Short-term lending for when you buy a new home before the sale of your current one has settled. It covers the gap, so for a time you carry lending on both properties. Lenders look closely at how certain the sale is, and bridging is easier to arrange once the current home has sold unconditionally. They also look at whether you could manage if the sale took longer or achieved less than expected.",
    ],
    seeAlso: ["Security", "Settlement", "Conditional and unconditional"],
  },
  {
    term: "Bright-line test",
    categories: ["investing"],
    body: [
      "A tax rule on residential property: if you sell within a set period of buying, the profit can be taxed as income, whether or not you set out to make one. Your main home is usually excluded, as long as you meet Inland Revenue's criteria. The period has changed several times since the rule was introduced, so what applies depends on when the property was bought and sold. An accountant can confirm how it applies to you.",
    ],
    seeAlso: ["Investment property", "Interest deductibility"],
  },
  {
    term: "Building inspection",
    categories: ["mortgages"],
    body: [
      "A report from a qualified inspector on the condition of a property: structure, roof, moisture, and anything likely to need repair. It is normally done while the purchase is still conditional, so what it finds can still change your decision or the price. When buying at auction, it has to be done before auction day.",
    ],
    seeAlso: ["Due diligence", "Auction", "Conditional and unconditional"],
  },
  {
    term: "Cash contribution",
    categories: ["mortgages"],
    body: [
      "Money some lenders pay you when a new loan is drawn down, often called cashback, usually put towards buying or switching costs. It comes with a minimum period the loan has to stay with that lender. Repay or move the loan before then and the lender can claw some or all of it back, often in proportion to how early you leave. The loan agreement sets out exactly how.",
    ],
    seeAlso: ["Clawback", "Refinancing"],
  },
  {
    term: "Cash flow",
    categories: ["investing"],
    body: [
      "The money coming in and going out over a period: income against spending, loan repayments and saving. Positive cash flow means more comes in than goes out; negative means the gap is being covered by savings or debt. In a financial plan it is the starting point, because it shows what is really available to save, invest or repay. For an investment property it is whether the rent covers the costs.",
    ],
    seeAlso: ["Financial plan", "Emergency fund", "Rental yield"],
  },
  {
    term: "Clawback",
    categories: ["mortgages"],
    body: [
      "Money taken back when a loan is repaid, refinanced or moved within an early period, and it can happen in two ways. When the loan was arranged through an adviser, the lender takes back the commission it paid the adviser, and depending on the adviser's terms some or all of that cost can be passed on to you. When the lender paid a cash contribution, it can claw that back too, often in proportion to how early the loan is moved. The periods and amounts are set in the adviser's agreement and the loan agreement, so check both before you sign, not two years later when you want to move the loan.",
    ],
    seeAlso: ["Mortgage adviser", "Cash contribution", "Refinancing"],
  },
  {
    term: "Code compliance certificate (CCC)",
    categories: ["mortgages"],
    body: [
      "Confirmation from the council, or another building consent authority, that building work done under a building consent was completed in line with that consent. It matters most when a property has had renovations or additions: consented work that never received its certificate can show up on the LIM report, and it is far easier to resolve before you buy than after. Lenders usually want to see one before the final payment on a new build.",
    ],
    seeAlso: ["LIM report", "Building inspection", "Construction loan", "Due diligence"],
  },
  {
    term: "Compounding",
    categories: ["investing"],
    body: [
      "Earning returns on your earlier returns, not only on the money you put in. Each year's growth is added to the balance, and the next year's growth is worked out on that larger amount, so the effect is small at first and builds over time. It is why the number of years money stays invested matters so much. It works the same way against you on debt that is not being paid down.",
    ],
    seeAlso: ["Return", "Investment horizon", "KiwiSaver"],
  },
  {
    term: "Conditional and unconditional",
    categories: ["mortgages"],
    body: [
      "An offer is conditional when the purchase depends on something happening first. The usual conditions are finance, a building inspection, a valuation or selling your own home, each normally with its own date. An unconditional offer has no conditions at all. A conditional agreement becomes unconditional once every condition has been met or waived, and from then on it is binding: you are committed to settle, whatever happens with your finance. A winning bid at auction is unconditional the moment the hammer falls.",
    ],
    seeAlso: ["Finance condition", "Due diligence", "Auction", "Sale and purchase agreement", "Settlement"],
  },
  {
    term: "Construction loan",
    categories: ["mortgages"],
    body: [
      "A loan for building a new home, paid out in stages as the build reaches agreed milestones, rather than in one lump sum. These stages are called progress payments, and interest is charged only on what has been drawn so far. Lenders usually want the building contract, the plans and a valuation of the finished home before approving, and the code compliance certificate before the final payment.",
    ],
    seeAlso: ["Quantity surveyor", "Code compliance certificate", "Registered valuation"],
  },
  {
    term: "Credit report",
    categories: ["mortgages"],
    body: [
      "The record credit reporting agencies hold on your borrowing: loans, credit cards, applications for credit, and any missed payments or defaults. Lenders check it when you apply. Applications are recorded on it too, which is one reason to avoid applying to several lenders yourself in a short space of time.",
    ],
    seeAlso: ["Pre-approval", "Servicing"],
  },
  {
    term: "Cross-lease",
    categories: ["mortgages"],
    body: [
      "A form of ownership common in older New Zealand subdivisions. The owners share the land between them, and each holds a long lease over their own home, shown on a plan. If a home has been extended or altered without the plan being updated, the title can be defective. Your lawyer checks for this, and lenders care about it.",
    ],
    seeAlso: ["Freehold", "Leasehold", "Record of Title", "Unit title"],
  },
  {
    term: "Debt-to-income ratio (DTI)",
    categories: ["mortgages"],
    body: [
      "How much you owe compared with how much you earn: your total debt, including the new loan, as a multiple of your income before tax. The higher the ratio, the less room a lender sees for more borrowing. The Reserve Bank also limits how much high-DTI lending banks can do, so it is one of the checks on how much you can borrow, alongside your deposit and servicing.",
    ],
    seeAlso: ["Loan-to-value ratio", "Servicing", "Non-bank lender"],
  },
  {
    term: "Deposit",
    categories: ["mortgages"],
    body: [
      "The word means two different things when you buy a home, and they are easy to confuse.",
      "**Your deposit for the loan** is the part of the price you pay with your own money rather than borrow. It can come from savings, KiwiSaver, a gift or the sale of another property. Its size sets your loan-to-value ratio, which affects which lenders will consider you and the rate you are offered.",
      "**The purchase deposit** is a payment made under the sale and purchase agreement. Depending on the agreement, it is paid once both sides have signed or once the agreement becomes unconditional, and at auction usually on the day. It counts towards the price at settlement, but because it is paid earlier, that money has to be available sooner than the rest.",
    ],
    seeAlso: ["Loan-to-value ratio", "Gifted funds", "KiwiSaver first-home withdrawal", "Conditional and unconditional", "Auction"],
  },
  {
    term: "Diversification",
    categories: ["investing", "kiwisaver"],
    body: [
      "Spreading money across different investments, so that one going badly does less damage to the whole. It works across types of asset, companies, industries and countries. It lowers the risk of any single holding sinking the result, but it does not stop a portfolio falling when markets fall broadly. For a home owner, most of their wealth is often in one asset, the home, which is worth seeing clearly when looking at the whole picture.",
    ],
    seeAlso: ["Asset allocation", "Managed fund", "Risk profile", "Net worth"],
  },
  {
    term: "Due diligence",
    categories: ["mortgages"],
    body: [
      "The checks a buyer makes before committing to a purchase: a building inspection, the LIM report, the title, and anything specific to the property, such as the body corporate's records for a unit title. It is usually a condition in the sale and purchase agreement with a set deadline, and if the checks turn up something serious in that time, the buyer can usually withdraw. At auction there is no condition to rely on, so all of it has to be done before auction day.",
    ],
    seeAlso: ["Conditional and unconditional", "Building inspection", "LIM report", "Body corporate", "Auction"],
  },
  {
    term: "Emergency fund",
    categories: ["investing"],
    body: [
      "Money set aside for the unexpected, such as losing an income, a medical cost or an urgent repair. It is kept where you can reach it quickly, rather than invested where its value moves. It means a shock does not have to go on a credit card or force an investment to be sold at a bad time. How much is enough depends on income, costs and how secure the work is, which is why it is usually one of the first things a financial plan settles.",
    ],
    seeAlso: ["Financial plan", "Cash flow"],
  },
  {
    term: "Equity",
    categories: ["mortgages", "investing"],
    body: [
      "The part of a property you own outright: its current value minus what you still owe on it. Equity grows as you repay the loan and as the property's value rises. It can be borrowed against for renovations, another purchase, or a deposit on an investment property. Borrowing more against it from your current lender is called a top-up.",
    ],
    seeAlso: ["Top-up", "Net worth", "Loan-to-value ratio", "Security"],
  },
  {
    term: "Finance condition",
    categories: ["mortgages"],
    body: [
      "A condition in a sale and purchase agreement that makes the purchase subject to arranging finance by an agreed date. This is what “subject to finance” means in an offer. If finance is not approved in time, the buyer may be able to cancel the agreement. The finance date should allow enough time for the lender to assess the application and check the property.",
    ],
    seeAlso: ["Conditional and unconditional", "Live deal", "Pre-approval", "Sale and purchase agreement"],
  },
  {
    term: "Financial plan",
    categories: ["investing"],
    body: [
      "A written picture of where you are now and a route to where you want to be. It covers income, spending, assets and debts; the goals you are working towards, and by when; and the steps to get there, such as saving, investing, repaying debt and protecting against the things that could knock the plan over. It is meant to be revisited as life changes, not filed away once it is written.",
    ],
    seeAlso: ["Wealth management", "Cash flow", "Net worth", "Emergency fund", "Investment horizon", "Risk profile"],
  },
  {
    term: "First Home Loan",
    categories: ["mortgages"],
    body: [
      "A scheme that lets eligible first home buyers borrow with as little as a 5% deposit. The loan comes from a participating bank or lender and is underwritten by Kāinga Ora, which insures the lender against loss. Eligibility criteria include income limits, some previous home owners can qualify, and you still have to meet the lender's own criteria. An insurance premium is charged, and it can be added to the loan.",
    ],
    seeAlso: ["Kāinga Ora", "Deposit", "KiwiSaver first-home withdrawal"],
  },
  {
    term: "Fixed rate",
    categories: ["mortgages"],
    body: [
      "An interest rate locked for a set period, called the fixed term, so your repayments do not change during it. The trade-off is flexibility: extra repayments are usually limited, and ending the fixed term early can cost a break fee. When the term ends you refix, or the loan normally moves to the floating rate. The fixed term is not the loan term, which is the full length of the mortgage.",
    ],
    seeAlso: ["Refix", "Floating rate", "Break fee", "Loan term", "Split loan"],
  },
  {
    term: "Floating rate",
    categories: ["mortgages"],
    body: [
      "An interest rate that can change at any time. You can make extra repayments, or repay the loan in full, without a break fee. Floating rates are usually higher than fixed rates, which is why floating is often used for only part of a loan.",
    ],
    seeAlso: ["Fixed rate", "Split loan", "Revolving credit", "Official Cash Rate"],
  },
  {
    term: "Freehold",
    categories: ["mortgages"],
    body: [
      "Owning the land and, generally, anything built on it. Also called fee simple, it is the most common kind of ownership in New Zealand. What you can do with the property can still be limited by interests on the title, such as easements or covenants, and by council rules.",
    ],
    seeAlso: ["Leasehold", "Cross-lease", "Unit title", "Record of Title"],
  },
  {
    term: "Gifted funds",
    categories: ["mortgages"],
    body: [
      "Money given towards your deposit, with no expectation of being repaid. It usually comes from family, but it can come from someone else, such as a friend. Lenders have their own rules on gifts and usually want one confirmed in a signed gift certificate, so they know it is not a loan you would have to repay. If the money is really a loan, it has to be treated as one.",
    ],
    seeAlso: ["Deposit", "Guarantor"],
  },
  {
    term: "Guarantor",
    categories: ["mortgages"],
    body: [
      "A person, usually a family member, who agrees to be responsible for part of your loan if you cannot repay it. The guarantee is often secured against their own property and is usually limited to a set amount. It can help a buyer with a small deposit, but it puts the guarantor's property at risk, which is why lenders expect the guarantor to take independent legal advice before signing.",
    ],
    seeAlso: ["Gifted funds", "Deposit", "Security"],
  },
  {
    term: "Healthy Homes Standards",
    categories: ["investing"],
    body: [
      "Minimum standards every rental property in New Zealand has to meet, covering heating, insulation, ventilation, moisture ingress and drainage, and draught stopping. Meeting them is the landlord's responsibility, so for anyone buying an investment property they are part of the purchase: a home that does not meet them yet comes with work, and a cost, to bring it up to standard. The building inspection and the seller's records are where checking starts.",
    ],
    seeAlso: ["Investment property", "Building inspection", "Rental yield"],
  },
  {
    term: "High-LVR loan",
    categories: ["mortgages"],
    body: [
      "A home loan that is a large share of the property's value, because the deposit or the equity is small. The Reserve Bank limits how much of this lending banks can do, so high-LVR loans are harder to get, the criteria are tighter, and they usually cost more through a low-equity margin or premium. For eligible first home buyers, the First Home Loan is one way in.",
    ],
    seeAlso: ["Loan-to-value ratio", "Low-equity margin", "First Home Loan", "Deposit"],
  },
  {
    term: "Interest deductibility",
    categories: ["investing"],
    body: [
      "Whether the interest on a loan used for a residential rental property can be claimed as an expense against the rent, which reduces the tax on rental income. Inland Revenue calls these the interest limitation rules. They have changed more than once in recent years, so what can be claimed depends on the tax year. An accountant can confirm your position. Interest on the loan for your own home is not deductible.",
    ],
    seeAlso: ["Investment property", "Bright-line test", "Rental yield"],
  },
  {
    term: "Interest-only",
    categories: ["mortgages"],
    body: [
      "A loan, or part of one, where for a set period you pay only the interest and the balance does not go down. Repayments are lower during that period and higher afterwards, when the principal has to be repaid over the time that is left. More common on investment property than on a home.",
    ],
    seeAlso: ["Principal and interest", "Investment property"],
  },
  {
    term: "Investment horizon",
    categories: ["investing", "kiwisaver"],
    body: [
      "How long money can stay invested before you need it. It is one of the main things that decides how much short-term rise and fall an investment can live with. Money needed for a house deposit next year and money for retirement decades away have very different horizons, even when both sit in the same person's KiwiSaver.",
    ],
    seeAlso: ["Risk profile", "Asset allocation", "KiwiSaver first-home withdrawal"],
  },
  {
    term: "Investment property",
    categories: ["investing", "mortgages"],
    body: [
      "A property bought to rent out, or for its future value, rather than to live in. Lenders treat it differently from a home: a bigger deposit is usually needed, because the Reserve Bank's LVR limits are tighter for investors; only part of the rent is usually counted when working out what you can afford; and interest-only periods are more common. The tax treatment is different too: the bright-line test and the interest limitation rules both apply.",
    ],
    seeAlso: ["Rental yield", "Loan-to-value ratio", "Bright-line test", "Interest deductibility", "Interest-only", "Healthy Homes Standards"],
  },
  {
    term: "Joint tenants and tenants in common",
    categories: ["mortgages", "investing"],
    body: [
      "The two ways people can own a property together, recorded on the title. The difference matters most when one owner dies. **Joint tenants** own the whole property together, without separate shares; if one dies, the other automatically owns all of it, whatever a will says. **Tenants in common** each own a defined share, which can be unequal and is shown on the title; each share can be sold or left in a will. Whether you are a couple, family or friends buying together, or owners who put in different amounts, the choice is worth settling with your lawyer before you buy.",
    ],
    seeAlso: ["Record of Title", "Sale and purchase agreement", "Wealth management"],
  },
  {
    term: "Kāinga Ora",
    categories: ["mortgages", "kiwisaver"],
    body: [
      "The government's housing and urban development agency, and the country's public housing landlord. For buyers, it underwrites the First Home Loan, and it assesses previous home owners who want to use their KiwiSaver towards buying again.",
    ],
    seeAlso: ["First Home Loan", "KiwiSaver first-home withdrawal"],
  },
  {
    term: "KiwiSaver",
    categories: ["kiwisaver", "investing"],
    body: [
      "New Zealand's voluntary, work-based savings scheme. Members save from their pay, employers usually contribute as well, and eligible members also receive a government contribution. The money is invested in a fund with a KiwiSaver provider, and fund types run from defensive and conservative through balanced to growth and aggressive. It is generally held until retirement age, with a few exceptions; the one that matters most to buyers is a first home.",
    ],
    seeAlso: ["KiwiSaver contributions", "Managed fund", "Asset allocation", "KiwiSaver first-home withdrawal"],
  },
  {
    term: "KiwiSaver contributions",
    categories: ["kiwisaver"],
    body: [
      "Money paid into KiwiSaver. There are usually three sources: what you pay from your wages at the rate you choose, what your employer adds, and a government contribution for eligible members. You can also pay in voluntarily at any time, which is how self-employed members contribute. The rates and the rules for the government contribution have changed recently and more changes are scheduled, so Inland Revenue or your provider has the current settings.",
    ],
    seeAlso: ["KiwiSaver", "Compounding"],
  },
  {
    term: "KiwiSaver first-home withdrawal",
    categories: ["kiwisaver", "mortgages"],
    body: [
      "KiwiSaver members of at least three years can usually withdraw most of their savings towards a first home, though a small balance has to stay in the account. The home has to be one you intend to live in. The money is paid to your lawyer on or before settlement, not to you, and the application goes through your KiwiSaver provider, so it needs to start well before settlement day. Previous home owners can sometimes qualify too, after an assessment by Kāinga Ora.",
    ],
    seeAlso: ["KiwiSaver", "Kāinga Ora", "Deposit", "First Home Loan"],
  },
  {
    term: "Leasehold",
    categories: ["mortgages"],
    body: [
      "Buying an exclusive right to use the land and the buildings on it for a set period, on the terms of a lease, rather than owning the land. You pay rent for the land, usually called ground rent, to the freehold owner, and the lease sets how often that rent is reviewed. A rising ground rent and a shortening lease can make a leasehold property much harder to sell later, so lenders look closely at the lease terms too.",
    ],
    seeAlso: ["Freehold", "Cross-lease", "Record of Title"],
  },
  {
    term: "LIM report",
    categories: ["mortgages"],
    body: [
      "A Land Information Memorandum: what the local council holds on file about a property, including consents and code compliance certificates, zoning, known hazards such as flooding, and anything outstanding. It is usually obtained during due diligence, while the purchase is still conditional. Work done without a consent may show up here by its absence.",
    ],
    seeAlso: ["Due diligence", "Zoning", "Code compliance certificate", "Building inspection", "Record of Title"],
  },
  {
    term: "Live deal",
    categories: ["mortgages"],
    body: [
      "Applying for a loan on a specific property: the sale and purchase agreement is signed, usually with a finance condition, and goes to the lender to assess the property and you together. It is the alternative to getting pre-approval first. The finance condition has a deadline, so a live deal runs on a tight timeline from the day the agreement is signed.",
    ],
    seeAlso: ["Finance condition", "Pre-approval", "Sale and purchase agreement"],
  },
  {
    term: "Loan term",
    categories: ["mortgages"],
    body: [
      "The full length of time a home loan is set up to be repaid over. A longer term means lower regular repayments but more interest over the life of the loan; a shorter one means the reverse. It is not the same as a fixed term, which is only the period a rate is locked for.",
    ],
    seeAlso: ["Fixed rate", "Principal and interest", "Restructure"],
  },
  {
    term: "Loan-to-value ratio (LVR)",
    categories: ["mortgages"],
    body: [
      "The size of your loan as a share of the property's value. A lower LVR, meaning a bigger deposit or more equity, opens up more lenders and better rates. The Reserve Bank limits how much high-LVR lending banks can do, with tighter limits for investment property, which is why low-deposit loans are harder to get and often cost more.",
    ],
    seeAlso: ["High-LVR loan", "Deposit", "Equity", "Low-equity margin", "Debt-to-income ratio", "Investment property"],
  },
  {
    term: "Low-equity margin",
    categories: ["mortgages"],
    body: [
      "An extra cost some lenders charge when your deposit or equity is below what they treat as standard. It can be added to the interest rate (a low-equity margin) or charged once as a fee (a low-equity premium). It usually falls away once your equity reaches the lender's threshold, though with some lenders that only happens when you ask for a review.",
    ],
    seeAlso: ["High-LVR loan", "Loan-to-value ratio", "Deposit", "Special rate"],
  },
  {
    term: "Managed fund",
    categories: ["investing", "kiwisaver"],
    body: [
      "A fund that pools money from many investors and is run by a professional manager, who invests it across a mix of assets according to the fund's stated strategy. You usually own units in the fund rather than the investments themselves, and the value of your units rises and falls with the assets underneath. KiwiSaver schemes are made up of managed funds. Fees for running the fund come out of what it earns, which is why they are worth comparing.",
    ],
    seeAlso: ["Diversification", "Asset allocation", "KiwiSaver", "Return"],
  },
  {
    term: "Mortgage adviser",
    categories: ["mortgages"],
    body: [
      "A financial adviser who compares lenders and helps you structure, apply for and settle a home loan. In New Zealand, financial advisers work under a licensed Financial Advice Provider and must give priority to your interests. Most mortgage advisers are paid a commission by the lender rather than a fee by you, and they have to tell you how they are paid.",
    ],
    seeAlso: ["Clawback", "Pre-approval"],
  },
  {
    term: "Net worth",
    categories: ["investing"],
    body: [
      "Everything you own minus everything you owe: your assets less your debts. For a home owner, the home and the mortgage are usually the two biggest numbers in it. Watching it change over time shows whether you are actually getting ahead, which income alone does not.",
    ],
    seeAlso: ["Wealth", "Asset", "Equity", "Financial plan"],
  },
  {
    term: "Non-bank lender",
    categories: ["mortgages"],
    body: [
      "A specialist mortgage lender or finance company that is not a registered bank. The Reserve Bank's LVR and DTI restrictions apply to registered banks, so non-bank lenders work to their own criteria and can sometimes lend where a bank will not, for example on self-employed income, a patchy credit history or an unusual property. That lending usually comes at a higher rate. For many borrowers it is a step on the way back to a bank.",
    ],
    seeAlso: ["Refinancing", "Debt-to-income ratio", "Loan-to-value ratio"],
  },
  {
    term: "Official Cash Rate (OCR)",
    categories: ["mortgages"],
    body: [
      "The interest rate set by the Reserve Bank of New Zealand to keep inflation in its target range, reviewed on a published schedule through the year. Changes flow through to floating rates quickly. Fixed rates follow wholesale market rates instead, which move on what markets expect the OCR to do, so fixed rates often move before an OCR decision is announced, and sometimes when the OCR has not changed at all.",
    ],
    seeAlso: ["Fixed rate", "Floating rate", "Test rate"],
  },
  {
    term: "Offset account",
    categories: ["mortgages"],
    body: [
      "A transaction or savings account linked to a home loan, where the balance is subtracted from the loan before interest is calculated. You keep full access to the money, and while it sits there it saves interest as if it were paying down the loan. It helps only as much as the balance you actually keep in it, and it is usually linked to a floating part of the loan.",
    ],
    seeAlso: ["Revolving credit", "Split loan", "Floating rate"],
  },
  {
    term: "Pre-approval",
    categories: ["mortgages"],
    body: [
      "A lender's conditional agreement to lend up to a set amount before you have found a property. It tells you your price range and lets you make offers with more confidence. It is not a guarantee: the lender still has to approve the property itself, your circumstances need to stay the same, and pre-approvals expire.",
    ],
    seeAlso: ["Live deal", "Finance condition", "Credit report"],
  },
  {
    term: "Pre-settlement inspection",
    categories: ["mortgages"],
    body: [
      "A visit to the property shortly before settlement, to check it is in the condition it was in when you agreed to buy, that the chattels listed in the agreement are there and working, and that anything the seller agreed to do has been done. Any problem has to go through your lawyer before settlement, because afterwards it is much harder to fix. Do not skip it.",
    ],
    seeAlso: ["Settlement", "Sale and purchase agreement"],
  },
  {
    term: "Principal and interest (P&I)",
    categories: ["mortgages"],
    body: [
      "The standard way to repay a home loan. Each repayment covers the interest due and pays down part of the balance, called the principal. Early on, most of each repayment is interest; as the balance falls, more of it goes to the principal, until the loan is repaid at the end of its term.",
    ],
    seeAlso: ["Interest-only", "Loan term"],
  },
  {
    term: "Property valuation",
    categories: ["mortgages"],
    body: [
      "The value of a property, and a term that covers several different things which are easy to mix up. A **registered valuation** is an independent assessment of market value by a registered valuer, and it is the kind lenders usually ask for. Some companies also produce **automated or desktop valuations** from sales data, and banks sometimes accept these instead. A **rating valuation** (RV or CV) is the council's figure for sharing out rates, set at a past date. A real estate agent's **appraisal** is the agent's estimate of the likely sale price, which is useful but is not a valuation. For the same property, these can be far apart.",
    ],
    seeAlso: ["Registered valuation", "Rating valuation", "Vendor"],
  },
  {
    term: "Quantity surveyor",
    categories: ["mortgages"],
    body: [
      "A professional who estimates and tracks building costs. On a new build or a large renovation, a lender may want a quantity surveyor's report to confirm the budget is realistic before approving the loan, and to check that each progress payment matches the work actually done. For a buyer, a cost estimate before committing shows whether a renovation plan adds up.",
    ],
    seeAlso: ["Construction loan", "Code compliance certificate", "Registered valuation"],
  },
  {
    term: "Rates",
    categories: ["mortgages"],
    body: [
      "The word means two different things in property, and they are easy to confuse. **Council rates** are the property tax charged by your local council, and in many areas the regional council, to pay for local services, usually in instalments through the year. They are one of the ongoing costs of owning, and lenders include them in your costs when they assess what you can afford. **Interest rates** are the percentage a lender charges on the money you borrow, such as a fixed or floating rate. When people talk about a property's rates, they usually mean council rates.",
    ],
    seeAlso: ["Rating valuation", "Fixed rate", "Floating rate", "Servicing"],
  },
  {
    term: "Rating valuation (RV / CV)",
    categories: ["mortgages"],
    body: [
      "The council's valuation of a property, used to share rates fairly between owners. It has three parts: the land value; the capital value (CV), which is the estimated value of the whole property at a set date; and the value of improvements, which is simply the difference between the two. Councils revalue only every few years, so it can be well out of step with today's market, and it is not meant for insurance or mortgage purposes. It is not a registered valuation either, and a sale price can land well above or below it.",
    ],
    seeAlso: ["Property valuation", "Registered valuation", "Rates"],
  },
  {
    term: "Record of Title",
    categories: ["mortgages"],
    body: [
      "The official record of who owns a piece of land and what rights and restrictions come with it, such as mortgages, easements and covenants. It replaced the older certificate of title and is held by Land Information New Zealand (LINZ). Your lawyer checks it before you commit to a purchase.",
    ],
    seeAlso: ["Joint tenants and tenants in common", "Cross-lease", "Unit title", "LIM report", "Due diligence"],
  },
  {
    term: "Refinancing",
    categories: ["mortgages"],
    body: [
      "Changing an existing home loan. It can mean restructuring the loan with your current lender, or moving it to a different lender for a better rate, a better structure, or an option your current lender does not offer. Before moving lender, weigh up the costs: break fees on fixed parts, any cash contribution you would have to repay, clawback, and legal fees. A new lender assesses you from scratch, so being approved for your current loan does not mean being approved for the same loan elsewhere. Choosing a new fixed rate when a fixed term ends is a refix.",
    ],
    seeAlso: ["Restructure", "Refix", "Top-up", "Break fee", "Cash contribution", "Clawback"],
  },
  {
    term: "Refix",
    categories: ["mortgages"],
    body: [
      "Choosing a new fixed rate and term when your current fixed term ends. Lenders usually get in touch beforehand (“your loan is coming up for refix”) with the rates on offer. Refixing at the end of a term costs no break fee, which makes it the natural point to review the whole loan: how much to fix and for how long, and whether to restructure, top up or move to another lender. If you do nothing, the loan usually moves to the floating rate.",
    ],
    seeAlso: ["Fixed rate", "Floating rate", "Restructure", "Refinancing"],
  },
  {
    term: "Registered valuation",
    categories: ["mortgages"],
    body: [
      "An independent assessment of a property's market value by a registered valuer. Lenders often ask for one for low-deposit loans, new builds, auctions, or properties without a recent sale. If it comes in below the price you agreed, the lender generally works from the valuation. It is not the same as the council's rating valuation (RV or CV), which is set for rates and often differs from market value.",
    ],
    seeAlso: ["Property valuation", "Rating valuation", "Loan-to-value ratio", "Auction"],
  },
  {
    term: "Rental yield",
    categories: ["investing"],
    body: [
      "The rent a property earns in a year, as a share of its value or purchase price. Gross yield uses the rent alone; net yield takes off the costs first: rates, insurance, maintenance, property management and any body corporate levies. Yield on its own does not show whether a property pays for itself, because that also depends on the loan, the interest rate and tax.",
    ],
    seeAlso: ["Yield", "Investment property", "Cash flow", "Return", "Interest deductibility"],
  },
  {
    term: "Restructure",
    categories: ["mortgages"],
    body: [
      "Changing how an existing loan is set up while staying with the same lender: splitting it differently, moving part between fixed and floating, adding an offset or revolving facility, or changing the loan term. It is one form of refinancing, and usually simpler than moving to another lender, though changing a fixed part before its term ends can still cost a break fee.",
    ],
    seeAlso: ["Refix", "Top-up", "Refinancing", "Split loan"],
  },
  {
    term: "Return",
    categories: ["investing"],
    body: [
      "What an investment earns: the income it pays, such as interest, dividends or rent, plus any change in its value. It can be negative. Returns are usually quoted as a yearly percentage, and it matters whether a figure is before or after fees and tax, and what period it covers. Past returns are not a guide to future returns.",
    ],
    seeAlso: ["Yield", "XIRR", "Compounding", "Rental yield", "Managed fund", "Risk tolerance"],
  },
  {
    term: "Revolving credit",
    categories: ["mortgages"],
    body: [
      "A home loan facility that works like a large overdraft: income goes in, spending comes out, and interest is charged daily on the balance, so every dollar sitting in it reduces the interest. It suits people who can keep the balance moving down, and costs those who cannot, because the unused limit stays available to spend.",
    ],
    seeAlso: ["Offset account", "Floating rate", "Split loan"],
  },
  {
    term: "Risk profile",
    categories: ["investing", "kiwisaver"],
    body: [
      "A summary of how much investment risk suits a person. It combines how much rise and fall they are comfortable with, which is their risk tolerance, and how much they can actually afford to take, given their investment horizon, income and goals. It is usually worked out through a questionnaire and a conversation. Advisers and KiwiSaver providers use it as the starting point when looking at which type of fund fits.",
    ],
    seeAlso: ["Risk tolerance", "Investment horizon", "Asset allocation"],
  },
  {
    term: "Risk tolerance",
    categories: ["investing", "kiwisaver"],
    body: [
      "How comfortable you are with the value of your investments going down, even for a while. It is about how you would really feel, and what you would do, if your balance dropped sharply in a bad year. It is only half of a risk profile: someone can be comfortable with big swings but need the money soon, or the reverse. Selling after a fall because it became too uncomfortable is how a temporary drop becomes a permanent loss.",
    ],
    seeAlso: ["Risk profile", "Investment horizon", "Diversification"],
  },
  {
    term: "Sale and purchase agreement",
    categories: ["mortgages"],
    body: [
      "The contract between buyer and seller. It sets out the price, the purchase deposit, the settlement date, the chattels included, and any conditions, such as finance, a building inspection, a LIM or due diligence. Once signed it is binding on the terms it contains, so your lawyer should review it before you sign, not after.",
    ],
    seeAlso: ["Vendor", "Conditional and unconditional", "Finance condition", "Deposit", "Settlement"],
  },
  {
    term: "Security",
    categories: ["mortgages"],
    body: [
      "The property a lender takes a mortgage over to protect the loan. If the loan is not repaid, the lender can sell it. One loan can be secured over more than one property, which is common for investors and can give the lender a say when one of them is sold. When you sell and buy at the same time, some lenders allow a substitution of security: the existing loan, fixed rates included, moves to the new property instead of being repaid, which can avoid a break fee.",
    ],
    seeAlso: ["Break fee", "Equity", "Bridging finance", "Investment property"],
  },
  {
    term: "Servicing",
    categories: ["mortgages"],
    body: [
      "Whether you can afford the repayments on a loan, as the lender works it out. The lender takes your income, subtracts living costs, existing debts and the new loan's repayments at its test rate, and checks what is left. Credit card and overdraft limits usually count even if you never use them. Each lender runs its own model, which is why two lenders can offer very different amounts.",
    ],
    seeAlso: ["Test rate", "Debt-to-income ratio", "Rates"],
  },
  {
    term: "Settlement",
    categories: ["mortgages"],
    body: [
      "The day the purchase completes: the lender pays the seller through the lawyers, the property becomes yours, and you get the keys. Shortly before it, you do a pre-settlement inspection. Insurance has to be in place before the lender will release the money, and from settlement day the repayments, insurance and rates are yours.",
    ],
    seeAlso: ["Pre-settlement inspection", "Sale and purchase agreement", "Conditional and unconditional", "Rates"],
  },
  {
    term: "Special rate",
    categories: ["mortgages"],
    body: [
      "A lender's discounted interest rate, lower than its standard “carded” rate. Special rates come with conditions: most often a minimum level of equity or deposit, and sometimes taking other products from the same lender. The rate you are actually offered can differ from both advertised numbers.",
    ],
    seeAlso: ["Fixed rate", "Low-equity margin", "Loan-to-value ratio"],
  },
  {
    term: "Split loan",
    categories: ["mortgages"],
    body: [
      "One home loan divided into parts with different rate types or terms. For example, part can be fixed for one term, part fixed for another, and part floating or revolving. Splitting spreads the timing risk of rate changes and keeps some flexibility for extra repayments, while the fixed parts keep their certainty.",
    ],
    seeAlso: ["Fixed rate", "Floating rate", "Offset account", "Revolving credit", "Restructure"],
  },
  {
    term: "Test rate",
    categories: ["mortgages"],
    body: [
      "The interest rate a lender uses to check whether you could still afford a loan if rates rose. It is set well above the rate you will actually pay, and it moves with the market: when rates rise, the test rate rises, and the amount a lender will approve falls even if your income has not changed.",
    ],
    seeAlso: ["Servicing", "Official Cash Rate"],
  },
  {
    term: "Top-up",
    categories: ["mortgages"],
    body: [
      "Borrowing more from your current lender against the equity in your property, for renovations, a deposit on another property, or another large cost. It is added to your existing loan or set up as a new part of it. The lender assesses you again as it would for any new lending, looking at income, costs and an up-to-date value of the property, so the amount approved can be less than your equity suggests.",
    ],
    seeAlso: ["Equity", "Restructure", "Refinancing", "Loan-to-value ratio"],
  },
  {
    term: "Unit title",
    categories: ["mortgages"],
    body: [
      "Ownership of a unit, usually an apartment or townhouse, inside a development, together with a share of the common property. Every owner belongs to the body corporate, which looks after the shared parts and charges levies. Before you buy, the seller has to give you a disclosure statement about the unit and the body corporate, and some lenders look at the development closely too.",
    ],
    seeAlso: ["Body corporate", "Due diligence", "Cross-lease", "Record of Title"],
  },
  {
    term: "Vendor",
    categories: ["mortgages"],
    body: [
      "The seller. Sale and purchase agreements and real estate agents say “vendor” and “purchaser”. The agent selling a property works for the vendor, not for you, even while showing you around. They must still treat buyers fairly and tell you about known problems with the property. Only a buyer's agent works for the buyer.",
    ],
    seeAlso: ["Sale and purchase agreement", "Property valuation", "Settlement"],
  },
  {
    term: "Wealth",
    categories: ["investing"],
    body: [
      "What you own that holds or grows its value and can support your life without depending on your next pay: property, investments, KiwiSaver, a business. It is not the same as income. A high income can sit alongside very little wealth, and the reverse. Net worth measures wealth at one point in time; building wealth is about what happens to that number over years.",
    ],
    seeAlso: ["Net worth", "Wealth management", "Asset", "Compounding"],
  },
  {
    term: "Wealth management",
    categories: ["investing"],
    body: [
      "Looking after someone's finances as a whole over the long term, rather than one product at a time. It brings together investments, property, KiwiSaver and debt, working towards goals such as financial independence or retirement, with regular reviews as life changes. The tax and legal questions within it, such as structures, trusts and wills, sit with an accountant and a lawyer working alongside.",
    ],
    seeAlso: ["Wealth", "Financial plan", "Risk profile", "Asset allocation"],
  },
  {
    term: "XIRR",
    categories: ["investing"],
    body: [
      "The annualised return on an investment when money has been added or withdrawn at different times. It takes the timing of each cash flow into account, giving a more realistic picture of your actual investment return.",
    ],
    seeAlso: ["Return", "Compounding", "Cash flow"],
  },
  {
    term: "Yield",
    categories: ["investing"],
    body: [
      "The income an investment pays in a year, such as interest, dividends or rent, as a share of its value or price. It leaves out any change in that value, and that is what separates it from return, which adds the rise or fall. A high yield is not automatically a better investment. It can reflect higher risk, or a price that has fallen.",
    ],
    seeAlso: ["Return", "Rental yield", "Compounding"],
  },
  {
    term: "Zoning",
    categories: ["mortgages", "investing"],
    body: [
      "The council's rules for how land may be used, set in the district plan: whether a site is residential, rural, commercial or something else, and what can be built on it. That covers how big, how close to the boundaries, and whether the site can be subdivided. Zoning shows on the LIM report. It shapes what you can do with a property, now and later, and so its value; building something the zone does not permit needs a resource consent.",
    ],
    seeAlso: ["LIM report", "Due diligence", "Investment property"],
  },
];

/**
 * Every term A–Z, with its anchor and its see-also links resolved.
 *
 * Sorted here rather than trusted to the order above, so a new term can go in
 * anywhere. Accents are ignored for sorting, which files Kāinga Ora under K
 * ahead of KiwiSaver. A duplicate anchor or a see-also that names no term
 * throws — that fails the build instead of shipping a dead link.
 */
export function glossaryEntries(): GlossaryEntry[] {
  const bySlug = new Map<string, GlossaryTerm>();
  for (const term of TERMS) {
    const slug = glossarySlug(term.term);
    if (bySlug.has(slug)) throw new Error(`Glossary: two terms share the anchor "${slug}".`);
    bySlug.set(slug, term);
  }

  const sortKey = (term: string) => foldAccents(term).toLowerCase();

  return [...TERMS]
    .sort((a, b) => (sortKey(a.term) < sortKey(b.term) ? -1 : 1))
    .map((term) => ({
      ...term,
      slug: glossarySlug(term.term),
      letter: sortKey(term.term)[0].toUpperCase(),
      related: term.seeAlso.map((name) => {
        const target = bySlug.get(glossarySlug(name));
        if (!target) {
          throw new Error(`Glossary: "${term.term}" links to "${name}", which is not a term.`);
        }
        return { term: target.term, slug: glossarySlug(target.term) };
      }),
    }));
}
