/*
 * The email someone gets back after asking for their borrowing numbers in
 * writing: the sibling of repayment-calculation.ts and split-calculation.ts.
 *
 * Written as table-and-inline-style HTML rather than the site's Tailwind:
 * Outlook renders through Word, which supports neither flexbox nor grid nor a
 * <style> block reliably, so anything laid out the way the page is laid out
 * arrives as one column of unstyled text. Every rule here is inline and every
 * row is a table cell on purpose. It is ugly source for a reason.
 *
 * It mirrors the results panel block for block. Until 2026-09-14 it still
 * carried the 20% / 10% / 5% deposit table and the verdict paragraphs the page
 * dropped on 09-10, so what arrived was not what Lena had just been looking at.
 * The order is the page's:
 *   1. the loan and the price, with the deposit and LVR line
 *   2. the counterweight: what a lender could stretch to is not a target
 *   3. what it costs a month, repayment pressure, the take-home bar
 *   4. examples by repayment pressure
 * then what it was based on, the guide, the call and the disclaimer.
 *
 * The page keeps two explanations behind a click (the LVR footnote and "What
 * it means"). An email cannot open anything, so the one-line LVR definition is
 * printed and the longer explainer is left out, as it is on screen until asked
 * for.
 */

import { SITE_URL } from "@/lib/schema";
import { calculate, money } from "@/lib/affordability";
import {
  inputsFromSnapshot,
  type AffordabilitySnapshot,
} from "@/lib/affordability-report";

const NAVY = "#061634";
const AMBER = "#E8A23A";
const LILAC = "#C8CBE3";
const STEEL = "#8F93B5";
const CONCRETE = "#C9CED6";
const FOG = "#F6F7F9";
const BODY = "#3f4a5a";

/*
 * Steel reads fine as a label on the navy panels but only reaches about 3:1 on
 * white, which is under the floor for body-sized text. Small print on a light
 * ground uses this instead: same family, dark enough to actually be read.
 */
const MUTED = "#5A6478";

/*
 * The page builds these tints with opacity. Email clients that ignore rgba get
 * them flattened onto white instead.
 */
const AMBER_TINT = "#FDF6EB"; // valar-amber at 10%
const LILAC_TINT = "#E9EAF4"; // valar-lilac at 40%
const RISE = "#B4410C"; // the rise beside the 7% repayment, orange rather than red

/*
 * Word for word the line under the caution on screen. Lena wanted it in the
 * email too (2026-09-14), not only in the footer disclaimer.
 */
const INDICATIVE =
  "All these figures are indicative and not guaranteed. For a real assessment, talk to a mortgage adviser or your bank directly.";

/* The repayment-pressure scale, coloured as on screen. */
const SCALE = [
  { label: "Comfortable", range: "to 30%", bg: "#059669", fg: "#ffffff" },
  { label: "Manageable", range: "30&ndash;40%", bg: "#059669", fg: "#ffffff" },
  { label: "Stretched", range: "40&ndash;50%", bg: AMBER, fg: NAVY },
  { label: "High risk", range: "50%+", bg: "#F97316", fg: "#ffffff" },
];

/* The take-home bar's fills: the pair the page validated for this ground. */
const SPLIT = { mortgage: "#4A6BAF", owed: "#D0567E", left: "#FFFFFF" };

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

/** The small uppercase label over each block, as on the page. */
function eyebrow(text: string) {
  return `<p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${AMBER};">${text}</p>`;
}

/** A table that is only there for layout. */
function layout(inner: string, style = "") {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"${
    style ? ` style="${style}"` : ""
  }>${inner}</table>`;
}

/** One line of the "what this is based on" panel. */
function input(label: string, value: string) {
  return `
    <tr>
      <td style="padding:5px 0;font-size:14px;color:${BODY};">${esc(label)}</td>
      <td align="right" style="padding:5px 0 5px 12px;font-size:14px;font-weight:700;color:${NAVY};">${esc(value)}</td>
    </tr>`;
}

export type AffordabilityEmail = { subject: string; html: string; text: string };

export function renderAffordabilityEmail({
  firstName,
  snapshot,
  guideTitle,
  guideReady,
  guideUrl,
  pendingNote,
  baseUrl = SITE_URL,
}: {
  firstName: string;
  snapshot: AffordabilitySnapshot;
  guideTitle: string;
  guideReady: boolean;
  /** Absolute URL of the guide PDF, when there is one. */
  guideUrl?: string;
  /**
   * What to say when there is no document. Not every magnet is one being
   * written (some are answered by Lena), so the default sentence is wrong for
   * them and this replaces it.
   */
  pendingNote?: string;
  /**
   * Where the links point. Defaults to the live site; a local run passes its
   * own origin so a test send is actually clickable.
   */
  baseUrl?: string;
}): AffordabilityEmail {
  const r = calculate(inputsFromSnapshot(snapshot));
  const name = esc(firstName.trim());
  const gross = snapshot.inc1 + snapshot.inc2;
  const ratePct = (r.expRate * 100).toFixed(2);
  const share = r.repaymentShare;
  const band = share.band;
  const hasLoans = r.debtMonthly > 0;
  const rise = r.payAtTest - r.payAtRate;
  const pct = (fraction: number) => `${Math.round(fraction * 100)}%`;

  // Which of the three limits is holding the loan: the line under it on screen.
  const cappedLine =
    r.best.cappedBy === "deposit"
      ? "What your deposit reaches"
      : r.dtiBinds
        ? "What your income supports"
        : "What your budget supports";

  // ---------- 1. the loan and the price ----------

  const figure = (label: string, value: string, note: string) => `
    <td valign="top" width="50%" style="padding:0 10px 0 0;">
      <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:${LILAC};">${label}</p>
      <p style="margin:0;font-size:26px;line-height:32px;font-weight:700;color:#ffffff;">${value}</p>
      <p style="margin:4px 0 0;font-size:12px;line-height:18px;color:${STEEL};">${note}</p>
    </td>`;

  /*
   * Blocked, the page shows only the headline. The email adds the engine's
   * short explanation of what to do about it, because a message that says
   * "not there" and nothing else is no use in an inbox.
   */
  const loanBlock = r.blocked
    ? `
      ${eyebrow("Indicative maximum")}
      <p style="margin:0;font-size:22px;line-height:30px;font-weight:700;color:#ffffff;">${esc(r.headline)}</p>
      <p style="margin:14px 0 0;font-size:15px;line-height:23px;font-weight:700;color:#ffffff;">${esc(r.title)}</p>
      ${r.body
        .map((p) => `<p style="margin:8px 0 0;font-size:14px;line-height:22px;color:${LILAC};">${esc(p)}</p>`)
        .join("")}`
    : `
      ${eyebrow("Indicative maximum")}
      ${layout(`<tr>
        ${figure("Loan", money(r.best.loan), cappedLine)}
        ${figure("Purchase price", money(r.best.price), "That loan plus your deposit")}
      </tr>`)}
      ${layout(
        `<tr><td style="padding-top:16px;font-size:14px;line-height:22px;color:${LILAC};">
          Your deposit of <strong style="color:#ffffff;">${money(r.best.deposit)}</strong> is
          <strong style="color:#ffffff;">${pct(r.best.depositPct)}</strong> of that price, so the LVR
          is <strong style="color:#ffffff;">${pct(r.best.lvr)}</strong>.
          <br><span style="font-size:12px;line-height:18px;color:${STEEL};">LVR, loan-to-value ratio: your loan as a share of the home&rsquo;s value.</span>
        </td></tr>`,
        "margin-top:18px;border-top:1px solid #2a3a5c;",
      )}`;

  // ---------- 2. the counterweight ----------

  const cautionBlock = r.caution
    ? `
    <tr><td style="padding:18px 24px;background-color:${AMBER_TINT};border-left:4px solid ${AMBER};">
      <p style="margin:0;font-size:14px;line-height:21px;font-weight:700;color:${NAVY};">${esc(r.caution.lead)}</p>
      <p style="margin:4px 0 0;font-size:14px;line-height:21px;color:${BODY};">${esc(r.caution.detail)}</p>
      <p style="margin:8px 0 0;font-size:12px;line-height:18px;color:${BODY};">${INDICATIVE}</p>
    </td></tr>`
    : "";

  // ---------- 3. what it costs, pressure, the take-home bar ----------

  const riseTag =
    rise >= 1
      ? ` <span style="font-size:13px;font-weight:700;color:${RISE};white-space:nowrap;">&#9650; ${money(rise)}</span>`
      : "";

  const cost = (value: string, extra: string, note: string) => `
    <td valign="top" width="50%" style="padding:0 10px 0 0;">
      <p style="margin:0;font-size:22px;line-height:28px;font-weight:700;color:${NAVY};">${value}${extra}</p>
      <p style="margin:2px 0 0;font-size:12px;line-height:18px;color:${MUTED};">${note}</p>
    </td>`;

  const pillBg = band.tone === "high" ? AMBER : band.tone === "warn" ? "#EBDCCB" : "#D2D5E1";
  const pill = `<span style="display:inline-block;padding:3px 10px;border-radius:999px;background-color:${pillBg};font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${NAVY};white-space:nowrap;">${band.label}</span>`;

  const line = (label: string, amount: string, percent: string, strong = false) => `
    <tr>
      <td style="padding:4px 0;font-size:14px;${strong ? `font-weight:700;color:${NAVY};` : `color:${BODY};`}">${label}</td>
      <td align="right" style="padding:4px 0 4px 12px;font-size:14px;${strong ? "font-weight:700;" : ""}color:${NAVY};white-space:nowrap;">${amount}</td>
      <td align="right" style="padding:4px 0 4px 12px;font-size:14px;${strong ? `font-weight:700;color:${NAVY};` : `color:${BODY};`}white-space:nowrap;">${percent}</td>
    </tr>`;

  const pressure = hasLoans
    ? `${layout(`
        ${line("Mortgage", money(r.payAtRate), `${share.mortgage}%`)}
        ${line("Cards &amp; other loans", money(r.debtMonthly), `${share.loans}%`)}
        <tr><td colspan="3" style="border-top:1px solid ${CONCRETE};height:4px;font-size:0;line-height:0;">&nbsp;</td></tr>
        ${line("All repayments", money(r.payAtRate + r.debtMonthly), `${share.all}%`, true)}
      `)}
      <p style="margin:8px 0 0;">${pill}</p>`
    : layout(`<tr>
        <td style="font-size:14px;font-weight:700;color:${NAVY};">${share.all}% of your take-home pay</td>
        <td align="right">${pill}</td>
      </tr>`);

  const scale = layout(
    `<tr>${SCALE.map((step, i) => {
      const on = step.label === band.label;
      return `<td align="center" width="25%" style="padding:6px 2px;background-color:${on ? step.bg : "#ffffff"};${
        i < SCALE.length - 1 ? `border-right:4px solid ${LILAC_TINT};` : ""
      }">
        <span style="display:block;font-size:9px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;color:${on ? step.fg : STEEL};">${step.label}</span>
        <span style="display:block;font-size:10px;color:${on ? step.fg : STEEL};">${step.range}</span>
      </td>`;
    }).join("")}</tr>`,
    "margin-top:12px;",
  );

  /*
   * The bar is a row of cells sized by percentage. The page labels a segment
   * only when it is wide enough to hold its figure; an email cannot measure
   * anything, so it labels every segment from 5% up, which still holds its
   * figure on a phone. The first cut-off was 8%, and it left Lena's 7% of cards
   * and loans blank in the bar (2026-09-14). The legend underneath always
   * carries every figure.
   */
  const segments = [
    { label: "Mortgage", pct: share.mortgage, amount: r.payAtRate, fill: SPLIT.mortgage, ink: "#ffffff" },
    { label: "Cards &amp; other loans", pct: share.loans, amount: r.debtMonthly, fill: SPLIT.owed, ink: NAVY },
    { label: "Left to live on", pct: r.leftToLive.pct, amount: r.leftToLive.atRate, fill: SPLIT.left, ink: NAVY },
  ].filter((s) => s.pct > 0);
  // Past 100%, with repayments above take-home pay, the bar is scaled to fit.
  const whole = Math.max(100, share.all);

  const bar = `
    ${layout(
      `<tr>${segments
        .map(
          (s, i) =>
            `<td width="${((s.pct / whole) * 100).toFixed(1)}%" height="28" align="center" style="height:28px;background-color:${s.fill};font-size:11px;font-weight:700;color:${s.ink};${
              i < segments.length - 1 ? `border-right:2px solid ${LILAC_TINT};` : ""
            }">${s.pct >= 5 ? `${s.pct}%` : "&nbsp;"}</td>`,
        )
        .join("")}</tr>`,
      "margin-top:10px;",
    )}
    <p style="margin:8px 0 0;font-size:12px;line-height:22px;color:${BODY};">
      ${segments
        .map(
          (s) =>
            `<span style="white-space:nowrap;"><span style="display:inline-block;width:10px;height:10px;background-color:${s.fill};border:1px solid ${CONCRETE};vertical-align:middle;">&nbsp;</span>&nbsp;${s.label} <strong style="color:${NAVY};">${money(s.amount)}</strong> ${s.pct}%</span>`,
        )
        .join(" &nbsp;&nbsp; ")}
    </p>`;

  const costBlock = `
    <tr><td style="padding:24px;background-color:${LILAC_TINT};">
      ${eyebrow("What it costs a month")}
      ${layout(`<tr>
        ${cost(money(r.payAtRate), "", `at ${ratePct}%`)}
        ${cost(money(r.payAtTest), riseTag, "if mortgage rates hit 7%")}
      </tr>`)}
      ${layout(
        `<tr><td style="padding-top:16px;">
          <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:${NAVY};">Repayment pressure</p>
          ${pressure}
          ${scale}
        </td></tr>`,
        `margin-top:18px;border-top:1px solid ${CONCRETE};`,
      )}
      ${layout(
        `<tr><td style="padding-top:16px;">
          <p style="margin:0;font-size:14px;font-weight:700;color:${NAVY};">Your take-home pay: ${money(r.netMonthly)} a month</p>
          ${bar}
          <p style="margin:10px 0 0;font-size:12px;line-height:19px;color:${BODY};">
            If mortgage rates hit 7%, ${
              hasLoans
                ? `all your repayments take ${share.allAtTest}% and leave`
                : `the repayment takes ${share.allAtTest}% and leaves`
            } <strong style="color:${NAVY};">${money(r.leftToLive.atTest)}</strong> to live on.
          </p>
        </td></tr>`,
        `margin-top:18px;border-top:1px solid ${CONCRETE};`,
      )}
    </td></tr>`;

  // ---------- 4. examples by repayment pressure ----------

  const th = (text: string, align = "center") =>
    `<th align="${align}" style="padding:0 4px 8px;border-bottom:1px solid ${CONCRETE};font-size:10px;line-height:13px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;color:${MUTED};">${text}</th>`;
  const td = (text: string, strong: boolean) =>
    `<td align="center" style="padding:10px 4px;border-bottom:1px solid #EEF0F3;font-size:13px;${
      strong ? `font-weight:700;color:${NAVY};` : `color:${BODY};`
    }white-space:nowrap;">${text}</td>`;

  const levelRows = r.levels
    .map(
      (level) => `
      <tr>
        <td style="padding:10px 4px 10px 0;border-bottom:1px solid #EEF0F3;">
          <span style="display:block;font-size:13px;font-weight:700;color:${NAVY};">${esc(level.label)}</span>
          <span style="display:block;font-size:11px;color:${MUTED};">${pct(level.share)} of pay</span>
        </td>
        ${
          level.payment > 0
            ? `${td(money(level.payment), true)}${td(money(level.loan), false)}${td(money(level.price), true)}${td(pct(level.lvr), true)}`
            : `<td colspan="4" align="center" style="padding:10px 4px;border-bottom:1px solid #EEF0F3;font-size:12px;color:${MUTED};">Your cards and loans already take this much</td>`
        }
      </tr>`,
    )
    .join("");

  const examplesBlock = `
    <tr><td style="padding:24px;">
      ${eyebrow("Examples by repayment pressure")}
      <p style="margin:0 0 14px;font-size:13px;line-height:20px;color:${BODY};">
        ${hasLoans ? "Priced from your pay, after your cards and loans." : "Priced from your pay, not from the lender&rsquo;s ceiling."}
      </p>
      ${layout(`
        <tr>${th("Pressure", "left")}${th("Mortgage<br>a month")}${th("Loan")}${th("Home price")}${th("LVR")}</tr>
        ${levelRows}
      `)}
      ${layout(
        `<tr><td style="padding:14px 16px;font-size:13px;line-height:20px;color:${NAVY};">
          <strong>These are payments, not limits.</strong> A lender would go to ${money(r.maxLoan)}, with
          ${hasLoans ? "all your repayments" : "the repayment"} at ${share.all}% of your take-home pay. The rows
          above are what the same income buys at a repayment you would choose.
        </td></tr>`,
        `margin-top:16px;background-color:${AMBER_TINT};border-left:4px solid ${AMBER};`,
      )}
      <p style="margin:12px 0 0;font-size:12px;line-height:18px;color:${MUTED};">
        Above 80% LVR a bank adds a low-equity margin to your rate or a one-off fee. Each lender sets its
        own. Under 10% down, some banks lend directly and others through the First Home Loan.
      </p>
    </td></tr>`;

  /*
   * One bordered panel, as on screen: the navy block on top, then the caution,
   * the costs and the examples. Blocked, only the navy block is there.
   */
  const resultsPanel = layout(
    `<tr><td style="padding:26px 24px;background-color:${NAVY};">${loanBlock}</td></tr>
     ${r.blocked ? "" : `${cautionBlock}${costBlock}${examplesBlock}`}`,
    `border:1px solid ${CONCRETE};`,
  );

  // ---------- what it was based on ----------

  const loansMonthly = snapshot.car + snapshot.stud + snapshot.other;
  const kiwi = snapshot.couple
    ? `${snapshot.kiwi1 > 0 ? `${snapshot.kiwi1}%` : "none"} and ${snapshot.kiwi2 > 0 ? `${snapshot.kiwi2}%` : "none"}`
    : snapshot.kiwi1 > 0
      ? `${snapshot.kiwi1}%`
      : "Not contributing";

  const basedOn: [string, string][] = [
    ["Buying", snapshot.couple ? "With a partner" : "On my own"],
    [snapshot.couple ? "Income, before tax" : "Your income, before tax", `${money(gross)} a year`],
    ["KiwiSaver contribution", kiwi],
    ["Dependants", snapshot.deps === 0 ? "None" : String(snapshot.deps)],
    ["Everyday spending", `${money(snapshot.spend)} a month`],
    ["Rates & house insurance", `${money(snapshot.rins)} a month`],
    ...(snapshot.insurance > 0
      ? ([["Life, health & income cover", `${money(snapshot.insurance)} a month`]] as [string, string][])
      : []),
    ...(snapshot.otherSpend > 0
      ? ([["Anything else, every month", `${money(snapshot.otherSpend)} a month`]] as [string, string][])
      : []),
    ["Deposit", money(snapshot.deposit)],
    ["Mortgage rate", `${snapshot.rate.toFixed(2)}%`],
    ["Card limits", snapshot.cc > 0 ? money(snapshot.cc) : "None"],
    ["Other loan repayments", loansMonthly > 0 ? `${money(loansMonthly)} a month` : "None"],
  ];

  /*
   * The guide link goes in this email as well as in the MailerLite welcome
   * automation, and that repetition is deliberate. A MailerLite automation
   * fires once per subscriber, ever, so anyone who has already been through a
   * Valar form gets nothing from it. This is the copy that always arrives.
   */
  const guideLine = guideReady
    ? `<p style="margin:0 0 12px;font-size:15px;line-height:24px;color:${BODY};">
         And here is <strong style="color:${NAVY};">${esc(guideTitle)}</strong>, as promised.
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
    : `<p style="margin:0 0 20px;font-size:15px;line-height:24px;color:${BODY};">
         ${
           pendingNote
             ? esc(pendingNote)
             : `I am finishing a short guide called <strong style="color:${NAVY};">${esc(guideTitle)}</strong>. You will get it the moment it is done.`
         }
       </p>`;

  const disclaimer =
    "The figures are indicative, based on general assumptions, and not an offer of finance. What you can actually borrow is confirmed by a lender after a full application.";

  const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>What you can borrow</title>
</head>
<body style="margin:0;padding:0;background-color:${FOG};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${
    r.blocked
      ? "Your numbers from the Valar borrowing calculator."
      : `A ${money(r.best.loan)} loan, a ${money(r.best.price)} home, and what the repayments would take.`
  }</div>
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
    <p style="margin:0 0 24px;font-size:15px;line-height:24px;color:${BODY};">
      This is what you ran on the Valar borrowing calculator, so you have it in writing.
    </p>

    ${resultsPanel}

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:24px;border:1px solid ${CONCRETE};">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${MUTED};">What this is based on</p>
        ${layout(basedOn.map(([label, value]) => input(label, value)).join(""))}
      </td></tr>
    </table>

    <p style="margin:20px 0 24px;font-size:13px;line-height:21px;color:${MUTED};">
      Want to change any of those? <a href="${baseUrl}/calculators/what-can-i-buy" style="color:${NAVY};font-weight:700;text-decoration:underline;">Run it again</a>.
    </p>

    ${guideLine}

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:8px;border:1px solid ${CONCRETE};background-color:${FOG};">
      <tr><td style="padding:22px 24px;">
        <h2 style="margin:0 0 8px;font-size:17px;line-height:24px;font-weight:700;color:${NAVY};">
          Two lenders will give you two different numbers<span style="color:${AMBER};">.</span>
        </h2>
        <p style="margin:0 0 16px;font-size:14px;line-height:22px;color:${BODY};">
          Lender, rate and loan structure all change the answer.
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="background-color:${AMBER};">
            <a href="${baseUrl}/book" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:700;color:${NAVY};text-decoration:none;">
              Book a clarity call
            </a>
          </td></tr>
        </table>
        <p style="margin:8px 0 0;font-size:12px;line-height:18px;color:${MUTED};">Thirty minutes. No cost, no obligation.</p>
      </td></tr>
    </table>

    <p style="margin:28px 0 0;font-size:12px;line-height:19px;color:${MUTED};">
      <strong style="color:${NAVY};">This is a guide, not advice.</strong> ${disclaimer}
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
      You are receiving this because you asked for these numbers on our calculator.
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`;

  // ---------- plain text: the same blocks, in the same order ----------

  const plain = (s: string) => s.replace(/&amp;/g, "&");

  const results: string[] = r.blocked
    ? [r.headline, "", r.title, ...r.body]
    : [
        `Loan: ${money(r.best.loan)} (${cappedLine.toLowerCase()})`,
        `Purchase price: ${money(r.best.price)} (that loan plus your deposit)`,
        `Your deposit of ${money(r.best.deposit)} is ${pct(r.best.depositPct)} of that price, so the LVR is ${pct(r.best.lvr)}.`,
        "",
        ...(r.caution ? [`${r.caution.lead} ${r.caution.detail}`, INDICATIVE, ""] : []),
        "WHAT IT COSTS A MONTH",
        `${money(r.payAtRate)} at ${ratePct}%`,
        `${money(r.payAtTest)} if mortgage rates hit 7%${rise >= 1 ? ` (${money(rise)} more)` : ""}`,
        "",
        "Repayment pressure",
        ...(hasLoans
          ? [
              `  Mortgage: ${money(r.payAtRate)}, ${share.mortgage}%`,
              `  Cards & other loans: ${money(r.debtMonthly)}, ${share.loans}%`,
              `  All repayments: ${money(r.payAtRate + r.debtMonthly)}, ${share.all}% (${band.label})`,
            ]
          : [`  ${share.all}% of your take-home pay (${band.label})`]),
        "",
        `Your take-home pay: ${money(r.netMonthly)} a month`,
        ...segments.map((s) => `  ${plain(s.label)}: ${money(s.amount)}, ${s.pct}%`),
        `If mortgage rates hit 7%, ${
          hasLoans ? `all your repayments take ${share.allAtTest}% and leave` : `the repayment takes ${share.allAtTest}% and leaves`
        } ${money(r.leftToLive.atTest)} to live on.`,
        "",
        "EXAMPLES BY REPAYMENT PRESSURE",
        ...r.levels.map((level) =>
          level.payment > 0
            ? `  ${level.label} (${pct(level.share)} of pay): ${money(level.payment)} a month, loan ${money(level.loan)}, home price ${money(level.price)}, LVR ${pct(level.lvr)}`
            : `  ${level.label} (${pct(level.share)} of pay): your cards and loans already take this much`,
        ),
        `These are payments, not limits. A lender would go to ${money(r.maxLoan)}, with ${
          hasLoans ? "all your repayments" : "the repayment"
        } at ${share.all}% of your take-home pay.`,
      ];

  const text = [
    name ? `${name}, here are your numbers.` : "Here are your numbers.",
    "",
    "INDICATIVE MAXIMUM",
    ...results,
    "",
    "WHAT THIS IS BASED ON",
    ...basedOn.map(([label, value]) => `  ${label}: ${value}`),
    "",
    `Run it again: ${baseUrl}/calculators/what-can-i-buy`,
    ...(guideReady && guideUrl ? [`${guideTitle}: ${guideUrl}`] : pendingNote ? [pendingNote] : []),
    `Book a clarity call: ${baseUrl}/book`,
    "",
    `This is a guide, not advice. ${disclaimer}`,
    "",
    "Lena Bykova (FSP1010055) trades as Valar Financial Advisors. A disclosure statement is available free of charge on request.",
  ]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");

  return {
    subject: r.blocked
      ? "Your numbers from the Valar calculator"
      : `You could borrow about ${money(r.best.loan)}`,
    html,
    text,
  };
}
