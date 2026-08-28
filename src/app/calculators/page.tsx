import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Calculator as CalculatorIcon } from "lucide-react";
import { CALCULATORS_LIVE, calculatorHref, liveCalculators } from "@/lib/calculators";

export const metadata: Metadata = {
  title: "Mortgage Calculators NZ | Valar Financial Advisors",
  description:
    "Free New Zealand mortgage calculators — work out what you can afford as a first home buyer, and what your repayments would be. Your own numbers, before anyone asks you to commit to them.",
  openGraph: {
    images: ["/opengraph.jpg"],
    title: "Mortgage Calculators NZ | Valar Financial Advisors",
    description:
      "Work out what you can afford and what it would cost — on your own numbers, before anyone asks you to commit to them.",
  },
};

export default function Page() {
  // The section stays private until CALCULATORS_LIVE is flipped in
  // src/lib/calculators.ts. Always renders locally so it can be reviewed.
  if (!CALCULATORS_LIVE && process.env.NODE_ENV !== "development") notFound();

  const calculators = liveCalculators();

  return (
    <div data-cmp="CalculatorsPage" className="flex min-h-screen w-full flex-col bg-valar-fog">
      <section
        data-cmp="CalculatorsPage.Hero"
        className="bg-valar-navy px-4 pt-36 pb-16 text-white md:px-6"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="mb-4 flex flex-col space-y-3">
            <div className="h-[2px] w-6 bg-valar-amber" />
            <span className="text-xs font-bold uppercase tracking-widest text-valar-steel">
              Tools
            </span>
          </div>
          <h1 className="mb-5 text-4xl font-bold tracking-tight md:text-5xl">
            Calculators<span className="text-valar-amber">.</span>
          </h1>
          <p className="max-w-2xl border-l-2 border-valar-amber pl-4 text-lg font-light leading-relaxed text-valar-lilac">
            Move the numbers around before anyone asks you to commit to them. Nothing here asks for
            your details, and nothing here is stored.
          </p>
        </div>
      </section>

      <section data-cmp="CalculatorsPage.Grid" className="px-4 py-16 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {calculators.map((calculator) => (
              <Link
                key={calculator.slug}
                href={calculatorHref(calculator.slug)}
                data-cmp="CalculatorsPage.Card"
                className="flex flex-col rounded-xl border border-gray-100 bg-white p-7 transition-shadow hover:shadow-md md:p-8"
              >
                <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-[10px] bg-valar-amber/15 text-valar-amber">
                  <CalculatorIcon className="h-5 w-5" />
                </span>
                <h2 className="mb-3 text-xl font-bold text-valar-navy">{calculator.title}</h2>
                <p className="mb-6 flex-1 text-[15px] leading-relaxed text-gray-600">
                  {calculator.blurb}
                </p>
                <span className="inline-flex items-center text-sm font-semibold text-valar-navy">
                  Open <ArrowRight className="ml-2 h-4 w-4 text-valar-amber" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section data-cmp="CalculatorsPage.Cta" className="px-4 pb-20 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-valar-navy p-8 md:p-10">
            <div className="max-w-[52ch]">
              <h2 className="mb-2 text-2xl font-bold text-white">
                Calculators show you numbers. They don&rsquo;t build a strategy
                <span className="text-valar-amber">.</span>
              </h2>
              <p className="text-[15px] leading-relaxed text-valar-lilac">
                They can tell you what your numbers do. They can&rsquo;t tell you which lender is right
                for you, how the loan should be built, or what to actually do about it. That part is a
                conversation, not a calculation.
              </p>
            </div>
            <Link
              href="/book"
              className="rounded-lg bg-valar-amber px-6 py-3.5 text-[15px] font-bold text-valar-navy transition-colors hover:bg-valar-amber-hover"
            >
              Book a clarity call
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
