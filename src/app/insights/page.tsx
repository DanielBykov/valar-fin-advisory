import type { Metadata } from "next";
import InsightsContent from "./page-content";

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
  return <InsightsContent />;
}
