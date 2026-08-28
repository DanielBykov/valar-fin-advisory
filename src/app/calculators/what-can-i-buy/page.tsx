import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { calculatorVisible } from "@/lib/calculators";
import WhatCanIBuyContent from "./page-content";

export const metadata: Metadata = {
  title: "How Much Can I Afford? First Home Buyer Calculator NZ | Valar",
  description:
    "Work out what you can realistically buy as a first home buyer in New Zealand — on your income, spending, debts and deposit — and see whether it is your deposit or your income setting the ceiling.",
  openGraph: {
    images: ["/opengraph.jpg"],
    title: "How Much Can I Afford? First Home Buyer Calculator NZ | Valar",
    description:
      "A realistic purchase price on your own numbers, and the one thing standing between you and a bigger one.",
  },
};

export default function Page() {
  if (!calculatorVisible("what-can-i-buy")) notFound();
  return <WhatCanIBuyContent />;
}
