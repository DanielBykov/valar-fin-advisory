import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Valar Financial Advisors",
  description:
    "Read the privacy policy for Valar Financial Advisors — how we collect, use and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div data-cmp="PrivacyPolicyPage" className="w-full flex flex-col bg-white min-h-screen">

      {/* Hero */}
      <section className="bg-valar-navy text-white pt-28 pb-12 px-4 md:px-6">
        <div className="container mx-auto max-w-3xl">
          <div className="h-[2px] w-6 bg-valar-amber mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Privacy Policy<span className="text-valar-amber">.</span>
          </h1>
          <p className="text-valar-lilac font-light">Last updated: June 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-3xl space-y-10 text-valar-indigo leading-relaxed">

          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">Who we are</h2>
            <p>
              This privacy policy applies to Valar Financial Advisors Limited, operated by Lyubov (Lena) Bykova (FSP1010055), trading as Valar Financial Advisors. References to "we", "us", or "Valar" mean Valar Financial Advisors Limited.
            </p>
            <p className="mt-3">
              We are committed to protecting your personal information in accordance with the New Zealand Privacy Act 2020.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">What information we collect</h2>
            <p>We may collect the following personal information:</p>
            <ul className="mt-3 space-y-2">
              {[
                "Name and contact details (email address, phone number)",
                "Information you share when booking a call or sending a message",
                "Financial background information you choose to provide during consultations",
                "Website usage data (via cookies and analytics tools)",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-valar-amber flex-shrink-0 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">Why we collect it</h2>
            <p>We collect personal information to:</p>
            <ul className="mt-3 space-y-2">
              {[
                "Respond to your enquiries and schedule consultations",
                "Provide financial advisory services",
                "Meet our regulatory obligations as a financial adviser (FSP1010055)",
                "Send relevant updates and insights (only where you have opted in)",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-valar-amber flex-shrink-0 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">How we store and protect your information</h2>
            <p>
              Your information is stored securely. We take reasonable steps to protect personal information from loss, unauthorised access, use, or disclosure. We do not sell your personal information to third parties.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">Third-party services</h2>
            <p>We use the following third-party services that may process your personal information:</p>
            <ul className="mt-3 space-y-2">
              {[
                "Calendly — for scheduling consultations. Calendly's own privacy policy applies to information collected through their booking platform.",
                "Email service providers — to send confirmations and communications.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-valar-amber flex-shrink-0 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">Your rights</h2>
            <p>Under the New Zealand Privacy Act 2020, you have the right to:</p>
            <ul className="mt-3 space-y-2">
              {[
                "Request access to the personal information we hold about you",
                "Ask us to correct any information that is inaccurate or incomplete",
                "Ask us to delete your information (subject to our legal obligations)",
                "Withdraw consent to marketing communications at any time",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-valar-amber flex-shrink-0 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">Contact us</h2>
            <p>
              If you have any questions about this policy or want to exercise your rights, please contact us at{" "}
              <a href="mailto:lena.bykova@valar.co.nz" className="text-valar-amber hover:underline font-medium">
                lena.bykova@valar.co.nz
              </a>
            </p>
            <p className="mt-3">
              If you are not satisfied with our response, you can contact the Office of the Privacy Commissioner at{" "}
              <span className="font-medium text-valar-navy">privacy.org.nz</span>.
            </p>
          </div>

          <div className="pt-4 border-t border-valar-concrete">
            <Link href="/contact" className="text-valar-amber font-semibold hover:underline text-sm">
              ← Back to Contact
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
