import type { Metadata } from "next";
import StartContent from "./page-content";

export const metadata: Metadata = {
  title: "Lena Bykova | Valar Financial Advisors",
  description:
    "Mortgage and financial advice in New Zealand. Book a clarity call, get the First Home Buyer Guide, or run the numbers yourself.",
  // Unlisted, not hidden. This page is handed out on Instagram, so it must stay
  // out of search — but the way to do that is noindex, NOT a robots.txt
  // disallow: a disallow stops crawlers from ever reading this directive, and
  // robots.txt is public, so listing the path there would advertise it.
  robots: { index: false, follow: false },
  alternates: { canonical: "https://valar.co.nz/start" },
  openGraph: {
    title: "Lena Bykova | Valar Financial Advisors",
    description: "Mortgage and financial advice in New Zealand.",
    images: ["/opengraph.jpg"],
  },
};

export default function Page() {
  return <StartContent />;
}
