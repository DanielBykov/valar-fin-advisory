import type { Metadata } from "next";
import WealthManagementContent from "./page-content";

export const metadata: Metadata = {
  title: "Wealth Management Planning NZ | Valar Financial Advisors",
  description:
    "A clear roadmap to help you build long-term wealth. Valar's wealth management planning aligns your property, lending and financial decisions with your future in NZ.",
  openGraph: {
    title: "Wealth Management Planning NZ | Valar Financial Advisors",
    description:
      "A clear roadmap to help you build long-term wealth, aligning your property, lending and financial decisions with your future.",
  },
};

export default function Page() {
  return <WealthManagementContent />;
}
