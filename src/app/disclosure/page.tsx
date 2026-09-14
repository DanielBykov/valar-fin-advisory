import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclosure Statement | Valar Financial Advisors",
  description:
    "Public disclosure for Valar Financial Advisors Limited (FSP1012862): licence, scope of advice, fees, commissions, conflicts of interest and complaints.",
  alternates: { canonical: "/disclosure" },
  openGraph: {
    images: ["/opengraph.jpg"],
    title: "Disclosure Statement | Valar Financial Advisors",
    description:
      "Licence, scope of advice, fees, commissions and complaints information for Valar Financial Advisors Limited.",
    url: "/disclosure",
    type: "website",
  },
};

const linkClass = "text-valar-amber hover:underline font-medium";

function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-valar-amber flex-shrink-0 mt-2" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/*
 * Sources: Valar's Public Disclosure (Jul26) for the structure and the licence,
 * the Nature and Scope of Advice (v1 Aug26) for services, commissions and fees,
 * and Lena's decisions of 2026-09-14. The Nature and Scope sends clients to the
 * complaints process on this page, so keep the #complaints anchor.
 */
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
          <p className="text-valar-lilac font-light">Last updated: September 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-3xl space-y-10 text-valar-indigo leading-relaxed">

          {/* 1. Licence and adviser */}
          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">About us</h2>
            <p>
              <span className="font-semibold">Valar Financial Advisors Limited</span> holds a Financial Advice
              Provider licence issued by the Financial Markets Authority (FMA) to provide financial advice
              services. Our Financial Service Provider number is FSP1012862.
            </p>
            <p className="mt-3">
              Financial advice is provided by <span className="font-semibold">Lena (Lyubov) Bykova</span>,
              Director and Financial Adviser (FSP1010055), under the licence of Valar Financial Advisors
              Limited. Lena holds the New Zealand Certificate in Financial Services (Level 5), with strands in
              Residential Property Lending and Investment.
            </p>
            <Bullets
              items={[
                "Address: The Crate, 28 Constellation Drive, Rosedale, Auckland 0632",
                <>Phone: <a href="tel:+642108635695" className={linkClass}>+64 21 086 35695</a></>,
                <>Email: <a href="mailto:admin@valar.co.nz" className={linkClass}>admin@valar.co.nz</a></>,
                "Website: valar.co.nz",
              ]}
            />
          </div>

          {/* 2. Nature and scope */}
          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">The advice we provide</h2>
            <Bullets
              items={[
                "Residential lending: residential mortgages, refinancing, debt consolidation, construction lending and lending structures.",
                "Property investment strategy: residential property investment funding, portfolio planning, cashflow analysis and wealth strategies.",
                "Investment advice: KiwiSaver and managed fund advice, where appropriate to your goals and circumstances.",
                "Commercial and business lending: commercial property lending, business lending and business finance solutions.",
                "Financial planning: goal setting, budgeting and cashflow planning, and structuring your finances to support longer-term goals.",
                "Specialist lending: non-bank and specialist lending for clients outside standard bank criteria.",
              ]}
            />
            <p className="mt-4">
              Products we can advise on: KiwiSaver investments, managed investments, and loans, including
              residential mortgages, commercial property loans and business loans.
            </p>
            <p className="mt-3">
              Our advice covers the financial and lending strategy only. It does not include property
              valuations, building reports or real estate agency services. Any decision to buy a property
              remains yours.
            </p>
          </div>

          {/* 3. Services not provided */}
          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">Services we do not provide</h2>
            <p>
              We do not provide legal, tax or accounting advice, property valuations, building or engineering
              inspections, real estate agency services, general insurance or personal risk insurance. If you need
              any of these, we may refer you to a suitably qualified professional. We take no responsibility for
              their advice, and you are under no obligation to use them.
            </p>
          </div>

          {/* 4. Product providers. Interim wording while lender accreditations transfer to Valar
                 (Lena, 2026-09-14). Revisit once the transfers are complete. */}
          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">Product providers</h2>
            <p>
              We are not tied to any single lender or product provider. We recommend providers based on your
              situation, and the current list is set out in your Nature and Scope of Advice.
            </p>
          </div>

          {/* 5. Fees. The situations only, no amounts (Lena, 2026-09-14): amounts and how they are
                 calculated live in the Nature and Scope of Advice. Keep the situations named here: the
                 Privacy Authority clients sign says consultancy and clawback costs are on this website. */}
          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">Our fees</h2>
            <p>
              We do not usually charge a fee where your lending is retained for at least 27 months and we have
              received a commission from the lender.
            </p>
            <p className="mt-3">
              A fee may apply if we arrange finance through a non-bank lender or a lender that pays no commission,
              if the lending is intended to be repaid within 27 months, if you do not proceed after receiving a
              loan offer we arranged, or if you cancel or refinance your loan within 27 months of settlement. Any
              fee, and how it is calculated, is set out in your Nature and Scope of Advice, which you receive
              before we give advice. If you need financial advice or planning beyond your lending, we will discuss
              any fee with you first.
            </p>
          </div>

          {/* 6. Commissions */}
          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">Commissions and referral fees</h2>
            <p>If you proceed with a lending product following our advice, we may receive commission from the lender:</p>
            <Bullets
              items={[
                "Upfront commission: 0.55%–0.90% of the initial loan amount, paid at settlement.",
                "Ongoing (trail) commission: 0.15%–0.20% per year of the outstanding balance, paid monthly.",
                "Refix commission: we may also receive a commission when you refix your loan.",
                "KiwiSaver: typically between $40 and $300, depending on the provider.",
              ]}
            />
            <p className="mt-4">
              Commissions are shared between Valar Financial Advisors Limited and the adviser to cover compliance,
              training and back-office costs.
            </p>
            <p className="mt-3">
              Where we refer you to a third-party property specialist, buyer&apos;s agent, developer or real
              estate firm, Valar may receive a referral fee or commission from that organisation, not from you. We
              will tell you before or at the time of the referral and confirm the basis of the fee. From time to
              time we may also receive minor gifts or hospitality from product providers. These are recorded in
              our conflicts register.
            </p>
          </div>

          {/* 7. Conflicts */}
          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">Conflicts of interest</h2>
            <p>
              Your interests are our priority, although we do have business relationships with product providers.
              Valar receives commissions from product providers for the financial products we place and service,
              and we recognise this may create a conflict of interest. To manage it:
            </p>
            <Bullets
              items={[
                "We follow an advice process that bases every recommendation on your goals and circumstances.",
                "Our adviser completes annual training on identifying and managing conflicts of interest.",
                "We keep registers of conflicts of interest and of gifts and incentives, and review them regularly.",
                "We undertake an annual independent Compliance Assurance Review.",
              ]}
            />
            <p className="mt-4">
              Lena Bykova holds a 50% shareholding in Valar Intelligence Limited, a software development company.
              Where this is relevant to your advice, we will disclose it.
            </p>
            <p className="mt-3">
              If we or you identify a conflict of interest, we will discuss it with you and record it in your
              Statement of Advice.
            </p>
          </div>

          {/* 8. No guarantee */}
          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">No guarantee of approval</h2>
            <p>
              Neither Valar Financial Advisors Limited nor our adviser can guarantee that a lender will approve an
              application. We use our knowledge, experience and lender relationships to find the best available
              solution for your circumstances.
            </p>
          </div>

          {/* 9. Reliability */}
          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">Reliability history</h2>
            <p>
              A reliability event is anything that may materially influence your decision to seek advice from us,
              for example legal proceedings or bankruptcy in the last four years. Neither Valar Financial Advisors
              Limited nor Lena Bykova has been subject to a reliability event.
            </p>
          </div>

          {/* 10. Duties */}
          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">Our duties to you</h2>
            <p>
              We are bound by the duties in the Financial Markets Conduct Act 2013 (sections 431I, 431K, 431L and
              431M) to:
            </p>
            <Bullets
              items={[
                "Meet the standards of competence, knowledge and skill set out in the Code of Professional Conduct for Financial Advice Services;",
                "Give priority to your interests;",
                "Exercise care, diligence and skill; and",
                "Meet the standards of ethical behaviour, conduct and client care set out in the Code.",
              ]}
            />
          </div>

          {/* 11. Complaints */}
          <div id="complaints">
            <h2 className="text-xl font-bold text-valar-navy mb-3">Complaints</h2>
            <p>
              <span className="font-semibold">Internal process.</span> If you have a problem, concern or complaint
              about our advice or service, please tell us so we can try to fix it. Call{" "}
              <a href="tel:+642108635695" className={linkClass}>+64 21 086 35695</a>, email{" "}
              <a href="mailto:admin@valar.co.nz" className={linkClass}>admin@valar.co.nz</a> or use the form at{" "}
              <Link href="/contact" className={linkClass}>valar.co.nz/contact</Link>. Lyubov (Lena) Bykova will
              respond within 48 hours (2 working days).
            </p>
            <p className="mt-3">How we handle a complaint:</p>
            <ol className="mt-3 space-y-2 list-decimal pl-5 marker:text-valar-amber marker:font-semibold">
              <li>We confirm the facts with you.</li>
              <li>We confirm what a solution looks like for you.</li>
              <li>We agree timelines, depending on your circumstances and the nature of the complaint.</li>
              <li>We work out possible solutions and explain any implications.</li>
              <li>We try to resolve the situation.</li>
              <li>We make a final decision and tell you the outcome.</li>
            </ol>
            <p className="mt-4">
              <span className="font-semibold">External process.</span> If we cannot agree on how to resolve the
              issue, or you decide not to use our internal process, you can contact our external dispute resolution
              scheme, Financial Services Complaints Limited (FSCL). This service is independent and costs you
              nothing.
            </p>
            <Bullets
              items={[
                "Address: PO Box 5967, Lambton Quay, Wellington 6145",
                "Phone: 0800 347 257",
                <>Email: <a href="mailto:complaints@fscl.org.nz" className={linkClass}>complaints@fscl.org.nz</a></>,
                <>Website: <a href="https://www.fscl.org.nz" target="_blank" rel="noopener noreferrer" className={linkClass}>fscl.org.nz</a></>,
                "FSCL registration number: 9744",
              ]}
            />
          </div>

          {/* 12. Contact */}
          <div>
            <h2 className="text-xl font-bold text-valar-navy mb-3">Contact</h2>
            <p>
              To ask about this disclosure, or to request a free copy, email{" "}
              <a href="mailto:admin@valar.co.nz" className={linkClass}>admin@valar.co.nz</a>.
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
