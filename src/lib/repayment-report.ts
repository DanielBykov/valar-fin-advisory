/*
 * The contract shared by the three places a repayment calculation has to
 * survive outside the calculator component: the capture form that posts it,
 * the email that reports it back, and the printable page that email links to.
 *
 * Only the INPUTS travel. Every consumer recomputes the answer with
 * calculateRepayments, so the figure in the email can never drift from the
 * figure on the page, and a hand-edited query string can change what is being
 * modelled but never what a given loan is quoted at.
 */

import { FREQUENCIES, type FrequencyKey } from "./split-loan";
import type { ExtraMode, RepaymentInput } from "./repayments";

export type RepaymentSnapshot = RepaymentInput;

/*
 * The floors and ceilings the sliders enforce, repeated on this side of the
 * network boundary. Anything arriving at the API has been through a form the
 * visitor controls, so it is clamped again rather than trusted — otherwise a
 * posted amount of 1e30 becomes an email full of Infinity.
 */
const LIMITS = {
  amount: { min: 50_000, max: 2_000_000 },
  rate: { min: 1, max: 12 },
  years: { min: 5, max: 30 },
} as const;

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const isFrequency = (v: unknown): v is FrequencyKey =>
  FREQUENCIES.some((f) => f.key === v);

/**
 * Accepts numbers and numeric strings; anything else is not a number.
 *
 * The empty check is load-bearing. Stripping the non-numeric characters out of
 * "abc" leaves "", and Number("") is 0, not NaN — without it a query string of
 * pure nonsense parsed cleanly into a $50,000 loan instead of a 404.
 */
function toNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string") return null;
  const cleaned = value.replace(/[^0-9.\-]/g, "");
  if (cleaned.trim() === "") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

/**
 * Validate and clamp whatever arrived into a snapshot, or null if it is not a
 * calculation at all. Returning null rather than a default is deliberate: a
 * malformed payload means the visitor gets the plain confirmation, not an
 * email quoting a $50,000 loan they never asked about.
 */
export function parseRepaymentSnapshot(raw: unknown): RepaymentSnapshot | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  const amount = toNumber(r.amount);
  const rate = toNumber(r.rate);
  const years = toNumber(r.years);
  const extraValue = toNumber(r.extra ?? r.extraValue);
  if (amount === null || rate === null || years === null) return null;

  const frequency: FrequencyKey = isFrequency(r.frequency) ? r.frequency : "fortnightly";
  const extraMode: ExtraMode = r.extraMode === "percent" ? "percent" : "amount";

  const clampedAmount = clamp(amount, LIMITS.amount.min, LIMITS.amount.max);

  return {
    amount: clampedAmount,
    rate: clamp(rate, LIMITS.rate.min, LIMITS.rate.max),
    years: Math.round(clamp(years, LIMITS.years.min, LIMITS.years.max)),
    frequency,
    extraMode,
    // An extra payment larger than the loan itself is not a scenario, it is a
    // typo or a probe. Percent is capped at the whole loan per year.
    extraValue: clamp(extraValue ?? 0, 0, extraMode === "percent" ? 100 : clampedAmount),
  };
}

/** Query keys are spelled out — this URL is pasted into emails and read by people. */
export function repaymentReportQuery(s: RepaymentSnapshot): string {
  return new URLSearchParams({
    amount: String(s.amount),
    rate: String(s.rate),
    years: String(s.years),
    frequency: s.frequency,
    extraMode: s.extraMode,
    extra: String(s.extraValue),
  }).toString();
}

export function repaymentReportPath(s: RepaymentSnapshot): string {
  return `/calculators/repayments/report?${repaymentReportQuery(s)}`;
}

/** The Next `searchParams` shape, back into a snapshot. */
export function snapshotFromSearchParams(
  params: Record<string, string | string[] | undefined>,
): RepaymentSnapshot | null {
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  return parseRepaymentSnapshot({
    amount: first(params.amount),
    rate: first(params.rate),
    years: first(params.years),
    frequency: first(params.frequency),
    extraMode: first(params.extraMode),
    extra: first(params.extra),
  });
}

export const nzd = (n: number, decimals = 0) =>
  new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(Number.isFinite(n) ? n : 0);
