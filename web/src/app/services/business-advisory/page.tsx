import type { Metadata } from "next";
import BusinessAdvisoryContent from "./page-content";

export const metadata: Metadata = {
  title: "Business Advisory Services NZ | Valar Financial Advisors",
  description:
    "AI-driven business advisory for New Zealand business owners. Build a finance system with AI-powered tools and strategic guidance from Valar Financial Advisors.",
  openGraph: {
    title: "Business Advisory Services NZ | Valar Financial Advisors",
    description:
      "AI-driven business advisory — helping business owners build a finance system with AI-powered tools and strategic guidance.",
  },
};

export default function Page() {
  return <BusinessAdvisoryContent />;
}
