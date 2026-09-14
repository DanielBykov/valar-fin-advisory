import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { calculatorVisible } from "@/lib/calculators";
import SplitLoanContent from "./page-content";

export const metadata: Metadata = {
  title: "Split Home Loan Calculator NZ | Valar Financial Advisors",
  description:
    "Split a New Zealand home loan into three parts, each with its own rate, term and extra repayment, and see the combined repayment and the weighted average rate across the whole structure.",
  openGraph: {
    images: ["/opengraph.jpg"],
    title: "Split Home Loan Calculator NZ | Valar Financial Advisors",
    description:
      "Three parts, three rates, three terms — and what the whole loan actually costs you.",
  },
};

export default function Page() {
  if (!calculatorVisible("split-loan")) notFound();
  return <SplitLoanContent />;
}
