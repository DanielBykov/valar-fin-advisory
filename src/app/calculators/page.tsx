import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Home, Scale, Split, TrendingDown } from "lucide-react";
import {
  CALCULATORS_LIVE,
  calculatorHref,
  liveCalculators,
  type CalculatorIconKey,
} from "@/lib/calculators";

/*
 * Each calculator's glyph. They all used the same calculator icon, which told
 * the eye nothing — three identical marks in a row is a pattern, not a label.
 *
 * Each one now echoes its own page: a house for what you can buy, a falling
 * line for a balance coming down, a branch for one loan becoming three.
 */
const ICONS: Record<CalculatorIconKey, typeof Home> = {
  home: Home,
  "trending-down": TrendingDown,
  split: Split,
  scale: Scale,
};

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

/*
 * The three things worth knowing before starting, as chips rather than a
 * sentence.
 *
 * All three are checked against what the page actually does. "Free to run" is
 * the maths, which happens in the browser and asks for nothing. "Send it to
 * yourself" is the capture form, stated as the offer it is rather than denied
 * — the sentence these replaced claimed nothing here asks for your details,
 * three scrolls above the form that does. "Guide comes with it" holds because
 * every live calculator's magnet has a file behind it; if one is ever added
 * without one, this chip is the thing that stops being true.
 */
const HERO_CHIPS = ["Free to run", "Send it to yourself", "Guide comes with it"];

export default function Page() {
  // The section stays private until CALCULATORS_LIVE is flipped in
  // src/lib/calculators.ts. Always renders locally so it can be reviewed.
  if (!CALCULATORS_LIVE && process.env.NODE_ENV !== "development") notFound();

  const calculators = liveCalculators();

  /*
   * Three across when there are three, two when there are four.
   *
   * The old `md:grid-cols-2` left the third card alone on a second row beside a
   * gap. How many cards there are is decided by the `live` flags in
   * src/lib/calculators.ts, not here, so the column count has to follow the
   * count rather than be hardcoded — the day Rent vs Buy is switched on, four
   * cards want 2×2 and three-across would strand one exactly as before.
   */
  const wideCols = calculators.length % 3 === 0 ? "lg:grid-cols-3" : "lg:grid-cols-2";

  return (
    <div data-cmp="CalculatorsPage" className="flex min-h-screen w-full flex-col bg-valar-fog">
      <section
        data-cmp="CalculatorsPage.Hero"
        className="relative overflow-hidden bg-valar-navy px-4 pt-36 pb-16 text-white md:px-6"
      >
        {/*
         * The art carries its own navy ground, so it joins the section rather
         * than sitting on top of it. Right-anchored with a fade back to
         * valar-navy, because the picture's own left third is empty space meant
         * for exactly this copy — and the fade covers the small difference
         * between the image's navy and #061634.
         *
         * Hidden below md: there is no room for both, and a phone-width crop
         * would keep the empty half and lose the piggy.
         */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[68%] md:block"
        >
          <Image
            src="/images/calculators-hero.webp"
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 68vw, 0px"
            className="object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-valar-navy via-valar-navy/60 to-transparent" />
        </div>

        <div className="relative container mx-auto max-w-6xl">
          {/*
           * The copy column is sized, not the type. Capping the paragraph and
           * letting the heading run full width is what reads as broken on a wide
           * monitor; here the right half is spoken for by the art, so the column
           * is the thing that narrows.
           */}
          <div className="md:max-w-[54%]">
            <div className="mb-4 flex flex-col space-y-3">
              <div className="h-[2px] w-6 bg-valar-amber" />
              <span className="text-xs font-bold uppercase tracking-widest text-valar-steel">
                Calculators
              </span>
            </div>
            <h1 className="mb-5 text-4xl font-bold tracking-tight md:text-5xl">
              Run your own numbers<span className="text-valar-amber">.</span>
            </h1>
            <p className="border-l-2 border-valar-amber pl-4 text-lg font-light leading-relaxed text-valar-lilac">
              Move the numbers around before anyone asks you to commit to them.
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

      <section data-cmp="CalculatorsPage.Grid" className="px-4 py-16 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${wideCols}`}>
            {calculators.map((calculator) => {
              const Icon = ICONS[calculator.icon];
              return (
              <Link
                key={calculator.slug}
                href={calculatorHref(calculator.slug)}
                data-cmp="CalculatorsPage.Card"
                className="flex flex-col rounded-xl border border-gray-100 bg-white p-7 transition-shadow hover:shadow-md md:p-8"
              >
                <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-[10px] bg-valar-amber/15 text-valar-amber">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mb-3 text-xl font-bold text-valar-navy">{calculator.title}</h2>
                <p className="mb-6 flex-1 text-[15px] leading-relaxed text-gray-600">
                  {calculator.blurb}
                </p>
                <span className="inline-flex items-center text-sm font-semibold text-valar-navy">
                  Open <ArrowRight className="ml-2 h-4 w-4 text-valar-amber" />
                </span>
              </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section data-cmp="CalculatorsPage.Cta" className="px-4 pb-20 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-valar-navy p-8 md:p-10">
            <div className="max-w-[52ch]">
              {/*
               * Lena's wording and length (2026-09-14). The paragraph was three
               * sentences listing what a calculator cannot do; one is enough.
               */}
              <h2 className="mb-2 text-2xl font-bold text-white">
                Calculators show your numbers. They don&rsquo;t build strategy
                <span className="text-valar-amber">.</span>
              </h2>
              <p className="text-[15px] leading-relaxed text-valar-lilac">
                What to do about them is a conversation, not a calculation.
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
