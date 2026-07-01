// Order matters: the page renders the first 7 in the left column and the
// rest in the right column (see page-content.tsx). Keep all entries here so
// the visible FAQ and the FAQPage schema stay in sync.
export const faqs: { question: string; answer: string | string[] }[] = [
  // Left column
  {
    question: "When should I speak with a mortgage adviser?",
    answer: "As early as possible. Many clients speak with us months or even years before they buy. Early planning helps you understand your borrowing capacity, deposit requirements, and possible lending options.",
  },
  {
    question: "How much deposit do I need?",
    answer: "Many buyers assume they need a 20% deposit, but this is not always the case. Depending on your situation and lender criteria, smaller deposits may be possible.",
  },
  {
    question: "Can I buy with a 5% deposit?",
    answer: "In some situations, yes. Eligibility depends on lender requirements, income, deposit sources, and the property being purchased.",
  },
  {
    question: "Can I use KiwiSaver?",
    answer: "Eligible first-home buyers may be able to use KiwiSaver as part of their deposit.",
  },
  {
    question: "How much can I borrow?",
    answer: ["Your income", "Your expenses", "Existing debt", "Dependants", "Deposit size", "Lender criteria"],
  },
  {
    question: "Do I need pre-approval before looking for a property?",
    answer: "Not always. Some buyers obtain pre-approval first, while others proceed through a live deal where a specific property is assessed by the lender.",
  },
  {
    question: "What is a live deal?",
    answer: "A live deal means there is a specific property under contract and a signed Sale & Purchase Agreement has been submitted to the lender for assessment.",
  },
  // Right column
  {
    question: "Why speak with an adviser without pre-approval?",
    answer: "A mortgage adviser can help you understand your likely borrowing range, prepare documents, identify suitable lenders, and avoid unnecessary delays when you find a property.",
  },
  {
    question: "What costs should I expect?",
    answer: [
      "Legal fees: approximately $1,500–$5,000+",
      "Building inspection: approximately $650–$1,000+",
      "Valuation: approximately $800–$1,300+ (if required)",
      "Moving costs",
      "Ongoing: rates, insurance, maintenance, utilities",
      "Note: some lenders may offer cashback around $5,000",
    ],
  },
  {
    question: "Do I need to pay for mortgage advice?",
    answer: "In most cases, no. Mortgage advisory services are generally paid by the lender after settlement.",
  },
  {
    question: "How long should I allow for finance approval?",
    answer: "For live deals, we commonly suggest allowing approximately 10–15 working days for finance approval conditions. We generally recommend allowing at least 10 working days, and preferably 15 working days, to allow enough time for lender assessment, legal review, valuation requirements, and inspections.",
  },
  {
    question: "Can I buy at auction?",
    answer: "Yes, but auctions can be challenging for first-home buyers because most due diligence must be completed before auction day and the purchase is usually unconditional.",
  },
  {
    question: "Can my parents help me buy a home?",
    answer: "Potentially, yes. Some buyers receive assistance through gifted deposits, guarantees, or other family support arrangements.",
  },
  {
    question: "What happens if my application is declined?",
    answer: "A decline from one lender does not necessarily mean home ownership is not possible. Different lenders have different lending criteria and alternative options may be available.",
  },
];
