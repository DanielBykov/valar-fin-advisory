import type { Metadata } from "next";
import MortgageAdviceContent from "./page-content";

export const metadata: Metadata = {
  title: "Mortgage Advice in New Zealand | Valar Financial Advisors",
  description:
    "Strategic mortgage advice in New Zealand for first home buyers, homeowners, investors and business owners. We focus on the bigger financial picture, not just the rate.",
  openGraph: {
    title: "Mortgage Advice in New Zealand | Valar Financial Advisors",
    description:
      "Strategic mortgage advice for first home buyers, homeowners, investors and business owners. We focus on the bigger financial picture, not just the rate.",
  },
};

export default function Page() {
  return <MortgageAdviceContent />;
}
