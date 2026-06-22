import type { Metadata } from "next";
import FirstHomeBuyersContent from "./page-content";

export const metadata: Metadata = {
  title: "First Home Buyer Mortgages NZ | Valar Financial Advisors",
  description:
    "Your first home starts here. Valar guides New Zealand first home buyers from questions and confusion to a clear plan and a confident first step. Download our free guide.",
  openGraph: {
    title: "First Home Buyer Mortgages NZ | Valar Financial Advisors",
    description:
      "Valar guides first home buyers from questions and confusion to a clear plan and a confident first step.",
  },
};

export default function Page() {
  return <FirstHomeBuyersContent />;
}
