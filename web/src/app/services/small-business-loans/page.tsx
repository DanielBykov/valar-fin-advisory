import type { Metadata } from "next";
import SmallBusinessLoansContent from "./page-content";

export const metadata: Metadata = {
  title: "Small Business Loans NZ | Valar Financial Advisors",
  description:
    "Helping New Zealand small business owners access funding for growth and working capital. Strategic lending advice and support from Valar Financial Advisors.",
  openGraph: {
    title: "Small Business Loans NZ | Valar Financial Advisors",
    description:
      "Helping small business owners access funding for growth and working capital, with strategic lending advice from Valar.",
  },
};

export default function Page() {
  return <SmallBusinessLoansContent />;
}
