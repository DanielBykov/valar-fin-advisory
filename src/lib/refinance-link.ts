import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { parseRefinanceSnapshot, type RefinanceSnapshot } from "@/lib/refinance-report";

/*
 * The one-click "Let's review my mortgage" link in the refinance email
 * (2026-11-20). The link has to say who is asking, and an email address in a
 * URL ends up in browser history, proxies and analytics. So the contact and
 * the figures are sealed with AES-256-GCM: the token is opaque to anyone but
 * this server, and a tampered one fails to open.
 *
 * The key is derived from REFINANCE_LINK_SECRET, or from the Resend key when
 * that is not set, so the feature works without a new variable on Vercel. A
 * dedicated secret is better: rotating the Resend key would otherwise void
 * every link already sent.
 */

export type ReviewRequest = {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  snapshot: RefinanceSnapshot;
  /** ISO date the email was sent. */
  issued: string;
};

/** A link older than this asks the visitor to use the calculator again. */
const MAX_AGE_DAYS = 180;

function key(): Buffer | null {
  const secret = process.env.REFINANCE_LINK_SECRET || process.env.RESEND_API_KEY;
  return secret ? createHash("sha256").update(`refinance-review:${secret}`).digest() : null;
}

export function sealReviewRequest(request: ReviewRequest): string | null {
  const k = key();
  if (!k) return null;
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", k, iv);
  const body = Buffer.concat([cipher.update(JSON.stringify(request), "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), body]).toString("base64url");
}

export function openReviewRequest(token: string, todayIso: string): ReviewRequest | null {
  const k = key();
  if (!k || typeof token !== "string" || token.length > 4000) return null;
  try {
    const raw = Buffer.from(token, "base64url");
    const decipher = createDecipheriv("aes-256-gcm", k, raw.subarray(0, 12));
    decipher.setAuthTag(raw.subarray(12, 28));
    const json = Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString(
      "utf8",
    );
    const r = JSON.parse(json) as Partial<ReviewRequest>;
    const snapshot = parseRefinanceSnapshot(r.snapshot);
    if (!snapshot || typeof r.firstName !== "string" || typeof r.email !== "string") return null;
    const age = (Date.parse(todayIso) - Date.parse(r.issued ?? "")) / 86_400_000;
    if (!(age >= 0 && age <= MAX_AGE_DAYS)) return null;
    return {
      firstName: r.firstName,
      lastName: typeof r.lastName === "string" ? r.lastName : undefined,
      email: r.email,
      phone: typeof r.phone === "string" ? r.phone : undefined,
      snapshot,
      issued: r.issued as string,
    };
  } catch {
    return null;
  }
}
