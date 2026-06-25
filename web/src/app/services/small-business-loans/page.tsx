import type { Metadata } from "next";
import SmallBusinessLoansContent from "./page-content";
import { JsonLd } from "@/components/json-ld";
import { getBreadcrumbSchema, SITE_URL } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Small Business Finance Adviser NZ | Valar Financial Advisors",
  description:
    "Small business loan advice in New Zealand. Helping owners access funding for growth and working capital, with strategic lending guidance from Valar.",
  alternates: { canonical: "/services/small-business-loans" },
  openGraph: {
    title: "Small Business Finance Adviser NZ | Valar Financial Advisors",
    description:
      "Helping small business owners access funding for growth and working capital, with strategic lending advice from Valar.",
    url: "/services/small-business-loans",
    type: "website",
  },
};

const breadcrumbs = getBreadcrumbSchema([
  { name: "Home", url: `${SITE_URL}/` },
  { name: "Services", url: `${SITE_URL}/services` },
  { name: "Small Business Loans", url: `${SITE_URL}/services/small-business-loans` },
]);

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <SmallBusinessLoansContent />
    </>
  );
}
