import type { Metadata } from "next";
import ContactContent from "./page-content";

export const metadata: Metadata = {
  title: "Contact Valar Financial Advisors | New Zealand",
  description:
    "Get in touch with Valar Financial Advisors. Pick the option that works best for you to talk through your mortgage and financial advice needs in New Zealand.",
  openGraph: {
    title: "Contact Valar Financial Advisors | New Zealand",
    description:
      "Get in touch with Valar Financial Advisors. Pick the option that works best for you for mortgage and financial advice in New Zealand.",
  },
};

export default function Page() {
  return <ContactContent />;
}
