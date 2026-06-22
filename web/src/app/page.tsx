import type { Metadata } from "next";
import HomeContent from "./page-content";

export const metadata: Metadata = {
  title: "Mortgage & Financial Advisers NZ | Valar Financial Advisors",
  description:
    "Strategic mortgage and financial advice in New Zealand. Beyond approvals and rates — clarity for your lending and financial decisions. Book a clarity call today.",
  openGraph: {
    title: "Mortgage & Financial Advisers NZ | Valar Financial Advisors",
    description:
      "Strategic mortgage and financial advice in New Zealand. Beyond approvals and rates — clarity for your lending and financial decisions.",
  },
};

export default function Page() {
  return <HomeContent />;
}
