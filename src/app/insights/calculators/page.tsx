import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import RepaymentCalculator from "@/components/insights/repayment-calculator";
import { CALCULATORS_LIVE, INSIGHTS_LIVE } from "@/lib/insights";

export const metadata: Metadata = {
  title: "Mortgage Calculators | Valar",
  description:
    "Work out mortgage repayments on any loan amount, rate and term — and see what paying a little extra each time actually saves you.",
  openGraph: {
    images: ["/opengraph.jpg"],
    title: "Mortgage Calculators | Valar",
    description:
      "Work out mortgage repayments and see what paying extra each time saves you over the life of the loan.",
  },
};

export default function Page() {
  // Still reachable by direct URL when running locally, so the calculators
  // can be built out before they are announced anywhere.
  if ((!INSIGHTS_LIVE || !CALCULATORS_LIVE) && process.env.NODE_ENV !== "development") notFound();

  return (
    <div data-cmp="CalculatorsPage" className="flex min-h-screen w-full flex-col bg-valar-fog">
      <section
        data-cmp="CalculatorsPage.Hero"
        className="bg-valar-navy px-4 pt-20 pb-16 text-white md:px-6"
      >
        <div className="container mx-auto max-w-6xl">
          <Link
            href="/insights"
            className="mb-7 inline-flex items-center gap-2 text-sm text-valar-lilac transition-colors hover:text-valar-amber"
          >
            <ArrowLeft className="h-4 w-4" />
            Insights
          </Link>
          <div className="mb-6 h-[1px] w-12 bg-valar-amber" />
          <h1 className="mb-5 text-4xl font-bold tracking-tight md:text-5xl">
            Calculators<span className="text-valar-amber">.</span>
          </h1>
          <p className="max-w-2xl border-l-2 border-valar-amber pl-4 text-lg font-light text-valar-lilac">
            Move the numbers around before anyone asks you to commit to them.
          </p>
        </div>
      </section>

      <section data-cmp="CalculatorsPage.Repayments" className="px-4 py-16 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-7">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-valar-amber">
              Calculator
            </p>
            <h2 className="mb-3 text-3xl font-bold text-valar-navy">Mortgage repayments</h2>
            <p className="max-w-[62ch] text-[15px] leading-relaxed text-gray-600">
              Set the loan, the rate and the term. Then add something to the extra field and watch what
              it does to the interest — that number is usually the surprise.
            </p>
          </div>
          <RepaymentCalculator />
        </div>
      </section>

      <section data-cmp="CalculatorsPage.Cta" className="px-4 pb-20 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-xl bg-valar-navy p-8 md:p-10">
            <div className="max-w-[42ch]">
              <h2 className="mb-2 text-2xl font-bold text-white">
                These are the generic numbers<span className="text-valar-amber">.</span>
              </h2>
              <p className="text-[15px] leading-relaxed text-valar-lilac">
                Yours depend on your income, your deposit and which lender sees the file. That is a
                thirty-minute conversation.
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
