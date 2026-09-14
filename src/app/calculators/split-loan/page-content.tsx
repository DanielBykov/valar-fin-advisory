"use client";

import Image from "next/image";
import Link from "next/link";
import SplitLoanCalculator from "@/components/calculators/split-loan-calculator";
import { isReady, LEAD_MAGNETS } from "@/lib/lead-magnets";

/*
 * Capture lives inside the calculator, not in a modal on this page.
 *
 * The modal that used to sit here could not see the structure someone had
 * built — it enrolled a lead and told Lena nothing about what they were
 * actually modelling. The form beside the results carries the parts with it,
 * so the CTA at the bottom of the page drives to that one form rather than
 * offering a second, worse way to ask for the same thing.
 */
/*
 * The split offers the same guide the repayments calculator does.
 *
 * It used to offer "Split structure review", which has no document by design —
 * Lena answers it herself. That meant the one capture on this page enrolled
 * someone and then sent them nothing automatic, while the repayments page sent
 * a PDF. Pointing at a magnet that exists makes the MailerLite automation fire
 * here too; Lena coming back on the structure is still promised, in the blurb,
 * because that is a promise she keeps by hand and not something the list does.
 */
const MAGNET = LEAD_MAGNETS["pay-your-mortgage-off-faster"];

const WHY_SPLIT = [
  {
    title: "Spread refixing risk",
    copy: "Fixing the whole loan on one term means the entire balance resets at once. Splitting it across different terms means only part of the mortgage comes up for review at a time.",
  },
  {
    title: "Make room for extra repayments",
    copy: "Fixed loans can limit how much you can repay early. A shorter or flexible portion gives you somewhere to direct bonuses, lump sums or extra repayments without disturbing the rest.",
  },
  {
    title: "Match the loan to real life",
    copy: "A sale, renovation, change in income or future lump sum can all affect your plans. A split structure lets one part of the loan be shaped around what is likely to happen next.",
  },
];

/*
 * Three outputs, benefit-first, by the rules the repayments hero settled: they
 * must not restate the line above them, must not name something every bank
 * calculator has, and must say what the visitor gets rather than which control
 * produces it.
 *
 * The line carries the principle — splitting is risk spreading, not rate
 * shopping — so the chips carry what the page hands back for it.
 *
 * "When your first re-fix lands" was here and came out: Lena's read is that a
 * date is not what anyone opens this page for. The two figures they do open it
 * for are the blended rate across the whole structure and what each part costs
 * on its own. Both are real — the "Weighted average rate" tile, and the Payment
 * / Interest per year columns in the per-part table.
 */
const HERO_CHIPS = [
  "Your combined rate",
  "Payments for each part",
  "Send it to yourself",
];

export default function SplitLoanContent() {
  return (
    <div data-cmp="SplitLoanPage" className="flex min-h-screen w-full flex-col bg-valar-fog">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        data-cmp="SplitLoanPage.Hero"
        className="relative overflow-hidden bg-valar-navy px-4 pt-32 pb-12 text-white md:px-6"
      >
        {/*
         * One node branching into three lit houses. Of the three hero images
         * this is the most literal — it is the page's own diagram, and it says
         * "one loan, more than one part" before a word is read.
         *
         * Same treatment as the other two: own navy ground, anchored right,
         * faded back to valar-navy, hidden below md.
         */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[68%] md:block"
        >
          <Image
            src="/images/split-loan-hero.webp"
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 68vw, 0px"
            className="object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-valar-navy via-valar-navy/60 to-transparent" />
        </div>

        <div className="relative container mx-auto max-w-6xl">
          <div className="md:max-w-[54%]">
          <div className="mb-4 flex flex-col space-y-3">
            <div className="h-[2px] w-6 bg-valar-amber" />
            <span className="text-xs font-bold uppercase tracking-widest text-valar-steel">
              Calculator
            </span>
          </div>
          <h1 className="mb-5 text-4xl font-bold tracking-tight md:text-5xl">
            Split home loan<span className="text-valar-amber">.</span>
          </h1>
          <p className="border-l-2 border-valar-amber pl-4 text-lg font-light leading-relaxed text-valar-lilac">
            Splitting isn&rsquo;t about chasing the best rate. It&rsquo;s about spreading the risk.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {HERO_CHIPS.map((chip) => (
              <li
                key={chip}
                className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white"
              >
                {chip}
              </li>
            ))}
          </ul>
          </div>
        </div>
      </section>

      {/* ── The calculator ───────────────────────────────────── */}
      <section data-cmp="SplitLoanPage.Calculator" className="px-4 py-10 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <SplitLoanCalculator
            guideKey={MAGNET.key}
            guideTitle={MAGNET.title}
            guideReady={isReady(MAGNET)}
            pendingNote={MAGNET.pendingNote}
            /*
             * Deliberately no promise of a review. The card is a fair exchange
             * for an email address — a calculation and a guide — and offering an
             * opinion on someone's structure in return for their details is a
             * step towards advice, which is not what a form can give.
             */
            blurb={
              <>
                Get your split calculation + <b className="text-valar-navy">{MAGNET.title}</b>. No
                charge.
              </>
            }
            cover={MAGNET.cover}
            source="Split loan calculator"
          />
        </div>
      </section>

      {/* ── Why split ────────────────────────────────────────── */}
      <section data-cmp="SplitLoanPage.Why" className="px-4 pb-10 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-6 text-2xl font-bold text-valar-navy">Why split it at all</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {WHY_SPLIT.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-gray-100 bg-white p-5"
              >
                <div className="mb-3 h-[2px] w-6 bg-valar-amber" />
                <h3 className="mb-2 text-base font-bold text-valar-navy">{item.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Send it to Lena ──────────────────────────────────── */}
      <section data-cmp="SplitLoanPage.Review" className="px-4 pb-10 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-valar-navy p-6 md:p-8">
            <div className="max-w-[58ch]">
              <h2 className="mb-2 text-2xl font-bold text-white">
                Build the structure.
                <br />
                Want a second opinion on it<span className="text-valar-amber">?</span>
              </h2>
              <p className="text-[15px] leading-relaxed text-valar-lilac">
                A calculator builds the structure. Strategy comes from experience &mdash; what a
                lender will approve, and what actually holds up when rates move. Want to talk
                through your situation?
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

      {/* ── Legal ────────────────────────────────────────────── */}
      <section data-cmp="SplitLoanPage.Legal" className="px-4 pb-14 md:px-6">
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
