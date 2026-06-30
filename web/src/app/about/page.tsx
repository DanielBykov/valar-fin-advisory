import type { Metadata } from "next";
import AboutContent from "./page-content";
import { JsonLd } from "@/components/json-ld";
import { getPersonSchema, getBreadcrumbSchema, SITE_URL } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Lena Bykova — Mortgage & Investment Adviser NZ | Valar",
  description:
    "Lena Bykova is a licensed mortgage and financial adviser in New Zealand (FSP1010055) with 20+ years across finance, valuation and investment analysis. Learn about Valar.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Lena Bykova — Mortgage & Investment Adviser NZ | Valar",
    description:
      "Licensed financial adviser (FSP1010055) with 20+ years in finance. Meet Lena Bykova and the approach behind Valar Financial Advisors.",
    url: "/about",
    type: "profile",
  },
};

const breadcrumbs = getBreadcrumbSchema([
  { name: "Home", url: `${SITE_URL}/` },
  { name: "About", url: `${SITE_URL}/about` },
]);

export default function Page() {
  return (
    <>
      <JsonLd data={[getPersonSchema(), breadcrumbs]} />
      <AboutContent />
    </>
  );
}
