import type { Metadata } from "next";
import FirstHomeAiSkillContent from "./page-content";

export const metadata: Metadata = {
  title: "Valári, first home AI assistant | Valar Financial Advisors",
  description:
    "Download Valári, a free AI skill that walks you through buying your first home in New Zealand. Works with Claude and ChatGPT.",
  // Unlisted, like /card: people arrive from the QR code on the webinar slide
  // and from the webinar email, not from search. noindex rather than a
  // robots.txt disallow, for the reason given on /start.
  robots: { index: false, follow: false },
  alternates: { canonical: "https://valar.co.nz/first-home-ai-skill" },
  openGraph: {
    title: "Valári, first home AI assistant",
    description: "A free AI skill for buying your first home in New Zealand.",
    images: ["/opengraph.jpg"],
  },
};

export default function Page() {
  return <FirstHomeAiSkillContent />;
}
