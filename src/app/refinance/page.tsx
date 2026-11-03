import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { REFINANCE_LIVE } from "@/lib/refinance";
import RefinanceContent from "./page-content";

const TITLE = "Refinance Your Mortgage NZ | Valar Financial Advisors";
const DESCRIPTION =
  "Enter your mortgage balance, rate, repayment and the date your fixed rate ends. See what your repayment could be if you refinance, and what it could cost.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/refinance" },
  openGraph: {
    images: ["/opengraph.jpg"],
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function Page() {
  // Local development always renders it, the same rule the calculators follow.
  if (!REFINANCE_LIVE && process.env.NODE_ENV !== "development") notFound();
  return <RefinanceContent />;
}
