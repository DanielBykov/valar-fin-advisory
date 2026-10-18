import type { Metadata } from "next";
import { INSIGHTS_LIVE, getArticle } from "@/lib/insights";
import StartContent from "./page-content";

// The steps guide gets a tile only once it is published: getArticle hides drafts
// in production, so the tile appears by itself when draft flips to false.
const STEPS_SLUG = "first-home-buying-steps-nz";

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
  const stepsHref =
    INSIGHTS_LIVE && getArticle(STEPS_SLUG) ? `/insights/articles/${STEPS_SLUG}` : null;
  return <StartContent stepsHref={stepsHref} />;
}
