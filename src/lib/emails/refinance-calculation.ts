/*
 * The email a visitor gets back after asking for their refinance numbers.
 *
 * Same construction as split-calculation.ts and for the same reason: table and
 * inline-style HTML, because Outlook renders through Word. It recomputes from the
 * snapshot and takes its sentences from describeRefinance, so it cannot say
 * something different from the page it came from.
 */

import { SITE_URL } from "@/lib/schema";
import {
  assumptionsLine,
  calculateRefinance,
  describeRefinance,
  formatDate,
  formatDuration,
} from "@/lib/refinance";
import type { RefinanceSnapshot } from "@/lib/refinance-report";

const NAVY = "#061634";
const AMBER = "#E8A23A";
const LILAC = "#C8CBE3";
const STEEL = "#8F93B5";
const CONCRETE = "#C9CED6";
const FOG = "#F6F7F9";
const MUTED = "#5A6478";

/** Anything interpolated from the form is escaped. A name is not markup. */
function esc(s: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return s.replace(/[&<>"']/g, (c) => map[c]);
}

export function renderRefinanceEmail({
  firstName,
  snapshot,
  guideTitle,
  guideUrl,
  today,
  baseUrl = SITE_URL,
}: {
  firstName: string;
  snapshot: RefinanceSnapshot;
  guideTitle: string;
  guideUrl?: string;
  /** ISO date the calculation is run on. */
  today: string;
  baseUrl?: string;
}): { subject: string; html: string; text: string } {
  const result = calculateRefinance(snapshot, today);
  const words = describeRefinance(result, snapshot);
  const name = esc(firstName.trim());
  const assumptions = assumptionsLine();

  const yourLoan = [
    `Balance $${Math.round(snapshot.balance).toLocaleString("en-NZ")}`,
    `rate ${snapshot.rate.toFixed(2)}%`,
    `repayment $${Math.round(snapshot.repayment).toLocaleString("en-NZ")} ${snapshot.frequency}`,
    snapshot.fixedEnd ? `fixed until ${formatDate(snapshot.fixedEnd)}` : "floating",
  ].join(", ");

  const comparison =
    result.state !== "low" && words.showComparison && result.refinanceMonths !== null
      ? {
          stay: formatDuration(result.stayMonths),
          move: formatDuration(result.refinanceMonths),
        }
      : null;

  const headline = words.headlineIsFigure
    ? `${words.headline} ${words.headlineUnit ?? ""}`
    : words.headline;

  const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Your refinance numbers</title>
</head>
<body style="margin:0;padding:0;background-color:${FOG};">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${FOG};">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:100%;font-family:Helvetica,Arial,sans-serif;">

  <tr><td style="background-color:${NAVY};padding:28px 32px;">
    <p style="margin:0;font-size:18px;font-weight:700;letter-spacing:1px;color:#ffffff;">VALAR</p>
    <p style="margin:2px 0 0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${STEEL};">Financial Advisors</p>
  </td></tr>

  <tr><td style="background-color:#ffffff;padding:32px;">
    <h1 style="margin:0 0 12px;font-size:24px;line-height:32px;font-weight:700;color:${NAVY};">
      ${name ? `${name}, here` : "Here"} are your numbers<span style="color:${AMBER};">.</span>
    </h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:24px;color:#3f4a5a;">You entered: ${esc(yourLoan)}.</p>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${NAVY};">
      <tr><td style="padding:28px 24px;">
        <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:${AMBER};">${esc(words.label)}</p>
        <p style="margin:0;font-size:30px;line-height:38px;font-weight:700;color:#ffffff;">${esc(headline)}</p>
        <p style="margin:10px 0 0;font-size:14px;line-height:22px;color:${LILAC};">${esc(words.sub)}</p>
        ${words.pills
          .map(
            (p) =>
              `<p style="margin:10px 0 0;font-size:14px;font-weight:700;color:#ffffff;">${esc(p)}</p>`,
          )
          .join("")}
        ${words.note ? `<p style="margin:12px 0 0;font-size:13px;line-height:21px;color:${LILAC};">${esc(words.note)}</p>` : ""}
      </td></tr>
    </table>

    ${
      comparison
        ? `<p style="margin:20px 0 0;font-size:14px;line-height:22px;color:#3f4a5a;">
             Time to finish: <strong style="color:${NAVY};">${comparison.stay}</strong> if you stay,
             <strong style="color:${NAVY};">${comparison.move}</strong> if you refinance, with both paying the same amounts.
           </p>`
        : ""
    }

    ${
      guideUrl
        ? `<p style="margin:24px 0 12px;font-size:15px;line-height:24px;color:#3f4a5a;">
             And here is <a href="${guideUrl}" style="color:${NAVY};font-weight:700;">${esc(guideTitle)}</a>.
           </p>`
        : ""
    }

    ${
      snapshot.fixedEnd
        ? `<p style="margin:16px 0 0;font-size:15px;line-height:24px;color:#3f4a5a;">
             Lena will send you a reminder about 90 days before ${formatDate(snapshot.fixedEnd)}.
           </p>`
        : ""
    }

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:24px;border:1px solid ${CONCRETE};background-color:${FOG};">
      <tr><td style="padding:22px 24px;">
        <h2 style="margin:0 0 8px;font-size:17px;line-height:24px;font-weight:700;color:${NAVY};">
          The exact numbers take a conversation<span style="color:${AMBER};">.</span>
        </h2>
        <p style="margin:0 0 16px;font-size:14px;line-height:22px;color:#3f4a5a;">
          Your break cost, your lender options and your plans decide the real answer.
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="background-color:${AMBER};">
            <a href="${baseUrl}/book" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:700;color:${NAVY};text-decoration:none;">
              Book a clarity call
            </a>
          </td></tr>
        </table>
      </td></tr>
    </table>

    <p style="margin:28px 0 0;font-size:12px;line-height:19px;color:${MUTED};">
      ${esc(assumptions)} This is an illustration, not financial advice or a loan offer. Rates change and lending criteria apply.
    </p>
  </td></tr>

  <tr><td style="background-color:${NAVY};padding:24px 32px;">
    <p style="margin:0 0 6px;font-size:13px;line-height:20px;color:${LILAC};">
      Lena Bykova &middot; Valar Financial Advisors &middot;
      <a href="${SITE_URL}" style="color:#ffffff;text-decoration:underline;">valar.co.nz</a>
    </p>
    <p style="margin:0;font-size:11px;line-height:18px;color:${STEEL};">
      Valar Financial Advisors Limited (FSP1012862) holds a Financial Advice Provider licence
      issued by the FMA. Financial advice is provided by Lena Bykova, Director and Financial
      Adviser (FSP1010055). Disclosure statement:
      <a href="${SITE_URL}/disclosure" style="color:#ffffff;text-decoration:underline;">valar.co.nz/disclosure</a><br>
      You are receiving this because you asked for these numbers on our calculator.
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`;

  const text = [
    name ? `${name}, here are your numbers.` : "Here are your numbers.",
    "",
    `You entered: ${yourLoan}.`,
    "",
    words.label,
    headline,
    words.sub,
    ...words.pills,
    words.note ?? "",
    comparison
      ? `Time to finish: ${comparison.stay} if you stay, ${comparison.move} if you refinance, with both paying the same amounts.`
      : "",
    "",
    guideUrl ? `${guideTitle}: ${guideUrl}` : "",
    snapshot.fixedEnd
      ? `Lena will send you a reminder about 90 days before ${formatDate(snapshot.fixedEnd)}.`
      : "",
    `Book a clarity call: ${baseUrl}/book`,
    "",
    `${assumptions} This is an illustration, not financial advice or a loan offer. Rates change and lending criteria apply.`,
    "",
    "Valar Financial Advisors Limited (FSP1012862) holds a Financial Advice Provider licence issued by the FMA. Financial advice is provided by Lena Bykova, Director and Financial Adviser (FSP1010055). Disclosure statement: valar.co.nz/disclosure",
  ]
    .filter((line, i, all) => line !== "" || all[i - 1] !== "")
    .join("\n");

  return {
    subject:
      result.state === "low" || result.state === "hold"
        ? "Your mortgage numbers"
        : `Your refinance numbers: ${headline.trim()}`,
    html,
    text,
  };
}
