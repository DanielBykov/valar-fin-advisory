"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import NumberField from "@/components/calculators/number-field";
import SendCalculationForm from "@/components/calculators/send-calculation-form";
import {
  RISE_OPTIONS,
  assumptionsLine,
  calculateRefinance,
  describeRefinance,
  formatDuration,
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

function monthsFrom(iso: string, months: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString().slice(0, 10);
}

/*
 * The brand blue fails chart validation on white, so the refinance bar uses the
 * validated substitute. See the note on brand colours in the mirror doc.
 */
const REFINANCE_BAR = "bg-[#4A6BAF]";

function Bar({
  label,
  months,
  longest,
  colour,
}: {
  label: string;
  months: number;
  longest: number;
  colour: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
        <span className="text-valar-navy">{label}</span>
        <b className="tabular-nums text-valar-navy">{formatDuration(months)}</b>
      </div>
      <div className="h-4 rounded bg-valar-fog">
        <div
          className={`h-full rounded transition-[width] duration-300 motion-reduce:transition-none ${colour}`}
          style={{ width: `${(months / longest) * 100}%` }}
        />
      </div>
    </div>
  );
}

export default function RefinanceCalculator({
  intro,
  children,
  closing,
  guideKey,
  guideTitle,
  guideReady,
  cover,
}: {
  /** The hero's left column, written on the server. */
  intro: React.ReactNode;
  /** What sits between the answer and the capture card. */
  children: React.ReactNode;
  /** The invitation beside the capture card. */
  closing: React.ReactNode;
  guideKey: string;
  guideTitle: string;
  guideReady: boolean;
  cover?: { src: string; width: number; height: number };
}) {
  const [balance, setBalance] = useState(600_000);
  const [rate, setRate] = useState(4.79);
  const [repayment, setRepayment] = useState(3_435);
  const [frequency, setFrequency] = useState<FrequencyKey>("monthly");
  const [rise, setRise] = useState(0.5);
  // Null until the visitor touches it, so the example keeps its distance from today.
  const [typedEnd, setTypedEnd] = useState<string | null>(null);

  /*
   * Today only exists in the browser. This page is prerendered, so reading the
   * date during render would ship a stale date into the HTML and fail hydration;
   * the server snapshot is null and the answer appears once the page is live.
   */
  const today = useSyncExternalStore(noSubscription, todayIso, () => null);
  const fixedEnd = typedEnd ?? (today ? monthsFrom(today, STARTING_MONTHS_LEFT) : "");

  const inputs = useMemo(
    () => ({ balance, rate, repayment, frequency, fixedEnd, rise }),
    [balance, rate, repayment, frequency, fixedEnd, rise],
  );
  const result = useMemo(() => (today ? calculateRefinance(inputs, today) : null), [inputs, today]);
  const words = result ? describeRefinance(result, inputs) : null;
  const figures: RefinanceSnapshot = { kind: "refinance", ...inputs };

  const showBars =
    result && result.state !== "low" && words?.showComparison && result.refinanceMonths !== null;
  const longest = showBars ? Math.max(result.stayMonths, result.refinanceMonths ?? 0) : 1;

  return (
    <>
      <section
        data-cmp="RefinancePage.Hero"
        className="bg-valar-navy px-4 pt-32 pb-20 text-white md:px-6"
      >
        <div className="container mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div className="min-w-0">{intro}</div>

          <div
            data-cmp="RefinanceCalculator.Inputs"
            className="min-w-0 rounded-2xl bg-white p-5 text-valar-navy md:p-6"
          >
            <h2 className="mb-4 text-xl font-bold">See what could change</h2>
            <div className="grid gap-3 sm:grid-cols-2">
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
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-valar-navy">Fixed rate ends</span>
                <input
                  type="date"
                  value={fixedEnd}
                  onChange={(e) => setTypedEnd(e.target.value)}
                  className="w-full rounded-lg border border-valar-concrete bg-white px-2.5 py-[7px] text-sm font-semibold text-valar-navy focus:border-valar-amber focus:outline-none focus:ring-2 focus:ring-valar-amber/30"
                />
                <span className="text-[11px] leading-snug text-valar-steel">
                  Leave blank if floating
                </span>
              </label>
            </div>

            <div className="mt-3 flex gap-1.5" role="group" aria-label="Repayment frequency">
              {FREQUENCIES.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFrequency(f.key)}
                  aria-pressed={frequency === f.key}
                  className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-semibold transition-colors ${
                    frequency === f.key
                      ? "border-valar-navy bg-valar-navy text-white"
                      : "border-valar-concrete bg-white text-gray-700 hover:border-valar-amber"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <p className="mt-3 text-xs leading-relaxed text-gray-600">
              Loan split into parts? Enter the total balance, your average rate and your total
              repayment.
            </p>
          </div>
        </div>
      </section>

      <section data-cmp="RefinanceCalculator.Result" className="relative -mt-8 px-4 md:px-6">
        <div
          aria-live="polite"
          className="container mx-auto grid min-h-56 max-w-6xl gap-6 rounded-2xl border border-valar-concrete bg-white p-5 md:p-8 lg:grid-cols-2 lg:gap-10"
        >
          {words && (
            <>
              <div className="min-w-0">
                <p className="font-semibold text-valar-navy">{words.label}</p>
                {words.headlineIsFigure ? (
                  <p className="mt-1 text-5xl font-bold tracking-tight tabular-nums text-valar-navy md:text-7xl">
                    {words.headline}{" "}
                    <span className="text-lg font-medium tracking-normal text-gray-600">
                      {words.headlineUnit}
                    </span>
                  </p>
                ) : (
                  <p className="mt-1 text-3xl font-bold tracking-tight text-valar-navy md:text-4xl">
                    {words.headline}
                  </p>
                )}
                <p className="mt-2 leading-relaxed text-gray-600">{words.sub}</p>
                {words.pills.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {words.pills.map((pill) => (
                      <li
                        key={pill}
                        className="rounded-lg border border-valar-concrete bg-valar-fog px-3 py-1.5 text-sm font-bold text-valar-navy"
                      >
                        {pill}
                      </li>
                    ))}
                  </ul>
                )}
                {words.note && (
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{words.note}</p>
                )}
              </div>

              {words.rollLabel && (
                <div className="flex min-w-0 flex-col justify-center gap-5 border-t border-valar-concrete pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
                  <div>
                    <p className="mb-1.5 text-sm font-semibold text-valar-navy">
                      {words.rollLabel}
                    </p>
                    <div className="flex flex-wrap gap-1.5" role="group" aria-label="Rate scenario">
                      {RISE_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setRise(option.value)}
                          aria-pressed={rise === option.value}
                          className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors ${
                            rise === option.value
                              ? "border-valar-navy bg-valar-navy text-white"
                              : "border-valar-concrete bg-white text-valar-navy hover:border-valar-amber"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {showBars && (
                    <div className="flex flex-col gap-3">
                      <Bar
                        label="Stay with your current loan"
                        months={result.stayMonths}
                        longest={longest}
                        colour="bg-valar-steel"
                      />
                      <Bar
                        label="Refinance"
                        months={result.refinanceMonths ?? 0}
                        longest={longest}
                        colour={REFINANCE_BAR}
                      />
                      <p className="text-xs leading-relaxed text-gray-600">
                        Both lines pay the same amounts. The refinance line uses the sample rate for
                        2 years, then both use the same rate.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {children}

      <section data-cmp="RefinancePage.Close" className="px-4 pb-10 md:px-6">
        <div
          id="send-my-refinance"
          className="container mx-auto grid max-w-6xl scroll-mt-28 gap-5 lg:grid-cols-2"
        >
          <SendCalculationForm
            guideKey={guideKey}
            guideTitle={guideTitle}
            guideReady={guideReady}
            cover={cover}
            source="Refinance page"
            figures={figures}
            /*
             * Deliverables only. The reminder is real but it is Lena's by hand:
             * her notification carries the date it falls due.
             */
            blurb={
              <>
                Get your calculation + <b className="text-valar-navy">{guideTitle}</b>, and a
                reminder 90 days before your fixed rate ends. No charge.
              </>
            }
          />
          {closing}
        </div>
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
