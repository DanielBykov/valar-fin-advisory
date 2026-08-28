"use client";

import { useState } from "react";
import Link from "next/link";
import SplitLoanCalculator from "@/components/calculators/split-loan-calculator";
import { GuideDownloadModal } from "@/components/guide-download-modal";
import { EXTRA_CAP_PERCENT } from "@/lib/split-loan";

/*
 * Capture reuses the guide route rather than adding a second consent path.
 * The title is what lands in Lena's inbox notification, so it names the tool
 * the person was actually using when they asked.
 */
const SPLIT_REVIEW = {
  key: "first-home-buyer-guide",
  title: "Split structure review",
  description:
    "Send Lena your split and she will come back on what she would change — the parts, the terms, and where the extra repayment is doing the most work.",
};

const WHY_SPLIT = [
  {
    term: "You are never re-fixing all of it at once.",
    copy: "One rate on the whole loan means one day, every few years, when the entire repayment resets to whatever the market is doing that week. Three parts on three terms turn one big bet into three smaller ones.",
  },
  {
    term: "Extra repayments have somewhere to go.",
    copy: "Most fixed loans limit what you can pay off early before break costs apply. A shorter part gives the extra money a home without touching the rest of the structure.",
  },
  {
    term: "Life changes land on one part, not all of it.",
    copy: "Selling, a lump sum, a change of income — with a split you can act on the part that comes free, instead of breaking a fixed rate across the whole balance.",
  },
];

export default function SplitLoanContent() {
  const [reviewOpen, setReviewOpen] = useState(false);

  return (
    <div data-cmp="SplitLoanPage" className="flex min-h-screen w-full flex-col bg-valar-fog">
      <GuideDownloadModal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        guide={SPLIT_REVIEW}
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        data-cmp="SplitLoanPage.Hero"
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
            Split home loan<span className="text-valar-amber">.</span>
          </h1>
          <p className="max-w-2xl border-l-2 border-valar-amber pl-4 text-lg font-light leading-relaxed text-valar-lilac">
            Almost nobody should carry one loan on one rate for one term. Split it into three, give
            each part its own rate and its own term, and see what the whole thing actually costs.
          </p>
        </div>
      </section>

      {/* ── The calculator ───────────────────────────────────── */}
      <section data-cmp="SplitLoanPage.Calculator" className="px-4 py-14 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <SplitLoanCalculator />
        </div>
      </section>

      {/* ── Why split ────────────────────────────────────────── */}
      <section data-cmp="SplitLoanPage.Why" className="px-4 pb-14 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="rounded-xl border border-gray-100 bg-white p-6 md:p-8">
            <h2 className="mb-1 text-2xl font-bold text-valar-navy">Why split it at all</h2>
            <p className="mb-6 max-w-[70ch] text-sm text-gray-600">
              A split is not about chasing a better headline rate. It is about not having every dollar
              you owe reset on the same day.
            </p>
            <ul className="flex flex-col gap-5 text-[15px] leading-relaxed text-gray-600">
              {WHY_SPLIT.map((item) => (
                <li key={item.term} className="border-l-2 border-valar-amber pl-4">
                  <strong className="text-valar-navy">{item.term}</strong> {item.copy}
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-lg bg-valar-fog p-4 text-sm leading-relaxed text-gray-600">
              <strong className="text-valar-navy">About the {EXTRA_CAP_PERCENT}% cap.</strong> Extra
              repayments here are capped at {EXTRA_CAP_PERCENT}% of each part per year, because most
              lenders charge a break cost above roughly that on a fixed rate. It is a working
              assumption, not a rule — the real allowance is in your loan contract and it differs by
              lender. Worth checking before you set up a payment you intend to keep.
            </p>
          </div>
        </div>
      </section>

      {/* ── Send it to Lena ──────────────────────────────────── */}
      <section data-cmp="SplitLoanPage.Review" className="px-4 pb-14 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-valar-navy p-8 md:p-10">
            <div className="max-w-[54ch]">
              <h2 className="mb-2 text-2xl font-bold text-white">
                Built a structure you like? Send it to me
                <span className="text-valar-amber">.</span>
              </h2>
              <p className="text-[15px] leading-relaxed text-valar-lilac">
                This is the part of the job I actually enjoy. Tell me what you have landed on and I
                will come back on what I would change — where the parts should sit, which terms I
                would pick against the current curve, and where the extra repayment is doing the most
                work. No charge, and no obligation to do anything with it.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setReviewOpen(true)}
                className="rounded-lg border border-white/40 px-6 py-3.5 text-[15px] font-bold text-white transition-colors hover:border-white hover:bg-white/10"
              >
                Send me my split
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
      <section data-cmp="SplitLoanPage.Legal" className="px-4 pb-20 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="border-t border-valar-concrete pt-6 text-sm leading-relaxed text-valar-steel">
            <p className="mb-2">
              <strong className="text-valar-navy">This is a guide, not advice.</strong> These figures
              are indicative only — based on the numbers you entered and on general assumptions, not
              on your circumstances. They are not an offer of finance or a recommendation to borrow,
              structure or fix any amount.
            </p>
            <p>
              Rates, available terms, split minimums and early-repayment allowances differ by lender
              and by contract. What your loan can actually be structured as is confirmed by a lender,
              in writing, after a full application.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
