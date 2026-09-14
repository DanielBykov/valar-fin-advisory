"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, ChevronDown, Info } from "lucide-react";

import {
  type Inputs,
  type Result,
  DEFAULTS,
  KIWISAVER_RATES,
  calculate,
  livingBenchmark,
  money,
  toNumber,
  withCommas,
} from "@/lib/affordability";
import { snapshotFromInputs } from "@/lib/affordability-report";
import SendCalculationForm from "@/components/calculators/send-calculation-form";

// ---------- inputs ----------
function MoneyField({
  id,
  label,
  hint,
  prefix = "$",
  value,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  prefix?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div data-cmp="AffordabilityCalculator.Field" className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-valar-navy">
        {label}
      </label>
      <div className="flex items-center rounded-lg border border-valar-concrete bg-white focus-within:border-valar-amber focus-within:ring-2 focus-within:ring-valar-amber/30">
        <span className="pl-3 text-sm text-valar-steel">{prefix}</span>
        <input
          id={id}
          type="text"
          inputMode={prefix === "%" ? "decimal" : "numeric"}
          value={value}
          onChange={(e) =>
            onChange(prefix === "%" ? e.target.value.replace(/[^0-9.]/g, "") : withCommas(e.target.value))
          }
          className="w-full bg-transparent px-2 py-2.5 text-sm font-semibold tabular-nums text-valar-navy focus:outline-none"
        />
      </div>
      {hint && <p className="text-xs leading-relaxed text-valar-steel">{hint}</p>}
    </div>
  );
}

/**
 * A short question that does not need a whole row: the label on the left, the
 * control on the right, one line.
 */
function InlineSelect({
  id,
  label,
  hint,
  small,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  hint?: string;
  /** The version that sits under an income field rather than on its own row. */
  small?: boolean;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
        <label
          htmlFor={id}
          className={
            small
              ? "text-xs font-semibold text-valar-steel"
              : "text-sm font-semibold text-valar-navy"
          }
        >
          {label}
        </label>
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`rounded-lg border border-valar-concrete bg-white font-semibold text-valar-navy focus:border-valar-amber focus:outline-none focus:ring-2 focus:ring-valar-amber/30 ${
            small ? "px-2 py-1 text-xs" : "px-3 py-2 text-sm"
          }`}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      {hint && <p className="text-xs leading-relaxed text-valar-steel">{hint}</p>}
    </div>
  );
}

function IncomeField({
  id,
  label,
  value,
  onChange,
  kiwi,
  onKiwiChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  kiwi: string;
  onKiwiChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <MoneyField id={id} label={label} hint="Per year, before tax" value={value} onChange={onChange} />
      <InlineSelect
        id={`${id}-kiwi`}
        label="KiwiSaver"
        small
        value={kiwi}
        onChange={onKiwiChange}
        options={KIWISAVER_RATES.map((r) => ({
          value: r,
          label: r === "0" ? "Not in it" : `${r}%`,
        }))}
      />
    </div>
  );
}

// ---------- results ----------
/*
 * The four bands of repayment-to-take-home, as a scale rather than a sentence.
 *
 * Labels and thresholds mirror shareBand() in src/lib/affordability.ts — if one
 * moves, move the other. A rule of thumb, not any lender's rule; no bank
 * publishes a share-of-income cap. It is the number people actually feel, and
 * the one a maximum loan hides.
 */
const SHARE_SCALE = [
  { label: "Comfortable", range: "to 30%", on: "bg-emerald-600 text-white" },
  { label: "Manageable", range: "30–40%", on: "bg-emerald-600 text-white" },
  { label: "Stretched", range: "40–50%", on: "bg-valar-amber text-valar-navy" },
  { label: "High risk", range: "50%+", on: "bg-orange-500 text-white" },
] as const;

/**
 * The take-home bar's three fills.
 *
 * Not the brand tokens: valar-indigo is too dark for a chart mark and
 * valar-amber too faint on a light ground. Blue + rose passed every check of
 * the dataviz validator against this block's lilac ground (#E9EAF4) — lightness,
 * chroma, colour-blind separation, contrast. Amber passed too but was passed
 * over: it is the "Stretched" colour on the scale right above, and a dark ochre
 * on a light ground is the one Lena has already called dirty.
 *
 * "Left" is plain white — the unspent part of the bar, not a series.
 */
const SPLIT_COLOURS = {
  mortgage: "#4A6BAF",
  owed: "#D0567E",
  left: "#FFFFFF",
} as const;

/** The label above each block of the answer. */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-valar-amber">
      {children}
    </p>
  );
}

export default function AffordabilityCalculator({
  guideKey,
  guideTitle,
  guideReady,
  pendingNote,
  blurb,
  cover,
  source,
  aside,
}: {
  guideKey?: string;
  guideTitle?: string;
  guideReady?: boolean;
  pendingNote?: string;
  blurb?: React.ReactNode;
  cover?: { src: string; width: number; height: number };
  source?: string;
  /**
   * Filled into the left column under the form, beside the send-me-my-numbers
   * card.
   *
   * The input panel is shorter than the answer, so that space was empty and
   * the page's next-steps content sat far below where anyone would read it.
   * It lives here now: the question "what do I do about this?" is asked the
   * moment the number lands, not three sections later.
   *
   * The content stays in the page, not the component — layout here, words
   * there.
   */
  aside?: React.ReactNode;
}) {
  const [draft, setDraft] = useState<Inputs>(DEFAULTS);
  /*
   * Whether anyone has typed in the spending box.
   *
   * Until they have, it tracks the benchmark for the household they have
   * described — so the figure on screen is always plausible for THEM rather
   * than a fixed $2,200 that belongs to nobody. The moment they type, it is
   * theirs and stops moving; changing income afterwards must not quietly
   * rewrite a number they entered.
   */
  const [spendTouched, setSpendTouched] = useState(false);

  // The spending benchmark for the household a set of inputs describes.
  const benchmarkFor = (d: Inputs) =>
    livingBenchmark(
      (toNumber(d.inc1) + (d.who === "2" ? toNumber(d.inc2) : 0)) / 12,
      d.who === "2",
      parseInt(d.deps, 10) || 0,
    );

  /*
   * Seeded the way the form opens: the defaults, with the spending box on its
   * benchmark. Seeded with DEFAULTS alone, a fresh page came up stale ("Numbers
   * changed. Run again." and a dimmed answer) before anyone had typed, because
   * the box shows the benchmark rather than DEFAULTS.spend. Found 2026-09-14.
   */
  const [committed, setCommitted] = useState<Inputs>(() => ({
    ...DEFAULTS,
    spend: withCommas(String(benchmarkFor(DEFAULTS))),
  }));
  // The (i) beside "Repayment pressure": closed until someone asks what it means.
  const [showPressureInfo, setShowPressureInfo] = useState(false);
  // The footnote on "LVR" in the navy block.
  const [showLvrInfo, setShowLvrInfo] = useState(false);

  const result: Result = useMemo(() => calculate(committed), [committed]);

  /*
   * The benchmark for whatever is currently in the form — recomputed as the
   * household changes, and used both to pre-fill the box and to explain it.
   */
  const suggestedSpend = benchmarkFor(draft);

  /*
   * What the spending box actually shows and what gets calculated.
   *
   * Untouched, it IS the benchmark and follows the household as income,
   * partner and dependants change. Once typed in, the typed value stands and
   * nothing rewrites it behind their back.
   */
  const effectiveSpend = spendTouched ? draft.spend : withCommas(String(suggestedSpend));
  const live: Inputs = useMemo(
    () => ({ ...draft, spend: effectiveSpend }),
    [draft, effectiveSpend],
  );
  const stale = useMemo(
    () => JSON.stringify(live) !== JSON.stringify(committed),
    [live, committed],
  );

  const set = <K extends keyof Inputs>(key: K, value: Inputs[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const couple = draft.who === "2";
  // Read off ALL repayments, not the mortgage alone — see `repaymentShare`.
  const band = result.repaymentShare.band;
  const hasLoans = result.debtMonthly > 0;
  const bandClass =
    band.tone === "high"
      ? "bg-valar-amber text-valar-navy"
      : band.tone === "warn"
        ? "bg-valar-amber/20 text-valar-navy"
        : "bg-valar-navy/10 text-valar-navy";
  const ratePct = (result.expRate * 100).toFixed(2);
  // How much more the mortgage costs a month at the 7% test than at their rate.
  const rateRise = result.payAtTest - result.payAtRate;

  /*
   * The take-home bar, in the order money leaves the account. Empty segments
   * are dropped so the bar never shows a zero-width sliver between two gaps.
   */
  const splitSegments = [
    {
      key: "mortgage",
      label: "Mortgage",
      pct: result.repaymentShare.mortgage,
      amount: result.payAtRate,
      fill: SPLIT_COLOURS.mortgage,
      ink: "text-white",
    },
    {
      key: "owed",
      label: "Cards & other loans",
      pct: result.repaymentShare.loans,
      amount: result.debtMonthly,
      fill: SPLIT_COLOURS.owed,
      ink: "text-valar-navy",
    },
    {
      key: "left",
      label: "Left to live on",
      pct: result.leftToLive.pct,
      amount: result.leftToLive.atRate,
      fill: SPLIT_COLOURS.left,
      ink: "text-valar-navy",
    },
  ].filter((s) => s.pct > 0);
  // Past 100% — repayments above take-home pay — the bar is scaled to fit.
  const splitWhole = Math.max(100, result.repaymentShare.all);

  return (
    <div data-cmp="AffordabilityCalculator">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        {/*
         * INPUTS — tinted, so the half you fill in reads as a different surface
         * from the half that answers you. Same treatment as the split
         * calculator's input panel.
         */}
        <section className="rounded-xl border border-valar-concrete bg-valar-indigo/[0.04] p-6 md:p-8">
          {/*
           * One form, nothing hidden.
           *
           * There was a Quick / With debts toggle here. Two modes meant the
           * answer changed depending on a switch someone might not have
           * noticed, and the debt fields — the ones that move the number most —
           * were the half behind it. They are simply part of the form now,
           * sitting at zero until there is something to put in.
           */}
          <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-valar-navy">Put your numbers in</h2>
            <div
              role="group"
              aria-label="Buying on my own or with a partner"
              className="inline-flex rounded-lg border border-valar-concrete bg-white p-1"
            >
              {[
                { value: "1", label: "On my own" },
                { value: "2", label: "With a partner" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={draft.who === option.value}
                  onClick={() => set("who", option.value as "1" | "2")}
                  className={`rounded-md px-3 py-1.5 text-xs font-bold transition-colors ${
                    draft.who === option.value
                      ? "bg-valar-navy text-white"
                      : "text-valar-steel hover:text-valar-navy"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <p className="mb-6 text-sm leading-relaxed text-gray-600">
            Leave anything you don&rsquo;t have at zero.
          </p>

          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <IncomeField
                id="inc1"
                label={couple ? "Your income" : "Your income, before tax"}
                value={draft.inc1}
                onChange={(v) => set("inc1", v)}
                kiwi={draft.kiwi1}
                onKiwiChange={(v) => set("kiwi1", v)}
              />
              {couple && (
                <IncomeField
                  id="inc2"
                  label="Partner's income"
                  value={draft.inc2}
                  onChange={(v) => set("inc2", v)}
                  kiwi={draft.kiwi2}
                  onKiwiChange={(v) => set("kiwi2", v)}
                />
              )}
            </div>
            {/*
             * 11px, not 12: at the panel's width this sentence is a couple of
             * characters too long for one line at text-xs, and it read as a
             * two-line block under a one-line field. It still wraps on a phone,
             * which is correct — nothing here is pinned with nowrap.
             */}
            <p className="-mt-2 text-[11px] leading-relaxed text-valar-steel">
              Pick your contribution rate. It comes off your pay, so it changes what you can borrow.
            </p>

            <InlineSelect
              id="deps"
              label="Dependants"
              value={draft.deps}
              onChange={(v) => set("deps", v)}
              /*
               * Stops at 3+, because the living-cost table does. Offering 4 and
               * 5 asked a question whose answer could not change anything —
               * every one of them produced the identical figure — which is
               * false precision, and the kind that quietly teaches people the
               * calculator is more exact than it is.
               */
              options={[
                { value: "0", label: "None" },
                { value: "1", label: "1" },
                { value: "2", label: "2" },
                { value: "3", label: "3 or more" },
              ]}
            />

            <MoneyField
              id="spend"
              label="Everyday spending, a month"
              hint="Food, power, transport, phone. Not rent, loans or insurance."
              value={effectiveSpend}
              onChange={(v) => {
                setSpendTouched(true);
                set("spend", v);
              }}
            />
            <p className="-mt-2 text-[11px] leading-relaxed text-valar-steel">
              {spendTouched
                ? `${money(suggestedSpend)} is the minimum for your household. Below that, we use it.`
                : `Started at ${money(suggestedSpend)}, the minimum for your household. Spend more? Change it.`}
            </p>

            <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-valar-amber">
              And what else goes out
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <MoneyField
                id="rins"
                label="Rates & house insurance"
                hint="Per month, on the new home."
                value={draft.rins}
                onChange={(v) => set("rins", v)}
              />
              <MoneyField
                id="ins"
                label="Life, health & income cover"
                hint="Per month, if you have any."
                value={draft.ins}
                onChange={(v) => set("ins", v)}
              />
            </div>
            <MoneyField
              id="extra"
              label="Anything else, every month"
              hint="Childcare, school fees, board. Not loan repayments."
              value={draft.extra}
              onChange={(v) => set("extra", v)}
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <MoneyField
                id="dep"
                label="Deposit you'll have"
                hint="Savings, KiwiSaver, family help. All of it goes in."
                value={draft.dep}
                onChange={(v) => set("dep", v)}
              />
              {/*
               * The rate came out of the collapsed assumptions box to sit here.
               *
               * Its hint is load-bearing, not decoration: the rate moves the
               * repayment and nothing else, because borrowing power is tested
               * at 7% regardless. Hidden away, it invited exactly the confusion
               * the six-times cap caused — a number changed, the answer didn't,
               * and the page looked broken.
               */}
              <MoneyField
                id="rate"
                label="Rate you expect to pay"
                prefix="%"
                hint="Changes the repayment, not what you can borrow."
                value={draft.rate}
                onChange={(v) => set("rate", v)}
              />
            </div>

            <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-valar-amber">
              What you already owe
            </p>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <MoneyField
                    id="cc"
                    label="Cards, BNPL & overdrafts"
                    hint="The total limit, not what you owe."
                    value={draft.cc}
                    onChange={(v) => set("cc", v)}
                  />
                  <MoneyField
                    id="car"
                    label="Car loan or hire purchase"
                    hint="Your monthly payments."
                    value={draft.car}
                    onChange={(v) => set("car", v)}
                  />
                  <MoneyField
                    id="stud"
                    label="Student loan repayment"
                    hint="Your monthly payments."
                    value={draft.stud}
                    onChange={(v) => set("stud", v)}
                  />
                  <MoneyField
                    id="other"
                    label="Anything else you repay"
                    hint="Your monthly payments."
                    value={draft.other}
                    onChange={(v) => set("other", v)}
                  />
            </div>
          </div>

          {/*
           * The "What this calculator assumes" fold-away stood here — the 7%
           * test, the 30-year term, the six-times cap, tax/ACC/KiwiSaver, the
           * living-cost floor, revolving limits at 3.8%, the $150 buffer.
           *
           * Removed 10 Sep 2026 on Lena's call: too big for the input panel.
           * The full text is preserved in
           * ws-valar/Valar website/pages/calculators/what-can-i-buy.md.
           *
           * ⚠️ With it and the "How this works" note both gone, NOTHING on this
           * page states what it assumes. The foot-of-page disclaimer says the
           * figures rest on general assumptions but never says which. Parked
           * pending a decision on where the assumptions live.
           */}

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setCommitted(live)}
              className="rounded-lg bg-valar-amber px-6 py-3 text-[15px] font-bold text-valar-navy transition-colors hover:bg-valar-amber-hover"
            >
              Run calculator
            </button>
            {stale && (
              <span className="text-sm font-medium text-valar-steel">
                Numbers changed. Run again.
              </span>
            )}
          </div>
        </section>

        {/* ============ RESULTS ============ */}
        <div className="flex flex-col gap-4">
          <section
            aria-live="polite"
            className={`flex-1 overflow-hidden rounded-xl border border-valar-concrete bg-white transition-opacity ${stale ? "opacity-60" : ""}`}
          >
            {/* ---- 1. the loan: the one dark block, so the eye has somewhere to land ---- */}
            <div className="bg-valar-navy p-6 md:p-8">
              <Eyebrow>Indicative maximum</Eyebrow>
              {result.blocked ? (
                <p className="text-2xl font-bold leading-tight text-white">{result.headline}</p>
              ) : (
                <>
                  {/*
                   * Loan and price in one cell, because the second is the first
                   * plus the deposit and reading them apart made that
                   * arithmetic invisible.
                   *
                   * The loan shown is the one BEHIND this price, not the
                   * income ceiling. On a deposit-capped answer those differ —
                   * the income would stretch further than the deposit lets the
                   * price go — and quoting the ceiling here would print two
                   * headline figures that do not add up with the deposit line
                   * directly under them.
                   */}
                  <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <dt className="mb-1 text-sm font-semibold text-valar-lilac">Loan</dt>
                      <dd className="text-4xl font-bold tabular-nums text-white md:text-5xl">
                        {money(result.best.loan)}
                      </dd>
                      {/*
                        * Which of the three limits is holding the number, in one
                        * line under it.
                        *
                        * This exists because of a real confusion: adding
                        * expenses left the figure unmoved and read as a broken
                        * formula. It wasn't — the six-times cap was binding, so
                        * servicing could fall a long way before the answer
                        * changed. Without saying so, the screen looks stuck.
                        *
                        * It named the six-times rule until Lena cut it: the
                        * rule itself belongs in the assumptions box, not here.
                        * "Income" still carries the explanation — a figure set
                        * by income is one that expenses cannot move — which is
                        * the whole reason the line exists.
                        */}
                      <p className="mt-1.5 text-xs leading-relaxed text-valar-steel">
                        {result.best.cappedBy === "deposit"
                          ? "What your deposit reaches"
                          : result.dtiBinds
                            ? "What your income supports"
                            : "What your budget supports"}
                      </p>
                    </div>
                    <div>
                      <dt className="mb-1 text-sm font-semibold text-valar-lilac">Purchase price</dt>
                      <dd className="text-4xl font-bold tabular-nums text-white md:text-5xl">
                        {money(result.best.price)}
                      </dd>
                      <p className="mt-1.5 text-xs leading-relaxed text-valar-steel">
                        That loan plus your deposit
                      </p>
                    </div>
                  </dl>
                  <p className="mt-6 border-t border-white/15 pt-4 text-sm leading-relaxed text-valar-lilac">
                    Your deposit of{" "}
                    <b className="font-semibold text-white">{money(result.best.deposit)}</b> is{" "}
                    <b className="font-semibold text-white">
                      {Math.round(result.best.depositPct * 100)}%
                    </b>{" "}
                    of that price, so the LVR{" "}
                    {/*
                     * A footnote on the term (Lena, 2026-09-11): not everyone
                     * knows what LVR stands for. The explanation opens as a box
                     * under the sentence rather than a popover pinned to the
                     * word: this panel clips its overflow, and a popover near
                     * the right edge would be cut off.
                     */}
                    <button
                      type="button"
                      onClick={() => setShowLvrInfo((v) => !v)}
                      aria-expanded={showLvrInfo}
                      aria-controls="lvr-info"
                      aria-label="What LVR means"
                      className={`inline-flex h-4 w-4 items-center justify-center rounded-full align-middle transition-colors ${
                        showLvrInfo ? "bg-white text-valar-navy" : "text-valar-amber hover:text-white"
                      }`}
                    >
                      <Info className="h-4 w-4" />
                    </button>{" "}
                    is{" "}
                    <b className="font-semibold text-white">
                      {Math.round(result.best.lvr * 100)}%
                    </b>
                    .
                  </p>
                  {showLvrInfo && (
                    <p
                      id="lvr-info"
                      className="mt-3 rounded-lg bg-white/10 p-3 text-xs leading-relaxed text-valar-lilac"
                    >
                      <b className="font-semibold text-white">LVR, loan-to-value ratio:</b>{" "}
                      your loan as a share of the home&rsquo;s value. Above 80%, a bank adds a low-equity margin
                      to your rate or a one-off fee. Each lender sets its own.
                    </p>
                  )}
                </>
              )}
            </div>

            {!result.blocked && (
              <>
                {/*
                 * ---- 2. the counterweight, straight after the big numbers ----
                 *
                 * A maximum is a true number and a terrible target, and the
                 * moment it is most likely to be mistaken for a recommendation
                 * is the moment it is read. So this sits directly under it
                 * rather than beside the repayment further down.
                 */}
                {result.caution && (
                  <div className="border-b border-gray-100 bg-valar-amber/10 p-6 md:px-8 md:py-5">
                    <div className="flex items-start gap-3 text-valar-navy">
                      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-valar-amber" />
                      <div>
                        <p className="text-sm font-bold leading-snug">{result.caution.lead}</p>
                        <p className="mt-1 text-sm leading-relaxed text-gray-600">
                          {result.caution.detail}
                        </p>
                        {/*
                         * Lena, 2026-09-11: the indicative-only line sat only at
                         * the foot of the page, far below the first number anyone
                         * reads. It goes where the maximum is quoted. It replaced
                         * "Check it below before you decide." rather than adding a
                         * fourth sentence.
                         *
                         * The email carries it in the same place too, since
                         * 2026-09-14 on Lena's call, not only in its footer.
                         */}
                        <p className="mt-2 text-xs leading-relaxed text-gray-600">
                          All these figures are indicative and not guaranteed. For a real assessment,
                          talk to a mortgage adviser or your bank directly.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/*
                 * ---- 3. what it costs, and whether that is liveable ----
                 *
                 * Lilac, not fog. Fog is the page's own ground, so this band
                 * read as a hole through the panel — the page showing through
                 * between two white halves (Lena, 2026-09-11). The panel border
                 * went from gray-100 to concrete for the same reason: against
                 * fog, gray-100 is invisible.
                 */}
                <div className="border-b border-gray-100 bg-valar-lilac/40 p-6 md:p-8">
                  <Eyebrow>What it costs a month</Eyebrow>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-2xl font-bold tabular-nums text-valar-navy">
                        {money(result.payAtRate)}
                      </p>
                      <p className="mt-1 text-xs text-gray-600">at {ratePct}%</p>
                    </div>
                    <div>
                      {/*
                       * The rise, beside the figure (Lena, 2026-09-11): two
                       * repayments side by side made the reader do the
                       * subtraction, and the difference is the risk. Hidden
                       * when the rate they entered is already 7% or more.
                       *
                       * Orange, not red — Lena's rule for this page. A custom
                       * step between orange-700 and -800: -700 is 4.3:1 on this
                       * lilac, just short of the 4.5:1 small text needs.
                       */}
                      <p className="flex flex-wrap items-baseline gap-x-2 text-2xl font-bold tabular-nums text-valar-navy">
                        {money(result.payAtTest)}
                        {rateRise >= 1 && (
                          <span
                            className="text-sm font-bold text-[#B4410C]"
                            title={`${money(rateRise)} a month more than at ${ratePct}%`}
                          >
                            <span aria-hidden>&#9650;</span> {money(rateRise)}
                            <span className="sr-only"> more a month</span>
                          </span>
                        )}
                      </p>
                      <p className="mt-1 text-xs text-gray-600">if mortgage rates hit 7%</p>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-valar-concrete pt-5">
                    {/*
                     * "Repayment pressure" — Lena's name (2026-09-11) for the
                     * share of take-home pay that goes on ALL repayments. It was
                     * "financial pressure" for an hour; "repayment" says what is
                     * actually being measured. The (i) sits here, beside the
                     * rating, because what it explains is the rating. It first
                     * sat on the take-home bar and explained the bar, which
                     * needed no explaining.
                     */}
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-sm font-bold text-valar-navy">Repayment pressure</p>
                      <button
                        type="button"
                        onClick={() => setShowPressureInfo((v) => !v)}
                        aria-expanded={showPressureInfo}
                        aria-controls="repayment-pressure-info"
                        /*
                         * Words and a chevron, not a bare (i). The icon alone —
                         * steel on a white dot — did not read as something that
                         * opens (Lena, 2026-09-11). Indigo so it reads as a
                         * control; navy and flipped once open.
                         */
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                          showPressureInfo
                            ? "border-valar-navy bg-valar-navy text-white"
                            : "border-valar-indigo/40 bg-white text-valar-indigo hover:border-valar-indigo"
                        }`}
                      >
                        <Info className="h-3.5 w-3.5" />
                        What it means
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform ${showPressureInfo ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>

                    {/* Lena's own words, 2026-09-11. */}
                    {showPressureInfo && (
                      <div
                        id="repayment-pressure-info"
                        className="mb-4 space-y-2 rounded-lg bg-white p-4 text-xs leading-relaxed text-gray-600"
                      >
                        <p>
                          Repayment pressure shows how much of your take-home pay goes towards
                          mortgage, credit card and loan repayments (cards estimated at 3.8% of the
                          limit). The lower the percentage, the
                          more income you have left for everyday spending, saving and unexpected
                          costs.
                        </p>
                        <p>
                          There is no single &ldquo;right&rdquo; level, but lower repayment pressure
                          generally gives you more financial flexibility. Once debt repayments approach
                          50% of your take-home pay, your budget has much less room to absorb changes
                          such as higher interest rates, increased expenses or a drop in income.
                        </p>
                      </div>
                    )}

                    {/*
                     * With cards or loans, the share is shown in three lines —
                     * mortgage, cards and loans (cards at 3.8% of the limit),
                     * and the two together — and the label goes
                     * on the total. A mortgage at 30% is "comfortable" only if
                     * nothing else is going out; Lena's case was exactly a
                     * household where the rest was large.
                     *
                     * Without them, the one line it always was: the three-line
                     * version would print the same figure twice.
                     */}
                    {hasLoans ? (
                      <div className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center gap-x-4 gap-y-2 text-sm">
                        <span className="text-gray-600">Mortgage</span>
                        <span className="text-right tabular-nums text-valar-navy">
                          {money(result.payAtRate)}
                        </span>
                        <span className="text-right tabular-nums text-gray-600">
                          {result.repaymentShare.mortgage}%
                        </span>
                        <span />

                        <span className="text-gray-600">Cards &amp; other loans</span>
                        <span className="text-right tabular-nums text-valar-navy">
                          {money(result.debtMonthly)}
                        </span>
                        <span className="text-right tabular-nums text-gray-600">
                          {result.repaymentShare.loans}%
                        </span>
                        <span />

                        <span className="col-span-4 border-t border-valar-concrete" />

                        <span className="font-bold text-valar-navy">All repayments</span>
                        <span className="text-right font-bold tabular-nums text-valar-navy">
                          {money(result.payAtRate + result.debtMonthly)}
                        </span>
                        <span className="text-right font-bold tabular-nums text-valar-navy">
                          {result.repaymentShare.all}%
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-1 text-center text-[10px] font-bold uppercase tracking-wider ${bandClass}`}
                        >
                          {band.label}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm font-bold text-valar-navy">
                          {result.repaymentShare.all}% of your take-home pay
                        </p>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${bandClass}`}
                        >
                          {band.label}
                        </span>
                      </div>
                    )}
                    {/*
                     * The scale, as four segments rather than a sentence.
                     *
                     * It used to live only in the explainer at the foot, which
                     * meant the one figure people feel had a label — "high
                     * risk" — and nothing on screen saying what the labels are
                     * or where the line sits. Four boxes answer that at a
                     * glance and take less room than the sentence did.
                     */}
                    <ul className="mt-4 grid grid-cols-4 gap-1.5">
                      {SHARE_SCALE.map((step) => {
                        const active = step.label === band.label;
                        return (
                          <li
                            key={step.label}
                            className={`rounded-md px-2 py-1.5 text-center ${
                              active ? step.on : "bg-white text-valar-steel"
                            }`}
                          >
                            <span className="block text-[10px] font-bold uppercase tracking-wide">
                              {step.label}
                            </span>
                            <span className="block text-[10px] tabular-nums opacity-80">
                              {step.range}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/*
                   * Take-home pay as one bar: the mortgage, what they already
                   * owe, and what is left to live on (Lena, 2026-09-11).
                   *
                   * It replaced a sentence — "You take home about $X a month" —
                   * that gave the whole and left the reader to do the
                   * subtraction. The part nobody computed for themselves was the
                   * one that matters: what is left.
                   *
                   * Widths come from the same rounded percentages as the lines
                   * above, so the bar and the figures always agree. Labels sit
                   * inside a segment only when it is wide enough to hold one;
                   * the legend under the bar always carries every figure.
                   */}
                  <div className="mt-5 border-t border-valar-concrete pt-5">
                    <p className="text-sm font-bold text-valar-navy">
                      Your take-home pay: {money(result.netMonthly)} a month
                    </p>

                    <div
                      role="img"
                      aria-label={splitSegments.map((s) => `${s.label} ${s.pct}%`).join(", ")}
                      className="mt-3 flex h-8 w-full gap-[2px] overflow-hidden rounded"
                    >
                      {splitSegments.map((s) => {
                        const text = `${s.pct}%`;
                        return (
                          /*
                           * Each segment is its own CSS container, and its label
                           * shows only once the segment is wide enough to hold it
                           * — "6%" on a desktop bar, not on a phone.
                           *
                           * Two earlier rules failed Lena's 6% of cards and loans:
                           * a fixed 12% cut-off, then a JavaScript width measurement
                           * that left it unlabelled on her screen for reasons never
                           * pinned down. A container query needs no measuring and
                           * no guess about the screen.
                           *
                           * Thresholds are the label's width at 11px bold plus a
                           * couple of px either side; the class names are written
                           * out whole so Tailwind can find them.
                           */
                          <div
                            key={s.key}
                            title={`${s.label}: ${money(s.amount)} a month · ${s.pct}%`}
                            className={`@container flex items-center justify-center text-[11px] font-bold tabular-nums ${s.ink}`}
                            style={{ width: `${(s.pct / splitWhole) * 100}%`, backgroundColor: s.fill }}
                          >
                            <span
                              className={`hidden ${
                                text.length <= 2
                                  ? "@min-[20px]:inline"
                                  : text.length === 3
                                    ? "@min-[28px]:inline"
                                    : "@min-[36px]:inline"
                              }`}
                            >
                              {text}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-600">
                      {splitSegments.map((s) => (
                        <li key={s.key} className="flex items-center gap-1.5">
                          <span
                            aria-hidden
                            className="h-2.5 w-2.5 shrink-0 rounded-sm"
                            style={{ backgroundColor: s.fill }}
                          />
                          <span>
                            {s.label}{" "}
                            <b className="font-semibold tabular-nums text-valar-navy">
                              {money(s.amount)}
                            </b>{" "}
                            <span className="tabular-nums">{s.pct}%</span>
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/*
                     * "Mortgage rates", not "rates" (Lena, 2026-09-11): only the
                     * mortgage moves at 7% — the cards and loans in the total stay
                     * where they are — and "all your repayments" says the 74% is
                     * the whole of it, not the mortgage alone.
                     */}
                    <p className="mt-3 text-xs leading-relaxed text-gray-600">
                      If mortgage rates hit 7%,{" "}
                      {hasLoans
                        ? `all your repayments take ${result.repaymentShare.allAtTest}% and leave`
                        : `the repayment takes ${result.repaymentShare.allAtTest}% and leaves`}{" "}
                      <b className="font-semibold text-valar-navy">
                        {money(result.leftToLive.atTest)}
                      </b>{" "}
                      to live on.
                    </p>
                  </div>
                </div>

                {/*
                 * ---- 4. what each level of pressure buys ----
                 *
                 * Was "What you'd actually live with", which Lena found unclear.
                 * Named now for what the rows are: the same pay priced at three
                 * levels of repayment pressure. Not "at different rates" — every
                 * row is at the one rate they entered; what changes is the share.
                 * "Repayment examples by repayment pressure" said repayment twice.
                 */}
                <div className="border-b border-gray-100 p-6 md:p-8">
                  <Eyebrow>Examples by repayment pressure</Eyebrow>
                  <p className="mb-4 text-sm leading-relaxed text-gray-600">
                    {hasLoans
                      ? "Priced from your pay, after your cards and loans."
                      : "Priced from your pay, not from the lender’s ceiling."}
                  </p>

                  {/*
                   * The deposit-level table used to sit here — 20%, 10%, 5%
                   * down. It answered a deposit question with a deposit answer
                   * and confused everyone who read it twice, Lena included.
                   * This answers the question people actually hold: what does a
                   * repayment I could live with buy?
                   */}
                  {/*
                   * Fixed column widths across the full panel, figures centred in
                   * their columns (Lena, 2026-09-11, third pass).
                   *
                   * Pass one let the browser size the columns: it gave the spare
                   * width to "Pressure" and left LVR jammed against the edge. Pass
                   * two packed the columns left: an empty band opened on the right
                   * (her screenshot). Neither was the fix, because both left the
                   * spacing to content widths. Fixed percentages set it directly;
                   * centring puts equal air on both sides of each figure, LVR
                   * included, and every column's figures are the same length, so
                   * nothing is lost in alignment.
                   */}
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[420px] table-fixed border-collapse text-sm">
                      <colgroup>
                        <col className="w-[22%]" />
                        <col className="w-[20%]" />
                        <col className="w-[20%]" />
                        <col className="w-[22%]" />
                        <col className="w-[16%]" />
                      </colgroup>
                      <thead>
                        <tr className="border-b border-valar-concrete align-bottom">
                          <th className="pb-2 text-left text-[10px] font-bold uppercase tracking-wider text-valar-steel">
                            Pressure
                          </th>
                          <th className="pb-2 text-center text-[10px] font-bold uppercase leading-tight tracking-wider text-valar-steel">
                            Mortgage
                            <br />a month
                          </th>
                          <th className="pb-2 text-center text-[10px] font-bold uppercase tracking-wider text-valar-steel">
                            Loan
                          </th>
                          <th className="pb-2 text-center text-[10px] font-bold uppercase tracking-wider text-valar-steel">
                            Home price
                          </th>
                          <th className="pb-2 text-center text-[10px] font-bold uppercase tracking-wider text-valar-steel">
                            LVR
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.levels.map((level) => (
                          <tr key={level.share} className="border-b border-gray-100 last:border-0">
                            <td className="py-3">
                              <span className="block font-semibold leading-tight text-valar-navy">
                                {level.label}
                              </span>
                              <span className="block text-xs text-valar-steel">
                                {Math.round(level.share * 100)}% of pay
                              </span>
                            </td>
                            {/*
                             * When cards and loans take the whole share on their
                             * own there is no mortgage left in it. A row of $0 /
                             * $0 would read as a broken formula, so it says why.
                             */}
                            {level.payment > 0 ? (
                              <>
                                <td className="whitespace-nowrap py-3 text-center font-semibold tabular-nums text-valar-navy">
                                  {money(level.payment)}
                                </td>
                                <td className="whitespace-nowrap py-3 text-center tabular-nums text-gray-600">
                                  {money(level.loan)}
                                </td>
                                <td className="whitespace-nowrap py-3 text-center font-bold tabular-nums text-valar-navy">
                                  {money(level.price)}
                                </td>
                                <td className="whitespace-nowrap py-3 text-center font-semibold tabular-nums text-valar-navy">
                                  {Math.round(level.lvr * 100)}%
                                </td>
                              </>
                            ) : (
                              <td colSpan={4} className="py-3 text-center text-xs text-valar-steel">
                                Your cards and loans already take this much
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-5 flex items-start gap-3 rounded-lg bg-valar-amber/10 p-4">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-valar-amber" />
                    <p className="text-sm leading-relaxed text-valar-navy">
                      <b className="font-bold">These are payments, not limits.</b> A lender would go
                      to {money(result.maxLoan)}, with {hasLoans ? "all your repayments" : "the repayment"}{" "}
                      at {result.repaymentShare.all}% of your take-home pay. The rows above are what the
                      same income buys at a repayment you would choose.
                    </p>
                  </div>

                  <p className="mt-4 text-xs leading-relaxed text-valar-steel">
                    Above 80% LVR a bank adds a low-equity margin to your rate or a one-off fee.
                    Each lender sets its own. Under 10% down, some banks lend directly and others
                    through the First Home Loan.
                  </p>
                </div>
              </>
            )}

            {/*
             * Two things used to close this panel and both are gone, on Lena's
             * call (10 Sep 2026).
             *
             * The written verdict — a title and two adaptive paragraphs — was
             * a block of reading competing with the figures beside it. It is
             * NOT deleted: `result.title` and `result.body` still carry it and
             * the emailed version still prints it, which is where a paragraph
             * of explanation actually gets read.
             *
             * The "How this works" accordion (~320 words of caveats) and the
             * "Print or save as PDF" button came off too — the answer is sent
             * by email rather than printed, and the caveats are parked. Both
             * texts are preserved in
             * ws-valar/Valar website/pages/calculators/what-can-i-buy.md if
             * they are wanted back.
             */}
          </section>

        </div>
      </div>

      {/*
       * What to do next, and the ask, side by side on their own row.
       *
       * Both used to live inside the columns above — the steps under the form,
       * the ask under the answer — and their tops never lined up, because each
       * column is as tall as its own content. A row of their own is the only
       * thing that guarantees they start on the same line.
       *
       * The ask carries `committed`, not `draft`: what gets emailed is what is
       * on screen, not what someone half-typed after running it.
       */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        {aside ?? <div />}
        {guideTitle && (
          <div id="send-my-numbers" className="scroll-mt-28">
            <SendCalculationForm
              guideKey={guideKey}
              guideTitle={guideTitle}
              source={source}
              guideReady={Boolean(guideReady)}
              pendingNote={pendingNote}
              blurb={blurb}
              cover={cover}
              figures={snapshotFromInputs(committed)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
