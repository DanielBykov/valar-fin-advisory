import type { Metadata } from "next";
import ServicesContent from "./page-content";
import { JsonLd } from "@/components/json-ld";
import { getBreadcrumbSchema, SITE_URL } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Mortgage & Financial Advisory Services NZ | Valar",
  description:
    "Explore Valar's services — mortgage advice, financial planning, wealth management, investment property analysis and business advisory, tailored to your goals in NZ.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Mortgage & Financial Advisory Services NZ | Valar",
    description:
      "Mortgage advice, financial planning, wealth management, investment property analysis and business advisory — tailored to your property ambitions and wealth growth.",
    url: "/services",
    type: "website",
  },
};

const breadcrumbs = getBreadcrumbSchema([
  { name: "Home", url: `${SITE_URL}/` },
  { name: "Services", url: `${SITE_URL}/services` },
]);

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <ServicesContent />
    </>
  );
}
