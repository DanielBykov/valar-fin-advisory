import Image from "next/image";
import Link from "next/link";
import RepaymentCalculator from "@/components/insights/repayment-calculator";
import { isReady, LEAD_MAGNETS } from "@/lib/lead-magnets";

/*
 * Capture posts to the same /api/guide-request as the guide modal — one path,
 * one consent flow. Which MailerLite group it lands in, and whether the guide
 * exists yet, are properties of the magnet, in src/lib/lead-magnets.ts.
 */
const MAGNET = LEAD_MAGNETS["pay-your-mortgage-off-faster"];

/*
 * What this calculator does that a bank's does not, as chips rather than a
 * third clause.
 *
 * Two rules learned the hard way. They must not restate the line above them —
 * "see what extra repayments save" sat directly under "see what it saves" and
 * read as a stutter. And they must not spend a slot on something every
 * calculator has: "weekly, fortnightly or monthly" is table stakes, not a
 * reason to use this one.
 *
 * Third rule, Lena's: name the BENEFIT, not the control. "Round up to a whole
 * payment" describes a field; "Round up and finish sooner" says what pressing
 * it buys. Same feature, and only the second one is a reason.
 *
 * Each is still a thing actually on the page: the "Paid off in" headline on the
 * chart card, the round-up mode on the extra control, and the capture form.
 */
const HERO_CHIPS = [
  "Check when you're mortgage-free",
  "Round up and finish sooner",
  "Send it to yourself",
];

export default function RepaymentsContent() {
  return (
    <div data-cmp="RepaymentsPage" className="flex min-h-screen w-full flex-col bg-valar-fog">
      <section
        data-cmp="RepaymentsPage.Hero"
        className="relative overflow-hidden bg-valar-navy px-4 pt-36 pb-16 text-white md:px-6"
      >
        {/*
         * Same treatment as the calculators hub: the art carries its own navy
         * ground, so it joins the section instead of sitting on it, and the
         * fade back to valar-navy covers the difference between the image's
         * navy and #061634.
         *
         * The picture is doing work here rather than decorating — gold coins as
         * stepping stones and a curve falling towards the house is the balance
         * coming down, which is exactly what the chart below plots.
         *
         * Hidden below md: no room for both, and a phone-width crop would keep
         * the empty half and lose the house.
         */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[68%] md:block"
        >
          <Image
            src="/images/repayments-hero.webp"
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 68vw, 0px"
            className="object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-valar-navy via-valar-navy/60 to-transparent" />
        </div>

        <div className="relative container mx-auto max-w-6xl">
          {/* The copy column is sized, not the type — the right half is spoken
              for by the art. */}
          <div className="md:max-w-[54%]">
          <div className="mb-4 flex flex-col space-y-3">
            <div className="h-[2px] w-6 bg-valar-amber" />
            <span className="text-xs font-bold uppercase tracking-widest text-valar-steel">
              Calculator
            </span>
          </div>
          <h1 className="mb-5 text-4xl font-bold tracking-tight md:text-5xl">
            Mortgage repayments<span className="text-valar-amber">.</span>
          </h1>
          <p className="border-l-2 border-valar-amber pl-4 text-lg font-light leading-relaxed text-valar-lilac">
            Set the loan, the rate and the term. Then add your extra and see what it saves.
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

      <section data-cmp="RepaymentsPage.Calculator" className="px-4 py-14 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <RepaymentCalculator
            guideKey={MAGNET.key}
            guideTitle={MAGNET.title}
            guideReady={isReady(MAGNET)}
            cover={MAGNET.cover}
            source="Mortgage repayments calculator"
          />
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
