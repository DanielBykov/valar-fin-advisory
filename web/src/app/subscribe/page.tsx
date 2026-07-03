import type { Metadata } from "next";
import SubscribeContent from "./page-content";

export const metadata: Metadata = {
  title: "Subscribe | Valar Financial Advisors Newsletter",
  description:
    "Stay updated with Valar. Once a week — market news, property research, useful guides and calculators for New Zealand homeowners and investors. No spam.",
  alternates: { canonical: "/subscribe" },
  openGraph: {
    images: ["/opengraph.jpg"],
    title: "Subscribe | Valar Financial Advisors Newsletter",
    description:
      "Once a week — market news, property research, useful guides and calculators. No spam.",
  },
};

export default function Page() {
  return <SubscribeContent />;
}
