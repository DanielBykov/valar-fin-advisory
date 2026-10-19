/**
 * Catches a mistyped email domain and proposes the one that was meant.
 *
 * It exists instead of a confirmation email (Lena, 2026-10-16). Making someone
 * leave the page, find a message and click a link before the webinar opens
 * loses people at the one step that should cost nothing, and a confirmation
 * that lands in spam reads as being cheated out of the video. What actually
 * loses a real lead is an honest typo — "gmial.com" — and that can be caught
 * while the person is still looking at the field.
 *
 * It only ever suggests. An address it does not recognise is not wrong, and
 * the form submits either way.
 */

/*
 * The providers the site's visitors actually use: the international ones,
 * New Zealand's own, and the Ukrainian ones the `/ua` audience brings with
 * them. A domain not on this list is never "corrected" towards it unless it
 * is one or two keystrokes away.
 */
const KNOWN_DOMAINS = [
  "gmail.com",
  "googlemail.com",
  // Real providers one keystroke from gmail.com; listed so they are left alone.
  "mail.com",
  "gmx.com",
  "aol.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "yahoo.com",
  "icloud.com",
  "me.com",
  "proton.me",
  "protonmail.com",
  "xtra.co.nz",
  "slingshot.co.nz",
  "orcon.net.nz",
  "vodafone.co.nz",
  "ukr.net",
  "i.ua",
  "meta.ua",
];

/** Optimal string alignment distance: an adjacent swap ("gmial") counts as one edit. */
function distance(a: string, b: string): number {
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}

/**
 * The corrected address, or `null` when there is nothing to suggest.
 *
 * Two edits are allowed only on longer domains: on a short one two edits can
 * turn almost anything into anything, and "i.ua" would start claiming
 * addresses it has nothing to do with.
 */
export function suggestEmail(email: string): string | null {
  const at = email.lastIndexOf("@");
  if (at < 1) return null;
  const local = email.slice(0, at);
  const domain = email
    .slice(at + 1)
    .trim()
    .toLowerCase();
  if (!domain || KNOWN_DOMAINS.includes(domain)) return null;

  let best: { domain: string; d: number } | null = null;
  for (const known of KNOWN_DOMAINS) {
    const d = distance(domain, known);
    const allowed = known.length >= 8 ? 2 : 1;
    if (d <= allowed && (!best || d < best.d)) best = { domain: known, d };
  }
  return best ? `${local}@${best.domain}` : null;
}
