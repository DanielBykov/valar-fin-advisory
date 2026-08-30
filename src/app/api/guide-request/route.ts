import { NextResponse } from "next/server";
import { Resend } from "resend";
import { calculateRepayments } from "@/lib/repayments";
import { FREQUENCIES } from "@/lib/split-loan";
import { nzd, parseRepaymentSnapshot } from "@/lib/repayment-report";
import { renderRepaymentEmail } from "@/lib/emails/repayment-calculation";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Lena Bykova <lena.bykova@valar.co.nz>";
const TO_LENA = "lena.bykova@valar.co.nz";

export async function POST(req: Request) {
  const { firstName, lastName, email, phone, guideTitle, guideReady, subscribe, figures } =
    await req.json();
  if (!firstName || !email) {
    return NextResponse.json({ success: false, error: "Name and email required." }, { status: 400 });
  }

  /*
   * The calculator sends its inputs along; the guide modal does not. Anything
   * malformed comes back null and the request degrades to what it always was —
   * enrol the lead, notify Lena — rather than emailing someone a calculation
   * built from junk.
   */
  const snapshot = parseRepaymentSnapshot(figures);

  // Everyone who requests the guide joins the First Home Buyers group — this triggers the
  // MailerLite welcome automation that delivers the guide and the follow-up series.
  // Ticking the news box also adds them to the general newsletter group.
  const groups = [process.env.MAILERLITE_FHB_GROUP_ID];
  if (subscribe === "yes") groups.push(process.env.MAILERLITE_GROUP_ID);

  // Guard against a missing/misconfigured group id — otherwise we'd POST groups: [undefined]
  // to MailerLite, which silently fails to enrol the lead and never fires the welcome automation.
  if (groups.some((g) => !g)) {
    console.error("MailerLite group id missing — check MAILERLITE_FHB_GROUP_ID / MAILERLITE_GROUP_ID env vars.");
    return NextResponse.json({ success: false, error: "Subscription is temporarily unavailable." }, { status: 500 });
  }

  /*
   * Lena's copy repeats the figures, not just the contact details. It is the
   * fallback if the visitor's email bounces, and on its own it is the useful
   * half of the lead: what they were actually modelling.
   */
  let figuresBlock = "";
  if (snapshot) {
    const r = calculateRepayments(snapshot);
    const freqLabel = FREQUENCIES.find((f) => f.key === snapshot.frequency)?.label ?? "";
    figuresBlock = `
      <hr>
      <p><strong>Their calculation</strong></p>
      <p>
        ${nzd(snapshot.amount)} at ${snapshot.rate.toFixed(2)}% over ${snapshot.years} years,
        ${freqLabel.toLowerCase()}${
          snapshot.extraValue > 0
            ? `, plus ${
                snapshot.extraMode === "percent"
                  ? `${snapshot.extraValue}% a year`
                  : `${nzd(snapshot.extraValue)} per payment`
              } extra`
            : ", no extra repayment"
        }.
      </p>
      <p>
        Repayment ${nzd(r.totalPayment, 2)} &middot;
        total interest ${nzd(r.totalInterest)} &middot;
        total repaid ${nzd(r.totalPaid)}${
          r.interestSaved > 0 ? ` &middot; saves ${nzd(r.interestSaved)} by paying extra` : ""
        }
      </p>`;
  }

  // Internal heads-up to Lena that a new lead came in.
  const notify = resend.emails.send({
    from: "Valar Website <lena.bykova@valar.co.nz>",
    to: TO_LENA,
    subject: snapshot
      ? `Calculation sent: ${firstName} — ${nzd(snapshot.amount)} @ ${snapshot.rate.toFixed(2)}%`
      : `Guide request: ${guideTitle}`,
    html: `
      <p><strong>Guide:</strong> ${guideTitle}</p>
      <p><strong>Name:</strong> ${firstName}${lastName ? ` ${lastName}` : ""}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "—"}</p>
      <p><strong>News opt-in:</strong> ${subscribe === "yes" ? "Yes" : "No"}</p>
      ${figuresBlock}
    `,
  });

  // Add the lead to MailerLite. The guide itself is delivered by the MailerLite
  // welcome automation attached to the First Home Buyers group.
  const enrol = fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.MAILERLITE_API_KEY}`,
    },
    body: JSON.stringify({
      email,
      fields: { name: firstName, ...(lastName ? { last_name: lastName } : {}) },
      groups,
    }),
  });

  /*
   * The calculation itself goes out transactionally, not through MailerLite.
   * Two reasons it cannot be an automation: an automation email is one template
   * for every subscriber, so it cannot carry this person's numbers; and it
   * fires once per subscriber, so the second calculation someone runs would
   * silently send nothing.
   */
  const mail = snapshot
    ? renderRepaymentEmail({
        firstName,
        snapshot,
        guideTitle: guideTitle || "Ten Ways to Pay Your Mortgage Off Faster",
        guideReady: guideReady === true,
      })
    : null;

  const deliver = mail
    ? resend.emails.send({
        from: FROM,
        to: email,
        replyTo: TO_LENA,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
      })
    : null;

  const [, mailerlite, calculation] = await Promise.all([notify, enrol, deliver]);

  // fetch() only rejects on network errors, not on 4xx/5xx — check the response
  // explicitly so a MailerLite validation error doesn't silently report success.
  if (!mailerlite.ok) {
    const detail = await mailerlite.text().catch(() => "");
    console.error(`MailerLite subscribe failed (${mailerlite.status}): ${detail}`);
    return NextResponse.json({ success: false, error: "Could not complete your request." }, { status: 502 });
  }

  /*
   * A failed calculation email is logged but not fatal: the lead is enrolled and
   * Lena's copy carries the same figures, so the recoverable path stays open.
   * Failing the request here would tell someone already on the list to try again.
   */
  if (calculation?.error) {
    console.error("Calculation email failed:", calculation.error);
  }

  return NextResponse.json({ success: true });
}
