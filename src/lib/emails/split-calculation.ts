/*
 * The email a visitor gets back after asking for their split in writing.
 *
 * Same construction as repayment-calculation.ts and for the same reason:
 * table-and-inline-style HTML rather than the site's Tailwind, because Outlook
 * renders through Word and supports neither flexbox nor grid nor a <style>
 * block reliably. It is ugly source on purpose.
 *
 * It recomputes the structure from the snapshot with calculateSplit, so the
 * figures here cannot drift from the ones the calculator showed.
 */

import { SITE_URL } from "@/lib/schema";
import {
  calculateSplit,
  describeDuration,
  EXTRA_CAP_PERCENT,
  FREQUENCIES,
  interestInFirstYearByPart,
} from "@/lib/split-loan";
import { nzd } from "@/lib/repayment-report";
import type { SplitSnapshot } from "@/lib/split-report";

const NAVY = "#061634";
const AMBER = "#E8A23A";
const LILAC = "#C8CBE3";
const STEEL = "#8F93B5";
const CONCRETE = "#C9CED6";
const FOG = "#F6F7F9";

/*
 * Steel reads fine as a label on the navy panels but only reaches about 3:1 on
 * white, which is under the floor for body-sized text. Small print on a light
 * ground uses this instead.
 */
const MUTED = "#5A6478";

/** Anything interpolated from the form is escaped — a name is not markup. */
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

/** One line of the dark results panel. */
function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:6px 0;font-size:14px;color:${LILAC};">${label}</td>
      <td align="right" style="padding:6px 0;font-size:14px;font-weight:700;color:#ffffff;">${value}</td>
    </tr>`;
}

const th = (text: string, align = "left") =>
  `<th align="${align}" style="padding:8px 10px;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${MUTED};border-bottom:1px solid ${CONCRETE};">${text}</th>`;

const td = (text: string, align = "left", bold = false) =>
  `<td align="${align}" style="padding:9px 10px;font-size:13px;color:${bold ? NAVY : "#3f4a5a"};font-weight:${bold ? 700 : 400};border-bottom:1px solid #EDEFF2;">${text}</td>`;

export type SplitEmail = { subject: string; html: string; text: string };

export function renderSplitEmail({
  firstName,
  snapshot,
  guideTitle,
  guideReady,
  guideUrl,
  pendingNote,
  baseUrl = SITE_URL,
}: {
  firstName: string;
  snapshot: SplitSnapshot;
  guideTitle: string;
  guideReady: boolean;
  /** Absolute URL of the guide PDF, when there is one. */
  guideUrl?: string;
  /**
   * What to say when there is no document. A split structure review is answered
   * by Lena, not written — telling someone it is "being finished" is wrong.
   */
  pendingNote?: string;
  /**
   * Where the links point. Defaults to the live site; a local run passes its own
   * origin so a test send is actually clickable.
   */
  baseUrl?: string;
}): SplitEmail {
  const r = calculateSplit(snapshot.parts, snapshot.frequency, snapshot.loanYears);
  const freqLabel =
    FREQUENCIES.find((f) => f.key === snapshot.frequency)?.label ?? "Fortnightly";
  const freq = freqLabel.toLowerCase();
  const annual = r.totalPayment * r.perYear;
  // Matches the figure the panel shows, so the email cannot say something
  // different from the page it came from.
  const interestByPart = interestInFirstYearByPart(snapshot.parts, r.perYear, snapshot.loanYears);
  const annualInterest = interestByPart.reduce((sum, n) => sum + n, 0);
  const name = esc(firstName.trim());
  const partCount = snapshot.parts.length;

  const partRows = snapshot.parts
    .map((part, i) => {
      const pr = r.parts[i];
      // The interest-only tag is built as a template literal, not a quoted
      // string: a plain string would ship the literal text "${MUTED}" into the
      // style attribute instead of the colour.
      const tag =
        part.type === "io"
          ? ` <span style="font-size:10px;text-transform:uppercase;color:${MUTED};">int. only</span>`
          : "";
      return `<tr>
        ${td(`Part ${i + 1}${tag}`, "left", true)}
        ${td(nzd(part.amount), "right")}
        ${td(`${part.rate.toFixed(2)}%`, "right")}
        ${td(`${part.fixedYears} yr${part.fixedYears === 1 ? "" : "s"}`, "right")}
        ${td(nzd(pr.totalPayment, 2), "right", true)}
        ${td(nzd(interestByPart[i]), "right")}
      </tr>`;
    })
    .join("");

  /*
   * Which parts clear early, and by how much. Only the extra repayment can do
   * this, so the line simply does not appear on a structure without one.
   */
  const earlyParts = snapshot.parts
    .map((part, i) => ({ n: i + 1, r: r.parts[i] }))
    .filter(({ r: pr }) => pr.clears && pr.periodsSaved > 0);

  const earlyLine = earlyParts.length
    ? `<p style="margin:8px 0 0;font-size:12px;line-height:19px;color:${MUTED};">
         Paying extra clears
         ${earlyParts
           .map(
             ({ n, r: pr }) =>
               `<strong style="color:${NAVY};">part ${n}</strong> in ${describeDuration(pr.periods, r.perYear)}`,
           )
           .join(", ")}
         &mdash; against the full ${snapshot.loanYears} years it would otherwise take.
       </p>`
    : "";

  const partsTable = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:24px;border:1px solid ${CONCRETE};border-collapse:collapse;">
      <tr><td colspan="6" style="padding:18px 10px 10px;">
        <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${MUTED};">Your structure, part by part</p>
      </td></tr>
      <tr>
        ${th("Part")}
        ${th("Amount", "right")}
        ${th("Rate", "right")}
        ${th("Fixed", "right")}
        ${th(`Repayment`, "right")}
        ${th("Interest / yr", "right")}
      </tr>
      ${partRows}
      <tr style="background-color:${FOG};">
        ${td("Total", "left", true)}
        ${td(nzd(r.totalPrincipal), "right", true)}
        ${td(`${r.weightedAverageRate.toFixed(2)}%`, "right", true)}
        ${td("&mdash;", "right")}
        ${td(nzd(r.totalPayment, 2), "right", true)}
        ${td(nzd(annualInterest), "right", true)}
      </tr>
      <tr><td colspan="6" style="padding:12px 10px 16px;">
        <p style="margin:0;font-size:12px;line-height:19px;color:${MUTED};">
          Repayments are ${freq}. <strong>Interest / yr</strong> is what each part costs in interest
          over its first twelve months. The total rate is the weighted average &mdash; each rate
          counted by how much of the loan sits on it.
        </p>
        ${earlyLine}
      </td></tr>
    </table>`;

  const cappedNote = r.anyExtraCapped
    ? `
    <p style="margin:0 0 20px;padding:14px 16px;background-color:#FDF4E6;border-left:3px solid ${AMBER};font-size:13px;line-height:21px;color:${NAVY};">
      One of your extra repayments was trimmed to ${EXTRA_CAP_PERCENT}% of that part per year. On a
      <strong>fixed</strong> rate most lenders charge a break cost above roughly that. Your exact
      allowance is in your loan contract.
    </p>`
    : "";

  /*
   * The guide link goes here as well as in the MailerLite welcome automation,
   * and that repetition is deliberate: an automation fires once per subscriber,
   * ever, so anyone already on the list gets nothing from it. This is the copy
   * that always arrives.
   */
  const guideLine = guideReady
    ? `<p style="margin:0 0 12px;font-size:15px;line-height:24px;color:#3f4a5a;">
         And here is <strong style="color:${NAVY};">${esc(guideTitle)}</strong>.
       </p>
       ${
         guideUrl
           ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
                <tr><td style="border:1px solid ${CONCRETE};">
                  <a href="${guideUrl}" style="display:inline-block;padding:12px 22px;font-size:14px;font-weight:700;color:${NAVY};text-decoration:none;">
                    Read the guide &rarr;
                  </a>
                </td></tr>
              </table>`
           : ""
       }`
    : `<p style="margin:0 0 20px;font-size:15px;line-height:24px;color:#3f4a5a;">
         ${
           pendingNote
             ? esc(pendingNote)
             : `I am finishing a short guide called <strong style="color:${NAVY};">${esc(guideTitle)}</strong>. You will get it the moment it is done.`
         }
       </p>`;

  const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Your split home loan numbers</title>
</head>
<body style="margin:0;padding:0;background-color:${FOG};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${nzd(r.totalPayment, 2)} ${freq} across ${partCount} parts, ${nzd(r.totalPrincipal)} at ${r.weightedAverageRate.toFixed(2)}% average.</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${FOG};">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:100%;font-family:Helvetica,Arial,sans-serif;">

  <tr><td style="background-color:${NAVY};padding:28px 32px;">
    <p style="margin:0;font-size:18px;font-weight:700;letter-spacing:1px;color:#ffffff;">VALAR</p>
    <p style="margin:2px 0 0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${STEEL};">Financial Advisors</p>
  </td></tr>

  <tr><td style="background-color:#ffffff;padding:32px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td width="32" height="2" style="background-color:${AMBER};font-size:0;line-height:0;">&nbsp;</td>
    </tr></table>
    <h1 style="margin:16px 0 12px;font-size:24px;line-height:32px;font-weight:700;color:${NAVY};">
      ${name ? `${name}, here` : "Here"} is your split<span style="color:${AMBER};">.</span>
    </h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:24px;color:#3f4a5a;">
      This is the structure you built on the Valar split home loan calculator &mdash;
      ${nzd(r.totalPrincipal)} across ${partCount} part${partCount === 1 ? "" : "s"}, over
      ${snapshot.loanYears} years &mdash; so you have it in writing rather than in a browser tab you
      are about to close.
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${NAVY};">
      <tr><td style="padding:28px 24px;">
        <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${AMBER};">
          Your ${freq} repayment
        </p>
        <p style="margin:0;font-size:34px;line-height:40px;font-weight:700;color:#ffffff;">${nzd(r.totalPayment, 2)}</p>
        ${
          r.totalExtra > 0
            ? `<p style="margin:6px 0 0;font-size:13px;color:${LILAC};">${nzd(r.totalBasePayment, 2)} required, plus ${nzd(r.totalExtra, 2)} extra</p>`
            : ""
        }

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:22px;border-top:1px solid #2a3a5c;">
          <tr><td colspan="2" style="height:16px;font-size:0;line-height:0;">&nbsp;</td></tr>
          ${row("Paid per year", nzd(annual))}
          ${row("Total borrowed", nzd(r.totalPrincipal))}
          ${row("Weighted average rate", `${r.weightedAverageRate.toFixed(2)}%`)}
          ${row(
            "First re-fix",
            r.nextRefixYears > 0
              ? `${r.nextRefixYears} yr${r.nextRefixYears === 1 ? "" : "s"} &middot; ${nzd(r.nextRefixAmount)}`
              : "&mdash;",
          )}
          ${row("Interest paid per year", nzd(annualInterest))}
          ${r.totalInterestSaved >= 1 ? row("Interest saved by the extra repayments", nzd(r.totalInterestSaved)) : ""}
          ${r.totalBalanceRemaining >= 1 ? row(`Still owing after ${snapshot.loanYears} years`, nzd(r.totalBalanceRemaining)) : ""}
        </table>
      </td></tr>
    </table>

    ${partsTable}

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:24px;border:1px solid ${CONCRETE};">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${MUTED};">The one thing worth re-reading</p>
        <p style="margin:0;font-size:14px;line-height:22px;color:#3f4a5a;">
          <strong style="color:${NAVY};">Fixed for is not the loan term.</strong> A part fixed for one
          year is not repaid in a year &mdash; it amortises over the full ${snapshot.loanYears} years
          like every other part. After that year it comes off its rate and has to be re-fixed at
          whatever the market is then. That is the date to have in your calendar, and it is the
          reason a split exists at all.
        </p>
      </td></tr>
    </table>

    <p style="margin:24px 0 20px;font-size:13px;line-height:21px;color:${MUTED};">
      Two of these numbers are known and one is not. The repayment and the interest before your first
      re-fix are real &mdash; those rates are locked. Anything covering the full
      ${snapshot.loanYears} years assumes today&rsquo;s rates hold the whole way, which they will
      not. Use it to compare one structure against another, never as a forecast.
    </p>

    ${cappedNote}
    ${guideLine}

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:8px;border:1px solid ${CONCRETE};background-color:${FOG};">
      <tr><td style="padding:22px 24px;">
        <h2 style="margin:0 0 8px;font-size:17px;line-height:24px;font-weight:700;color:${NAVY};">
          A structure is a decision, not a calculation<span style="color:${AMBER};">.</span>
        </h2>
        <p style="margin:0 0 16px;font-size:14px;line-height:22px;color:#3f4a5a;">
          Which terms to pick against the current curve, how much to leave floating, and where the
          extra repayment is doing the most work &mdash; that is the conversation a calculator cannot
          have.
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
      Indicative only. Rates, available terms, split minimums and early-repayment allowances differ
      by lender and by contract &mdash; this is a comparison tool, not a quote, and not personalised
      advice on any particular loan.
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
    name ? `${name}, here is your split.` : "Here is your split.",
    "",
    `${nzd(r.totalPrincipal)} across ${partCount} part${partCount === 1 ? "" : "s"}, over ${snapshot.loanYears} years.`,
    "",
    `Your ${freq} repayment: ${nzd(r.totalPayment, 2)}`,
    r.totalExtra > 0
      ? `  (${nzd(r.totalBasePayment, 2)} required, plus ${nzd(r.totalExtra, 2)} extra)`
      : "",
    `Paid per year: ${nzd(annual)}`,
    `Weighted average rate: ${r.weightedAverageRate.toFixed(2)}%`,
    r.nextRefixYears > 0
      ? `First re-fix: ${r.nextRefixYears} yr${r.nextRefixYears === 1 ? "" : "s"} — ${nzd(r.nextRefixAmount)} comes off its rate`
      : "",
    `Interest paid per year: ${nzd(annualInterest)}`,
    "",
    "Part by part:",
    ...snapshot.parts.map((part, i) => {
      const pr = r.parts[i];
      return `  Part ${i + 1}: ${nzd(part.amount)} at ${part.rate.toFixed(2)}% fixed ${part.fixedYears} yr${part.fixedYears === 1 ? "" : "s"} — ${nzd(pr.totalPayment, 2)} ${freq}, ${nzd(interestByPart[i])} interest a year`;
    }),
    earlyParts.length
      ? `Paying extra clears ${earlyParts
          .map(({ n, r: pr }) => `part ${n} in ${describeDuration(pr.periods, r.perYear)}`)
          .join(", ")} — against the full ${snapshot.loanYears} years it would otherwise take.`
      : "",
    "",
    "Fixed for is not the loan term. A part fixed for one year is not repaid in a year — it amortises over the full term like every other part, then comes off its rate and has to be re-fixed at whatever the market is then.",
    "",
    guideReady && guideUrl ? `${guideTitle}: ${guideUrl}` : pendingNote || "",
    `Book a clarity call: ${baseUrl}/book`,
    "",
    "Indicative only. Rates, available terms, split minimums and early-repayment allowances differ by lender and by contract — this is a comparison tool, not a quote, and not personalised advice on any particular loan.",
    "",
    "Valar Financial Advisors Limited (FSP1012862) holds a Financial Advice Provider licence issued by the FMA. Financial advice is provided by Lena Bykova, Director and Financial Adviser (FSP1010055). Disclosure statement: valar.co.nz/disclosure",
  ]
    .filter((line) => line !== "")
    .join("\n");

  return {
    subject: `Your split: ${nzd(r.totalPayment, 2)} ${freq} across ${partCount} part${partCount === 1 ? "" : "s"}`,
    html,
    text,
  };
}
