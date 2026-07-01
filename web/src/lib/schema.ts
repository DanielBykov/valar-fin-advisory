/**
 * JSON-LD schema builders for SEO structured data.
 *
 * Reference: https://schema.org and Google's Rich Results guidelines.
 * All builders return plain objects intended for `JSON.stringify` in a
 * `<script type="application/ld+json">` tag via the `<JsonLd />` component.
 */

export const SITE_URL = "https://valar.co.nz";

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const PERSON_ID = `${SITE_URL}/#lena-bykova`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const SOCIAL_PROFILES = [
  "https://www.linkedin.com/company/valar-advisors",
  "https://www.instagram.com/lena.valarnz/",
  "https://www.facebook.com/lena.valarnz",
];

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: "Valar Financial Advisors",
    legalName: "Valar Financial Advisor Ltd.",
    url: SITE_URL,
    logo: `${SITE_URL}/images/valar-logo.png`,
    email: "lena.bykova@valar.co.nz",
    sameAs: SOCIAL_PROFILES,
    founder: { "@id": PERSON_ID },
  };
}

export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: "Valar Financial Advisors",
    description:
      "Strategic mortgage and financial advice in New Zealand — clarity for your financial future.",
    publisher: { "@id": ORGANIZATION_ID },
    inLanguage: "en-NZ",
  };
}

export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "@id": `${SITE_URL}/#localbusiness`,
    name: "Valar Financial Advisors",
    url: SITE_URL,
    logo: `${SITE_URL}/images/valar-logo.png`,
    image: `${SITE_URL}/opengraph.jpg`,
    description:
      "Independent mortgage and financial advisory in New Zealand. Strategic advice on home loans, KiwiSaver, investment property, wealth planning and small business lending.",
    email: "lena.bykova@valar.co.nz",
    priceRange: "$$",
    areaServed: {
      "@type": "Country",
      name: "New Zealand",
    },
    serviceType: [
      "Mortgage Advice",
      "Financial Planning",
      "Wealth Management",
      "Investment Property Analysis",
      "Small Business Loans",
      "Business Advisory",
      "First Home Buyer Advice",
    ],
    founder: { "@id": PERSON_ID },
    employee: { "@id": PERSON_ID },
    sameAs: SOCIAL_PROFILES,
    identifier: {
      "@type": "PropertyValue",
      propertyID: "Financial Service Provider Number",
      value: "FSP1010055",
    },
  };
}

export function getPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Lena Bykova",
    jobTitle: "Mortgage & Investment Adviser",
    description:
      "Licensed financial adviser with 20+ years across finance, valuation, investment analysis and business advisory in New Zealand.",
    url: `${SITE_URL}/about`,
    image: `${SITE_URL}/images/lena-portrait.jpg`,
    worksFor: { "@id": ORGANIZATION_ID },
    sameAs: [
      "https://www.linkedin.com/in/lenabykova/",
      "https://www.linkedin.com/company/valar-advisors",
    ],
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "degree",
        name: "Master's Degree in Finance & Accounting",
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "degree",
        name: "Graduate Diploma (Level 7) in Information Technology, Business Intelligence & Generative AI",
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "certificate",
        name: "NZ Certificate in Financial Services (Level 5) — Residential Property Lending",
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "certificate",
        name: "NZ Certificate in Financial Services (Level 5) — Investment",
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "license",
        name: "Licensed Financial Adviser",
        identifier: "FSP1010055",
      },
    ],
    knowsAbout: [
      "Mortgage Advice",
      "Financial Planning",
      "Investment Analysis",
      "Cash Flow & Financial Modelling",
      "Property Investment",
      "Business Performance & Growth",
      "KiwiSaver",
    ],
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Accepts either {question, answer} or {q, a}; answer may be a string or a
 *  list of strings (joined for the schema text). */
export type FaqEntry =
  | { question: string; answer: string | string[] }
  | { q: string; a: string | string[] };

/**
 * FAQPage structured data. Pass the SAME array the page renders its visible
 * FAQ from, so the on-page answers and the schema can never drift — Google
 * requires FAQ rich-result text to match the visible content.
 */
export function getFaqSchema(items: FaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => {
      const question = "question" in item ? item.question : item.q;
      const rawAnswer = "answer" in item ? item.answer : item.a;
      const answer = Array.isArray(rawAnswer) ? rawAnswer.join(" ") : rawAnswer;
      return {
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      };
    }),
  };
}
