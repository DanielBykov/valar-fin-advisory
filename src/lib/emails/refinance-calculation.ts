/*
 * The email a visitor gets back after asking for their refinance calculation.
 *
 * Same construction as split-calculation.ts and for the same reason: table and
 * inline-style HTML, because Outlook renders through Word. It recomputes from the
 * snapshot with refinanceOptions, the function the page uses, so the figures in
 * the inbox are the figures that were on screen.
 *
 * Rebuilt 2026-11-20 as the "full breakdown" the page promises: the page shows
 * two options, the email adds the third (30 years) with its cost beside it.
 */
import { SITE_URL } from "@/lib/schema";
import { CARD_CONTACT } from "@/lib/business-card";
import {
  CONTRIBUTION_MAX_LVR,
  CONTRIBUTION_SHARE,
  LEGAL_FEES,
  NEW_LENDER_FIRST_YEAR_RATE,
  ONGOING_RATE,
  assumptionsLine,
  formatDate,
  formatDuration,
  refinanceOptions,
} from "@/lib/refinance";
import type { RefinanceSnapshot } from "@/lib/refinance-report";
import {
  LEGAL_FEE_OFFER_LARGE,
  LEGAL_FEE_OFFER_ENDS,
  legalFeeOfferOn,
  LEGAL_FEE_OFFER_SMALL,
  LEGAL_FEE_OFFER_THRESHOLD,
} from "@/lib/offers";

const NAVY = "#061634";
const AMBER = "#E8A23A";
const LILAC = "#C8CBE3";
const STEEL = "#8F93B5";
const CONCRETE = "#C9CED6";
const FOG = "#F6F7F9";
const MUTED = "#5A6478";
const BODY = "#3f4a5a";

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

const money = (n: number) => `$${Math.round(n).toLocaleString("en-NZ")}`;

/*
 * The personal note that opens the email, from Lena's brief (2026-11-20). The
 * calculation follows underneath. Fixed strings with <strong> for emphasis;
 * nothing from the form is interpolated, and the text version strips the tags.
 */
const letter = (upTo: string | null) => [
  "Good on you for taking a look at your mortgage. Many homeowners simply refix with the same bank every time, and miss a real chance to be <strong>mortgage-free sooner</strong>.",
  upTo
    ? `According to the initial calculation, <strong>you could save up to ${upTo}</strong>. The detail is below.`
    : "<strong>Your calculation is below</strong>, with the detail.",
  "For our clients we go a step further: a strategic plan for how to refinance, so your mortgage costs you <strong>less in interest, or less each month</strong>. Which of the two suits you is what we work out together in a session.",
];

/*
 * TIME-SENSITIVE. Every email repeats this line until it is changed, so it must
 * match what the banks' published forecasts say at the time. Lena owns it; an
 * empty string removes the paragraph.
 */
const RATE_OUTLOOK =
  "Banks' forecasts point to rates rising, and next year's rates could be higher than today's. Refinancing now and fixing a good rate could save you a meaningful amount.";

/*
 * One action, everywhere in the email (2026-11-20, Lena: do not make the reader
 * choose). Every button is the same reply to Lena, with the same label.
 */
const CTA_LABEL = "Let's review my mortgage";

/** The fallback when there is no one-click link: a prefilled reply to Lena. */
const replyHref = `mailto:lena.bykova@valar.co.nz?subject=${encodeURIComponent(
  "Refinance: let's talk",
)}&body=${encodeURIComponent(
  "Hi Lena,\n\nI'd like to look at refinancing my mortgage. Please get in touch to book a session.\n\nThanks",
)}`;
const UNIT = { weekly: "a week", fortnightly: "a fortnight", monthly: "a month" } as const;

function option(title: string, figure: string, figureLabel: string, detail: string, dark = false) {
  const bg = dark ? NAVY : FOG;
  const border = dark ? NAVY : CONCRETE;
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:12px;background-color:${bg};border:1px solid ${border};">
      <tr><td style="padding:20px 22px;">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${dark ? AMBER : STEEL};">${title}</p>
        <p style="margin:0;font-size:28px;line-height:34px;font-weight:700;color:${dark ? AMBER : NAVY};">${figure}</p>
        <p style="margin:0 0 10px;font-size:14px;font-weight:700;color:${dark ? "#ffffff" : NAVY};">${figureLabel}</p>
        <p style="margin:0;font-size:14px;line-height:22px;color:${dark ? LILAC : BODY};">${detail}</p>
      </td></tr>
    </table>`;
}

export function renderRefinanceEmail({
  firstName,
  snapshot,
  guideTitle,
  guideUrl,
  today,
  baseUrl = SITE_URL,
  reviewUrl,
}: {
  firstName: string;
  snapshot: RefinanceSnapshot;
  guideTitle: string;
  guideUrl?: string;
  /** ISO date the calculation is run on. */
  today: string;
  baseUrl?: string;
  /** One-click "review my mortgage" page; every button uses it when present. */
  reviewUrl?: string;
}): { subject: string; html: string; text: string } {
  const o = refinanceOptions(snapshot, today);
  const action = reviewUrl ?? replyHref;
  const name = esc(firstName.trim());
  const unit = UNIT[snapshot.frequency];
  const assumptions = assumptionsLine();

  const yourLoan = [
    `balance ${money(snapshot.balance)}`,
    `rate ${snapshot.rate.toFixed(2)}%`,
    `repayment ${money(snapshot.repayment)} ${unit}`,
    snapshot.fixedEnd ? `fixed until ${formatDate(snapshot.fixedEnd)}` : "floating",
    ...(snapshot.loanEnd ? [`loan ends ${formatDate(snapshot.loanEnd)}`] : []),
  ].join(", ");

  const ahead = o.state === "ahead" ? o : null;
  const upTo = ahead ? money(ahead.interestSaved) : null;
  const switchDate =
    ahead && ahead.monthsToSwitch > 0 && snapshot.fixedEnd ? formatDate(snapshot.fixedEnd) : null;

  // The offer applies by loan size; the copy says where the money comes from.
  const cta = `<table role="presentation" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="background-color:${AMBER};">
        <a href="${action}" style="display:inline-block;padding:13px 26px;font-size:15px;font-weight:700;color:${NAVY};text-decoration:none;">${CTA_LABEL}</a>
      </td></tr>
    </table>`;

  // JPEG, not the site's webp: Outlook does not show webp. Absolute URL, as email needs.
  const signature = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;">
      <tr>
        <td style="padding-right:14px;vertical-align:middle;">
          <img src="${baseUrl}/images/lena-vcard.jpg" width="64" height="64" alt="Lena Bykova" style="display:block;width:64px;height:64px;border-radius:32px;">
        </td>
        <td style="vertical-align:middle;">
          <p style="margin:0;font-size:15px;line-height:22px;font-weight:700;color:${NAVY};">Lena Bykova</p>
          <p style="margin:0;font-size:13px;line-height:20px;color:${BODY};">${esc(CARD_CONTACT.title)}, Valar Financial Advisors</p>
          <p style="margin:0;font-size:13px;line-height:20px;color:${MUTED};"><a href="tel:${CARD_CONTACT.phoneDial}" style="color:${NAVY};text-decoration:none;">${CARD_CONTACT.phoneDisplay}</a> &middot; <a href="mailto:${CARD_CONTACT.email}" style="color:${NAVY};text-decoration:none;">${CARD_CONTACT.email}</a></p>
        </td>
      </tr>
    </table>`;

  const offerOn = legalFeeOfferOn(today);
  const offerEnds = formatDate(LEGAL_FEE_OFFER_ENDS);

  if (o.state !== "low" && !o.contributionEligible) {
    return renderHighLvrEmail({
      name,
      lvr: o.lvr ?? 0,
      address: snapshot.address,
      offerOn,
      offerEnds,
      signature,
      guideTitle,
      guideUrl,
      baseUrl,
      addressUrl: reviewUrl ? `${reviewUrl}&m=address` : undefined,
    });
  }

  // Above 80% LVR the figures carry no contribution, and the email says so first.
  const lvrNote =
    o.state !== "low" && !o.contributionEligible
      ? `Your LVR is about ${Math.round(o.lvr ?? 0)}%. Above ${CONTRIBUTION_MAX_LVR}%, lenders usually don't pay a cash contribution and approval is harder, so these figures include none. A fresh valuation may bring your LVR under ${CONTRIBUTION_MAX_LVR}%: we can check that for you.`
      : "";

  const intro = ahead
    ? `${switchDate ? `Your fixed rate ends on ${switchDate}. If your bank's rate is then` : "If your bank's rate is"} ${ONGOING_RATE.toFixed(2)}%, our example rate, your repayment would be about ${money(ahead.stayRepayment)} ${unit}. Refinancing gives you three ways to use a new lender's offer.`
    : o.state === "behind" && !o.contributionEligible
      ? "Without a cash contribution, these example rates do not leave you ahead. There may still be options, and that is worth a conversation."
      : o.state === "behind"
        ? "On this loan size, the cash contribution does not cover the cost of switching. A different structure could still help, and that is worth a conversation."
        : "With the numbers you entered, the loan does not reduce over time. Check your repayment and loan end date, or talk it through with us.";

  const options = ahead
    ? [
        option(
          "Pay less each month",
          money(ahead.totalLess),
          "saved over the loan",
          `Pay ${money(ahead.firstYearRepayment)} ${unit} in the first year, then ${money(ahead.laterRepayment)}. Saving ${money(ahead.firstYearSaving)} ${unit}, then ${money(ahead.saving)}. Same loan term.`,
        ),
        option(
          "Pay it off sooner",
          money(ahead.interestSaved),
          "saved in interest",
          `If you pay ${money(ahead.stayRepayment)} ${unit}, what staying would cost anyway, the loan is paid off ${formatDuration(ahead.monthsSooner)} sooner.`,
          true,
        ),
        option(
          "More room in the budget",
          `${money(ahead.longerFirstYearRepayment)} ${unit}`,
          "over a 30-year term",
          `Then ${money(ahead.longerRepayment)} after the first year. This helps if cash flow is tight, but it costs about <strong>${money(ahead.longerMore)} more</strong> over the life of the loan.`,
        ),
      ].join("")
    : "";

  const contribution = ahead ? ahead.balanceAtSwitch * CONTRIBUTION_SHARE : 0;
  const source =
    ahead && ahead.contributionEligible
      ? `A new lender's cash contribution of ${(CONTRIBUTION_SHARE * 100).toFixed(2)}% (${money(contribution)} on your loan), less about ${money(LEGAL_FEES)} in legal fees, puts ${money(ahead.net)} onto your mortgage. The first year at ${NEW_LENDER_FIRST_YEAR_RATE.toFixed(2)}% adds to the saving.`
      : "";

  const checks = [
    snapshot.fixedEnd
      ? `Break fee: none if you switch when your fixed rate ends. Leave before ${formatDate(snapshot.fixedEnd)} and your bank can charge one.`
      : "Break fee: none on a floating rate.",
    "Clawback: if your current bank paid you a contribution, leaving within its minimum period can mean paying some of it back.",
    "A new assessment: the new lender checks your income, expenses and property again. Approval is not automatic.",
  ];

  const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Your refinance calculation</title>
</head>
<body style="margin:0;padding:0;background-color:${FOG};">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${FOG};">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:100%;font-family:Helvetica,Arial,sans-serif;">

  <tr><td style="background-color:${NAVY};padding:24px 32px;">
    <img src="${baseUrl}/images/email/valar-logo-navy.png" width="210" height="72" alt="Valar Financial Advisors" style="display:block;width:210px;height:72px;border:0;">
  </td></tr>

  <tr><td style="background-color:#ffffff;padding:32px;">
    <h1 style="margin:0 0 16px;font-size:24px;line-height:32px;font-weight:700;color:${NAVY};">
      Hi${name ? ` ${name}` : ""}<span style="color:${AMBER};">,</span>
    </h1>
    ${letter(upTo)
      .map(
        (para) =>
          `<p style="margin:0 0 14px;font-size:15px;line-height:24px;color:${BODY};">${para}</p>`,
      )
      .join("")}
    ${
      RATE_OUTLOOK
        ? `<p style="margin:0 0 14px;font-size:15px;line-height:24px;color:${BODY};"><strong style="color:${NAVY};">Why now?</strong> ${esc(RATE_OUTLOOK)}</p>`
        : ""
    }
    ${
      // The deadline is real (offers.ts) and the line disappears after it.
      offerOn
        ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:4px 0 18px;background-color:#FDF3E1;border-left:4px solid ${AMBER};">
             <tr><td style="padding:16px 20px;">
               <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${NAVY};">Valar offer &middot; until ${offerEnds}</p>
               <p style="margin:0 0 4px;font-size:20px;line-height:28px;font-weight:700;color:${NAVY};">We'll cover up to ${money(LEGAL_FEE_OFFER_LARGE)} of your legal fees</p>
               <p style="margin:0;font-size:14px;line-height:22px;color:${BODY};">when you refinance with us. The details are below.</p>
             </td></tr>
           </table>`
        : ""
    }
    <p style="margin:0 0 16px;font-size:15px;line-height:24px;color:${BODY};">
      Want to talk it through and see what you could save? Press the button and we'll be in touch to book a session.
    </p>
    ${cta}
    ${signature}

    <h2 style="margin:36px 0 8px;padding-top:24px;border-top:1px solid ${CONCRETE};font-size:20px;line-height:28px;font-weight:700;color:${NAVY};">
      Your calculation<span style="color:${AMBER};">.</span>
    </h2>
    <p style="margin:0 0 20px;font-size:14px;line-height:22px;color:${MUTED};">You entered: ${esc(yourLoan)}.</p>

    ${
      ahead
        ? `<p style="margin:0;font-size:26px;line-height:34px;font-weight:700;color:${NAVY};">
             You could save up to <span style="color:${AMBER};">${money(ahead.interestSaved)}</span>.
           </p>`
        : ""
    }
    ${
      lvrNote
        ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:14px;background-color:#FDF3E1;border-left:4px solid ${AMBER};">
             <tr><td style="padding:14px 18px;font-size:14px;line-height:22px;color:${NAVY};">${esc(lvrNote)}</td></tr>
           </table>`
        : ""
    }
    <p style="margin:12px 0 0;font-size:15px;line-height:24px;color:${BODY};">${esc(intro)}</p>

    ${options}

    ${
      source
        ? `<h2 style="margin:28px 0 8px;font-size:17px;line-height:24px;font-weight:700;color:${NAVY};">Where the saving comes from<span style="color:${AMBER};">.</span></h2>
           <p style="margin:0;font-size:14px;line-height:22px;color:${BODY};">${esc(source)}</p>`
        : ""
    }

    <h2 style="margin:28px 0 8px;font-size:17px;line-height:24px;font-weight:700;color:${NAVY};">Before you decide<span style="color:${AMBER};">.</span></h2>
    ${checks
      .map((c) => {
        const [head, ...rest] = c.split(": ");
        return `<p style="margin:0 0 8px;font-size:14px;line-height:22px;color:${BODY};"><strong style="color:${NAVY};">${esc(head)}:</strong> ${esc(rest.join(": "))}</p>`;
      })
      .join("")}

    ${
      offerOn
        ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:24px;background-color:${AMBER};">
             <tr><td style="padding:22px 24px;">
               <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${NAVY};">Valar offer</p>
               <p style="margin:0 0 8px;font-size:20px;line-height:28px;font-weight:700;color:${NAVY};">We'll cover up to ${money(LEGAL_FEE_OFFER_LARGE)} of your legal fees.</p>
               <p style="margin:0 0 14px;font-size:14px;line-height:22px;color:${NAVY};">Refinance with Valar and we pay you back ${money(LEGAL_FEE_OFFER_LARGE)} on loans of ${money(LEGAL_FEE_OFFER_THRESHOLD)} or more, ${money(LEGAL_FEE_OFFER_SMALL)} on smaller loans. Paid after settlement. Offer ends ${offerEnds}.</p>
               <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                 <tr><td style="background-color:${NAVY};">
                   <a href="${action}" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">${CTA_LABEL}</a>
                 </td></tr>
               </table>
               <p style="margin:12px 0 0;font-size:11px;line-height:17px;color:${NAVY};">Valar is paid a commission by the lender when your loan settles. This payment comes out of that commission.</p>
             </td></tr>
           </table>`
        : ""
    }

    ${
      guideUrl
        ? `<p style="margin:24px 0 0;font-size:15px;line-height:24px;color:${BODY};">
             We've also sent you our guide, <a href="${guideUrl}" style="color:${NAVY};font-weight:700;">${esc(guideTitle)}</a>. See how many of the tricks you already use.
           </p>`
        : ""
    }
    ${
      snapshot.fixedEnd
        ? `<p style="margin:12px 0 0;font-size:15px;line-height:24px;color:${BODY};">
             Lena will send you a reminder about 90 days before ${formatDate(snapshot.fixedEnd)}.
           </p>`
        : ""
    }

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:24px;border:1px solid ${CONCRETE};background-color:${FOG};">
      <tr><td style="padding:22px 24px;">
        <h2 style="margin:0 0 8px;font-size:17px;line-height:24px;font-weight:700;color:${NAVY};">
          Which option fits you<span style="color:${AMBER};">?</span>
        </h2>
        <p style="margin:0 0 16px;font-size:14px;line-height:22px;color:${BODY};">
          It depends on your break fee, your lender options and what you need the loan to do. We work through it with you in a session.
        </p>
        ${cta}
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
      You are receiving this because you asked for this calculation on our website.
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`;

  const text = [
    `Hi${name ? ` ${name}` : ""},`,
    "",
    ...letter(upTo).flatMap((para) => [para.replace(/<[^>]+>/g, ""), ""]),
    RATE_OUTLOOK ? `Why now? ${RATE_OUTLOOK}` : "",
    offerOn
      ? `And one more thing: until ${offerEnds}, refinance with us and we'll cover up to ${money(LEGAL_FEE_OFFER_LARGE)} of your legal fees.`
      : "",
    "",
    "Want to talk it through and see what you could save? Use the link below, or reply to this email, and we'll be in touch to book a session.",
    "",
    "Lena Bykova",
    `${CARD_CONTACT.title}, Valar Financial Advisors`,
    `${CARD_CONTACT.phoneDisplay} · ${CARD_CONTACT.email}`,
    "",
    "YOUR CALCULATION",
    `You entered: ${yourLoan}.`,
    "",
    ahead ? `You could save up to ${money(ahead.interestSaved)}.` : "",
    lvrNote,
    intro,
    "",
    ...(ahead
      ? [
          `PAY LESS EACH MONTH: ${money(ahead.totalLess)} saved over the loan. Pay ${money(ahead.firstYearRepayment)} ${unit} in the first year, then ${money(ahead.laterRepayment)}.`,
          `PAY IT OFF SOONER: ${money(ahead.interestSaved)} saved in interest. Pay ${money(ahead.stayRepayment)} ${unit} and the loan is paid off ${formatDuration(ahead.monthsSooner)} sooner.`,
          `MORE ROOM IN THE BUDGET: ${money(ahead.longerFirstYearRepayment)} ${unit} over 30 years, then ${money(ahead.longerRepayment)}. Costs about ${money(ahead.longerMore)} more over the life of the loan.`,
          "",
          source,
          "",
        ]
      : []),
    "Before you decide:",
    ...checks,
    "",
    offerOn
      ? `Valar offer: we'll cover up to ${money(LEGAL_FEE_OFFER_LARGE)} of your legal fees, paid after settlement. Valar is paid a commission by the lender when your loan settles; this payment comes out of it. Offer ends ${offerEnds}.`
      : "",
    guideUrl ? `${guideTitle}: ${guideUrl}` : "",
    snapshot.fixedEnd
      ? `Lena will send you a reminder about 90 days before ${formatDate(snapshot.fixedEnd)}.`
      : "",
    reviewUrl
      ? `Let's review my mortgage: ${reviewUrl}`
      : "To review your mortgage, just reply to this email.",
    "",
    `${assumptions} This is an illustration, not financial advice or a loan offer. Rates change and lending criteria apply.`,
    "",
    "Valar Financial Advisors Limited (FSP1012862) holds a Financial Advice Provider licence issued by the FMA. Financial advice is provided by Lena Bykova, Director and Financial Adviser (FSP1010055). Disclosure statement: valar.co.nz/disclosure",
  ]
    .filter((line, i, all) => line !== "" || all[i - 1] !== "")
    .join("\n");

  return {
    subject: ahead
      ? `Your refinance calculation: save up to ${money(ahead.interestSaved)}`
      : "Your refinance calculation",
    html,
    text,
  };
}

/*
 * Above 80% LVR (2026-11-20, Lena): no figures and no "review my mortgage".
 * Lenders usually pay no contribution there, so the email is about one thing:
 * the property's value. With an address, Lena checks it and replies within a
 * business day; without one, the only button asks for it.
 */
function renderHighLvrEmail({
  name,
  lvr,
  address,
  offerOn,
  offerEnds,
  signature,
  guideTitle,
  guideUrl,
  baseUrl,
  addressUrl,
}: {
  name: string;
  lvr: number;
  address?: string;
  offerOn: boolean;
  offerEnds: string;
  signature: string;
  guideTitle: string;
  guideUrl?: string;
  baseUrl: string;
  /** The review page in its address mode; the prefilled reply is the fallback. */
  addressUrl?: string;
}): { subject: string; html: string; text: string } {
  const addressHref = `mailto:lena.bykova@valar.co.nz?subject=${encodeURIComponent(
    "My property address",
  )}&body=${encodeURIComponent("Hi Lena,\n\nMy property address is: \n\nThanks")}`;
  const insightsUrl = `${baseUrl}/insights`;

  const paras = [
    "Good on you for asking about your mortgage.",
    `With the value you entered, your LVR comes out at about <strong>${Math.round(lvr)}%</strong>. Above ${CONTRIBUTION_MAX_LVR}%, lenders usually don't pay a cash contribution, which is why we haven't put a saving figure on it yet. But <strong>your property may be worth more than you think</strong>.`,
    address
      ? `We've got your request. We'll check what your property at ${esc(address)} is worth today and <strong>come back to you with the result within one business day</strong>.`
      : "To check that, we need your property's address. <strong>Send it to us</strong>, and we'll check what your property is worth today and come back to you with the result within one business day.",
  ];
  const after = address
    ? "In the meantime, have a look around our website. Our articles explain refinancing, rates and how to pay your mortgage off faster."
    : "";

  const button = (href: string, label: string) => `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:4px;">
      <tr><td style="background-color:${AMBER};">
        <a href="${href}" style="display:inline-block;padding:13px 26px;font-size:15px;font-weight:700;color:${NAVY};text-decoration:none;">${label}</a>
      </td></tr>
    </table>`;

  const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Your refinance check</title>
</head>
<body style="margin:0;padding:0;background-color:${FOG};">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${FOG};">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:100%;font-family:Helvetica,Arial,sans-serif;">

  <tr><td style="background-color:${NAVY};padding:24px 32px;">
    <img src="${baseUrl}/images/email/valar-logo-navy.png" width="210" height="72" alt="Valar Financial Advisors" style="display:block;width:210px;height:72px;border:0;">
  </td></tr>

  <tr><td style="background-color:#ffffff;padding:32px;">
    <h1 style="margin:0 0 16px;font-size:24px;line-height:32px;font-weight:700;color:${NAVY};">
      Hi${name ? ` ${name}` : ""}<span style="color:${AMBER};">,</span>
    </h1>
    ${paras.map((p) => `<p style="margin:0 0 14px;font-size:15px;line-height:24px;color:${BODY};">${p}</p>`).join("")}
    ${address ? "" : button(addressUrl ?? addressHref, "Send my property address")}
    ${
      offerOn
        ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:18px 0;background-color:#FDF3E1;border-left:4px solid ${AMBER};">
             <tr><td style="padding:16px 20px;">
               <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${NAVY};">Valar offer &middot; until ${offerEnds}</p>
               <p style="margin:0 0 4px;font-size:18px;line-height:26px;font-weight:700;color:${NAVY};">We'll cover up to ${money(LEGAL_FEE_OFFER_LARGE)} of your legal fees</p>
               <p style="margin:0;font-size:13px;line-height:20px;color:${BODY};">when you refinance with us: ${money(LEGAL_FEE_OFFER_LARGE)} on loans of ${money(LEGAL_FEE_OFFER_THRESHOLD)} or more, ${money(LEGAL_FEE_OFFER_SMALL)} on smaller loans, paid after settlement. Valar is paid a commission by the lender when your loan settles; this payment comes out of it.</p>
             </td></tr>
           </table>`
        : ""
    }
    ${
      after
        ? `<p style="margin:0 0 14px;font-size:15px;line-height:24px;color:${BODY};">${after}</p>${button(insightsUrl, "Read our articles")}`
        : ""
    }
    ${signature}
    ${
      guideUrl
        ? `<p style="margin:24px 0 0;font-size:15px;line-height:24px;color:${BODY};">
             We've also sent you our guide, <a href="${guideUrl}" style="color:${NAVY};font-weight:700;">${esc(guideTitle)}</a>. See how many of the tricks you already use.
           </p>`
        : ""
    }
    <p style="margin:28px 0 0;font-size:12px;line-height:19px;color:${MUTED};">
      This is general information, not financial advice or a loan offer. Lending criteria apply.
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
      You are receiving this because you asked for this calculation on our website.
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`;

  const text = [
    `Hi${name ? ` ${name}` : ""},`,
    "",
    ...paras.flatMap((p) => [p.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&"), ""]),
    address
      ? ""
      : addressUrl
        ? `Send my property address: ${addressUrl}`
        : "Reply to this email with your property address.",
    offerOn
      ? `Valar offer until ${offerEnds}: we'll cover up to ${money(LEGAL_FEE_OFFER_LARGE)} of your legal fees when you refinance with us.`
      : "",
    after ? `${after} ${insightsUrl}` : "",
    "",
    "Lena Bykova",
    `${CARD_CONTACT.title}, Valar Financial Advisors`,
    `${CARD_CONTACT.phoneDisplay} · ${CARD_CONTACT.email}`,
    "",
    guideUrl ? `${guideTitle}: ${guideUrl}` : "",
    "",
    "This is general information, not financial advice or a loan offer. Lending criteria apply.",
    "Valar Financial Advisors Limited (FSP1012862) holds a Financial Advice Provider licence issued by the FMA. Financial advice is provided by Lena Bykova, Director and Financial Adviser (FSP1010055). Disclosure statement: valar.co.nz/disclosure",
  ]
    .filter((line, i, all) => line !== "" || all[i - 1] !== "")
    .join("\n");

  return {
    subject: address
      ? "We're checking your property value"
      : "Your refinance check: we need one detail",
    html,
    text,
  };
}
