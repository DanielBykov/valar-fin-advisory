import type { Metadata } from "next";
import FinancialPlanningContent from "./page-content";
import { JsonLd } from "@/components/json-ld";
import { getBreadcrumbSchema, SITE_URL } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Personal Financial Planning NZ | Valar Financial Advisors",
  description:
    "Personal financial planning for New Zealanders. Clear direction for where you are today and where you want to be, with Valar Financial Advisors.",
  alternates: { canonical: "/services/financial-planning" },
  openGraph: {
    title: "Personal Financial Planning NZ | Valar Financial Advisors",
    description:
      "Financial planning built around your goals — clear direction for today's decisions and tomorrow's outcomes.",
    url: "/services/financial-planning",
    type: "website",
  },
};

const breadcrumbs = getBreadcrumbSchema([
  { name: "Home", url: `${SITE_URL}/` },
  { name: "Services", url: `${SITE_URL}/services` },
  { name: "Financial Planning", url: `${SITE_URL}/services/financial-planning` },
]);

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <FinancialPlanningContent />
    </>
  );
}
