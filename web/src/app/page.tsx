import type { Metadata } from "next";
import HomeContent from "./page-content";
import { JsonLd } from "@/components/json-ld";
import { getLocalBusinessSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Mortgage & Financial Advisers NZ | Valar Financial Advisors",
  description:
    "Independent mortgage and financial advice in New Zealand from Lena Bykova. Beyond approvals and rates — clarity for your lending and financial decisions. Book a clarity call today.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Mortgage & Financial Advisers NZ | Valar Financial Advisors",
    description:
      "Independent mortgage and financial advice in New Zealand. Beyond approvals and rates — clarity for your lending and financial decisions.",
    url: "/",
    type: "website",
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={getLocalBusinessSchema()} />
      <HomeContent />
    </>
  );
}
