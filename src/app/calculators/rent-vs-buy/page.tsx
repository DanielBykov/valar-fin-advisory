import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import RentVsBuyCalculator from "@/components/calculators/rent-vs-buy-calculator";
import { CALCULATORS_LIVE } from "@/lib/calculators";

export const metadata: Metadata = {
  title: "Rent vs Buy Calculator NZ | Valar",
  description:
    "Compare renting and buying in New Zealand on your own numbers — deposit, rate, rent and time frame — and see where the two actually cross over.",
  openGraph: {
    images: ["/opengraph.jpg"],
    title: "Rent vs Buy Calculator NZ | Valar",
    description:
      "Compare renting and buying on your own numbers and see where the two actually cross over.",
  },
};

export default function Page() {
  if (!CALCULATORS_LIVE && process.env.NODE_ENV !== "development") notFound();

  return (
    <div data-cmp="RentVsBuyPage" className="flex min-h-screen w-full flex-col bg-valar-fog">
      <section
        data-cmp="RentVsBuyPage.Hero"
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
            Rent vs Buy<span className="text-valar-amber">.</span>
          </h1>
          <p className="max-w-2xl border-l-2 border-valar-amber pl-4 text-lg font-light leading-relaxed text-valar-lilac">
            The honest version of the question is not &ldquo;is renting dead money&rdquo;. It is how
            long you would have to stay, and what the money would have done instead. Move the numbers
            and find out.
          </p>
        </div>
      </section>

      <section data-cmp="RentVsBuyPage.Calculator" className="px-4 py-14 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <RentVsBuyCalculator />
        </div>
      </section>

      <section data-cmp="RentVsBuyPage.Cta" className="px-4 pb-20 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-valar-navy p-8 md:p-10">
            <div className="max-w-[46ch]">
              <h2 className="mb-2 text-2xl font-bold text-white">
                A calculator cannot see your file<span className="text-valar-amber">.</span>
              </h2>
              <p className="text-[15px] leading-relaxed text-valar-lilac">
                It does not know your income, your deposit, or which lender will say yes and at what
                rate. Thirty minutes with someone who does is a different conversation.
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
