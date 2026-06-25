import type { Metadata } from "next";
import MortgageAdviceContent from "./page-content";
import { JsonLd } from "@/components/json-ld";
import { getBreadcrumbSchema, SITE_URL } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Independent Mortgage Adviser NZ | Valar Financial Advisors",
  description:
    "Independent mortgage advice in New Zealand for first home buyers, homeowners, investors and business owners. Strategic guidance — not just the rate.",
  alternates: { canonical: "/services/mortgage-advice" },
  openGraph: {
    title: "Independent Mortgage Adviser NZ | Valar Financial Advisors",
    description:
      "Strategic mortgage advice for first home buyers, homeowners, investors and business owners. We focus on the bigger financial picture, not just the rate.",
    url: "/services/mortgage-advice",
    type: "website",
  },
};

const breadcrumbs = getBreadcrumbSchema([
  { name: "Home", url: `${SITE_URL}/` },
  { name: "Services", url: `${SITE_URL}/services` },
  { name: "Mortgage Advice", url: `${SITE_URL}/services/mortgage-advice` },
]);

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <MortgageAdviceContent />
    </>
  );
}
