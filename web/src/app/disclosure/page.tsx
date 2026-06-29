import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclosure Statement | Valar Financial Advisors",
  description:
    "Public disclosure for Valar Financial Advisors — licensing, scope of advice, fees, commissions, conflicts of interest and how to make a complaint.",
  alternates: { canonical: "/disclosure" },
  openGraph: {
    title: "Disclosure Statement | Valar Financial Advisors",
    description:
      "Licensing, scope of advice, fees, commissions and complaints information for Valar Financial Advisors.",
    url: "/disclosure",
    type: "website",
  },
};

export default function DisclosurePage() {
  return (
    <div data-cmp="DisclosurePage" className="w-full flex flex-col bg-white min-h-screen">

      {/* Hero */}
      <section className="bg-valar-navy text-white pt-28 pb-12 px-4 md:px-6">
        <div className="container mx-auto max-w-3xl">
          <div className="h-[2px] w-6 bg-valar-amber mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Disclosure Statement<span className="text-valar-amber">.</span>
          </h1>
          <p className="text-valar-lilac font-light">Last updated: June 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-3xl space-y-10 text-valar-indigo leading-relaxed">

          {/* 1. Who provides this advice */}
          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">Who we are</h2>
            <p>
              <span className="font-semibold">Lena (Lyubov) Bykova</span> (FSP1010055), trading as Valar Financial
              Advisors, is a Financial Adviser with more than 20 years of experience across finance, accounting,
              investment analysis and advisory. She holds the New Zealand Certificate in Financial Services
              (Level 5), with strands in Residential Property Lending and Investment.
            </p>
            <p className="mt-3">
              <span className="font-semibold">Mortgage and lending advice is provided under the Financial Advice
              Provider (FAP) licence held by Fundsmart Limited (FSP1008314)</span>, in accordance with the Financial
              Markets Conduct Act 2013. Lena provides this advice as a Financial Adviser engaged by Fundsmart.
            </p>
          </div>

          {/* 1b. Fundsmart FAP details */}
          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">Financial Advice Provider</h2>
            <p>
              Fundsmart holds a Class 2 Financial Advice Provider (FAP) licence issued by the Financial Markets
              Authority. Fundsmart&apos;s Financial Service Provider number is FSP1008314. Details of all
              disclosures can be found at{" "}
              <a href="https://www.fundsmart.co.nz" target="_blank" rel="noopener noreferrer" className="text-valar-amber hover:underline font-medium">
                www.fundsmart.co.nz
              </a>
              .
            </p>
            <ul className="mt-3 space-y-2">
              {[
                "Address: 1/14 Prospect Terrace, Milford, Auckland 0620",
                "Postal: PO Box 33-1263, Takapuna, Auckland 0740",
                "Phone: 09 222-2662",
                "Email: admin@fundsmart.co.nz",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-valar-amber flex-shrink-0 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Areas of advice */}
          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">The advice I can provide</h2>
            <ul className="mt-3 space-y-2">
              {[
                "Residential lending — mortgages, refinancing, debt consolidation, construction lending and lending structures.",
                "Property investment strategy — investment funding, portfolio planning, cashflow analysis and wealth-creation strategies.",
                "Commercial & business lending — commercial property lending, business lending and business finance solutions.",
                "Asset finance — vehicle, equipment and other asset finance.",
                "Specialist lending — non-bank and specialist lending for clients outside standard bank criteria.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-valar-amber flex-shrink-0 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4">
              My advice covers the financial and lending strategy only. It does not include property valuations,
              building reports, or real estate agency services. Any decision to acquire a property remains yours.
            </p>
          </div>

          {/* 5. Services not provided */}
          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">Services I do not provide</h2>
            <p>I do not provide: legal advice, tax advice, accounting advice, property valuations, building or
              engineering inspections, real estate agency services, general insurance, or personal risk insurance.
              If you need any of these, I may refer you to a suitably qualified professional; however, I take no
              responsibility for their advice, and you are under no obligation to use them.</p>
          </div>

          {/* 6. Commissions */}
          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">How I am paid — commissions and referral fees</h2>
            <p>If you proceed with a lending product following my advice, we may receive commission from the lender:</p>
            <ul className="mt-3 space-y-2">
              {[
                "Upfront commission: 0.55%–0.90% of the initial loan amount, paid at settlement.",
                "Trail (ongoing) commission: 0.15%–0.20% per annum of the outstanding balance, paid monthly.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-valar-amber flex-shrink-0 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4">
              Commissions are shared between Fundsmart Limited and the adviser to cover compliance, training and
              back-office costs. Where a lender pays no commission, we may agree a fee with you before proceeding.
            </p>
            <p className="mt-3">
              Where I refer you to a third-party property specialist, buyer&apos;s agent, developer or real estate
              firm, Fundsmart or I may receive a referral fee or commission from that organisation — not from you.
              Where this applies, I will disclose it before or at the time of the referral and confirm the basis of
              the fee. From time to time we may also receive minor gifts or hospitality from product providers;
              these are recorded in our conflicts register.
            </p>
          </div>

          {/* 7. Fees */}
          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">Our fees</h2>
            <p>
              We charge a fee for our services depending on the complexity of the service and advice offered. In
              some cases we also receive a commission from a provider. The actual fee depends on the nature and
              scope of the advice or service we provide. We will discuss and agree the actual fees with you, and
              explain how they are payable, before we proceed.
            </p>
            <p className="mt-3">
              For consumer loans through a main bank, the bank will usually pay us for our services. Where the work
              is more than typical for a mortgage, involves wider advisory work, or is arranged through a non-bank
              lender, we reserve the right to discuss a fee with you first. We may also charge $250 per hour (plus
              GST, if applicable) for finance or lending consultancy work, and/or to recover or part-recover a
              commission clawback where a loan is repaid or refinanced early. Any fee is quoted and agreed before
              you accept a loan offer, and any invoice is due within 7 days.
            </p>
          </div>

          {/* 8. Conflicts */}
          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">Conflicts of interest and other incentives</h2>
            <p>
              Your interests are our priority, although we do have business relationships with product providers. We
              are paid commissions by lenders when a mortgage settles, and from time to time we may receive a small
              gift from a provider (such as a bottle of wine or event tickets).
            </p>
            <p className="mt-3">
              To manage this, we follow an advice process that ensures our recommendations are made appropriately
              based on your goals and circumstances. All our advisers complete annual training on managing conflicts
              of interest, and we maintain registers of conflicts of interest and of the gifts and incentives we
              receive. These registers are monitored regularly.
            </p>
          </div>

          {/* 9. No guarantee */}
          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">No guarantee of approval</h2>
            <p>
              Neither Fundsmart Limited nor I can guarantee a lender will approve an application. I will use my
              knowledge, experience and lender relationships to identify the best available solution for your
              circumstances.
            </p>
          </div>

          {/* 10. Reliability */}
          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">Reliability history</h2>
            <p>
              A reliability event is anything that might materially influence your decision to seek advice from us —
              for example, legal proceedings or bankruptcy in the last four years. Neither Fundsmart Limited nor I
              have been subject to a reliability event.
            </p>
          </div>

          {/* 11. Duties */}
          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">Our duties and obligations to you</h2>
            <p>
              We are bound by the duties of the Financial Markets Conduct Act 2013 (sections 431I, 431K, 431L and
              431M) to:
            </p>
            <ul className="mt-3 space-y-2">
              {[
                "Meet the standards of competence, knowledge and skill set out in the Code of Professional Conduct for Financial Advice Services;",
                "Give priority to your interests;",
                "Exercise care, diligence and skill; and",
                "Meet the standards of ethical behaviour, conduct and client care set out in the Code.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-valar-amber flex-shrink-0 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* 12. Complaints */}
          <div id="complaints">
            <h2 className="text-xl font-bold text-valar-navy mb-3">Complaints</h2>
            <p>
              <span className="font-semibold">Internal process.</span> If you have a problem, concern or complaint
              about any part of our advice or service, please tell us so we can try to fix it. Our internal
              Complaints Manager is Ian Bailey, who can be reached at{" "}
              <a href="mailto:Ian@fundsmart.co.nz" className="text-valar-amber hover:underline font-medium">Ian@fundsmart.co.nz</a>{" "}
              or 021 664 941. You will get a reply within five business days.
            </p>
            <p className="mt-3">
              <span className="font-semibold">External process.</span> If we cannot agree on how to resolve the
              issue, or you decide not to use our internal scheme, you can contact our external dispute resolution
              scheme — Financial Services Complaints Limited (FSCL). This service costs you nothing and is
              independent.
            </p>
            <ul className="mt-3 space-y-2">
              {[
                "Address: FSCL, PO Box 5967, Wellington 6145",
                "Phone: 0800 347 257",
                "Email: complaints@fscl.org.nz",
                "FSCL registration number: 9294",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-valar-amber flex-shrink-0 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* 13. Contact */}
          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">Contact</h2>
            <p>
              For any questions about this disclosure, or to request a copy free of charge, contact me at{" "}
              <a href="mailto:lena.bykova@valar.co.nz" className="text-valar-amber hover:underline font-medium">
                lena.bykova@valar.co.nz
              </a>
              . Fundsmart&apos;s Financial Advice Provider contact details are listed above.
            </p>
          </div>

          <div className="pt-4 border-t border-valar-concrete">
            <Link href="/about" className="text-valar-amber font-semibold hover:underline text-sm">
              ← Back to About
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
