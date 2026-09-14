import type { Metadata } from "next";
import CardContent from "./page-content";

export const metadata: Metadata = {
  title: "Lena Bykova | Valar Financial Advisors",
  description:
    "Save Lena Bykova's contact details. Mortgage, investment property and business lending advice in New Zealand.",
  // Unlisted, like /start: people arrive from the QR code on Lena's printed
  // card, not from search. noindex rather than a robots.txt disallow, for the
  // reason given on /start.
  robots: { index: false, follow: false },
  alternates: { canonical: "https://valar.co.nz/card" },
  openGraph: {
    title: "Lena Bykova | Valar Financial Advisors",
    description: "Mortgage & Investment Adviser. Save my contact details.",
    images: ["/opengraph.jpg"],
  },
};

export default function Page() {
  return <CardContent />;
}
