import type { Metadata } from "next";
import BusinessAdvisoryContent from "./page-content";
import { JsonLd } from "@/components/json-ld";
import { getBreadcrumbSchema, SITE_URL } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Business Advisory Services NZ | Valar Financial Advisors",
  description:
    "AI-driven business advisory for New Zealand business owners. Build a finance system with AI-powered tools and strategic guidance from Valar Financial Advisors.",
  alternates: { canonical: "/services/business-advisory" },
  openGraph: {
    images: ["/opengraph.jpg"],
    title: "Business Advisory Services NZ | Valar Financial Advisors",
    description:
      "AI-driven business advisory — helping business owners build a finance system with AI-powered tools and strategic guidance.",
    url: "/services/business-advisory",
    type: "website",
  },
};

const breadcrumbs = getBreadcrumbSchema([
  { name: "Home", url: `${SITE_URL}/` },
  { name: "Services", url: `${SITE_URL}/services` },
  { name: "Business Advisory", url: `${SITE_URL}/services/business-advisory` },
]);

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <BusinessAdvisoryContent />
    </>
  );
}
