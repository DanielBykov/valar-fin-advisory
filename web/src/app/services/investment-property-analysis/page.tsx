import type { Metadata } from "next";
import InvestmentPropertyAnalysisContent from "./page-content";
import { JsonLd } from "@/components/json-ld";
import { getBreadcrumbSchema, SITE_URL } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Investment Property Mortgage Advice NZ | Valar",
  description:
    "Investment property mortgage advice in New Zealand. Financial modelling and strategic analysis to support better property investment and financing decisions.",
  alternates: { canonical: "/services/investment-property-analysis" },
  openGraph: {
    title: "Investment Property Mortgage Advice NZ | Valar",
    description:
      "Financial modelling and strategic analysis to support better investment property decisions in New Zealand.",
    url: "/services/investment-property-analysis",
    type: "website",
  },
};

const breadcrumbs = getBreadcrumbSchema([
  { name: "Home", url: `${SITE_URL}/` },
  { name: "Services", url: `${SITE_URL}/services` },
  { name: "Investment Property Analysis", url: `${SITE_URL}/services/investment-property-analysis` },
]);

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <InvestmentPropertyAnalysisContent />
    </>
  );
}
