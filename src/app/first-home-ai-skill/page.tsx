import type { Metadata } from "next";
import FirstHomeAiSkillContent from "./page-content";

export const metadata: Metadata = {
  /* Lena's wording, 2026-10-21. No "| Valar Financial Advisors": Google
     already shows the site name above the title, so the space goes to the
     words people search instead. */
  title: "Valári First Home AI Assistant: free for NZ buyers",
  description:
    "Get Valári, a free AI skill that walks you through buying your first home in New Zealand. Works with Claude and ChatGPT.",
  // Indexed (Lena, 2026-10-21). It started unlisted, like /card, for the
  // webinar QR; she wants first home buyers to find it from search as well.
  alternates: { canonical: "https://valar.co.nz/first-home-ai-skill" },
  openGraph: {
    title: "Valári, first home AI assistant",
    description: "A free AI skill for buying your first home in New Zealand.",
    url: "https://valar.co.nz/first-home-ai-skill",
    type: "website",
    siteName: "Valar Financial Advisors",
    /* Valári's own card (Lena, 2026-10-21), cropped from her 1734x907
       original. 1200 wide, not the 2400 /ua uses: the source has no more
       pixels than that to give. */
    images: [
      {
        url: "/images/og-valari.jpg",
        width: 1200,
        height: 630,
        alt: "Valári, the first home AI assistant, with a couple looking at a laptop.",
      },
    ],
  },
};

export default function Page() {
  return <FirstHomeAiSkillContent />;
}
