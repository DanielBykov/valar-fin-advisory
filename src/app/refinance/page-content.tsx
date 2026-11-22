import Image from "next/image";
import Link from "next/link";
import RefinanceCalculator from "@/components/calculators/refinance-calculator";
import { isReady, LEAD_MAGNETS } from "@/lib/lead-magnets";
import { getArticle } from "@/lib/insights";

/*
 * The existing guide rather than a new magnet: paying a mortgage off sooner is
 * this page's promise and that guide's subject, and the Calculators group and its
 * automation already exist.
 */
const MAGNET = LEAD_MAGNETS["refinance-calculation"];

/** Lena's refinance art (Claude Design, 2026-11-22): two banks and the home between them. */
const HERO_ART = "/images/refinance-hero.jpg";

/** Same wording as the article, so the two pages never disagree. */
const TRACKS = [
  {
    title: "Refixing",
    text: "Choosing a new fixed interest rate with your existing lender when your current fixed term expires.",
  },
  {
    title: "Refinancing",
    text: "Moving your mortgage to another lender, with a new loan agreement.",
  },
];

const ARTICLE = getArticle("mortgage-refinancing-nz");

const HELPS = [
  {
    title: "A lower repayment",
    copy: "A lower rate can reduce what you pay each month and give your budget more room.",
  },
  {
    title: "A shorter loan",
    copy: "Pay the same amount on a lower rate or a smaller balance, and more of each payment goes to what you owe.",
  },
  {
    title: "A smaller balance",
    copy: "Some lenders pay a cash contribution when you move your loan. Put on the mortgage, it reduces what you owe.",
  },
];

/*
 * On the page in full size, not in the small print. Each of these can turn the
 * figure above into a loss, and a visitor who first hears about them on the phone
 * has been misled by the page.
 */
const COSTS = [
  {
    title: "Break costs",
    copy: "Leaving a fixed rate early can cost money. Only your current bank can give you this figure.",
  },
  {
    title: "Clawback",
    copy: "A lender contribution usually has to be repaid if you leave within a set period.",
  },
  {
    title: "Legal and discharge fees",
    copy: "Moving a loan between banks involves a solicitor and your current bank's fees.",
  },
  {
    title: "A new application",
    copy: "The new lender assesses your income and expenses again. Approval is not automatic.",
  },
];

export default function RefinanceContent() {
  return (
    <div data-cmp="RefinancePage" className="flex min-h-screen w-full flex-col bg-valar-fog">
      {/*
       * Minimal on purpose (2026-11-22, Lena, all calculator heroes): eyebrow,
       * heading, one line. No buttons or chips; the calculator starts right below.
       * The paragraph is a draft for Lena to rewrite.
       */}
      <section
        data-cmp="RefinancePage.Hero"
        className="relative overflow-hidden bg-valar-navy px-4 pt-20 pb-6 text-white md:px-6"
      >
        {/*
         * Smaller than the other calculator heroes (2026-11-22, Lena): the
         * calculator is the point, so it should start sooner on screen.
         *
         * The art works as on /calculators: navy ground, right-anchored, a fade
         * back to valar-navy, hidden below md. HERO_ART is the calculators
         * picture until Lena's refinance version (same piggy style, 1920×800,
         * left third empty) replaces it: then only the path changes.
         */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[60%] md:block"
        >
          <Image
            src={HERO_ART}
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 60vw, 0px"
            className="object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-valar-navy via-valar-navy/60 to-transparent" />
        </div>

        <div className="relative container mx-auto max-w-6xl">
          {/*
           * The paragraph runs one line on desktop (Lena, 2026-11-22), so it may
           * pass the column and reach into the faded edge of the picture.
           */}
          <div>
            <div className="mb-2 flex flex-col space-y-2">
              <div className="h-[2px] w-6 bg-valar-amber" />
              <span className="text-xs font-bold uppercase tracking-widest text-valar-steel">
                Refinance
              </span>
            </div>
            <h1 className="mb-2 text-2xl font-bold tracking-tight md:text-3xl">
              Pay off your mortgage sooner<span className="text-valar-amber">.</span>
            </h1>
            <p className="border-l-2 border-valar-amber pl-4 text-base font-light leading-relaxed text-valar-lilac lg:whitespace-nowrap">
              Fixed rate ending soon, or paying more than lenders offer today? See what moving your
              loan could save you. It takes a minute.
            </p>
          </div>
        </div>
      </section>

      <RefinanceCalculator
        guideKey={MAGNET.key}
        guideTitle={MAGNET.title}
        guideReady={isReady(MAGNET)}
        closing={
          <div className="flex flex-col justify-center gap-4 rounded-2xl bg-valar-navy p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white">
              Want the exact numbers<span className="text-valar-amber">?</span>
            </h2>
            <p className="text-[15px] leading-relaxed text-valar-lilac">
              The real answer depends on your break cost, your lender options and your plans. A
              clarity call works through them with a licensed adviser.
            </p>
            <Link
              href="/book"
              className="w-fit rounded-lg bg-valar-amber px-6 py-3.5 text-[15px] font-bold text-valar-navy transition-colors hover:bg-valar-amber-hover"
            >
              Book a clarity call
            </Link>
          </div>
        }
      >
        {/*
         * A short "what is it" from the article (2026-11-22, Lena), with the way
         * to the full piece. The link appears only while the article is visible
         * (getArticle hides drafts in production), so it can never 404.
         */}
        <section data-cmp="RefinancePage.WhatIs" className="px-4 pt-12 md:px-6">
          <div className="container mx-auto max-w-6xl">
            <h2 className="mb-4 text-2xl font-bold text-valar-navy md:text-3xl">
              What is refinancing<span className="text-valar-amber">?</span>
            </h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="text-base leading-relaxed text-gray-700">
                <p className="mb-3">
                  Refinancing means{" "}
                  <b className="text-valar-navy">replacing your home loan with a new one</b>,
                  usually from a different lender. The new lender pays off your current mortgage,
                  and you start making repayments under the new loan agreement.
                </p>
                <p className="mb-4">
                  You don&apos;t sell your property or move house. You simply change how your
                  mortgage is financed.
                </p>
                {ARTICLE && (
                  <Link
                    href={`/insights/articles/${ARTICLE.slug}`}
                    className="inline-flex items-center gap-1 font-bold text-valar-navy underline decoration-valar-amber decoration-2 underline-offset-4 hover:text-valar-amber"
                  >
                    Read the full article <span aria-hidden>&rarr;</span>
                  </Link>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {TRACKS.map((t) => (
                  <div
                    key={t.title}
                    className="rounded-xl border border-valar-concrete bg-white p-5"
                  >
                    <div className="mb-3 h-[2px] w-6 bg-valar-amber" />
                    <h3 className="mb-1 text-base font-bold text-valar-navy">{t.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-600">{t.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section data-cmp="RefinancePage.Helps" className="px-4 pt-12 md:px-6">
          <div className="container mx-auto max-w-6xl">
            <h2 className="mb-6 text-2xl font-bold text-valar-navy md:text-3xl">
              How refinancing can help<span className="text-valar-amber">.</span>
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {HELPS.map((item) => (
                <div key={item.title} className="rounded-xl border border-gray-100 bg-white p-5">
                  <div className="mb-3 h-[2px] w-6 bg-valar-amber" />
                  <h3 className="mb-2 text-base font-bold text-valar-navy">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section data-cmp="RefinancePage.Costs" className="px-4 py-12 md:px-6">
          <div className="container mx-auto max-w-6xl">
            <h2 className="mb-6 text-2xl font-bold text-valar-navy md:text-3xl">
              What it can cost<span className="text-valar-amber">.</span>
            </h2>
            <ul className="grid gap-x-10 gap-y-4 md:grid-cols-2">
              {COSTS.map((item) => (
                <li key={item.title} className="border-t border-valar-concrete pt-3">
                  <h3 className="text-base font-bold text-valar-navy">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{item.copy}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </RefinanceCalculator>
    </div>
  );
}
