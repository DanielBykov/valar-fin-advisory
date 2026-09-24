/*
 * The contract the payment-first borrowing calculation travels under, the same
 * way repayment-report.ts carries a single loan and split-report.ts a split.
 *
 * Only the INPUTS travel. The email recomputes the answer with
 * calculateBorrow, so a figure quoted back can never drift from the page, and
 * a tampered payload can change what is modelled but never what a given set
 * of numbers is quoted at.
 *
 * `kind: "borrow"` tells it apart on the wire from the income-based
 * `kind: "affordability"` snapshot it replaced (2026-09-24).
 */

import { FREQUENCIES, type FrequencyKey } from "./split-loan";
import type { BorrowInput } from "./borrow-from-payment";

export type BorrowSnapshot = BorrowInput & { kind: "borrow" };

/*
 * Clamped again on this side of the network boundary: anything arriving at the
 * API came through a form the visitor controls. Money is per period, and a
 * weekly payment of $50,000 is not a scenario.
 */
const LIMITS = {
  money: { min: 0, max: 200_000 },
  rate: { min: 0.5, max: 20 },
  years: { min: 1, max: 40 },
} as const;

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const isFrequency = (v: unknown): v is FrequencyKey => FREQUENCIES.some((f) => f.key === v);

/** Numbers and numeric strings; anything else is not a number. "" is not 0. */
function toNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string") return null;
  const cleaned = value.replace(/[^0-9.\-]/g, "");
  if (cleaned.trim() === "") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

/** A snapshot, or null when the payload is not this calculator's. */
export function parseBorrowSnapshot(raw: unknown): BorrowSnapshot | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (r.kind !== "borrow") return null;

  const payment = toNumber(r.payment);
  const rate = toNumber(r.rate);
  const years = toNumber(r.years);
  if (payment === null || rate === null || years === null || payment <= 0) return null;

  return {
    kind: "borrow",
    frequency: isFrequency(r.frequency) ? r.frequency : "monthly",
    income: clamp(toNumber(r.income) ?? 0, LIMITS.money.min, LIMITS.money.max),
    payment: clamp(payment, LIMITS.money.min, LIMITS.money.max),
    rate: clamp(rate, LIMITS.rate.min, LIMITS.rate.max),
    years: Math.round(clamp(years, LIMITS.years.min, LIMITS.years.max)),
  };
}
