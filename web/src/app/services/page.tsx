import type { Metadata } from "next";
import ServicesContent from "./page-content";

export const metadata: Metadata = {
  title: "Our Services | Mortgage & Financial Advice | Valar",
  description:
    "Explore Valar's services — mortgage advice, financial planning, wealth management, investment property analysis and business advisory, tailored to your goals in NZ.",
  openGraph: {
    title: "Our Services | Mortgage & Financial Advice | Valar",
    description:
      "Mortgage advice, financial planning, wealth management, investment property analysis and business advisory — tailored to your property ambitions and wealth growth.",
  },
};

export default function Page() {
  return <ServicesContent />;
}
