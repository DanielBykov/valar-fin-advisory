import { NextResponse } from "next/server";
import { Resend } from "resend";
import { openReviewRequest } from "@/lib/refinance-link";
import { REVIEW_MESSAGE_MAX, formatDate, formatDuration, refinanceOptions } from "@/lib/refinance";

/*
 * Fired by /refinance/review when a visitor presses "Let's review my mortgage"
 * in their refinance email. It tells Lena, with the figures they were shown.
 *
 * Sent only when the visitor presses Send on the page, with the message they
 * wrote or kept (2026-11-20). Never on the link itself: mail scanners open
 * links in emails on their own.
 */

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_LENA = "lena.bykova@valar.co.nz";

const nzd = (n: number) => `$${Math.round(n).toLocaleString("en-NZ")}`;
const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

export async function POST(req: Request) {
  const { t, message, address } = await req.json().catch(() => ({ t: null, message: null }));
  // Present only from the high-LVR "Send my property address" page.
  const given =
    typeof address === "string" ? address.replace(/[<>]/g, "").trim().slice(0, 200) : "";
  const text = typeof message === "string" ? message.trim().slice(0, REVIEW_MESSAGE_MAX) : "";
  if (!text) return NextResponse.json({ success: false }, { status: 400 });
  const today = new Date().toISOString().slice(0, 10);
  const request = openReviewRequest(t, today);
  if (!request) return NextResponse.json({ success: false }, { status: 400 });

  const { snapshot: s } = request;
  const o = refinanceOptions(s, today);
  const name = `${request.firstName}${request.lastName ? ` ${request.lastName}` : ""}`;

  const figures =
    o.state === "ahead"
      ? `<p>They were shown: <strong>save up to ${nzd(o.interestSaved)}</strong>.<br>
         Pay less each month: ${nzd(o.firstYearRepayment)}, then ${nzd(o.laterRepayment)} (staying ${nzd(o.stayRepayment)}).<br>
         Pay it off sooner: ${formatDuration(o.monthsSooner)} sooner.</p>`
      : `<p>Their calculation showed no saving (${o.state}${o.state !== "low" && !o.contributionEligible ? ", LVR above 80%" : ""}).</p>`;

  const sent = await resend.emails.send({
    from: "Valar Website <lena.bykova@valar.co.nz>",
    to: TO_LENA,
    // Reply goes straight to the visitor.
    replyTo: request.email,
    subject: given ? `Property value check: ${name}` : `Refinance review requested: ${name}`,
    html: `
      <p><strong>${esc(name)} ${given ? "sent their property address for a value check. They were promised a reply within one business day." : "wants to review their mortgage."}</strong></p>
      ${given ? `<p style="font-size:16px;"><strong>Property address:</strong> ${esc(given)}</p>` : ""}
      <p style="white-space:pre-wrap;border-left:3px solid #E8A23A;padding-left:12px;">${esc(text)}</p>
      <p><strong>Email:</strong> ${esc(request.email)}<br>
      ${request.phone ? `<strong>Phone:</strong> ${esc(request.phone)}<br>` : ""}
      <strong>Calculation sent:</strong> ${formatDate(request.issued)}</p>
      <hr>
      <p>${nzd(s.balance)} at ${s.rate.toFixed(2)}%, ${nzd(s.repayment)} ${s.frequency}.
      ${s.fixedEnd ? `Fixed until ${formatDate(s.fixedEnd)}.` : "Floating."}
      ${s.loanEnd ? `Loan ends ${formatDate(s.loanEnd)}.` : ""}</p>
      ${s.propertyValue ? `<p>Property value (their estimate) ${nzd(s.propertyValue)}, LVR ${Math.round((s.balance / s.propertyValue) * 100)}%.</p>` : ""}
      ${s.address ? `<p>Property: ${esc(s.address)}</p>` : ""}
      ${figures}
      <p>Reply to this email to answer them directly.</p>`,
  });

  if (sent.error) {
    console.error("Refinance review notification failed:", sent.error);
    return NextResponse.json({ success: false }, { status: 502 });
  }
  return NextResponse.json({ success: true, firstName: request.firstName });
}
