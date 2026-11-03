/*
 * The contract a refinance calculation travels under, the same way
 * src/lib/split-report.ts carries a split.
 *
 * Only the inputs travel. The server recomputes the answer, so an email can never
 * quote a figure the page did not, and a tampered payload can change what is
 * being modelled but never what a given loan is quoted at.
 */

import { PER_YEAR, RISE_OPTIONS, type RefinanceInputs } from "./refinance";
import type { FrequencyKey } from "./split-loan";

export type RefinanceSnapshot = RefinanceInputs & { kind: "refinance" };

const LIMITS = {
  balance: { min: 10_000, max: 5_000_000 },
  rate: { min: 1, max: 15 },
  repayment: { min: 50, max: 100_000 },
} as const;

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const toNumber = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

const isFrequency = (v: unknown): v is FrequencyKey => typeof v === "string" && v in PER_YEAR;

/** Anything else that arrives in this field ends up inside an email to Lena. */
const isIsoDate = (v: unknown): v is string =>
  typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && Number.isFinite(Date.parse(v));

export function parseRefinanceSnapshot(raw: unknown): RefinanceSnapshot | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (r.kind !== "refinance") return null;

  const balance = toNumber(r.balance);
  const rate = toNumber(r.rate);
  const repayment = toNumber(r.repayment);
  if (balance === null || rate === null || repayment === null) return null;

  return {
    kind: "refinance",
    balance: clamp(balance, LIMITS.balance.min, LIMITS.balance.max),
    rate: clamp(rate, LIMITS.rate.min, LIMITS.rate.max),
    repayment: clamp(repayment, LIMITS.repayment.min, LIMITS.repayment.max),
    frequency: isFrequency(r.frequency) ? r.frequency : "monthly",
    fixedEnd: isIsoDate(r.fixedEnd) ? r.fixedEnd : "",
    rise: RISE_OPTIONS.some((o) => o.value === r.rise) ? (r.rise as number) : 0,
  };
}

export const REFINANCE_LIMITS = LIMITS;
