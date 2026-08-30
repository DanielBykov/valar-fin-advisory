import Link from "next/link";
import RepaymentCalculator from "@/components/insights/repayment-calculator";

/*
 * Capture posts to the same /api/guide-request as the guide modal — one path,
 * one consent flow, one MailerLite group. The title is what lands in Lena's
 * inbox, so it names what the person was doing.
 */
const GUIDE_TITLE = "Ten Ways to Pay Your Mortgage Off Faster";

/*
 * The PDF is not written yet. Until it exists the thank-you says the guide is
 * being finished rather than promising something already sent.
 */
const GUIDE_READY = false;

export default function RepaymentsContent() {
  return (
    <div data-cmp="RepaymentsPage" className="flex min-h-screen w-full flex-col bg-valar-fog">
      <section
        data-cmp="RepaymentsPage.Hero"
        className="bg-valar-navy px-4 pt-36 pb-16 text-white md:px-6"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="mb-4 flex flex-col space-y-3">
            <div className="h-[2px] w-6 bg-valar-amber" />
            <span className="text-xs font-bold uppercase tracking-widest text-valar-steel">
              Calculator
            </span>
          </div>
          <h1 className="mb-5 text-4xl font-bold tracking-tight md:text-5xl">
            Mortgage repayments<span className="text-valar-amber">.</span>
          </h1>
          <p className="max-w-2xl border-l-2 border-valar-amber pl-4 text-lg font-light leading-relaxed text-valar-lilac">
            Set the loan, the rate and the term. Then add something to the extra field and watch what
            it does to the interest — and to the year you finally stop paying.
          </p>
        </div>
      </section>

      <section data-cmp="RepaymentsPage.Calculator" className="px-4 py-14 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <RepaymentCalculator guideTitle={GUIDE_TITLE} guideReady={GUIDE_READY} />
        </div>
      </section>

      <section data-cmp="RepaymentsPage.Split" className="px-4 pb-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <Link
            href="/calculators/split-loan"
            className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-valar-concrete bg-white p-6 transition-colors hover:border-valar-amber"
          >
            <div className="max-w-[60ch]">
              <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-valar-amber">
                Is your loan split?
              </p>
              <h2 className="mb-1 text-lg font-bold text-valar-navy">
                Most loans are not one rate on one term
              </h2>
              <p className="text-sm leading-relaxed text-gray-600">
                If yours is split across parts on different rates and terms, this calculator only
                describes one of them. The split calculator does the whole structure.
              </p>
            </div>
            <span className="text-sm font-semibold text-valar-navy">
              Open the split calculator &rarr;
            </span>
          </Link>
        </div>
      </section>

      <section data-cmp="RepaymentsPage.Cta" className="px-4 pb-20 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-valar-concrete bg-white p-8 md:p-10">
            <div className="max-w-[52ch]">
              <h2 className="mb-2 text-2xl font-bold text-valar-navy">
                Knowing the repayment is not the same as knowing the structure
                <span className="text-valar-amber">.</span>
              </h2>
              <p className="text-[15px] leading-relaxed text-gray-600">
                How the loan is split, what you fix and for how long, and where the extra payment
                should actually go — that is the conversation this calculator cannot have.
              </p>
            </div>
            <Link
              href="/book"
              className="rounded-lg bg-valar-amber px-6 py-3.5 text-[15px] font-bold text-valar-navy transition-colors hover:bg-valar-amber-hover"
            >
              Book Strategy Call
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
