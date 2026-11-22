"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import NumberField from "@/components/calculators/number-field";
import SendCalculationForm from "@/components/calculators/send-calculation-form";
import {
  CONTRIBUTION_MAX_LVR,
  CONTRIBUTION_SHARE,
  LEGAL_FEES,
  NEW_LENDER_FIRST_YEAR_RATE,
  ONGOING_RATE,
  PER_PERIOD_LABEL,
  REPAYMENT_TOLERANCE,
  assumptionsLine,
  formatDuration,
  monthsBetween,
  refinanceOptions,
  requiredRepayment,
  type RefinanceOptions,
} from "@/lib/refinance";
import { REFINANCE_LIMITS, type RefinanceSnapshot } from "@/lib/refinance-report";
import { FREQUENCIES, type FrequencyKey } from "@/lib/split-loan";

const noSubscription = () => () => {};
const todayIso = () => new Date().toISOString().slice(0, 10);

/*
 * The starting example opens eight months from today, so the first thing anyone
 * sees is the case the page is for: a fix that is about to end.
 */
const STARTING_MONTHS_LEFT = 8;

/** The example loan ends 25 years out, which matches the example repayment. */
const STARTING_TERM_MONTHS = 300;

/*
 * Still part of the snapshot the email is built from. The page itself uses
 * refinanceOptions, which has no rate scenario.
 */
const RISE = 0.5;

const ROLL_MS = 1400;

const FIELD =
  "w-full rounded-lg border border-valar-concrete bg-white px-2.5 py-[7px] text-base font-semibold text-valar-navy focus:border-valar-amber focus:outline-none focus:ring-2 focus:ring-valar-amber/30";

const money = (n: number) => `$${Math.round(n).toLocaleString("en-NZ")}`;

function monthsFrom(iso: string, months: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString().slice(0, 10);
}

/*
 * The rolling figure Lena asked for: it runs up from zero and settles on the
 * answer each time Calculate is pressed. `run` restarts it. Reduced motion
 * skips straight to the figure.
 */
function Rolling({ to, run, format }: { to: number; run: number; format: (n: number) => string }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setShown(to));
      return () => cancelAnimationFrame(id);
    }
    const start = performance.now();
    let id = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ROLL_MS);
      setShown(to * (1 - Math.pow(1 - t, 3)));
      if (t < 1) id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [to, run]);
  return <span className="tabular-nums">{format(Math.round(shown))}</span>;
}

/*
 * Left of the form (2026-11-22, Lena): a schematic, not a lecture. The move is
 * one picture (your bank to a new lender), then five short steps in a single
 * column that fills the panel. No claim about break fees here: whether there
 * is one depends on the visitor's timing, and the costs section covers it.
 * Icons are inline so nothing new loads.
 */
const STEPS = [
  {
    title: "We review your loan",
    text: "Your bank against other lenders.",
    icon: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-4.35-4.35",
  },
  {
    title: "A new lender repays it",
    text: "Your current loan is paid off and closed.",
    icon: "M3 10l9-6 9 6M5 10v10h14V10M9 20v-6h6v6",
  },
  {
    title: "You receive a cash contribution",
    text: "From the new lender. Legal fees and other costs come out of it.",
    icon: "M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  },
  {
    title: "The difference goes onto your loan",
    text: "Contribution less costs: less to repay from day one.",
    icon: "M12 5v14M5 12l7 7 7-7",
  },
  {
    title: "We structure the new loan",
    text: "A lower repayment, or a shorter loan.",
    icon: "M4 19V5M4 19h16M8 15l4-4 3 3 5-6",
  },
];

function StepIcon({ d }: { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={d} />
    </svg>
  );
}

function HowItWorks() {
  return (
    <div className="mt-5 flex flex-1 flex-col">
      {/* The move itself, as one picture. */}
      <div
        className="flex items-center gap-3"
        aria-label="Your loan moves from your bank to a new lender"
      >
        <div className="flex-1 rounded-xl border border-valar-concrete bg-valar-fog px-4 py-3 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-valar-steel">From</p>
          <p className="text-base font-bold text-valar-navy">Your bank</p>
        </div>
        <svg
          viewBox="0 0 48 24"
          className="h-6 w-12 shrink-0 text-valar-amber"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M2 12h42M34 4l10 8-10 8" />
        </svg>
        <div className="flex-1 rounded-xl border border-valar-horizon bg-valar-horizon/15 px-4 py-3 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-valar-indigo">To</p>
          <p className="text-base font-bold text-valar-navy">A new lender</p>
        </div>
      </div>

      {/* One column; the steps spread to fill the panel beside the form. */}
      <ol className="relative mt-6 flex flex-1 flex-col justify-between gap-4">
        <span
          aria-hidden
          className="absolute top-5 bottom-5 left-5 w-px -translate-x-1/2 bg-valar-concrete"
        />
        {STEPS.map((step) => (
          <li key={step.title} className="relative flex items-center gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-valar-navy text-valar-amber">
              <StepIcon d={step.icon} />
            </span>
            <span>
              <span className="block text-base font-bold text-valar-navy">{step.title}</span>
              <span className="block text-sm text-gray-600">{step.text}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function RefinanceCalculator({
  children,
  closing,
  guideKey,
  guideTitle,
  guideReady,
}: {
  /** The explainers below the breakdown offer. */
  children: React.ReactNode;
  /** The invitation beside the capture card. */
  closing: React.ReactNode;
  guideKey: string;
  guideTitle: string;
  guideReady: boolean;
}) {
  const [balance, setBalance] = useState(600_000);
  const [propertyValue, setPropertyValue] = useState(800_000);
  const [rate, setRate] = useState(4.79);
  const [repayment, setRepayment] = useState(3_435);
  const [frequency, setFrequency] = useState<FrequencyKey>("monthly");
  // Null until the visitor touches them, so the example keeps its distance from today.
  const [typedEnd, setTypedEnd] = useState<string | null>(null);
  const [typedLoanEnd, setTypedLoanEnd] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  /*
   * Today only exists in the browser. This page is prerendered, so reading the
   * date during render would ship a stale date into the HTML and fail hydration;
   * the server snapshot is null and the answer appears once the page is live.
   */
  const today = useSyncExternalStore(noSubscription, todayIso, () => null);
  const fixedEnd = typedEnd ?? (today ? monthsFrom(today, STARTING_MONTHS_LEFT) : "");
  const loanEnd = typedLoanEnd ?? (today ? monthsFrom(today, STARTING_TERM_MONTHS) : "");

  const inputs = { balance, rate, repayment, frequency, fixedEnd, rise: RISE };
  const figures: RefinanceSnapshot = {
    kind: "refinance",
    ...inputs,
    propertyValue,
    loanEnd,
  };
  const unit = PER_PERIOD_LABEL[frequency];

  const lvr = propertyValue > 0 ? (balance / propertyValue) * 100 : null;

  /*
   * The loan end date does not drive the result yet: the term still comes from
   * the repayment. The hint tells the visitor, and Lena's copy of the lead, when
   * the two disagree, so the logic for that case can be decided from real leads.
   */
  const required =
    today && loanEnd
      ? requiredRepayment(balance, rate, monthsBetween(today, loanEnd), frequency)
      : null;
  let loanEndHint = "From your loan documents";
  if (required !== null) {
    const gap = repayment - required;
    if (Math.abs(gap) <= required * REPAYMENT_TOLERANCE) loanEndHint = "Matches your repayment";
    else if (gap > 0)
      loanEndHint = `Minimum ${money(required)} ${unit}. You pay ${money(gap)} more`;
    else loanEndHint = `Needs about ${money(required)} ${unit}. Check your numbers`;
  }

  /*
   * The answer appears on Calculate, not while typing, so the rolling figure has
   * a moment to run. Editing afterwards marks it out of date until pressed again.
   */
  const key = JSON.stringify({ ...inputs, loanEnd, propertyValue });
  const [shown, setShown] = useState<{ key: string; result: RefinanceOptions } | null>(null);
  const [run, setRun] = useState(0);
  const calculate = () => {
    if (!today) return;
    setShown({ key, result: refinanceOptions({ ...inputs, loanEnd, propertyValue }, today) });
    setRun((n) => n + 1);
  };

  /*
   * The answer opens below the form, often under the fold, so each Calculate
   * brings it into view. Reduced motion jumps instead of gliding.
   */
  const resultRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (run === 0) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    resultRef.current?.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
  }, [run]);
  const stale = shown !== null && shown.key !== key;
  const answer = shown?.result ?? null;
  // Above 80% LVR the panel shows no figures, only the request for the address.
  const highLvr = answer !== null && answer.state !== "low" && !answer.contributionEligible;

  return (
    <>
      {/*
       * What refinancing is on the left, the form on the right (2026-11-22,
       * Lena). The savings open below on Calculate, full width, and only then is
       * there anything to send: the capture button lives with the answer.
       */}
      <section
        id="refinance-check"
        data-cmp="RefinanceCalculator.Inputs"
        className="scroll-mt-28 px-4 pt-12 md:px-6"
      >
        <div className="container mx-auto grid max-w-6xl items-stretch gap-5 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
          <div className="flex flex-col rounded-2xl border border-valar-concrete bg-white p-5 md:p-7">
            <h2 className="text-xl font-bold text-valar-navy">
              How refinancing works<span className="text-valar-amber">.</span>
            </h2>
            <HowItWorks />
          </div>

          <div className="rounded-2xl border border-valar-concrete bg-white p-5 text-valar-navy md:p-7">
            <h2 className="mb-5 text-xl font-bold">
              See what could change<span className="text-valar-amber">.</span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                stacked
                label="Mortgage balance"
                value={balance}
                {...REFINANCE_LIMITS.balance}
                step={10_000}
                unit="$"
                onChange={setBalance}
              />
              <NumberField
                stacked
                label="Current interest rate"
                value={rate}
                {...REFINANCE_LIMITS.rate}
                step={0.05}
                decimals={2}
                unit="%"
                onChange={setRate}
              />
              <NumberField
                stacked
                label="Your repayment"
                value={repayment}
                {...REFINANCE_LIMITS.repayment}
                step={50}
                unit="$"
                onChange={setRepayment}
              />
              <NumberField
                stacked
                label="Property value"
                value={propertyValue}
                {...REFINANCE_LIMITS.propertyValue}
                step={10_000}
                unit="$"
                hint={lvr !== null ? `LVR ${Math.round(lvr)}%` : undefined}
                onChange={setPropertyValue}
              />
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold text-valar-navy">Fixed rate ends</span>
                <input
                  type="date"
                  value={fixedEnd}
                  onChange={(e) => setTypedEnd(e.target.value)}
                  className={FIELD}
                />
                <span className="text-[13px] leading-snug text-valar-steel">
                  Leave blank if floating
                </span>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold text-valar-navy">Loan ends</span>
                <input
                  type="date"
                  value={loanEnd}
                  onChange={(e) => setTypedLoanEnd(e.target.value)}
                  className={FIELD}
                />
                <span className="text-[13px] leading-snug text-valar-steel">{loanEndHint}</span>
              </label>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              <div className="flex gap-1.5" role="group" aria-label="Repayment frequency">
                {FREQUENCIES.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFrequency(f.key)}
                    aria-pressed={frequency === f.key}
                    className={`flex-1 rounded-lg border px-2 py-1.5 text-sm font-semibold transition-colors ${
                      frequency === f.key
                        ? "border-valar-navy bg-valar-navy text-white"
                        : "border-valar-concrete bg-white text-gray-700 hover:border-valar-amber"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              {/* One line in the narrow form column, so the wording is cut to fit. */}
              <p className="truncate text-sm text-gray-600">
                Split loan? Enter totals and your average rate.
              </p>
            </div>

            <button
              type="button"
              onClick={calculate}
              className="mt-5 w-full rounded-lg bg-valar-navy px-6 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-valar-navy/90"
            >
              {shown ? "Recalculate" : "Calculate my savings"}
            </button>
          </div>
        </div>
      </section>

      <section
        ref={resultRef}
        data-cmp="RefinanceCalculator.Result"
        aria-live="polite"
        className="scroll-mt-28 px-4 md:px-6"
      >
        {answer && (
          <div className="container mx-auto mt-5 flex max-w-6xl flex-col rounded-2xl border border-valar-concrete bg-white p-5 md:p-8">
            <h2 className="text-xl font-bold text-valar-navy">
              Your savings<span className="text-valar-amber">.</span>
            </h2>

            {/*
             * Above 80% LVR (2026-11-20, Lena): no figures at all. Lenders usually pay
             * no contribution there, so any number would mislead. The panel asks for
             * the address instead: a real valuation can bring the LVR under 80%.
             */}
            {highLvr ? (
              <div className={stale ? "opacity-50" : ""}>
                <p className="mt-3 text-3xl font-bold tracking-tight text-valar-navy md:text-4xl">
                  Let&apos;s check what your property is worth
                  <span className="text-valar-amber">.</span>
                </p>
                <p className="mt-4 text-lg leading-relaxed text-gray-600">
                  Your LVR comes out at about{" "}
                  <b className="text-valar-navy">{Math.round(answer.lvr ?? 0)}%</b>. Above{" "}
                  {CONTRIBUTION_MAX_LVR}%, lenders usually don&apos;t pay a cash contribution. But
                  your property may be worth more than you think.
                </p>
                <p className="mt-3 text-lg leading-relaxed text-gray-600">
                  Leave your address, we&apos;ll look at its value together and get in touch.
                </p>
              </div>
            ) : answer?.state === "ahead" ? (
              <div className={stale ? "opacity-50" : ""}>
                {/*
                 * Totals lead, monthly figures sit small (2026-11-20, Lena: "$74 a
                 * month" does not move anyone; the lifetime figure does). "Up to",
                 * because the larger total needs the higher repayment.
                 */}
                <p className="mt-3 text-3xl font-bold tracking-tight text-valar-navy md:text-4xl">
                  You could save up to{" "}
                  <span className="text-valar-amber">
                    <Rolling to={answer.interestSaved} run={run} format={money} />
                  </span>
                  .
                </p>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1 rounded-xl border border-valar-concrete bg-valar-fog p-5 md:p-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-valar-steel">
                      Pay less each month
                    </p>
                    <p className="mt-1 text-4xl font-bold text-valar-navy">
                      <Rolling to={answer.totalLess} run={run} format={money} />
                    </p>
                    <p className="text-sm font-semibold text-valar-navy">saved over the loan</p>
                    <p className="mt-auto pt-3 text-sm text-gray-600">
                      If you pay{" "}
                      <b className="text-valar-navy">{money(answer.firstYearRepayment)}</b> {unit},
                      then <b className="text-valar-navy">{money(answer.laterRepayment)}</b> after
                      the first year.
                    </p>
                    <p className="text-sm text-gray-600">
                      Saving <b className="text-valar-navy">{money(answer.firstYearSaving)}</b>{" "}
                      {unit}, then <b className="text-valar-navy">{money(answer.saving)}</b>.
                    </p>
                  </div>
                  <div className="relative flex flex-col gap-1 rounded-xl bg-valar-navy p-5 text-white md:p-6">
                    <span className="absolute -top-2.5 right-4 rounded-full bg-valar-amber px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-valar-navy">
                      Best saving
                    </span>
                    <p className="text-xs font-bold uppercase tracking-widest text-valar-amber">
                      Pay it off sooner
                    </p>
                    <p className="mt-1 text-4xl font-bold text-valar-amber">
                      <Rolling to={answer.interestSaved} run={run} format={money} />
                    </p>
                    <p className="text-sm font-semibold text-white">saved in interest</p>
                    <p className="mt-auto pt-3 text-sm text-valar-lilac">
                      If you pay <b className="text-white">{money(answer.stayRepayment)}</b> {unit}.
                      The loan is paid off{" "}
                      <b className="text-white">{formatDuration(answer.monthsSooner)} sooner</b>.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-5 text-lg leading-relaxed text-gray-600">
                {answer.state === "behind"
                  ? "On this loan size the cash contribution does not cover the switching costs. A conversation can still find a better structure."
                  : "Check your repayment and loan end date. With these numbers the loan does not reduce."}
              </p>
            )}

            {stale && (
              <p className="mt-3 text-sm font-semibold text-valar-navy">
                Your numbers changed. Press Recalculate to update.
              </p>
            )}

            <p
              className={`mt-4 mb-5 text-sm leading-relaxed text-gray-600 ${highLvr ? "hidden" : ""}`}
            >
              Example rates: a new lender at {NEW_LENDER_FIRST_YEAR_RATE.toFixed(2)}% for 1 year,
              then {ONGOING_RATE.toFixed(2)}%, against {ONGOING_RATE.toFixed(2)}% at your bank.
              Switching when your fixed rate ends, so no break fee. A{" "}
              {(CONTRIBUTION_SHARE * 100).toFixed(2)}% cash contribution, less about{" "}
              {money(LEGAL_FEES)} in legal fees, goes onto the loan.
            </p>

            {/*
             * Above 80% LVR the button is the whole answer, so an arrow points at it
             * (Lena, 2026-11-20). The bounce only runs for visitors who allow motion.
             */}
            <div className="flex flex-col items-center self-stretch sm:self-start">
              {highLvr && (
                <div aria-hidden="true" className="flex justify-center pb-3 text-valar-amber">
                  <svg
                    viewBox="0 0 24 48"
                    className="h-14 w-7 motion-safe:animate-bounce"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3v40M3 34l9 9 9-9" />
                  </svg>
                </div>
              )}
              <button
                type="button"
                onClick={() => setFormOpen(true)}
                className="block w-full rounded-lg bg-valar-amber px-10 py-4 text-center text-base font-bold text-valar-navy transition-colors hover:bg-valar-amber-hover sm:w-auto"
              >
                Get your calculation
              </button>
            </div>
          </div>
        )}
      </section>

      {/*
       * The capture opens over the page (2026-11-20) instead of waiting further
       * down, so the step from "that is my number" to "send it to me" is one click.
       */}
      {formOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Get your calculation"
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-valar-navy/70 p-4"
          onClick={(e) => e.target === e.currentTarget && setFormOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setFormOpen(false)}
        >
          <div className="relative w-full max-w-lg">
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              aria-label="Close"
              className="absolute top-3 right-3 z-10 rounded-full px-2.5 py-1 text-xl leading-none text-valar-steel hover:text-valar-navy"
            >
              ×
            </button>
            <SendCalculationForm
              guideKey={guideKey}
              guideTitle={guideTitle}
              guideReady={guideReady}
              source="Refinance page"
              figures={figures}
              askAddress
              eyebrow="Your refinance"
              heading="Get your calculation"
              /*
               * Deliverables only. The reminder is real but it is Lena's by hand:
               * her notification carries the date it falls due.
               */
              blurb={
                <>
                  All three options with your numbers, plus{" "}
                  <b className="text-valar-navy">{guideTitle}</b> and a reminder 90 days before your
                  fixed rate ends. No charge.
                </>
              }
            />
          </div>
        </div>
      )}
      {children}

      <section data-cmp="RefinancePage.Close" className="px-4 pt-12 pb-4 md:px-6">
        <div className="container mx-auto max-w-6xl">{closing}</div>
      </section>

      <section data-cmp="RefinancePage.Legal" className="px-4 pb-14 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="border-t border-valar-concrete pt-6 text-sm leading-relaxed text-gray-600">
            <p className="mb-2">{assumptionsLine()}</p>
            <p>
              <strong className="text-valar-navy">This is an illustration, not advice.</strong> It
              is not a loan offer or a recommendation to refinance. Rates change and lending
              criteria apply. What a lender can offer you is confirmed in writing, after a full
              application.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
