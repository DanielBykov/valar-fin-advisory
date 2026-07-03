import type { Metadata } from "next";
import HomeContent from "./page-content";
import { JsonLd } from "@/components/json-ld";
import { getLocalBusinessSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Mortgage & Financial Advisers NZ | Valar",
  description:
    "Independent mortgage and financial advice in NZ. Valar helps you structure property, lending and wealth decisions for the long term. Book a clarity call.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Mortgage & Financial Advisers NZ | Valar",
    description:
      "Independent mortgage and financial advice in New Zealand. Beyond approvals and rates — clarity for your lending and financial decisions.",
    url: "/",
    type: "website",
    images: ["/opengraph.jpg"],
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
