/*
 * The email a visitor gets back from the payment-first "How much can I
 * borrow?" calculator (2026-09-24).
 *
 * Same build as repayment-calculation.ts: tables and inline styles only,
 * because Outlook renders through Word. Same content as the page, in the same
 * order: the loan, the payment load, the stress test at 7%, then the inputs.
 */

import { SITE_URL } from "@/lib/schema";
import { calculateBorrow, STRESS_RATE } from "@/lib/borrow-from-payment";
import { money } from "@/lib/affordability";
import { FREQUENCIES } from "@/lib/split-loan";
import type { BorrowSnapshot } from "@/lib/borrow-report";

const NAVY = "#061634";
const AMBER = "#E8A23A";
const LILAC = "#C8CBE3";
const STEEL = "#8F93B5";
const CONCRETE = "#C9CED6";
const FOG = "#F6F7F9";
/** Small print on white: steel only reaches ~3:1 there. */
const MUTED = "#5A6478";

/** The band tag colours, as on the page's scale. */
const BAND_TAG: Record<string, { bg: string; ink: string }> = {
  Comfortable: { bg: "#059669", ink: "#ffffff" },
  Manageable: { bg: "#059669", ink: "#ffffff" },
  Stretched: { bg: AMBER, ink: NAVY },
  "High pressure": { bg: "#F97316", ink: "#ffffff" },
};

const PERIOD_WORD = { weekly: "week", fortnightly: "fortnight", monthly: "month" } as const;

function esc(s: string): string {
  const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return s.replace(/[&<>"']/g, (c) => map[c]);
}

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:6px 0;font-size:14px;color:${LILAC};">${label}</td>
      <td align="right" style="padding:6px 0;font-size:14px;font-weight:700;color:#ffffff;">${value}</td>
    </tr>`;
}

function inputRow(label: string, value: string) {
  return `<tr><td style="padding:5px 0;font-size:14px;color:#3f4a5a;">${label}</td><td align="right" style="padding:5px 0;font-size:14px;font-weight:700;color:${NAVY};">${value}</td></tr>`;
}

function tag(label: string) {
  const t = BAND_TAG[label] ?? BAND_TAG.Manageable;
  return `<span style="display:inline-block;padding:3px 10px;background-color:${t.bg};color:${t.ink};font-size:12px;font-weight:700;">${label}</span>`;
}

export type BorrowEmail = { subject: string; html: string; text: string };

export function renderBorrowEmail({
  firstName,
  snapshot,
  guideTitle,
  guideReady,
  guideUrl,
  pendingNote,
  baseUrl = SITE_URL,
}: {
  firstName: string;
  snapshot: BorrowSnapshot;
  guideTitle: string;
  guideReady: boolean;
  guideUrl?: string;
  pendingNote?: string;
  baseUrl?: string;
}): BorrowEmail {
  const r = calculateBorrow(snapshot);
  const per = PERIOD_WORD[snapshot.frequency];
  const freqLabel = FREQUENCIES.find((f) => f.key === snapshot.frequency)?.label ?? "Monthly";
  const pct = (n: number) => `${Math.round(n * 100)}%`;
  const name = esc(firstName.trim());
  const debtFree = r.debtFree.toLocaleString("en-NZ", { month: "short", year: "numeric" });
  const atStress = snapshot.rate >= STRESS_RATE;

  const loadBlock = r.hasIncome
    ? `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:24px;border:1px solid ${CONCRETE};">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${MUTED};">Your mortgage payment load</p>
        <p style="margin:0 0 10px;font-size:15px;line-height:24px;color:#3f4a5a;">
          <strong style="color:${NAVY};">${money(snapshot.payment)}</strong> is
          <strong style="color:${NAVY};">${pct(r.share)}</strong> of your take-home pay.
        </p>
        ${tag(r.band.label)}
      </td></tr>
    </table>`
    : "";

  const stressBlock = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:16px;background-color:#FDF4E6;border-left:3px solid ${AMBER};">
      <tr><td style="padding:18px 20px;">
        <p style="margin:0 0 6px;font-size:14px;font-weight:700;color:${NAVY};">If rates reach ${STRESS_RATE}%</p>
        <p style="margin:0;font-size:14px;line-height:22px;color:#3f4a5a;">
          ${
            atStress
              ? `Your rate is already at or above ${STRESS_RATE}%, the level lenders test at.`
              : `The same ${money(r.loan)} would cost <strong style="color:${NAVY};">${money(r.stress.payment)}</strong> a ${per},
                 <strong style="color:${NAVY};">${money(r.stress.rise)} more</strong>.${
                   r.hasIncome
                     ? ` That is <strong style="color:${NAVY};">${pct(r.stress.share)}</strong> of your take-home pay.`
                     : ""
                 }`
          }
        </p>
        ${!atStress && r.hasIncome ? `<p style="margin:10px 0 0;">${tag(r.stress.band.label)}</p>` : ""}
      </td></tr>
    </table>`;

  const bandsNote = `
    <p style="margin:20px 0 0;font-size:13px;line-height:21px;color:#3f4a5a;">
      <strong style="color:${NAVY};">What the bands mean.</strong>
      Comfortable (up to 30%): a good buffer in your cashflow.
      Manageable (30&ndash;40%): usually workable, depends on your other costs.
      Stretched (40&ndash;50%): sensitive to rising rates or costs.
      High pressure (above 50%): little room for rate rises, income changes or surprises.
    </p>
    <p style="margin:8px 0 0;font-size:13px;line-height:21px;color:#3f4a5a;">
      <strong style="color:${NAVY};">A guide, not a rule.</strong> The higher your income, the bigger the
      share that can go to a mortgage: food, power and basics don&rsquo;t rise with pay. A bank may lend
      you more, but you don&rsquo;t have to take it.
    </p>`;

  /*
   * The guide link repeats the MailerLite automation on purpose: that fires
   * once per subscriber, ever, and this copy always arrives.
   */
  const guideLine = guideReady
    ? `<p style="margin:24px 0 12px;font-size:15px;line-height:24px;color:#3f4a5a;">
         And here is <strong style="color:${NAVY};">${esc(guideTitle)}</strong>: the things that
         actually move the numbers, in the order worth doing them.
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
    : `<p style="margin:24px 0 20px;font-size:15px;line-height:24px;color:#3f4a5a;">
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
<title>What your payment could borrow</title>
</head>
<body style="margin:0;padding:0;background-color:${FOG};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${money(snapshot.payment)} a ${per} at ${snapshot.rate}% could carry a loan of ${money(r.loan)}.</div>
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
      ${name ? `${name}, here` : "Here"} are your numbers<span style="color:${AMBER};">.</span>
    </h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:24px;color:#3f4a5a;">
      This is the calculation you ran on the Valar borrowing calculator. It starts from the payment
      you&rsquo;d be comfortable with and shows the loan it carries.
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${NAVY};">
      <tr><td style="padding:28px 24px;">
        <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${AMBER};">
          You could borrow
        </p>
        <p style="margin:0;font-size:34px;line-height:40px;font-weight:700;color:#ffffff;">${money(r.loan)}</p>
        <p style="margin:6px 0 0;font-size:13px;color:${LILAC};">Paying ${money(snapshot.payment)} a ${per} at ${snapshot.rate}% over ${snapshot.years} years.</p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:22px;border-top:1px solid #2a3a5c;">
          <tr><td colspan="2" style="height:16px;font-size:0;line-height:0;">&nbsp;</td></tr>
          ${row("Total interest", money(r.totalInterest))}
          ${row("Total repaid", money(r.totalRepaid))}
          ${row("Debt-free by", debtFree)}
        </table>
      </td></tr>
    </table>

    ${loadBlock}
    ${stressBlock}
    ${bandsNote}

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:24px;border:1px solid ${CONCRETE};">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${MUTED};">What this is based on</p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          ${r.hasIncome ? inputRow(`Take-home pay per ${per}`, money(snapshot.income)) : ""}
          ${inputRow(`Mortgage payment per ${per}`, money(snapshot.payment))}
          ${inputRow("Interest rate", `${snapshot.rate}%`)}
          ${inputRow("Loan term", `${snapshot.years} years`)}
          ${inputRow("Repayment frequency", freqLabel)}
        </table>
      </td></tr>
    </table>

    ${guideLine}

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:8px;border:1px solid ${CONCRETE};background-color:${FOG};">
      <tr><td style="padding:22px 24px;">
        <h2 style="margin:0 0 8px;font-size:17px;line-height:24px;font-weight:700;color:${NAVY};">
          Two lenders will give you two different numbers<span style="color:${AMBER};">.</span>
        </h2>
        <p style="margin:0 0 16px;font-size:14px;line-height:22px;color:#3f4a5a;">
          Lender, rate and loan structure all change the answer. That is the conversation a
          calculator cannot have.
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
      Indicative only. It assumes the rate stays the same for the full term. This is a guide, not a
      quote, and not personalised advice. What you can actually borrow is confirmed by a lender
      after a full application.
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
    `You could borrow: ${money(r.loan)}`,
    `Paying ${money(snapshot.payment)} a ${per} at ${snapshot.rate}% over ${snapshot.years} years.`,
    `Total interest: ${money(r.totalInterest)}`,
    `Total repaid: ${money(r.totalRepaid)}`,
    `Debt-free by: ${debtFree}`,
    "",
    r.hasIncome ? `Payment load: ${pct(r.share)} of take-home pay (${r.band.label}).` : "",
    atStress
      ? `Your rate is already at or above ${STRESS_RATE}%.`
      : `At ${STRESS_RATE}%: ${money(r.stress.payment)} a ${per}, ${money(r.stress.rise)} more${
          r.hasIncome ? `, ${pct(r.stress.share)} of take-home pay (${r.stress.band.label})` : ""
        }.`,
    "",
    "Bands: up to 30% comfortable, 30-40% manageable, 40-50% stretched, above 50% high pressure. A guide, not a rule: the higher your income, the bigger the share that can go to a mortgage.",
    "",
    guideReady && guideUrl ? `${guideTitle}: ${guideUrl}` : pendingNote || "",
    `Book a clarity call: ${baseUrl}/book`,
    "",
    "Indicative only. Not a quote and not personalised advice. What you can actually borrow is confirmed by a lender after a full application.",
    "",
    "Valar Financial Advisors Limited (FSP1012862) holds a Financial Advice Provider licence issued by the FMA. Financial advice is provided by Lena Bykova, Director and Financial Adviser (FSP1010055). Disclosure statement: valar.co.nz/disclosure",
  ]
    .filter((line) => line !== "")
    .join("\n");

  return {
    subject: `You could borrow ${money(r.loan)}`,
    html,
    text,
  };
}
