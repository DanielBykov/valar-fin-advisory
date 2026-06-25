import type { Metadata } from "next";
import BookContent from "./page-content";

export const metadata: Metadata = {
  title: "Book a Clarity Call | Valar Financial Advisors",
  description:
    "Book a free 15–20 minute clarity call with Valar Financial Advisors. Pick a time that works for you and get clear, strategic mortgage and financial advice.",
  alternates: { canonical: "/book" },
  openGraph: {
    title: "Book a Clarity Call | Valar Financial Advisors",
    description:
      "Book a free 15–20 minute clarity call with Valar Financial Advisors. Pick a time that works for you.",
  },
};

export default function Page() {
  return <BookContent />;
}
