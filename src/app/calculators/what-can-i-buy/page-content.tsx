"use client";

import { useState } from "react";
import Link from "next/link";
import AffordabilityCalculator from "@/components/calculators/affordability-calculator";
import { GuideDownloadModal } from "@/components/guide-download-modal";
import { LEAD_MAGNETS } from "@/lib/lead-magnets";


const DEPOSIT_SOURCES = [
  { term: "Savings.", copy: "Money in the bank, in your name." },
  {
    term: "KiwiSaver.",
    copy: "Withdrawable for a first home after three years of membership. $1,000 has to stay in.",
  },
  {
    term: "A gift from family.",
    copy: "Fine, and common — but the bank needs it in writing, and a gift is treated very differently from a loan.",
  },
  {
    term: "Selling something you own.",
    copy: "A car, shares, anything that turns into cash before settlement.",
  },
];

const NEXT_STEPS = [
  {
    term: "Pin down your real deposit.",
    copy: "Get your actual KiwiSaver balance, and any family help confirmed in writing.",
  },
  {
    term: "Cut the limits you don't use.",
    copy: "A $10,000 card limit costs you borrowing power at a zero balance. Fastest win there is.",
  },
  {
    term: "Get three clean months of statements.",
    copy: "Lenders read your spending, not your budget. The last 90 days are what you're assessed on.",
  },
  {
    term: "Get pre-approved before you shop.",
    copy: "Not after you've found the house. It changes what you can negotiate.",
  },
  {
    term: "Have the conversation this page can't.",
    copy: "Structure, lender choice, and the options a calculator never sees.",
  },
];

export default function WhatCanIBuyContent() {
  const [guideOpen, setGuideOpen] = useState(false);

  return (
    <div data-cmp="WhatCanIBuyPage" className="flex min-h-screen w-full flex-col bg-valar-fog">
      <GuideDownloadModal
        open={guideOpen}
        onClose={() => setGuideOpen(false)}
        guide={LEAD_MAGNETS["first-home-buyer-guide"]}
        source="What can I buy calculator"
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        data-cmp="WhatCanIBuyPage.Hero"
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
            What can I actually buy<span className="text-valar-amber">?</span>
          </h1>
          <p className="max-w-2xl border-l-2 border-valar-amber pl-4 text-lg font-light leading-relaxed text-valar-lilac">
            Put in what you earn, what you spend and what you&rsquo;ve saved. You&rsquo;ll get a
            realistic price — and the one thing standing between you and a bigger one.
          </p>
        </div>
      </section>

      {/* ── The calculator ───────────────────────────────────── */}
      <section data-cmp="WhatCanIBuyPage.Calculator" className="px-4 py-14 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <AffordabilityCalculator onTakeGuide={() => setGuideOpen(true)} />
        </div>
      </section>

      {/* ── Explainers ───────────────────────────────────────── */}
      <section data-cmp="WhatCanIBuyPage.Explainers" className="px-4 pb-14 md:px-6">
        <div className="container mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-white p-6 md:p-8">
            <h2 className="mb-1 text-2xl font-bold text-valar-navy">What counts as your deposit</h2>
            <p className="mb-5 text-sm text-gray-600">
              Most first home buyers have more than they think — they only count one of these.
            </p>
            <ul className="flex flex-col gap-3 text-[15px] leading-relaxed text-gray-600">
              {DEPOSIT_SOURCES.map((item) => (
                <li key={item.term}>
                  <strong className="text-valar-navy">{item.term}</strong> {item.copy}
                </li>
              ))}
            </ul>
            <p className="mt-5 rounded-lg bg-valar-fog p-4 text-sm leading-relaxed text-gray-600">
              <strong className="text-valar-navy">
                Your deposit isn&rsquo;t all the cash you need.
              </strong>{" "}
              Lawyer, LIM, builder&rsquo;s report and moving come out of your pocket on top — usually
              $3,000 to $6,000. That&rsquo;s already set aside above.
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 md:p-8">
            <h2 className="mb-1 text-2xl font-bold text-valar-navy">Your five next steps</h2>
            <p className="mb-5 text-sm text-gray-600">
              In order. The first two move your number the fastest.
            </p>
            <ol className="flex flex-col gap-4 text-[15px] leading-relaxed text-gray-600">
              {NEXT_STEPS.map((step, i) => (
                <li key={step.term} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-valar-amber/20 text-xs font-bold text-valar-navy">
                    {i + 1}
                  </span>
                  <span>
                    <strong className="text-valar-navy">{step.term}</strong> {step.copy}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── Guide + call ─────────────────────────────────────── */}
      <section data-cmp="WhatCanIBuyPage.Cta" className="px-4 pb-16 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-valar-navy p-8 md:p-10">
            <div className="max-w-[52ch]">
              <h2 className="mb-2 text-2xl font-bold text-white">
                Two lenders will give you two different numbers
                <span className="text-valar-amber">.</span>
              </h2>
              <p className="text-[15px] leading-relaxed text-valar-lilac">
                The figure above is an estimate on general assumptions. Which lender says yes, at what
                rate, and how the loan is built are what move it — and none of that fits in a form.
                Print your figures, take the guide for what a lender actually looks at, and book thirty
                minutes for the rest.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setGuideOpen(true)}
                className="rounded-lg border border-white/40 px-6 py-3.5 text-[15px] font-bold text-white transition-colors hover:border-white hover:bg-white/10"
              >
                Get the guide
              </button>
              <Link
                href="/book"
                className="rounded-lg bg-valar-amber px-6 py-3.5 text-[15px] font-bold text-valar-navy transition-colors hover:bg-valar-amber-hover"
              >
                Book a clarity call
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Legal ────────────────────────────────────────────── */}
      <section data-cmp="WhatCanIBuyPage.Legal" className="px-4 pb-20 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="border-t border-valar-concrete pt-6 text-sm leading-relaxed text-valar-steel">
            <p className="mb-2">
              <strong className="text-valar-navy">This is a guide, not advice.</strong> These figures
              are indicative only — based on general assumptions, not your circumstances. They are not
              an offer of finance or a recommendation to borrow any amount.
            </p>
            <p>
              Every lender assesses differently, and a real assessment will produce a different number
              — sometimes materially. What you can actually borrow is confirmed by a lender, in
              writing, after a full application.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
