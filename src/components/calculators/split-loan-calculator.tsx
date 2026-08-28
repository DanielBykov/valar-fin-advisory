"use client";

import { useMemo, useState } from "react";
import { Plus, X, AlertTriangle } from "lucide-react";
import {
  EXTRA_CAP_PERCENT,
  FREQUENCIES,
  calculateSplit,
  describeDuration,
  type ExtraMode,
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

const STARTING_PARTS: LoanPart[] = [
  { amount: 300_000, rate: 5.79, fixedYears: 1, type: "pi", extraMode: "amount", extraValue: 0 },
  { amount: 200_000, rate: 5.99, fixedYears: 3, type: "pi", extraMode: "amount", extraValue: 0 },
  { amount: 100_000, rate: 6.45, fixedYears: 5, type: "pi", extraMode: "amount", extraValue: 0 },
];

function NumberField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = 1,
  min = 0,
  hint,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
  min?: number;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-valar-navy">{label}</label>
      <div className="flex items-center rounded-lg border border-valar-concrete bg-white focus-within:border-valar-amber focus-within:ring-2 focus-within:ring-valar-amber/30">
        {prefix && <span className="pl-2.5 text-sm text-valar-steel">{prefix}</span>}
        <input
          type="number"
          value={value}
          min={min}
          step={step}
          onChange={(e) => onChange(Math.max(min, Number(e.target.value) || 0))}
          className="w-full bg-transparent px-2 py-2 text-sm font-semibold tabular-nums text-valar-navy focus:outline-none"
          aria-label={label}
        />
        {suffix && <span className="pr-2.5 text-sm text-valar-steel">{suffix}</span>}
      </div>
      {hint && <p className="text-[11px] leading-snug text-valar-steel">{hint}</p>}
    </div>
  );
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-valar-navy">{label}</span>
      <div
        className="flex rounded-lg border border-valar-concrete bg-white p-0.5"
        role="group"
        aria-label={label}
      >
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
            className={`flex-1 rounded-md px-2 py-1.5 text-xs font-semibold transition-colors ${
              value === o.value ? "bg-valar-navy text-white" : "text-valar-steel hover:text-valar-navy"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SplitLoanCalculator() {
  const [parts, setParts] = useState<LoanPart[]>(STARTING_PARTS);
  const [activeCount, setActiveCount] = useState(3);
  const [frequency, setFrequency] = useState<FrequencyKey>("fortnightly");
  const [loanYears, setLoanYears] = useState(30);

  const visible = useMemo(() => parts.slice(0, activeCount), [parts, activeCount]);
  const result = useMemo(
    () => calculateSplit(visible, frequency, loanYears),
    [visible, frequency, loanYears],
  );

  const update = (index: number, patch: Partial<LoanPart>) =>
    setParts((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)));

  const perYear = result.perYear;
  const singular = result.frequencyLabel.replace(/ly$/, "");

  return (
    <div data-cmp="SplitLoanCalculator" className="flex flex-col gap-6">
      {/* ── Settings for the whole loan ────────────────────── */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 md:p-6">
        <div className="flex flex-wrap items-end gap-x-10 gap-y-5">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-valar-navy">Repayment frequency</span>
            <div className="flex gap-2" role="group" aria-label="Repayment frequency">
              {FREQUENCIES.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFrequency(f.key)}
                  aria-pressed={frequency === f.key}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
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

          <div className="w-32">
            <NumberField
              label="Loan term"
              value={loanYears}
              onChange={setLoanYears}
              suffix="yrs"
              min={1}
            />
          </div>
        </div>

        <p className="mt-4 max-w-[80ch] border-l-2 border-valar-amber pl-4 text-xs leading-relaxed text-gray-600">
          <strong className="text-valar-navy">The loan term and the fixed period are different
          things,</strong> and it is the single most misread part of a split. The loan runs for the
          term above — that is what sets the repayment. A part fixed for one year is not repaid in a
          year; after that year it simply comes off its rate and has to be re-fixed at whatever the
          market is then.
        </p>
      </div>

      {/* ── The parts ─────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        {visible.map((part, i) => {
          const r = result.parts[i];
          const share = result.totalPrincipal > 0 ? (part.amount / result.totalPrincipal) * 100 : 0;

          return (
            <div
              key={i}
              data-cmp="SplitLoanCalculator.Part"
              className="rounded-xl border border-gray-100 bg-white p-5 md:p-6"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-baseline gap-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-valar-navy">
                    {PART_LABELS[i]}
                  </h3>
                  {part.amount > 0 && (
                    <span className="text-xs text-valar-steel">{share.toFixed(0)}% of the loan</span>
                  )}
                </div>
                {activeCount > 1 && i === activeCount - 1 && (
                  <button
                    type="button"
                    onClick={() => setActiveCount((n) => n - 1)}
                    className="flex items-center gap-1 text-xs font-semibold text-valar-steel transition-colors hover:text-valar-navy"
                  >
                    <X className="h-3.5 w-3.5" /> Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
                <NumberField
                  label="Amount"
                  value={part.amount}
                  onChange={(n) => update(i, { amount: n })}
                  prefix="$"
                  step={10_000}
                />
                <NumberField
                  label="Rate"
                  value={part.rate}
                  onChange={(n) => update(i, { rate: n })}
                  suffix="%"
                  step={0.05}
                />
                <NumberField
                  label="Fixed for"
                  value={part.fixedYears}
                  onChange={(n) => update(i, { fixedYears: n })}
                  suffix="yrs"
                  step={1}
                  min={1}
                  hint="Rate lock, not the loan term"
                />
                <Segmented<PartType>
                  label="Type"
                  value={part.type}
                  onChange={(v) => update(i, { type: v })}
                  options={[
                    { value: "pi", label: "P&I" },
                    { value: "io", label: "Int. only" },
                  ]}
                />
                <div className="col-span-2 lg:col-span-1">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-valar-navy">Extra repayment</span>
                    <div className="flex gap-1.5">
                      <div className="flex flex-1 items-center rounded-lg border border-valar-concrete bg-white focus-within:border-valar-amber focus-within:ring-2 focus-within:ring-valar-amber/30">
                        {part.extraMode === "amount" && (
                          <span className="pl-2.5 text-sm text-valar-steel">$</span>
                        )}
                        <input
                          type="number"
                          value={part.extraValue}
                          min={0}
                          step={part.extraMode === "amount" ? 25 : 0.5}
                          onChange={(e) =>
                            update(i, { extraValue: Math.max(0, Number(e.target.value) || 0) })
                          }
                          className="w-full bg-transparent px-2 py-2 text-sm font-semibold tabular-nums text-valar-navy focus:outline-none"
                          aria-label={`${PART_LABELS[i]} extra repayment`}
                        />
                        {part.extraMode === "percent" && (
                          <span className="pr-2.5 text-sm text-valar-steel">%</span>
                        )}
                      </div>
                      <div className="flex rounded-lg border border-valar-concrete bg-white p-0.5">
                        {(["amount", "percent"] as ExtraMode[]).map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            aria-pressed={part.extraMode === mode}
                            onClick={() => update(i, { extraMode: mode, extraValue: 0 })}
                            className={`rounded-md px-2 py-1 text-xs font-bold transition-colors ${
                              part.extraMode === mode
                                ? "bg-valar-navy text-white"
                                : "text-valar-steel hover:text-valar-navy"
                            }`}
                          >
                            {mode === "amount" ? "$" : "%"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] leading-snug text-valar-steel">
                      {part.extraMode === "amount"
                        ? `Per ${singular} payment`
                        : "Of this part, per year"}
                    </p>
                  </div>
                </div>
              </div>

              {part.amount > 0 && (
                <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 border-t border-gray-100 pt-4 text-sm">
                  <div>
                    <p className="text-xs text-valar-steel">Repayment</p>
                    <p className="font-bold tabular-nums text-valar-navy">
                      {nzd(r.totalPayment, 2)}
                    </p>
                  </div>
                  {r.extraPerPeriod > 0 && (
                    <div>
                      <p className="text-xs text-valar-steel">of which extra</p>
                      <p className="font-bold tabular-nums text-valar-amber">
                        {nzd(r.extraPerPeriod, 2)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-valar-steel">
                      Interest over the {part.fixedYears} yr fix
                    </p>
                    <p className="font-bold tabular-nums text-valar-navy">
                      {nzd(r.interestDuringFixed)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-valar-steel">Left to re-fix in {part.fixedYears} yr</p>
                    <p className="font-bold tabular-nums text-valar-navy">{nzd(r.balanceAtRefix)}</p>
                  </div>
                  {r.interestSaved > 0 && (
                    <div>
                      <p className="text-xs text-valar-steel">Interest saved, full term</p>
                      <p className="font-bold tabular-nums text-valar-amber">
                        {nzd(r.interestSaved)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {r.extraCapped && (
                <p className="mt-3 flex items-start gap-2 rounded-lg bg-valar-amber/10 p-3 text-xs leading-relaxed text-valar-navy">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-valar-amber" />
                  <span>
                    Trimmed to {EXTRA_CAP_PERCENT}% of this part per year —{" "}
                    <b>{nzd(r.extraCapPerPeriod, 2)}</b> per payment. Most lenders charge a break cost
                    above roughly that on a fixed part, and the exact allowance is set by your loan
                    contract.
                  </span>
                </p>
              )}
            </div>
          );
        })}

        {activeCount < 3 && (
          <button
            type="button"
            onClick={() => setActiveCount((n) => n + 1)}
            className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-valar-concrete bg-white py-4 text-sm font-semibold text-valar-navy transition-colors hover:border-valar-amber"
          >
            <Plus className="h-4 w-4 text-valar-amber" /> Add {PART_LABELS[activeCount]}
          </button>
        )}
      </div>

      {/* ── The whole structure ───────────────────────────── */}
      <div
        data-cmp="SplitLoanCalculator.Summary"
        className="rounded-xl bg-valar-navy p-6 text-white md:p-8"
      >
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-valar-amber">
          The whole loan
        </p>
        <div className="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <p className="text-4xl font-bold tabular-nums md:text-5xl">{nzd(result.totalPayment, 2)}</p>
          <p className="text-lg text-valar-lilac">{result.frequencyLabel}</p>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/15 pt-6 md:grid-cols-4">
          <div>
            <p className="mb-1 text-xs text-valar-lilac">Total borrowed</p>
            <p className="text-lg font-bold tabular-nums">{nzd(result.totalPrincipal)}</p>
          </div>
          <div>
            <p className="mb-1 text-xs text-valar-lilac">Weighted average rate</p>
            <p className="text-lg font-bold tabular-nums text-valar-amber">
              {result.weightedAverageRate.toFixed(2)}%
            </p>
          </div>
          <div>
            <p className="mb-1 text-xs text-valar-lilac">First re-fix</p>
            <p className="text-lg font-bold tabular-nums">
              {result.nextRefixYears > 0
                ? `${result.nextRefixYears} yr${result.nextRefixYears === 1 ? "" : "s"}`
                : "—"}
            </p>
            {result.nextRefixAmount > 0 && (
              <p className="text-xs text-valar-lilac">{nzd(result.nextRefixAmount)} of it</p>
            )}
          </div>
          <div>
            <p className="mb-1 text-xs text-valar-lilac">
              Interest in the first {result.nextRefixYears} yr
              {result.nextRefixYears === 1 ? "" : "s"}
            </p>
            <p className="text-lg font-bold tabular-nums">
              {nzd(result.totalInterestToFirstRefix)}
            </p>
          </div>
        </div>

        {(result.totalInterestSaved >= 1 || result.totalBalanceRemaining >= 1) && (
          <div className="mt-6 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/15 pt-6">
            {result.totalInterestSaved >= 1 && (
              <div>
                <p className="mb-1 text-xs text-valar-lilac">
                  Interest saved by the extra repayments, if the rates held
                </p>
                <p className="text-lg font-bold tabular-nums text-valar-amber">
                  {nzd(result.totalInterestSaved)}
                </p>
              </div>
            )}
            {result.totalBalanceRemaining >= 1 && (
              <div>
                <p className="mb-1 text-xs text-valar-lilac">
                  Still owing at the end of {result.loanYears} years
                </p>
                <p className="text-lg font-bold tabular-nums">
                  {nzd(result.totalBalanceRemaining)}
                </p>
              </div>
            )}
          </div>
        )}

        <p className="mt-6 border-t border-white/15 pt-5 text-[13px] leading-relaxed text-valar-lilac">
          <strong className="text-white">Two of these numbers are known and one is not.</strong> The
          repayment and the interest before your first re-fix are real — those rates are locked. Any
          figure covering the full {result.loanYears}{" "}years assumes today&rsquo;s rates hold the
          whole way, which they will not. Use it to compare one structure against another, never as a
          forecast. The weighted average rate is the honest single number for a split; there is no
          &ldquo;average term&rdquo; here because averaging a {result.nextRefixYears}-year fix with a
          longer one produces a number that means nothing.
        </p>
      </div>

      {/* ── Per-part comparison ───────────────────────────── */}
      {result.totalPrincipal > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                {["Part", "Amount", "Rate", "Fixed", "Repayment", "Left at re-fix", "Paid off in"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-valar-steel"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {visible.map((part, i) => {
                if (part.amount <= 0) return null;
                const r = result.parts[i];
                return (
                  <tr key={i} className="border-b border-gray-50 last:border-0">
                    <td className="px-5 py-3 font-semibold text-valar-navy">
                      {PART_LABELS[i]}
                      {part.type === "io" && (
                        <span className="ml-2 rounded-full bg-valar-concrete/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-valar-navy">
                          Int. only
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 tabular-nums text-gray-700">{nzd(part.amount)}</td>
                    <td className="px-5 py-3 tabular-nums text-gray-700">{part.rate.toFixed(2)}%</td>
                    <td className="px-5 py-3 tabular-nums text-gray-700">
                      {part.fixedYears} yr{part.fixedYears === 1 ? "" : "s"}
                    </td>
                    <td className="px-5 py-3 font-semibold tabular-nums text-valar-navy">
                      {nzd(r.totalPayment, 2)}
                    </td>
                    <td className="px-5 py-3 tabular-nums text-gray-700">{nzd(r.balanceAtRefix)}</td>
                    <td className="px-5 py-3 tabular-nums text-gray-700">
                      {r.clears ? describeDuration(r.periods, perYear) : "Not on this plan"}
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-valar-fog font-bold">
                <td className="px-5 py-3 text-valar-navy">Total</td>
                <td className="px-5 py-3 tabular-nums text-valar-navy">
                  {nzd(result.totalPrincipal)}
                </td>
                <td className="px-5 py-3 tabular-nums text-valar-navy">
                  {result.weightedAverageRate.toFixed(2)}%
                </td>
                <td className="px-5 py-3 text-valar-steel">—</td>
                <td className="px-5 py-3 tabular-nums text-valar-navy">
                  {nzd(result.totalPayment, 2)}
                </td>
                <td className="px-5 py-3 text-valar-steel">—</td>
                <td className="px-5 py-3 text-valar-steel">—</td>
              </tr>
            </tbody>
          </table>
          <p className="border-t border-gray-100 px-5 py-3 text-xs leading-relaxed text-valar-steel">
            &ldquo;Paid off in&rdquo; assumes each rate holds for the whole{" "}
            {result.loanYears}-year term. It will not — it is here to compare structures, not to predict one.
          </p>
        </div>
      )}
    </div>
  );
}
