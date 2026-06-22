import type { Metadata } from "next";
import InvestmentPropertyAnalysisContent from "./page-content";

export const metadata: Metadata = {
  title: "Investment Property Analysis NZ | Valar Financial Advisors",
  description:
    "Financial modelling and strategic analysis to support better investment property decisions in New Zealand. See the nuances behind the numbers with Valar.",
  openGraph: {
    title: "Investment Property Analysis NZ | Valar Financial Advisors",
    description:
      "Financial modelling and strategic analysis to support better investment property decisions in New Zealand.",
  },
};

export default function Page() {
  return <InvestmentPropertyAnalysisContent />;
}
