"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import NumberField from "@/components/calculators/number-field";
import SendCalculationForm from "@/components/calculators/send-calculation-form";
import {
  FREQUENCIES,
  calculateSplit,
  interestInFirstYearByPart,
  type FrequencyKey,
  type LoanPart,
  type PartType,
} from "@/lib/split-loan";

const nzd = (n: number, decimals = 0) =>
  new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(Number.isFinite(n) ? n : 0);

const PART_LABELS = ["Part 1", "Part 2", "Part 3"];

/** The fixed terms a NZ lender actually offers on a split. */
const FIXED_TERMS = [1, 2, 3, 4, 5];

const STARTING_TOTAL = 600_000;

/**
 * The loan is the wider column and the split is the narrower one, on both rows.
 * Shared so the two can never drift apart — the alignment is the layout.
 */
const COLUMNS = "lg:grid-cols-[1.15fr_0.85fr]";

/*
 * One, two and three years, at Lena's indicative fixed rates.
 *
 * These are a starting point, not a quote — they should track her own rate
 * sheets rather than the market in general, and they are the first thing to
 * check when this calculator is looked at again.
 *
 * `extraMode` and `extraValue` are part of the shared LoanPart shape and stay
 * at zero here on purpose: this calculator does not model extra repayments at
 * all. That question belongs to the repayments calculator, where the whole
 * page is about it — see the note at the foot of the results panel.
 */
const STARTING_PARTS: LoanPart[] = [
  { amount: 200_000, rate: 4.99, fixedYears: 1, type: "pi", extraMode: "amount", extraValue: 0 },
  { amount: 200_000, rate: 5.19, fixedYears: 2, type: "pi", extraMode: "amount", extraValue: 0 },
  { amount: 200_000, rate: 5.29, fixedYears: 3, type: "pi", extraMode: "amount", extraValue: 0 },
];

/**
 * Divide a total into parts that add back up to it exactly.
 *
 * Rounded to the nearest $1,000 so the boxes read like amounts someone would
 * actually ask a lender for; the rounding difference lands on the first part
 * rather than leaving the split a few hundred dollars short of the loan.
 */
function shareOut(total: number, n: number): number[] {
  if (n <= 0) return [];
  const each = Math.round(total / n / 1000) * 1000;
  const shares = Array.from({ length: n }, () => each);
  shares[0] = total - each * (n - 1);
  return shares.map((s) => Math.max(0, Math.round(s)));
}

/** One line of the dark results panel. */
function Line({
  label,
  value,
  accent = false,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-sm text-valar-lilac">{label}</span>
      <span
        className={`shrink-0 text-sm font-semibold tabular-nums ${
          accent ? "text-valar-amber" : "text-white"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default function SplitLoanCalculator({
  guideKey,
  guideTitle,
  guideReady,
  pendingNote,
  blurb,
  cover,
  source,
}: {
  /** Which lead magnet the card offers — decides the MailerLite group. */
  guideKey?: string;
  /** Named on the capture card and in the email. Omit to hide the card. */
  guideTitle?: string;
  /** False while there is no document to send. */
  guideReady?: boolean;
  /** What the thank-you says when there is no document — a review is not a PDF. */
  pendingNote?: string;
  /** The card's own sentence, for when "a short guide" is the wrong description. */
  blurb?: React.ReactNode;
  /** The guide's cover art, shown at the top of the capture card. */
  cover?: { src: string; width: number; height: number };
  /** Which page asked, recorded against the subscriber. */
  source?: string;
}) {
  const [totalLoan, setTotalLoan] = useState(STARTING_TOTAL);
  const [splitEqually, setSplitEqually] = useState(true);
  const [parts, setParts] = useState<LoanPart[]>(STARTING_PARTS);
  const [activeCount, setActiveCount] = useState(3);
  const [frequency, setFrequency] = useState<FrequencyKey>("fortnightly");
  const [loanYears, setLoanYears] = useState(30);

  /*
   * An equal split is DERIVED, never stored. Storing it would mean every change
   * to the total had to remember to rewrite three amounts, and the one place
   * that forgot would leave the boxes disagreeing with the loan beside them.
   */
  const visible = useMemo(() => {
    const slice = parts.slice(0, activeCount);
    if (!splitEqually) return slice;
    const shares = shareOut(totalLoan, activeCount);
    return slice.map((p, i) => ({ ...p, amount: shares[i] }));
  }, [parts, activeCount, splitEqually, totalLoan]);

  const result = useMemo(
    () => calculateSplit(visible, frequency, loanYears),
    [visible, frequency, loanYears],
  );

  const update = (index: number, patch: Partial<LoanPart>) =>
    setParts((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)));

  /*
   * Typing an amount is what turns the equal split off — the tick box is a
   * claim about what the amounts are, so editing one has to contradict it. The
   * derived amounts are written back first, so the other parts stay where they
   * were drawn instead of jumping to whatever was last stored.
   */
  const updateAmount = (index: number, amount: number) => {
    if (!splitEqually) return update(index, { amount });
    const shares = shareOut(totalLoan, activeCount);
    setParts((prev) =>
      prev.map((p, i) =>
        i < activeCount ? { ...p, amount: i === index ? amount : shares[i] } : p,
      ),
    );
    setSplitEqually(false);
  };

  const perYear = result.perYear;
  const singular = result.frequencyLabel.replace(/ly$/, "");
  const annualPayment = result.totalPayment * perYear;
  const interestByPart = useMemo(
    () => interestInFirstYearByPart(visible, perYear, loanYears),
    [visible, perYear, loanYears],
  );
  const annualInterest = interestByPart.reduce((sum, n) => sum + n, 0);
  const unallocated = totalLoan - result.totalPrincipal;

  return (
    <div data-cmp="SplitLoanCalculator" className="flex flex-col gap-5">
      {/*
       * COLUMNS is deliberately the same on this row and the one below: the
       * loan sits above the answer and the split sits above the ask, so the
       * two vertical lines have to run the whole way down. Two grids rather
       * than one four-cell grid, because the rows size independently.
       */}
      <div className={`grid items-stretch gap-5 ${COLUMNS}`}>
        {/* Indigo edge — what is being borrowed. */}
        <div
          data-cmp="SplitLoanCalculator.Loan"
          className="flex flex-col gap-5 rounded-xl border border-valar-concrete border-t-[3px] border-t-valar-indigo bg-valar-indigo/[0.04] p-5"
        >
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-valar-indigo">
              The loan
            </h2>
            <span className="text-xs text-valar-steel">What you are borrowing</span>
          </div>

          <NumberField
            label="Total loan"
            value={totalLoan}
            min={50_000}
            max={3_000_000}
            step={10_000}
            unit="$"
            onChange={setTotalLoan}
          />
          <NumberField
            label="Loan term"
            value={loanYears}
            min={5}
            max={30}
            step={1}
            unit="yrs"
            onChange={setLoanYears}
          />

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-valar-navy">Repayment frequency</span>
            <div className="flex gap-1.5" role="group" aria-label="Repayment frequency">
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
          </div>

          <p className="mt-auto text-xs leading-relaxed text-valar-steel">
            The term sets your repayment. How long a rate is fixed for is a separate thing.
          </p>
        </div>

        {/* Amber edge — how it is carved up. */}
        <div
          data-cmp="SplitLoanCalculator.Parts"
          className="flex flex-col gap-3.5 rounded-xl border border-valar-concrete border-t-[3px] border-t-valar-amber bg-white p-5"
        >
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-valar-amber">
              The split
            </h2>
            <span className="text-xs text-valar-steel">
              {Math.abs(unallocated) >= 1 ? (
                <span className="font-semibold text-valar-navy">
                  {unallocated > 0
                    ? `${nzd(unallocated)} unallocated`
                    : `${nzd(-unallocated)} over`}
                </span>
              ) : (
                `${nzd(result.totalPrincipal)} allocated`
              )}
            </span>
          </div>

          <label className="flex items-center gap-2 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={splitEqually}
              onChange={(e) => setSplitEqually(e.target.checked)}
              className="h-4 w-4 shrink-0 rounded border-valar-concrete accent-valar-amber"
            />
            <span>
              <b className="text-valar-navy">Split equally</b> — edit any amount to take over.
            </span>
          </label>

          {/* Column headers once, then one row per part. */}
          <div className="hidden grid-cols-[1fr_98px_54px_100px] gap-2 px-1 sm:grid">
            {["Amount", "Rate", "Fixed yrs", "Type"].map((h) => (
              <span
                key={h}
                className="text-[10px] font-bold uppercase tracking-wider text-valar-steel"
              >
                {h}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            {visible.map((part, i) => (
              <div
                key={i}
                data-cmp="SplitLoanCalculator.Part"
                className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_98px_54px_100px]"
              >
                <NumberField
                  stacked
                  hideLabel
                  label={`${PART_LABELS[i]} amount`}
                  value={part.amount}
                  min={0}
                  max={3_000_000}
                  step={10_000}
                  unit="$"
                  onChange={(n) => updateAmount(i, n)}
                />
                <NumberField
                  stacked
                  hideLabel
                  label={`${PART_LABELS[i]} rate`}
                  value={part.rate}
                  min={1}
                  max={12}
                  step={0.05}
                  unit="%"
                  decimals={2}
                  onChange={(n) => update(i, { rate: n })}
                />
                <select
                  value={part.fixedYears}
                  onChange={(e) => update(i, { fixedYears: Number(e.target.value) })}
                  aria-label={`${PART_LABELS[i]} fixed for, in years`}
                  className="w-full rounded-lg border border-valar-concrete bg-white px-1.5 py-2 text-sm font-semibold text-valar-navy focus:border-valar-amber focus:outline-none focus:ring-2 focus:ring-valar-amber/30"
                >
                  {FIXED_TERMS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <select
                  value={part.type}
                  onChange={(e) => update(i, { type: e.target.value as PartType })}
                  aria-label={`${PART_LABELS[i]} repayment type`}
                  className="w-full rounded-lg border border-valar-concrete bg-white px-1.5 py-2 text-xs font-semibold text-valar-navy focus:border-valar-amber focus:outline-none focus:ring-2 focus:ring-valar-amber/30"
                >
                  <option value="pi">P&amp;I</option>
                  <option value="io">Interest only</option>
                </select>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {activeCount < 3 && (
              <button
                type="button"
                onClick={() => setActiveCount((n) => n + 1)}
                className="rounded-lg border border-dashed border-valar-concrete px-3 py-1.5 text-xs font-semibold text-valar-navy transition-colors hover:border-valar-amber"
              >
                + Add a part
              </button>
            )}
            {activeCount > 1 && (
              <button
                type="button"
                onClick={() => setActiveCount((n) => n - 1)}
                className="rounded-lg border border-valar-concrete px-3 py-1.5 text-xs font-semibold text-valar-steel transition-colors hover:text-valar-navy"
              >
                Remove one
              </button>
            )}
            {!splitEqually && (
              <button
                type="button"
                onClick={() => setSplitEqually(true)}
                className="rounded-lg border border-valar-concrete px-3 py-1.5 text-xs font-semibold text-valar-navy transition-colors hover:border-valar-amber"
              >
                Back to equal
              </button>
            )}
          </div>

          {/*
           * Only shown once a part is actually interest-only. It is the one
           * choice in the grid whose consequence is not visible in the numbers
           * beside it — the balance simply never moves.
           */}
          {visible.some((p) => p.type === "io" && p.amount > 0) && (
            <p className="mt-auto border-t border-gray-100 pt-3 text-[11px] leading-snug text-valar-steel">
              An interest-only part never reduces on its own — the balance you see at the re-fix is
              the balance you started with.
            </p>
          )}
        </div>
      </div>

      {/* ── Row 2: what it costs, and the ask ─────────────── */}
      <div id="send-my-split" className={`grid scroll-mt-28 gap-5 ${COLUMNS}`}>
        <div
          data-cmp="SplitLoanCalculator.Summary"
          className="flex flex-col rounded-xl bg-valar-navy p-5 text-white md:p-6"
        >
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-valar-amber">
            Your {result.frequencyLabel} repayment
          </p>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="text-3xl font-bold tabular-nums md:text-4xl">
              {nzd(result.totalPayment, 2)}
            </p>
            <p className="text-sm text-valar-lilac">
              <span className="font-semibold tabular-nums text-white">{nzd(annualPayment)}</span>{" "}
              paid per year
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-2 border-t border-white/15 pt-4">
            <Line label="Total borrowed" value={nzd(result.totalPrincipal)} />

            {/*
             * The structure itself, one line per part. This is what the table
             * underneath used to be needed for — that table is now only the
             * per-part costs, folded away.
             */}
            <div className="flex flex-col gap-1 rounded-lg bg-white/[0.07] p-2.5">
              {visible.map((part, i) =>
                part.amount <= 0 ? null : (
                  <div key={i} className="flex items-baseline justify-between gap-4 text-sm">
                    <span className="text-valar-lilac">
                      Part {i + 1}
                      <span className="ml-2 text-xs text-valar-steel">
                        fixed {part.fixedYears} yr{part.fixedYears === 1 ? "" : "s"}
                        {part.type === "io" ? " · interest only" : ""}
                      </span>
                    </span>
                    <span className="shrink-0 tabular-nums">
                      {nzd(part.amount)}{" "}
                      <span className="font-semibold text-valar-lilac">
                        @ {part.rate.toFixed(2)}%
                      </span>
                    </span>
                  </div>
                ),
              )}
            </div>

            <Line
              label="Weighted average rate"
              value={`${result.weightedAverageRate.toFixed(2)}%`}
              accent
            />
            <Line label="Total paid per year" value={nzd(annualPayment)} />
            <Line label="Interest paid per year" value={nzd(annualInterest)} />
            <Line
              label="First re-fix"
              value={
                result.nextRefixYears > 0 ? (
                  <>
                    in {result.nextRefixYears} yr{result.nextRefixYears === 1 ? "" : "s"}
                    <span className="ml-2 font-normal text-valar-lilac">
                      on {nzd(result.nextRefixAmount)}
                    </span>
                  </>
                ) : (
                  "—"
                )
              }
            />
            {result.totalBalanceRemaining >= 1 && (
              <Line
                label={`Still owing after ${result.loanYears} years`}
                value={nzd(result.totalBalanceRemaining)}
              />
            )}
          </div>

          {result.totalPrincipal > 0 && (
            <div className="mt-4 border-t border-white/15 pt-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-valar-amber">
                What each part costs
              </p>

              <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-[440px] text-xs">
                    <thead>
                      <tr className="text-left text-valar-steel">
                        {[
                          "Part",
                          `Per ${singular}`,
                          "Per year",
                          "Interest / yr",
                          "Left at re-fix",
                        ].map((h) => (
                          <th key={h} className="py-2 pr-3 font-semibold uppercase tracking-wider">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {visible.map((part, i) => {
                        if (part.amount <= 0) return null;
                        const r = result.parts[i];
                        return (
                          <tr key={i} className="border-t border-white/10">
                            <td className="py-2 pr-3 text-valar-lilac">Part {i + 1}</td>
                            <td className="py-2 pr-3 font-semibold tabular-nums">
                              {nzd(r.totalPayment, 2)}
                            </td>
                            <td className="py-2 pr-3 tabular-nums text-valar-lilac">
                              {nzd(r.totalPayment * perYear)}
                            </td>
                            <td className="py-2 pr-3 tabular-nums text-valar-amber">
                              {nzd(interestByPart[i])}
                            </td>
                            <td className="py-2 pr-3 tabular-nums text-valar-lilac">
                              {nzd(r.balanceAtRefix)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                <p className="mt-3 text-[11px] leading-relaxed text-valar-steel">
                  <b className="text-valar-lilac">Interest / yr</b> is what that part costs you in
                  interest over its first twelve months — the part of the repayment that buys you
                  nothing. It is the number to compare parts on.
                </p>
              </div>
            </div>
          )}

          <p className="mt-auto pt-4 text-xs leading-relaxed text-valar-lilac">
            This calculator models the structure, not extra repayments. To see what paying more each
            time does to the balance,{" "}
            <Link
              href="/calculators/repayments"
              className="font-semibold text-white underline decoration-valar-amber underline-offset-2 hover:text-valar-amber"
            >
              use the repayments calculator
            </Link>
            . The repayment and the interest before your first re-fix are locked in; anything
            covering the full {result.loanYears} years assumes today&rsquo;s rates hold, which they
            will not.
          </p>
        </div>

        {guideTitle && (
          <SendCalculationForm
            guideKey={guideKey}
            guideTitle={guideTitle}
            source={source}
            guideReady={Boolean(guideReady)}
            pendingNote={pendingNote}
            blurb={blurb}
            cover={cover}
            figures={{ kind: "split", loanYears, frequency, parts: visible }}
          />
        )}
      </div>
    </div>
  );
}
