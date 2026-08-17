import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InsightsContent from "./page-content";
import { INSIGHTS_LIVE } from "@/lib/insights";
import { faqItems } from "@/lib/faqs";

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

export default function Page() {
  // Section stays private until Lena flips INSIGHTS_LIVE in src/lib/insights.ts.
  // Always reachable when running the site locally.
  if (!INSIGHTS_LIVE && process.env.NODE_ENV !== "development") notFound();

  // Teaser only — the full set lives on /insights/faq. Read here because the
  // FAQ source is a file on disk and page-content is a client component.
  return <InsightsContent faqs={faqItems().slice(0, 6)} />;
}
