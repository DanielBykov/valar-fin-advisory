import type { Metadata } from "next";
import FinancialPlanningContent from "./page-content";

export const metadata: Metadata = {
  title: "Financial Planning Services NZ | Valar Financial Advisors",
  description:
    "Financial planning built around your goals. Get clear financial direction for where you are today and where you want to be, with Valar Financial Advisors in NZ.",
  openGraph: {
    title: "Financial Planning Services NZ | Valar Financial Advisors",
    description:
      "Financial planning built around your goals — clear financial direction for where you are today and where you want to be.",
  },
};

export default function Page() {
  return <FinancialPlanningContent />;
}
