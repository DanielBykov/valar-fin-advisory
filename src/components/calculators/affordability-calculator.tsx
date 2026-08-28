"use client";

import { useMemo, useState } from "react";

import {
  type Inputs,
  type Result,
  DEFAULTS,
  calculate,
  money,
  money0,
  withCommas,
} from "@/lib/affordability";

// ---------- small pieces ----------
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

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-valar-navy">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-valar-concrete bg-white px-3 py-2.5 text-sm font-semibold text-valar-navy focus:border-valar-amber focus:outline-none focus:ring-2 focus:ring-valar-amber/30"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Bar({
  label,
  amount,
  width,
  binds,
}: {
  label: string;
  amount: number;
  width: number;
  binds: boolean;
}) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className={`text-sm ${binds ? "font-semibold text-valar-navy" : "text-gray-600"}`}>
          {label}
          {binds && (
            <span className="ml-2 rounded-full bg-valar-amber/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-valar-navy">
              Your limit
            </span>
          )}
        </span>
        <span className="text-sm font-semibold tabular-nums text-valar-navy">{money0(amount)}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-valar-concrete/50">
        <div
          className={`h-full rounded-full transition-[width] duration-500 ${binds ? "bg-valar-amber" : "bg-valar-horizon"}`}
          style={{ width: `${Math.max(2, width)}%` }}
        />
      </div>
    </div>
  );
}

// ---------- the calculator ----------
export default function AffordabilityCalculator({
  onTakeGuide,
}: {
  onTakeGuide?: () => void;
}) {
  const [draft, setDraft] = useState<Inputs>(DEFAULTS);
  const [committed, setCommitted] = useState<Inputs>(DEFAULTS);

  const result: Result = useMemo(() => calculate(committed), [committed]);
  const stale = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(committed),
    [draft, committed],
  );

  const set = <K extends keyof Inputs>(key: K, value: Inputs[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  // Switching mode is a change of question, not a tweak — run it straight away
  // so the results panel never sits stale behind a toggle the reader just used.
  const setMode = (detailed: boolean) => {
    const next = { ...draft, detailed };
    setDraft(next);
    setCommitted(next);
  };

  const top = Math.max(result.priceByIncome, result.priceByDeposit, 1);
  const couple = draft.who === "2";

  return (
    <div data-cmp="AffordabilityCalculator">
      {/* mode toggle */}
      <div
        role="group"
        aria-label="Calculator detail level"
        className="mb-6 inline-flex rounded-lg border border-valar-concrete bg-white p-1"
      >
        {[
          { detailed: false, label: "Quick" },
          { detailed: true, label: "With my debts" },
        ].map((m) => (
          <button
            key={m.label}
            type="button"
            aria-pressed={draft.detailed === m.detailed}
            onClick={() => setMode(m.detailed)}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
              draft.detailed === m.detailed
                ? "bg-valar-navy text-white"
                : "text-valar-steel hover:text-valar-navy"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        {/* ============ INPUTS ============ */}
        <section className="rounded-xl border border-gray-100 bg-white p-6 md:p-8">
          <h2 className="mb-1 text-2xl font-bold text-valar-navy">Your numbers</h2>
          <p className="mb-6 text-sm leading-relaxed text-gray-600">
            {draft.detailed
              ? "Add what you already owe. Card limits matter even when the balance is zero."
              : "Five questions. No loans or credit cards assumed — switch to “With my debts” if you have any."}
          </p>

          <div className="flex flex-col gap-5">
            <SelectField
              id="who"
              label="Buying"
              value={draft.who}
              onChange={(v) => set("who", v as "1" | "2")}
              options={[
                { value: "1", label: "On my own" },
                { value: "2", label: "With a partner" },
              ]}
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <MoneyField
                id="inc1"
                label="Your income, before tax"
                hint="Per year"
                value={draft.inc1}
                onChange={(v) => set("inc1", v)}
              />
              {couple && (
                <MoneyField
                  id="inc2"
                  label="Partner's income, before tax"
                  hint="Per year"
                  value={draft.inc2}
                  onChange={(v) => set("inc2", v)}
                />
              )}
            </div>

            <SelectField
              id="deps"
              label="Dependants"
              value={draft.deps}
              onChange={(v) => set("deps", v)}
              options={[
                { value: "0", label: "None" },
                { value: "1", label: "1" },
                { value: "2", label: "2" },
                { value: "3", label: "3" },
                { value: "4", label: "4" },
                { value: "5", label: "5 or more" },
              ]}
            />

            <MoneyField
              id="spend"
              label="What you spend in a normal month"
              hint="Groceries, transport, power, phone, insurance, childcare, everyday life. Leave out rent and any loan repayments — those are handled separately."
              value={draft.spend}
              onChange={(v) => set("spend", v)}
            />

            <MoneyField
              id="dep"
              label="Deposit you'll have"
              hint="Everything you can put in — savings, KiwiSaver, family help, money from selling something."
              value={draft.dep}
              onChange={(v) => set("dep", v)}
            />

            {draft.detailed && (
              <>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-valar-amber">
                  What you already owe
                </p>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <MoneyField
                    id="cc"
                    label="Credit & store card limits"
                    hint="The limit, not the balance."
                    value={draft.cc}
                    onChange={(v) => set("cc", v)}
                  />
                  <MoneyField
                    id="car"
                    label="Car loan or hire purchase"
                    hint="Per month"
                    value={draft.car}
                    onChange={(v) => set("car", v)}
                  />
                  <MoneyField
                    id="stud"
                    label="Student loan repayment"
                    hint="Per month. Skip it if it comes straight out of your pay."
                    value={draft.stud}
                    onChange={(v) => set("stud", v)}
                  />
                  <MoneyField
                    id="other"
                    label="Anything else you repay"
                    hint="Per month"
                    value={draft.other}
                    onChange={(v) => set("other", v)}
                  />
                </div>
              </>
            )}
          </div>

          <details className="mt-6 rounded-lg border border-gray-100 bg-valar-fog p-5">
            <summary className="cursor-pointer text-sm font-semibold text-valar-navy">
              What this calculator assumes
            </summary>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm leading-relaxed text-gray-600">
              <li>
                <strong className="text-valar-navy">Tested at 7.00% p.a.</strong> — banks don&rsquo;t
                check you against today&rsquo;s rate, they check you against a much higher one. This is
                our version of that test.
              </li>
              <li>
                <strong className="text-valar-navy">30-year loan</strong>, principal and interest.
              </li>
              <li>
                <strong className="text-valar-navy">A loan of no more than six times your income.</strong>{" "}
                Lenders are limited in how much they can write above that, so we don&rsquo;t quote past
                it.
              </li>
              <li>
                <strong className="text-valar-navy">A minimum living cost floor</strong> — if what you
                enter is below what a household your size realistically spends, we use the higher
                figure. Banks do the same.
              </li>
              <li>
                <strong className="text-valar-navy">Card limits count at 3% a month</strong>, whether or
                not you owe anything on them.
              </li>
              <li>
                <strong className="text-valar-navy">$150 a month left over</strong> after everything —
                the standard margin lenders want to see.
              </li>
            </ul>

            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <MoneyField
                id="rate"
                label="Rate you expect to pay"
                prefix="%"
                hint="Only changes your repayment figure, not what you can borrow."
                value={draft.rate}
                onChange={(v) => set("rate", v)}
              />
              <MoneyField
                id="rins"
                label="Rates & house insurance"
                hint="Per month, on the home you buy."
                value={draft.rins}
                onChange={(v) => set("rins", v)}
              />
            </div>
            <div className="mt-5">
              <MoneyField
                id="costs"
                label="Upfront costs to come out of your deposit"
                hint="Lawyer, LIM report, builder's report, moving."
                value={draft.costs}
                onChange={(v) => set("costs", v)}
              />
            </div>
          </details>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setCommitted(draft)}
              className="rounded-lg bg-valar-amber px-6 py-3 text-[15px] font-bold text-valar-navy transition-colors hover:bg-valar-amber-hover"
            >
              Run calculator
            </button>
            {stale && (
              <span className="text-sm font-medium text-valar-steel">
                Numbers changed — run again
              </span>
            )}
          </div>
        </section>

        {/* ============ RESULTS ============ */}
        <div className="flex flex-col gap-4">
          <section
            aria-live="polite"
            className={`rounded-xl border border-gray-100 bg-white transition-opacity ${stale ? "opacity-60" : ""}`}
          >
            <div className="border-b border-gray-100 p-6 md:p-8">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-valar-amber">
                Indicative purchase price
              </p>
              {result.blocked ? (
                <p className="text-2xl font-bold leading-tight text-valar-steel">{result.headline}</p>
              ) : (
                <>
                  <p className="mb-4 text-4xl font-bold tabular-nums text-valar-navy md:text-5xl">
                    {money(result.price)}
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                    <span>
                      Loan{" "}
                      <b className="font-semibold tabular-nums text-valar-navy">
                        {money(result.loan)}
                      </b>
                    </span>
                    <span>
                      Deposit{" "}
                      <b className="font-semibold tabular-nums text-valar-navy">
                        {money(result.depAvail)}
                      </b>
                    </span>
                    <span>
                      LVR{" "}
                      <b className="font-semibold tabular-nums text-valar-navy">
                        {Math.round(result.lvr * 100)}%
                      </b>
                    </span>
                  </div>
                  {result.hasStretch && (
                    <p className="mt-4 border-l-2 border-valar-amber pl-4 text-sm leading-relaxed text-gray-600">
                      That&rsquo;s with a full 20% deposit. Buying with less than 20% down is possible
                      for first home buyers and would stretch you to about{" "}
                      <b className="font-semibold text-valar-navy">{money(result.stretch)}</b> — at
                      extra cost and against tighter criteria.
                    </p>
                  )}
                </>
              )}
            </div>

            {!result.blocked && (
              <div className="grid grid-cols-2 gap-4 border-b border-gray-100 p-6 md:px-8">
                <div>
                  <p className="mb-1 text-xs text-valar-steel">
                    Repayment at {(result.expRate * 100).toFixed(2)}%
                  </p>
                  <p className="text-lg font-bold tabular-nums text-valar-navy">
                    {money(result.payAtRate)}/mo
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs text-valar-steel">What the bank tests: 7.00%</p>
                  <p className="text-lg font-bold tabular-nums text-valar-navy">
                    {money(result.payAtTest)}/mo
                  </p>
                </div>
              </div>
            )}

            <div className="border-b border-gray-100 p-6 md:px-8">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-valar-navy">
                What sets your ceiling
              </h3>
              <Bar
                label="What your income supports"
                amount={result.priceByIncome}
                width={(result.priceByIncome / top) * 100}
                binds={!result.depositBinds}
              />
              <Bar
                label="What your deposit supports, 20% down"
                amount={result.priceByDeposit}
                width={(result.priceByDeposit / top) * 100}
                binds={result.depositBinds}
              />
            </div>

            <div className="p-6 md:p-8">
              <h3 className="mb-3 text-xl font-bold text-valar-navy">{result.title}</h3>
              <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-gray-600">
                {result.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </section>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-lg border border-valar-concrete bg-white px-5 py-2.5 text-sm font-semibold text-valar-navy transition-colors hover:border-valar-navy"
            >
              Print or save as PDF
            </button>
            {onTakeGuide && (
              <button
                type="button"
                onClick={onTakeGuide}
                className="rounded-lg border border-valar-concrete bg-white px-5 py-2.5 text-sm font-semibold text-valar-navy transition-colors hover:border-valar-navy"
              >
                Get the First Home Buyer Guide
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
