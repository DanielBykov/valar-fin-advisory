/*
 * The contract a split calculation travels under, the same way
 * src/lib/repayment-report.ts carries a single loan.
 *
 * Only the INPUTS travel. The email recomputes the answer with calculateSplit,
 * so a figure quoted back to someone can never drift from the figure the page
 * showed them, and a tampered payload can change what is being modelled but
 * never what a given structure is quoted at.
 *
 * `kind` is what tells the two apart on the wire. The repayment snapshot has no
 * such field and predates this one, so anything without it is still read as a
 * single loan and nothing that already worked stops working.
 */

import {
  FREQUENCIES,
  type ExtraMode,
  type FrequencyKey,
  type LoanPart,
  type PartType,
} from "./split-loan";

export type SplitSnapshot = {
  kind: "split";
  loanYears: number;
  frequency: FrequencyKey;
  parts: LoanPart[];
};

/*
 * The floors and ceilings the inputs enforce, repeated on this side of the
 * network boundary. Anything arriving at the API came through a form the
 * visitor controls, so it is clamped again rather than trusted.
 */
const LIMITS = {
  amount: { min: 0, max: 3_000_000 },
  rate: { min: 1, max: 12 },
  fixedYears: { min: 1, max: 5 },
  loanYears: { min: 5, max: 30 },
} as const;

/** Three parts is the shape of the calculator, and the ceiling on the payload. */
const MAX_PARTS = 3;

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const isFrequency = (v: unknown): v is FrequencyKey => FREQUENCIES.some((f) => f.key === v);

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

function parsePart(raw: unknown): LoanPart | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  const amount = toNumber(r.amount);
  const rate = toNumber(r.rate);
  const fixedYears = toNumber(r.fixedYears);
  if (amount === null || rate === null || fixedYears === null) return null;

  const type: PartType = r.type === "io" ? "io" : "pi";
  const extraMode: ExtraMode = r.extraMode === "percent" ? "percent" : "amount";
  const clampedAmount = clamp(amount, LIMITS.amount.min, LIMITS.amount.max);

  return {
    amount: clampedAmount,
    rate: clamp(rate, LIMITS.rate.min, LIMITS.rate.max),
    fixedYears: Math.round(clamp(fixedYears, LIMITS.fixedYears.min, LIMITS.fixedYears.max)),
    type,
    extraMode,
    // An extra payment larger than the part itself is a typo or a probe, not a
    // scenario. Percent is capped at the whole part per year.
    extraValue: clamp(
      toNumber(r.extraValue) ?? 0,
      0,
      extraMode === "percent" ? 100 : Math.max(clampedAmount, 1),
    ),
  };
}

/**
 * Validate and clamp whatever arrived into a split snapshot, or null if it is
 * not a split at all — including a split where every part is empty, which has
 * no structure in it to report back.
 */
export function parseSplitSnapshot(raw: unknown): SplitSnapshot | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (r.kind !== "split" || !Array.isArray(r.parts)) return null;

  const parts = r.parts
    .slice(0, MAX_PARTS)
    .map(parsePart)
    .filter((p): p is LoanPart => p !== null && p.amount > 0);

  if (parts.length === 0) return null;

  const loanYears = toNumber(r.loanYears);

  return {
    kind: "split",
    loanYears: Math.round(
      clamp(loanYears ?? 30, LIMITS.loanYears.min, LIMITS.loanYears.max),
    ),
    frequency: isFrequency(r.frequency) ? r.frequency : "fortnightly",
    parts,
  };
}
