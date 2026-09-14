import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { calculatorVisible } from "@/lib/calculators";
import RepaymentsContent from "./page-content";

export const metadata: Metadata = {
  title: "Mortgage Repayment Calculator NZ | Valar",
  description:
    "Work out mortgage repayments on any loan amount, rate and term — weekly, fortnightly or monthly — and see on a chart how much sooner an extra repayment clears the loan.",
  openGraph: {
    images: ["/opengraph.jpg"],
    title: "Mortgage Repayment Calculator NZ | Valar",
    description:
      "Work out mortgage repayments and see what paying extra each time saves you over the life of the loan.",
  },
};

export default function Page() {
  if (!calculatorVisible("repayments")) notFound();
  return <RepaymentsContent />;
}
