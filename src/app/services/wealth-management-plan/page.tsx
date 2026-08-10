import type { Metadata } from "next";
import WealthManagementContent from "./page-content";
import { JsonLd } from "@/components/json-ld";
import { getBreadcrumbSchema, SITE_URL } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Wealth Management Advice NZ | Valar Financial Advisors",
  description:
    "Wealth management advice for New Zealanders. A clear roadmap to build long-term wealth, aligning property, lending and financial decisions with your future.",
  alternates: { canonical: "/services/wealth-management-plan" },
  openGraph: {
    images: ["/opengraph.jpg"],
    title: "Wealth Management Advice NZ | Valar Financial Advisors",
    description:
      "A clear roadmap to help you build long-term wealth, aligning your property, lending and financial decisions with your future.",
    url: "/services/wealth-management-plan",
    type: "website",
  },
};

const breadcrumbs = getBreadcrumbSchema([
  { name: "Home", url: `${SITE_URL}/` },
  { name: "Services", url: `${SITE_URL}/services` },
  { name: "Wealth Management Plan", url: `${SITE_URL}/services/wealth-management-plan` },
]);

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <WealthManagementContent />
    </>
  );
}
