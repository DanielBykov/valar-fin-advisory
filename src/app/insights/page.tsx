import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InsightsContent, { type GlossaryTeaser } from "./page-content";
import { GLOSSARY_LIVE, INSIGHTS_LIVE } from "@/lib/insights";
import { faqItems } from "@/lib/faqs";
import { glossaryEntries } from "@/lib/glossary";

export const metadata: Metadata = {
  title: "Insights | Mortgage & Financial Tips | Valar",
  description:
    "Analysis, market updates, and strategic guidance from the Valar advisory team. Practical insights on mortgages, property and financial planning in New Zealand.",
  openGraph: {
    images: ["/opengraph.jpg"],
    title: "Insights | Mortgage & Financial Tips | Valar",
    description:
      "Analysis, market updates, and strategic guidance from the Valar advisory team on mortgages, property and financial planning.",
  },
};

/** The terms the hub's glossary card links to, by anchor, in the order shown. */
const GLOSSARY_FEATURED = [
  "loan-to-value-ratio",
  "break-fee",
  "refix",
  "cash-contribution",
  "kiwisaver-first-home-withdrawal",
  "bright-line-test",
  // Seventh by Lena's call, 2026-09-14: evens the second row up with the first
  // on a wide screen, and puts an investing term next to five mortgage ones.
  "asset-allocation",
];

/*
 * Built here rather than in page-content so the client bundle carries a handful
 * of term names, not all the definitions. Same visibility as the glossary's menu link.
 */
function glossaryTeaser(): GlossaryTeaser | null {
  if (!GLOSSARY_LIVE && process.env.NODE_ENV !== "development") return null;

  const entries = glossaryEntries();
  const featured = GLOSSARY_FEATURED.map((slug) => {
    const entry = entries.find((e) => e.slug === slug);
    // Renaming a term changes its anchor. Fail the build rather than ship a dead link.
    if (!entry) throw new Error(`Insights hub: the glossary card names "${slug}", which is not a term.`);
    return { slug, term: entry.term };
  });

  return { count: entries.length, featured };
}

export default function Page() {
  // Section stays private until Lena flips INSIGHTS_LIVE in src/lib/insights.ts.
  // Always reachable when running the site locally.
  if (!INSIGHTS_LIVE && process.env.NODE_ENV !== "development") notFound();

  // Teaser only — the full set lives on /insights/faq. Read here because the
  // FAQ source is a file on disk and page-content is a client component.
  return <InsightsContent faqs={faqItems().slice(0, 6)} glossary={glossaryTeaser()} />;
}
