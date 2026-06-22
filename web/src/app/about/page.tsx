import type { Metadata } from "next";
import AboutContent from "./page-content";

export const metadata: Metadata = {
  title: "About Valar | Mortgage & Financial Advisers in New Zealand",
  description:
    "Meet the team behind Valar Financial Advisors. We help New Zealanders navigate the bigger picture and move forward with confidence on mortgage and financial decisions.",
  openGraph: {
    title: "About Valar | Mortgage & Financial Advisers in New Zealand",
    description:
      "Meet the team behind Valar Financial Advisors. We help New Zealanders navigate the bigger picture and move forward with confidence.",
  },
};

export default function Page() {
  return <AboutContent />;
}
