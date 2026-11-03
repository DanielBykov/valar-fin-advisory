import Link from "next/link";
import RefinanceCalculator from "@/components/calculators/refinance-calculator";
import { isReady, LEAD_MAGNETS } from "@/lib/lead-magnets";

/*
 * The existing guide rather than a new magnet: paying a mortgage off sooner is
 * this page's promise and that guide's subject, and the Calculators group and its
 * automation already exist.
 */
const MAGNET = LEAD_MAGNETS["pay-your-mortgage-off-faster"];

const HERO_CHIPS = ["Your new repayment", "Your finish date", "What to do before your fix ends"];

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
      <RefinanceCalculator
        guideKey={MAGNET.key}
        guideTitle={MAGNET.title}
        guideReady={isReady(MAGNET)}
        cover={MAGNET.cover}
        intro={
          <>
            <div className="mb-4 flex flex-col space-y-3">
              <div className="h-[2px] w-6 bg-valar-amber" />
              <span className="text-xs font-bold uppercase tracking-widest text-valar-steel">
                Refinance
              </span>
            </div>
            <h1 className="mb-5 text-4xl font-bold tracking-tight md:text-6xl">
              Pay off your mortgage sooner<span className="text-valar-amber">.</span>
            </h1>
            <p className="border-l-2 border-valar-amber pl-4 text-lg font-light leading-relaxed text-valar-lilac">
              Refinancing is one tool that can help. Enter four numbers to see what your repayment
              could be, and how much sooner your loan could finish.
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
          </>
        }
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
