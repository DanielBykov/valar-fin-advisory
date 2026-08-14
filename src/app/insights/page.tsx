import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InsightsContent from "./page-content";
import { INSIGHTS_LIVE } from "@/lib/insights";

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

  return <InsightsContent />;
}
