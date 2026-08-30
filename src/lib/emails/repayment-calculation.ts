/*
 * The email a visitor gets back after asking for their figures in writing.
 *
 * Written as table-and-inline-style HTML rather than the site's Tailwind:
 * Outlook renders through Word, which supports neither flexbox nor grid nor a
 * <style> block reliably, so anything laid out the way the page is laid out
 * arrives as one column of unstyled text. Every rule here is inline and every
 * row is a table cell on purpose — it is ugly source for a reason.
 *
 * It carries the same numbers the calculator showed and the same disclaimer,
 * because it is the same content: an indicative comparison, not a quote and
 * not advice on a particular loan.
 */

import { SITE_URL } from "@/lib/schema";
import { calculateRepayments } from "@/lib/repayments";
import { describeDuration, EXTRA_CAP_PERCENT, FREQUENCIES } from "@/lib/split-loan";
import { nzd, repaymentReportPath, type RepaymentSnapshot } from "@/lib/repayment-report";

const NAVY = "#061634";
const AMBER = "#E8A23A";
const LILAC = "#C8CBE3";
const STEEL = "#8F93B5";
const CONCRETE = "#C9CED6";
const FOG = "#F6F7F9";
const HORIZON = "#6F88C4";

/*
 * Steel reads fine as a label on the navy panels but only reaches about 3:1 on
 * white, which is under the floor for body-sized text. Small print on a light
 * ground uses this instead — same family, dark enough to actually be read.
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

export type RepaymentEmail = { subject: string; html: string; text: string };

export function renderRepaymentEmail({
  firstName,
  snapshot,
  guideTitle,
  guideReady,
  guideUrl,
  baseUrl = SITE_URL,
}: {
  firstName: string;
  snapshot: RepaymentSnapshot;
  guideTitle: string;
  guideReady: boolean;
  /** Absolute URL of the guide PDF, when there is one. */
  guideUrl?: string;
  /**
   * Where the links point. Defaults to the live site; a local run passes its
   * own origin so a test send is actually clickable, instead of sending the
   * tester to a production URL the change has not reached yet.
   */
  baseUrl?: string;
}): RepaymentEmail {
  const r = calculateRepayments(snapshot);
  const freqLabel = FREQUENCIES.find((f) => f.key === snapshot.frequency)?.label ?? "Fortnightly";
  const usingExtra = r.extraPerPeriod > 0;
  const clearsEarly = usingExtra && r.periods < r.scheduledPeriods;
  const interestPct = Math.round(r.interestShare * 100);
  const reportUrl = `${baseUrl}${repaymentReportPath(snapshot)}`;
  const name = esc(firstName.trim());

  const extraInput =
    snapshot.extraMode === "percent"
      ? `${snapshot.extraValue}% of the loan a year`
      : `${nzd(snapshot.extraValue)} per payment`;

  /*
   * The interest-share bar: two table cells with background colours and
   * percentage widths, which is the one thing Outlook does honour. A div with
   * a coloured background and a width collapses there.
   */
  const shareBar = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:20px;">
      <tr>
        <td width="${100 - interestPct}%" height="8" style="background-color:${HORIZON};font-size:0;line-height:0;">&nbsp;</td>
        <td width="${interestPct}%" height="8" style="background-color:${AMBER};font-size:0;line-height:0;">&nbsp;</td>
      </tr>
      <tr>
        <td style="padding-top:8px;font-size:12px;color:${LILAC};">Amount borrowed</td>
        <td align="right" style="padding-top:8px;font-size:12px;color:${LILAC};">Interest &middot; ${interestPct}%</td>
      </tr>
    </table>`;

  const earlyBlock = clearsEarly
    ? `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:24px;background-color:#152444;">
      <tr>
        <td style="padding:16px;">
          <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${AMBER};">
            Paying ${snapshot.extraMode === "amount" ? nzd(r.extraPerPeriod) : `${snapshot.extraValue}%`} extra
          </p>
          <p style="margin:0;font-size:14px;line-height:22px;color:#ffffff;">
            Clears the loan <strong>${describeDuration(r.periodsSaved, r.perYear)}</strong> early
            and saves <strong>${nzd(r.interestSaved)}</strong> in interest.
          </p>
        </td>
      </tr>
    </table>`
    : "";

  const allowanceNote = r.overAllowance
    ? `
    <p style="margin:0 0 20px;padding:14px 16px;background-color:#FDF4E6;border-left:3px solid ${AMBER};font-size:13px;line-height:21px;color:${NAVY};">
      Worth knowing: that extra payment is more than ${EXTRA_CAP_PERCENT}% of the loan a year. On a
      <strong>fixed</strong> rate most lenders charge a break cost above roughly that, so the saving
      above may not be available to you as it stands. On a <strong>floating</strong> loan there is
      usually no limit at all. Your exact allowance is in your loan contract.
    </p>`
    : "";

  /*
   * The guide link goes in this email as well as in the MailerLite welcome
   * automation, and that repetition is deliberate. A MailerLite automation
   * fires once per subscriber, ever — so anyone who has already been through a
   * Valar form gets nothing from it. This is the copy that always arrives.
   */
  const guideLine = guideReady
    ? `<p style="margin:0 0 12px;font-size:15px;line-height:24px;color:#3f4a5a;">
         And here is <strong style="color:${NAVY};">${esc(guideTitle)}</strong> &mdash;
         the things that actually move this number, in the order worth doing them.
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
         I am finishing a short guide called <strong style="color:${NAVY};">${esc(guideTitle)}</strong> &mdash;
         the things that actually move this number, in the order worth doing them. You will get it the
         moment it is done.
       </p>`;

  const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Your mortgage repayment figures</title>
</head>
<body style="margin:0;padding:0;background-color:${FOG};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${nzd(r.totalPayment, 2)} ${freqLabel.toLowerCase()} on ${nzd(snapshot.amount)} at ${snapshot.rate.toFixed(2)}%.</div>
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
      ${name ? `${name}, here` : "Here"} are your figures<span style="color:${AMBER};">.</span>
    </h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:24px;color:#3f4a5a;">
      This is the calculation you ran on the Valar repayments calculator, so you have it in writing
      rather than in a browser tab you are about to close.
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${NAVY};">
      <tr><td style="padding:28px 24px;">
        <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${AMBER};">
          Your ${freqLabel.toLowerCase()} repayment
        </p>
        <p style="margin:0;font-size:34px;line-height:40px;font-weight:700;color:#ffffff;">${nzd(r.totalPayment, 2)}</p>
        ${
          usingExtra
            ? `<p style="margin:6px 0 0;font-size:13px;color:${LILAC};">${nzd(r.basePayment, 2)} required, plus ${nzd(r.extraPerPeriod, 2)} extra</p>`
            : ""
        }

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:22px;border-top:1px solid #2a3a5c;">
          <tr><td colspan="2" style="height:16px;font-size:0;line-height:0;">&nbsp;</td></tr>
          ${row("Paid per year", nzd(r.totalPayment * r.perYear))}
          ${row("Total interest", nzd(r.totalInterest))}
          ${row("Total repaid", nzd(r.totalPaid))}
        </table>
        ${shareBar}
        ${earlyBlock}
      </td></tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:24px;border:1px solid ${CONCRETE};">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${MUTED};">What this is based on</p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr><td style="padding:5px 0;font-size:14px;color:#3f4a5a;">Loan amount</td><td align="right" style="padding:5px 0;font-size:14px;font-weight:700;color:${NAVY};">${nzd(snapshot.amount)}</td></tr>
          <tr><td style="padding:5px 0;font-size:14px;color:#3f4a5a;">Interest rate</td><td align="right" style="padding:5px 0;font-size:14px;font-weight:700;color:${NAVY};">${snapshot.rate.toFixed(2)}%</td></tr>
          <tr><td style="padding:5px 0;font-size:14px;color:#3f4a5a;">Loan term</td><td align="right" style="padding:5px 0;font-size:14px;font-weight:700;color:${NAVY};">${snapshot.years} years</td></tr>
          <tr><td style="padding:5px 0;font-size:14px;color:#3f4a5a;">Repayment frequency</td><td align="right" style="padding:5px 0;font-size:14px;font-weight:700;color:${NAVY};">${freqLabel}</td></tr>
          <tr><td style="padding:5px 0;font-size:14px;color:#3f4a5a;">Extra repayment</td><td align="right" style="padding:5px 0;font-size:14px;font-weight:700;color:${NAVY};">${usingExtra ? extraInput : "None"}</td></tr>
        </table>
      </td></tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 10px;">
      <tr><td style="background-color:${NAVY};">
        <a href="${reportUrl}" style="display:inline-block;padding:14px 26px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">
          Open the printable version &rarr;
        </a>
      </td></tr>
    </table>
    <p style="margin:0 0 24px;font-size:13px;line-height:20px;color:${MUTED};">
      One A4 page &mdash; print it, or save it as a PDF.
    </p>

    ${allowanceNote}
    ${guideLine}

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:8px;border:1px solid ${CONCRETE};background-color:${FOG};">
      <tr><td style="padding:22px 24px;">
        <h2 style="margin:0 0 8px;font-size:17px;line-height:24px;font-weight:700;color:${NAVY};">
          Knowing the repayment is not the same as knowing the structure<span style="color:${AMBER};">.</span>
        </h2>
        <p style="margin:0 0 16px;font-size:14px;line-height:22px;color:#3f4a5a;">
          How the loan is split, what you fix and for how long, and where the extra payment should
          actually go &mdash; that is the conversation a calculator cannot have.
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
      Indicative only. It assumes the rate stays fixed for the full term, which it will not &mdash;
      this is a comparison tool, not a quote, and not personalised advice on any particular loan.
    </p>
  </td></tr>

  <tr><td style="background-color:${NAVY};padding:24px 32px;">
    <p style="margin:0 0 6px;font-size:13px;line-height:20px;color:${LILAC};">
      Lena Bykova &middot; Valar Financial Advisors &middot;
      <a href="${SITE_URL}" style="color:#ffffff;text-decoration:underline;">valar.co.nz</a>
    </p>
    <p style="margin:0;font-size:11px;line-height:18px;color:${STEEL};">
      Lena Bykova (FSP1010055) trades as Valar Financial Advisors. A disclosure statement is
      available free of charge on request.<br>
      You are receiving this because you asked for these figures on our calculator.
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`;

  const text = [
    name ? `${name}, here are your figures.` : "Here are your figures.",
    "",
    `Your ${freqLabel.toLowerCase()} repayment: ${nzd(r.totalPayment, 2)}`,
    usingExtra ? `  (${nzd(r.basePayment, 2)} required, plus ${nzd(r.extraPerPeriod, 2)} extra)` : "",
    `Paid per year: ${nzd(r.totalPayment * r.perYear)}`,
    `Total interest: ${nzd(r.totalInterest)}`,
    `Total repaid: ${nzd(r.totalPaid)} — interest is ${interestPct}% of it`,
    clearsEarly
      ? `\nPaying extra clears the loan ${describeDuration(r.periodsSaved, r.perYear)} early and saves ${nzd(r.interestSaved)} in interest.`
      : "",
    "",
    "Based on:",
    `  Loan amount: ${nzd(snapshot.amount)}`,
    `  Interest rate: ${snapshot.rate.toFixed(2)}%`,
    `  Loan term: ${snapshot.years} years`,
    `  Repayment frequency: ${freqLabel}`,
    `  Extra repayment: ${usingExtra ? extraInput : "None"}`,
    "",
    `Printable version: ${reportUrl}`,
    guideReady && guideUrl ? `${guideTitle}: ${guideUrl}` : "",
    `Book a clarity call: ${baseUrl}/book`,
    "",
    "Indicative only. It assumes the rate stays fixed for the full term, which it will not — this is a comparison tool, not a quote, and not personalised advice on any particular loan.",
    "",
    "Lena Bykova (FSP1010055) trades as Valar Financial Advisors. A disclosure statement is available free of charge on request.",
  ]
    .filter((line) => line !== "")
    .join("\n");

  return {
    subject: `Your ${freqLabel.toLowerCase()} repayment: ${nzd(r.totalPayment, 2)}`,
    html,
    text,
  };
}
