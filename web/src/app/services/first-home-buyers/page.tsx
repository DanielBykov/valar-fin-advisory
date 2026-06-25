import type { Metadata } from "next";
import FirstHomeBuyersContent from "./page-content";
import { JsonLd } from "@/components/json-ld";
import { getBreadcrumbSchema, SITE_URL } from "@/lib/schema";

export const metadata: Metadata = {
  title: "First Home Buyer Advice NZ | KiwiSaver, Deposit, Mortgage | Valar",
  description:
    "First home buyer advice in New Zealand. Independent guidance on KiwiSaver first home withdrawal, deposit, LVR, pre-approval and choosing a lender. Free guide.",
  alternates: { canonical: "/services/first-home-buyers" },
  openGraph: {
    title: "First Home Buyer Advice NZ | KiwiSaver, Deposit, Mortgage | Valar",
    description:
      "Independent first home buyer advice for New Zealanders — KiwiSaver, deposit, pre-approval and lender selection. From questions to a confident first step.",
    url: "/services/first-home-buyers",
    type: "website",
  },
};

const breadcrumbs = getBreadcrumbSchema([
  { name: "Home", url: `${SITE_URL}/` },
  { name: "Services", url: `${SITE_URL}/services` },
  { name: "First Home Buyers", url: `${SITE_URL}/services/first-home-buyers` },
]);

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <FirstHomeBuyersContent />
    </>
  );
}
