import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FaqContent from "./page-content";
import { JsonLd } from "@/components/json-ld";
import { INSIGHTS_LIVE } from "@/lib/insights";
import { faqCategories, faqItems, faqPlainAnswer } from "@/lib/faqs";
import { getBreadcrumbSchema, getFaqSchema, SITE_URL } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Mortgage & Financial FAQ NZ | Valar Financial Advisors",
  description:
    "Straight answers to the questions New Zealanders actually ask about deposits, KiwiSaver, borrowing power, pre-approval, investment property and business lending.",
  alternates: { canonical: "/insights/faq" },
  openGraph: {
    images: ["/opengraph.jpg"],
    title: "Mortgage & Financial FAQ NZ | Valar Financial Advisors",
    description:
      "Straight answers on deposits, KiwiSaver, borrowing power, pre-approval, investment property and business lending in New Zealand.",
    url: "/insights/faq",
    type: "website",
  },
};

const breadcrumbs = getBreadcrumbSchema([
  { name: "Home", url: `${SITE_URL}/` },
  { name: "Insights", url: `${SITE_URL}/insights` },
  { name: "FAQ", url: `${SITE_URL}/insights/faq` },
]);

export default function Page() {
  if (!INSIGHTS_LIVE && process.env.NODE_ENV !== "development") notFound();

  const categories = faqCategories();
  // Schema is built from the same list the page renders, so the two can't drift.
  const schema = getFaqSchema(
    faqItems().map((item) => ({ question: item.question, answer: faqPlainAnswer(item) })),
  );

  return (
    <>
      <JsonLd data={[breadcrumbs, schema]} />
      <FaqContent categories={categories} />
    </>
  );
}
