/*
 * The contract a borrowing calculation travels under, the same way
 * src/lib/repayment-report.ts carries a single loan and src/lib/split-report.ts
 * carries a split.
 *
 * Only the INPUTS travel. The email recomputes the answer with `calculate`, so
 * a figure quoted back to someone can never drift from the figure the page
 * showed them, and a tampered payload can change what is being modelled but
 * never what a given set of numbers is quoted at.
 *
 * `kind: "affordability"` is what tells it apart on the wire. The repayment
 * snapshot has no `kind` at all and predates both of the others, so anything
 * without one is still read as a single loan.
 *
 * The calculator itself holds its inputs as formatted strings, because that is
 * what its fields contain while someone is typing in them. Numbers cross the
 * network instead: "1,200" is a locale away from being a number on the server,
 * and a snapshot that has to be un-formatted before it can be trusted is a
 * snapshot that can be un-formatted wrongly.
 */

import type { Inputs } from "./affordability";

export type AffordabilitySnapshot = {
  kind: "affordability";
  couple: boolean;
  /** Gross, per year. */
  inc1: number;
  inc2: number;
  deps: number;
  /** KiwiSaver employee contribution per person, as a percentage of gross pay. */
  kiwi1: number;
  kiwi2: number;
  /** Everyday living, per month, excluding rent and loan repayments. */
  spend: number;
  /** Everything they can put in. All of it goes into the purchase. */
  deposit: number;
  /** Card and store card limits — the limit, not the balance. */
  cc: number;
  /** Monthly repayments. */
  car: number;
  stud: number;
  other: number;
  /** The rate they expect to pay, as a percentage. */
  rate: number;
  /** Rates and house insurance on the home being bought, per month. */
  rins: number;
  /** Life, health and income protection cover, per month. */
  insurance: number;
  /** Anything else going out monthly that is not a debt repayment. */
  otherSpend: number;
  /** Whether the debt fields were filled in, or left out of the question. */
  detailed: boolean;
};

/*
 * The floors and ceilings repeated on this side of the network boundary.
 * Anything arriving at the API came through a form the visitor controls, so it
 * is clamped again rather than trusted — otherwise a posted income of 1e30
 * becomes an email full of Infinity.
 */
const LIMITS = {
  income: { min: 0, max: 2_000_000 },
  deps: { min: 0, max: 10 },
  kiwi: { min: 0, max: 25 },
  spend: { min: 0, max: 50_000 },
  deposit: { min: 0, max: 10_000_000 },
  cc: { min: 0, max: 500_000 },
  monthly: { min: 0, max: 50_000 },
  rate: { min: 1, max: 12 },
  rins: { min: 0, max: 10_000 },
} as const;

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/**
 * Accepts numbers and numeric strings; anything else is not a number.
 *
 * The empty check is load-bearing: stripping non-numeric characters out of
 * "abc" leaves "", and Number("") is 0, not NaN.
 */
function toNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string") return null;
  const cleaned = value.replace(/[^0-9.\-]/g, "");
  if (cleaned.trim() === "") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

const field = (raw: unknown, limits: { min: number; max: number }) =>
  clamp(toNumber(raw) ?? 0, limits.min, limits.max);

/** The calculator's own state, as it stood when the button was pressed. */
export function snapshotFromInputs(input: Inputs): AffordabilitySnapshot {
  const num = (raw: string) => {
    const v = parseFloat(raw.replace(/[^0-9.]/g, ""));
    return Number.isNaN(v) ? 0 : v;
  };
  const couple = input.who === "2";
  return {
    kind: "affordability",
    couple,
    inc1: num(input.inc1),
    inc2: couple ? num(input.inc2) : 0,
    deps: parseInt(input.deps, 10) || 0,
    kiwi1: num(input.kiwi1),
    kiwi2: couple ? num(input.kiwi2) : 0,
    spend: num(input.spend),
    deposit: num(input.dep),
    cc: input.detailed ? num(input.cc) : 0,
    car: input.detailed ? num(input.car) : 0,
    stud: input.detailed ? num(input.stud) : 0,
    other: input.detailed ? num(input.other) : 0,
    rate: num(input.rate),
    rins: num(input.rins),
    insurance: num(input.ins),
    otherSpend: num(input.extra),
    detailed: input.detailed,
  };
}

/** Back into the shape `calculate` reads, so the server recomputes the answer. */
export function inputsFromSnapshot(s: AffordabilitySnapshot): Inputs {
  return {
    who: s.couple ? "2" : "1",
    inc1: String(s.inc1),
    inc2: String(s.inc2),
    deps: String(s.deps),
    kiwi1: String(s.kiwi1),
    kiwi2: String(s.kiwi2),
    spend: String(s.spend),
    dep: String(s.deposit),
    cc: String(s.cc),
    car: String(s.car),
    stud: String(s.stud),
    other: String(s.other),
    rate: String(s.rate),
    rins: String(s.rins),
    ins: String(s.insurance),
    extra: String(s.otherSpend),
    detailed: s.detailed,
  };
}

/**
 * Validate and clamp whatever arrived into a snapshot, or null if it is not a
 * borrowing calculation at all — including one with no income in it, which has
 * nothing in it to report back.
 */
export function parseAffordabilitySnapshot(raw: unknown): AffordabilitySnapshot | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (r.kind !== "affordability") return null;

  const couple = r.couple === true;
  const inc1 = field(r.inc1, LIMITS.income);
  const inc2 = couple ? field(r.inc2, LIMITS.income) : 0;
  if (inc1 + inc2 <= 0) return null;

  const detailed = r.detailed === true;

  return {
    kind: "affordability",
    couple,
    inc1,
    inc2,
    deps: Math.round(field(r.deps, LIMITS.deps)),
    kiwi1: field(r.kiwi1, LIMITS.kiwi),
    kiwi2: couple ? field(r.kiwi2, LIMITS.kiwi) : 0,
    spend: field(r.spend, LIMITS.spend),
    deposit: field(r.deposit, LIMITS.deposit),
    cc: detailed ? field(r.cc, LIMITS.cc) : 0,
    car: detailed ? field(r.car, LIMITS.monthly) : 0,
    stud: detailed ? field(r.stud, LIMITS.monthly) : 0,
    other: detailed ? field(r.other, LIMITS.monthly) : 0,
    // A rate of zero is not a rate. It only changes the repayment line, so the
    // calculator's own default is the right thing to fall back to.
    rate: clamp(toNumber(r.rate) || 5, LIMITS.rate.min, LIMITS.rate.max),
    rins: field(r.rins, LIMITS.rins),
    insurance: field(r.insurance, LIMITS.monthly),
    otherSpend: field(r.otherSpend, LIMITS.monthly),
    detailed,
  };
}
