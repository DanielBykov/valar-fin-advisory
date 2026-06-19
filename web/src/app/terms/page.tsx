import Link from "next/link";

export default function TermsPage() {
  return (
    <div data-cmp="TermsPage" className="w-full flex flex-col bg-white min-h-screen">

      {/* Hero */}
      <section className="bg-valar-navy text-white pt-28 pb-12 px-4 md:px-6">
        <div className="container mx-auto max-w-3xl">
          <div className="h-[2px] w-6 bg-valar-amber mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Terms &amp; Conditions<span className="text-valar-amber">.</span>
          </h1>
          <p className="text-valar-lilac font-light">Last updated: June 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-3xl space-y-10 text-valar-indigo leading-relaxed">

          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">About this website</h2>
            <p>
              This website is operated by Valar Financial Advisors Limited, operated by Lyubov (Lena) Bykova (FSP1010055), trading as Valar Financial Advisors. By accessing or using this website, you agree to these terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">General information only</h2>
            <p>
              The content on this website is provided for general information purposes only. It does not constitute financial advice and should not be relied upon as a substitute for professional advice tailored to your personal circumstances.
            </p>
            <p className="mt-3">
              Regulated financial advice is only provided after a scope of engagement has been agreed in writing between Valar Financial Advisors Limited and the client.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">Accuracy of information</h2>
            <p>
              While we take reasonable care to ensure the information on this website is accurate and up to date, we make no warranties or representations about its completeness or accuracy. Information may change without notice.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">Limitation of liability</h2>
            <p>
              To the extent permitted by law, Valar Financial Advisors Limited is not liable for any loss or damage arising from your use of, or reliance on, the content of this website.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">Intellectual property</h2>
            <p>
              All content on this website — including text, images, logos, and design — is the property of Valar Financial Advisors Limited. You may not reproduce, distribute, or use any content without prior written permission.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">Third-party links</h2>
            <p>
              This website may contain links to third-party websites. We are not responsible for the content or privacy practices of those sites.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">Governing law</h2>
            <p>
              These terms are governed by the laws of New Zealand. Any disputes will be subject to the exclusive jurisdiction of the New Zealand courts.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">Contact</h2>
            <p>
              Questions about these terms can be directed to{" "}
              <a href="mailto:lena.bykova@valar.co.nz" className="text-valar-amber hover:underline font-medium">
                lena.bykova@valar.co.nz
              </a>
            </p>
          </div>

          <div className="pt-4 border-t border-valar-concrete">
            <Link href="/privacy-policy" className="text-valar-amber font-semibold hover:underline text-sm">
              ← Privacy Policy
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
