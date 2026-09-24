"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import BorrowCalculator from "@/components/calculators/borrow-calculator";
import { isReady, LEAD_MAGNETS } from "@/lib/lead-magnets";

/*
 * Capture lives inside the calculator, not in a modal on this page.
 *
 * The modal that used to sit here could not see what someone had typed — it
 * enrolled a lead and told Lena nothing about the numbers they were actually
 * looking at. The form under the results carries them, so the CTA at the bottom
 * of the page drives to that one form rather than offering a second, worse way
 * to ask for the same thing.
 */
/*
 * One guide across all three calculators, and one MailerLite group with it.
 *
 * This page used to offer the First Home Buyer Guide, which put borrowing-
 * calculator visitors into the "First home buyers" list while the other two
 * calculators fed "Calculators". Lena's call (10 Sep 2026): the calculators
 * share a single standard offer for now, and the first-home guide gets its own
 * home elsewhere.
 *
 * The magnet carries the group, so changing it here moves the enrolment too —
 * that is the point, not a side effect.
 */
const MAGNET = LEAD_MAGNETS["pay-your-mortgage-off-faster"];

/*
 * The three deposit levels the calculator prices, explained once in plain
 * language. It exists because the answer now offers a choice it did not before:
 * the old version quoted a single price built on a full 20% deposit, so there
 * was nothing to explain and a lot of buyers were quoted a number far below
 * what they could actually buy.
 */
/*
 * Cut to a line each on Lena's call (2026-09-11): the cards stay, the prose goes.
 *
 * Ranges, not single points (Lena, 2026-09-14): 10–20% and 5–10% are where
 * buyers actually sit. The low end is not only the First Home Loan: some banks
 * lend at 5–10% directly, at a higher LVR and a higher margin.
 */
const DEPOSIT_LEVELS = [
  {
    level: "20%+",
    title: "The standard",
    copy: "No low-equity margin and every lender open to you. The cheapest money you'll be offered.",
  },
  {
    level: "10–20%",
    title: "Common, and more expensive",
    copy: "Mostly first home buyers. Expect a low-equity margin and fewer lenders.",
  },
  {
    level: "5–10%",
    title: "Possible, with conditions",
    copy: "Some banks lend here directly, others through the First Home Loan (Kāinga Ora). A higher LVR, so a higher margin.",
  },
];

/*
 * What the calculator assumes, folded away at the foot of the page (Lena,
 * 2026-09-11). It had been removed from the calculator on 09-10 and nothing on
 * the page said what the answer rested on; she wanted it back, closed by
 * default.
 *
 * No living-cost figures: they come from Lena's benchmark model and are never
 * published. The owner-occupier scope and the settlement-costs note live here
 * now because the sections that carried them were cut.
 */
/*
 * Rewritten 2026-09-24 for the payment-first calculator. The income-based
 * version's list (loan cap, living costs, card limits) is in the archive:
 * ws-valar/calculators/_archive/what-can-i-buy-v1/.
 */
const ASSUMPTIONS = [
  {
    term: "The loan.",
    copy: "What your chosen payment repays in full over the term, at the rate you enter, principal and interest.",
  },
  { term: "Stress test.", copy: "The same loan repriced at 7%, the level lenders commonly test at." },
  {
    term: "Payment bands.",
    copy: "Your payment as a share of take-home pay: up to 30% comfortable, 30–40% manageable, 40–50% stretched, above 50% high pressure. A rule of thumb, not a lender's rule: the higher the income, the larger the share a household can usually carry.",
  },
  {
    term: "Not a lender's limit.",
    copy: "A bank also looks at your living costs, other debts and deposit. It may lend more or less than this.",
  },
];

/*
 * Lena's set, 2026-09-11. The first three chips are the answer panel in the
 * order it reads: the range (the maximum, then the 30/40/50% table under it),
 * what is holding the number (the income / budget / deposit line under the
 * loan), and what it costs a month. A chip is a promise, and each of these
 * points at a block that is actually on the screen.
 *
 * The older rules still stand: a chip says what the visitor GETS, not what the
 * form asks, and never names something every bank calculator also has. That is
 * why "5 questions", "About a minute" and "Quick run" stay out.
 *
 * "Send it to yourself" is word for word the chip on the other three heroes.
 *
 * "For a home you'll live in" also came out, but the scope did not: it is
 * stated in the assumptions folded away at the foot of the page.
 */
const HERO_CHIPS = [
  "Start from your payment",
  "Share of your pay",
  "Stress test at 7%",
  "Send it to yourself",
];

/*
 * Lena's order, 2026-09-11. The budget comes first now: the page's whole point
 * is that a lender's ceiling is not your limit, so the first step is setting
 * your own. "Get pre-approved before you shop" came out — not for this card yet.
 */
const NEXT_STEPS = [
  {
    term: "Set your own limit.",
    copy: "Work out your budget and the repayment pressure you'd be comfortable with. Your number, not the lender's.",
  },
  {
    term: "Pin down your real deposit.",
    copy: "Your actual KiwiSaver balance, and any family help confirmed in writing.",
  },
  {
    /*
     * Was "Get three clean months of statements". "Trim regular payments
     * before you apply" came off (Lena): it read like dressing the statements
     * up for the bank.
     */
    term: "Optimise your spending.",
    copy: "Lenders assess what you actually spent in the last 90 days, not your budget.",
  },
  {
    /*
     * Softened on Lena's call: the old version told people to cut. Cutting a
     * limit is not always the right move — it can be the wrong one if you rely
     * on it — so the step is to know the price of keeping it, and decide.
     */
    term: "Check your card limits.",
    copy: "Every $10,000 of limit costs about $57,000 of borrowing power, used or not. You don't have to cut them, but know what they cost.",
  },
  {
    /*
     * "A specialist" (Lena, 2026-09-11): the step is to talk to someone who
     * does this, and a bank counts as well as an adviser. The box under the list
     * then shows the adviser this page offers.
     */
    term: "Talk it through with a specialist.",
    copy: "A mortgage adviser or your bank. Structure, lender choice, and the options a calculator never sees.",
  },
];

export default function WhatCanIBuyContent() {
  return (
    <div data-cmp="WhatCanIBuyPage" className="flex min-h-screen w-full flex-col bg-valar-fog">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        data-cmp="WhatCanIBuyPage.Hero"
        className="relative overflow-hidden bg-valar-navy px-4 pt-36 pb-16 text-white md:px-6"
      >
        {/*
         * Steps climbing to a lit house — the shape of the page: how far the
         * numbers reach, and the thing standing at the top of them.
         *
         * Same treatment as the other three heroes: the art carries its own
         * navy ground, anchored right, faded back to valar-navy, hidden below
         * md where there is no room for both.
         */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[68%] md:block"
        >
          <Image
            src="/images/what-can-i-buy-hero.webp"
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
            How much can I borrow<span className="text-valar-amber">?</span>
          </h1>
          <p className="border-l-2 border-valar-amber pl-4 text-lg font-light leading-relaxed text-valar-lilac">
            Start from what you&rsquo;d be comfortable paying and see the loan it carries.
          </p>
          {/* Chips rather than a sentence — see HERO_CHIPS for why these four. */}
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
      <section data-cmp="WhatCanIBuyPage.Calculator" className="px-4 py-14 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <BorrowCalculator
            guideKey={MAGNET.key}
            guideTitle={MAGNET.title}
            guideReady={isReady(MAGNET)}
            pendingNote={MAGNET.pendingNote}
            cover={MAGNET.cover}
            blurb={
              <>
                Your numbers, and <b className="text-valar-navy">{MAGNET.title}</b> with them. The
                things that actually move the number, in the order worth doing them.
              </>
            }
            source="How much can I borrow calculator"
            aside={
              <div className="flex h-full flex-col rounded-xl border border-valar-concrete bg-white p-6 md:p-8">
                <h2 className="mb-1 text-xl font-bold text-valar-navy">Your five next steps</h2>
                {/*
                 * Was "In order. The first two move your number the fastest." —
                 * no longer true once setting your own limit went first.
                 */}
                <p className="mb-5 text-sm text-gray-600">Before you make an offer.</p>
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
                {/*
                 * mt-auto pins the call to the foot of the card, so the card
                 * fills the row height rather than leaving a gap under it — and
                 * the list ends in the thing the list is for.
                 */}
                <div className="mt-auto pt-6">
                  {/*
                   * Who step five is with, right above the button that books it
                   * (Lena, 2026-09-11) — it fills the space the card had under
                   * the list, and puts a face on the call before anyone clicks.
                   *
                   * Lena's wording (2026-09-11). No FSP number here: it is in
                   * the footer of every page. The photo is a face-centred crop
                   * (lena-avatar.webp, cut from lena-portrait.webp) because the
                   * full portrait is waist-up and the face vanished at this size.
                   */}
                  <div className="mb-5 flex items-center gap-4 rounded-lg bg-valar-fog p-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-valar-amber">
                      <Image
                        src="/images/lena-avatar.webp"
                        alt="Lena Bykova, Financial Adviser"
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-valar-amber">
                        Who you&rsquo;d talk to
                      </p>
                      <p className="font-bold text-valar-navy">Lena Bykova</p>
                      <p className="text-xs leading-relaxed text-gray-600">
                        Financial Adviser with 20+ years&rsquo; experience across finance, business
                        valuation, and investment analysis.{" "}
                        <Link
                          href="/about"
                          className="font-semibold text-valar-indigo underline-offset-2 hover:underline"
                        >
                          About Lena
                        </Link>
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/book"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-valar-amber px-6 py-3.5 text-base font-bold text-valar-navy transition-colors hover:bg-valar-amber-hover"
                  >
                    Book a clarity call &rarr;
                  </Link>
                  <p className="mt-2 text-center text-xs text-valar-steel">
                    Thirty minutes. No cost, no obligation.
                  </p>
                </div>
              </div>
            }
          />
        </div>
      </section>

      {/* ── The deposit levels ───────────────────────────────── */}
      <section data-cmp="WhatCanIBuyPage.DepositLevels" className="px-4 pb-14 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="rounded-xl border border-gray-100 bg-white p-6 md:p-8">
            <h2 className="mb-1 text-2xl font-bold text-valar-navy">
              How much deposit do you actually need
              <span className="text-valar-amber">?</span>
            </h2>
            {/*
             * One line, then the cards (Lena, 2026-09-11). The two paragraphs
             * under the cards (rentals; lending limits above 80%) came off; the
             * owner-occupier scope is in the assumptions at the foot. "What
             * counts as your deposit" went too: not what this page is for.
             */}
            <p className="mb-6 text-sm leading-relaxed text-gray-600">
              Twenty percent is the best place to buy from, but not the only one.
            </p>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {DEPOSIT_LEVELS.map((d) => (
                <div key={d.level} className="rounded-lg border border-gray-100 bg-valar-fog p-5">
                  <p className="mb-1 text-3xl font-bold tabular-nums text-valar-navy">{d.level}</p>
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-valar-amber">
                    {d.title}
                  </p>
                  <p className="text-sm leading-relaxed text-gray-600">{d.copy}</p>
                </div>
              ))}
            </div>
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
                Lender, rate and loan structure all change the answer.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="#send-my-numbers"
                className="rounded-lg border border-white/40 px-6 py-3.5 text-[15px] font-bold text-white transition-colors hover:border-white hover:bg-white/10"
              >
                Send me my numbers
              </Link>
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
            {/* Closed until opened. See ASSUMPTIONS for why it is here. */}
            <details className="group mb-4 rounded-lg border border-valar-concrete bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-semibold text-valar-navy [&::-webkit-details-marker]:hidden">
                What this calculator assumes
                <ChevronDown className="h-4 w-4 shrink-0 text-valar-steel transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-t border-valar-concrete px-4 py-3">
                <p className="mb-2">
                  Common lending practice, not any one bank&rsquo;s rules. Nothing here is guaranteed,
                  and every lender applies its own.
                </p>
                <ul className="flex flex-col gap-1">
                  {ASSUMPTIONS.map((a) => (
                    <li key={a.term}>
                      <strong className="text-valar-navy">{a.term}</strong> {a.copy}
                    </li>
                  ))}
                </ul>
              </div>
            </details>
            {/* One paragraph, on Lena's call: it had been two, and long. */}
            <p>
              <strong className="text-valar-navy">This is a guide, not advice.</strong> The figures
              are indicative, based on general assumptions, and not an offer of finance. What you
              can actually borrow is confirmed by a lender after a full application.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
