import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { calculatorVisible } from "@/lib/calculators";
import WhatCanIBuyContent from "./page-content";

export const metadata: Metadata = {
  title: "How Much Can I Borrow? Home Loan Calculator NZ | Valar",
  description:
    "Start from the repayment you'd be comfortable with and see the loan it carries.",
  openGraph: {
    images: ["/opengraph.jpg"],
    title: "How Much Can I Borrow? Home Loan Calculator NZ | Valar",
    description:
      "Start from the repayment you'd be comfortable with and see the loan it carries.",
  },
};

export default function Page() {
  if (!calculatorVisible("what-can-i-buy")) notFound();
  return <WhatCanIBuyContent />;
}
