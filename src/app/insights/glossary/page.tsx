import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GlossaryContent from "./page-content";
import { JsonLd } from "@/components/json-ld";
import { GLOSSARY_LIVE, INSIGHTS_LIVE } from "@/lib/insights";
import { GLOSSARY_CATEGORIES, glossaryEntries, glossaryPlainText } from "@/lib/glossary";
import { getBreadcrumbSchema, getGlossarySchema, SITE_URL } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Mortgage, KiwiSaver & Investing Glossary NZ | Valar Financial Advisors",
  description:
    "Plain-English definitions of the words New Zealanders meet in a home loan, a house purchase, KiwiSaver and investing, from LVR and break fees to asset allocation.",
  alternates: { canonical: "/insights/glossary" },
  openGraph: {
    images: ["/opengraph.jpg"],
    title: "Mortgage, KiwiSaver & Investing Glossary NZ | Valar Financial Advisors",
    description:
      "What the words in a home loan, a purchase agreement, KiwiSaver and an investment actually mean — in plain English.",
    url: "/insights/glossary",
    type: "website",
  },
};

const PAGE_URL = `${SITE_URL}/insights/glossary`;

const breadcrumbs = getBreadcrumbSchema([
  { name: "Home", url: `${SITE_URL}/` },
  { name: "Insights", url: `${SITE_URL}/insights` },
  { name: "Glossary", url: PAGE_URL },
]);

export default function Page() {
  if (!(INSIGHTS_LIVE && GLOSSARY_LIVE) && process.env.NODE_ENV !== "development") notFound();

  const entries = glossaryEntries();
  // Built from the same entries the page renders, so the two can't drift.
  const schema = getGlossarySchema(
    PAGE_URL,
    "Valar Financial Advisors glossary",
    entries.map((entry) => ({
      name: entry.term,
      description: glossaryPlainText(entry),
      slug: entry.slug,
    })),
  );

  return (
    <>
      <JsonLd data={[breadcrumbs, schema]} />
      <GlossaryContent entries={entries} categories={GLOSSARY_CATEGORIES} />
    </>
  );
}
