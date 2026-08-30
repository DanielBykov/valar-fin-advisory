import { NextResponse } from "next/server";
import { Resend } from "resend";
import { SITE_URL } from "@/lib/schema";
import { calculateRepayments } from "@/lib/repayments";
import { FREQUENCIES } from "@/lib/split-loan";
import { nzd, parseRepaymentSnapshot } from "@/lib/repayment-report";
import { renderRepaymentEmail } from "@/lib/emails/repayment-calculation";
import { getLeadMagnet, isReady, LEAD_MAGNETS } from "@/lib/lead-magnets";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Lena Bykova <lena.bykova@valar.co.nz>";
const TO_LENA = "lena.bykova@valar.co.nz";

export async function POST(req: Request) {
  const { firstName, lastName, email, phone, guideKey, guideTitle, source, subscribe, figures } =
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

  /*
   * Where the links in the email point.
   *
   * Production is always the canonical site — never the request's own host,
   * which a caller controls and could use to put its own domain inside an
   * email sent from Lena's address. Development follows the origin it was
   * called from, so a test send from localhost is actually clickable rather
   * than pointing at a production URL the change has not been deployed to.
   */
  const baseUrl =
    process.env.NODE_ENV === "development" ? new URL(req.url).origin : SITE_URL;

  /*
   * Which magnet was promised decides which group they join, and therefore
   * which automation fires. Requests without a key are from before this
   * existed, and the first home guide is what they were all asking for.
   */
  const magnet = getLeadMagnet(guideKey) ?? LEAD_MAGNETS["first-home-buyer-guide"];
  const title = magnet.title || guideTitle;

  /*
   * The calculators group may not be created in MailerLite yet. Falling back to
   * the first home buyers group keeps every form working through the changeover
   * rather than 500-ing on a real lead; the log line is what says it happened.
   */
  let groupId = process.env[magnet.groupEnv];
  if (!groupId && magnet.groupEnv !== "MAILERLITE_FHB_GROUP_ID") {
    console.warn(`${magnet.groupEnv} is not set — enrolling "${magnet.key}" in the first home buyers group instead.`);
    groupId = process.env.MAILERLITE_FHB_GROUP_ID;
  }

  // Ticking the news box also adds them to the general newsletter group.
  const groups = [groupId];
  if (subscribe === "yes") groups.push(process.env.MAILERLITE_GROUP_ID);

  // Guard against a missing/misconfigured group id — otherwise we'd POST groups: [undefined]
  // to MailerLite, which silently fails to enrol the lead and never fires the welcome automation.
  if (groups.some((g) => !g)) {
    console.error(`MailerLite group id missing — check ${magnet.groupEnv} / MAILERLITE_GROUP_ID env vars.`);
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
      : `Guide request: ${title}`,
    html: `
      <p><strong>Guide:</strong> ${title}</p>
      <p><strong>Group:</strong> ${magnet.groupEnv === "MAILERLITE_FHB_GROUP_ID" ? "First home buyers" : "Calculators"}</p>
      <p><strong>Came from:</strong> ${source || "—"}</p>
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
      /*
       * `lead_source` is which page asked, not which document was promised —
       * the document is already implied by the group. It is there so a single
       * calculators automation can still be segmented and personalised, which
       * is the job a group per calculator would otherwise be doing badly.
       *
       * Deliberately no figures: what someone typed into a calculator is
       * financial data about them and it has no business sitting in a
       * marketing tool. It reaches Lena in the notification below instead.
       */
      fields: {
        name: firstName,
        ...(lastName ? { last_name: lastName } : {}),
        ...(typeof source === "string" && source ? { lead_source: source } : {}),
      },
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
        guideTitle: title,
        // Derived, not taken from the request: the browser has no business
        // telling the server whether a document exists.
        guideReady: isReady(magnet),
        guideUrl: magnet.file ? `${baseUrl}${magnet.file}` : undefined,
        baseUrl,
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
