import { NextResponse } from "next/server";
import { Resend } from "resend";
import { SITE_URL } from "@/lib/schema";
import { calculateRepayments } from "@/lib/repayments";
import { calculateSplit, FREQUENCIES } from "@/lib/split-loan";
import { nzd, parseRepaymentSnapshot } from "@/lib/repayment-report";
import { parseSplitSnapshot } from "@/lib/split-report";
import { calculate as calculateBorrowing, money } from "@/lib/affordability";
import { inputsFromSnapshot, parseAffordabilitySnapshot } from "@/lib/affordability-report";
import { renderRepaymentEmail } from "@/lib/emails/repayment-calculation";
import { renderSplitEmail } from "@/lib/emails/split-calculation";
import { renderAffordabilityEmail } from "@/lib/emails/affordability-calculation";
import { getLeadMagnet, isReady, LEAD_MAGNETS } from "@/lib/lead-magnets";

const resend = new Resend(process.env.RESEND_API_KEY);

// Matches the contact form. "Lena Bykova" alone reads as a personal email in
// an inbox; the calculation and the guide are from the firm.
const FROM = "Lena Bykova — Valar <lena.bykova@valar.co.nz>";
const TO_LENA = "lena.bykova@valar.co.nz";

export async function POST(req: Request) {
  const { firstName, lastName, email, phone, guideKey, guideTitle, source, subscribe, figures } =
    await req.json();
  if (!firstName || !email) {
    return NextResponse.json({ success: false, error: "Name and email required." }, { status: 400 });
  }

  /*
   * The calculators send their inputs along; the guide modal does not. Anything
   * malformed comes back null and the request degrades to what it always was —
   * enrol the lead, notify Lena — rather than emailing someone a calculation
   * built from junk.
   *
   * Each calculator names itself in `kind`, except the repayment snapshot,
   * which predates all of them and carries no `kind` at all. So the named ones
   * are tried first and the single loan is what is left over — which is what
   * keeps every payload sent before any of this existed reading correctly.
   */
  const borrowing = parseAffordabilitySnapshot(figures);
  const split = borrowing ? null : parseSplitSnapshot(figures);
  const snapshot = borrowing || split ? null : parseRepaymentSnapshot(figures);

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
  const fallbackEnv =
    magnet.fallbackGroupEnv === undefined ? "MAILERLITE_FHB_GROUP_ID" : magnet.fallbackGroupEnv;

  let groupId = process.env[magnet.groupEnv];
  if (!groupId && fallbackEnv && fallbackEnv !== magnet.groupEnv) {
    console.warn(`${magnet.groupEnv} is not set — enrolling "${magnet.key}" in ${fallbackEnv} instead.`);
    groupId = process.env[fallbackEnv];
  }

  // Ticking the news box also adds them to the general newsletter group.
  const groups = [groupId];
  if (subscribe === "yes") groups.push(process.env.MAILERLITE_GROUP_ID);

  /*
   * A magnet that opted out of the fallback and has no group of its own yet is
   * not a misconfiguration — it is a group Lena has not created. The lead is
   * not lost by it: the notification below still reaches her and the document
   * still downloads on the confirmation screen. What is skipped is the
   * automation, which is the thing that would have gone out in the wrong
   * language.
   */
  const wantsNewsletter = subscribe === "yes";
  const enrolable = fallbackEnv !== null || Boolean(groupId) || wantsNewsletter;

  /*
   * Someone who ticked the newsletter box asked for it in as many words, so it
   * happens even when the magnet's own group does not exist yet: dropping it
   * would silently ignore the one thing on the form they chose for themselves.
   */
  if (!groupId && wantsNewsletter) groups.shift();

  // Guard against a missing/misconfigured group id — otherwise we'd POST groups: [undefined]
  // to MailerLite, which silently fails to enrol the lead and never fires the welcome automation.
  if (enrolable && groups.some((g) => !g)) {
    console.error(`MailerLite group id missing — check ${magnet.groupEnv} / MAILERLITE_GROUP_ID env vars.`);
    return NextResponse.json({ success: false, error: "Subscription is temporarily unavailable." }, { status: 500 });
  }
  if (!enrolable) {
    console.warn(`${magnet.groupEnv} is not set and "${magnet.key}" has no fallback — capturing the lead without enrolling.`);
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
                  : snapshot.extraMode === "target"
                    ? `a round ${nzd(snapshot.extraValue)} a payment`
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
  } else if (borrowing) {
    const b = calculateBorrowing(inputsFromSnapshot(borrowing));
    // The same figures the page and the visitor's email lead with (2026-09-14).
    const rows = b.blocked
      ? ""
      : b.levels
          .map((l) =>
            l.payment > 0
              ? `<li>${l.label} (${Math.round(l.share * 100)}% of pay): ${money(l.payment)}/mo,
                   loan ${money(l.loan)}, price <strong>${money(l.price)}</strong>, LVR ${Math.round(l.lvr * 100)}%</li>`
              : `<li>${l.label} (${Math.round(l.share * 100)}% of pay): cards and loans already take this much</li>`,
          )
          .join("");
    figuresBlock = `
      <hr>
      <p><strong>What they can borrow</strong></p>
      <p>
        ${borrowing.couple ? "Couple" : "Single"},
        ${money(borrowing.inc1 + borrowing.inc2)} gross,
        ${borrowing.deps === 0 ? "no dependants" : `${borrowing.deps} dependant${borrowing.deps === 1 ? "" : "s"}`},
        spending ${money(borrowing.spend)}/mo, deposit ${money(borrowing.deposit)}${
          borrowing.detailed
            ? `, debts ${money(borrowing.cc)} card limits + ${money(borrowing.car + borrowing.stud + borrowing.other)}/mo repayments`
            : " (no debts entered)"
        }.
      </p>
      ${
        b.blocked
          ? `<p><strong>${b.headline}</strong> &middot; ${b.title}</p>`
          : `<p>Loan <strong>${money(b.best.loan)}</strong> &middot; price <strong>${money(b.best.price)}</strong>
               &middot; deposit ${money(b.best.deposit)}, LVR ${Math.round(b.best.lvr * 100)}%</p>
             <p>Repayment ${money(b.payAtRate)}/mo, ${money(b.payAtTest)}/mo at 7% &middot;
               repayment pressure <strong>${b.repaymentShare.all}%</strong> (${b.repaymentShare.band.label})</p>
             <p>Examples by repayment pressure:</p>
             <ul>${rows}</ul>`
      }`;
  } else if (split) {
    const s = calculateSplit(split.parts, split.frequency, split.loanYears);
    const freqLabel = FREQUENCIES.find((f) => f.key === split.frequency)?.label ?? "";
    const rows = split.parts
      .map((part, i) => {
        const pr = s.parts[i];
        return `<li>
            ${nzd(part.amount)} at ${part.rate.toFixed(2)}% fixed ${part.fixedYears} yr${
              part.fixedYears === 1 ? "" : "s"
            }${part.type === "io" ? " (interest only)" : ""} &mdash;
            ${nzd(pr.totalPayment, 2)} per payment
          </li>`;
      })
      .join("");
    figuresBlock = `
      <hr>
      <p><strong>Their split</strong></p>
      <p>
        ${nzd(s.totalPrincipal)} over ${split.loanYears} years,
        ${freqLabel.toLowerCase()}, in ${split.parts.length} part${
          split.parts.length === 1 ? "" : "s"
        }.
      </p>
      <ul>${rows}</ul>
      <p>
        Repayment ${nzd(s.totalPayment, 2)} &middot;
        ${nzd(s.totalPayment * s.perYear)} a year &middot;
        weighted average ${s.weightedAverageRate.toFixed(2)}% &middot;
        first re-fix in ${s.nextRefixYears} yr${s.nextRefixYears === 1 ? "" : "s"}
        on ${nzd(s.nextRefixAmount)}
      </p>`;
  }

  // Internal heads-up to Lena that a new lead came in.
  const notify = resend.emails.send({
    from: "Valar Website <lena.bykova@valar.co.nz>",
    to: TO_LENA,
    subject: snapshot
      ? `Calculation sent: ${firstName} — ${nzd(snapshot.amount)} @ ${snapshot.rate.toFixed(2)}%`
      : split
        ? `Split sent: ${firstName} — ${nzd(
            split.parts.reduce((sum, p) => sum + p.amount, 0),
          )} in ${split.parts.length} part${split.parts.length === 1 ? "" : "s"}`
        : borrowing
          ? `Borrowing calc: ${firstName} — ${money(
              calculateBorrowing(inputsFromSnapshot(borrowing)).maxLoan,
            )} on ${money(borrowing.inc1 + borrowing.inc2)}`
          : `Guide request: ${title}`,
    html: `
      <p><strong>Guide:</strong> ${title}</p>
      <p><strong>Group:</strong> ${magnet.groupLabel}${enrolable ? "" : " (not enrolled — group not created yet)"}</p>
      <p><strong>Came from:</strong> ${source || "—"}</p>
      <p><strong>Name:</strong> ${firstName}${lastName ? ` ${lastName}` : ""}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "—"}</p>
      <p><strong>News opt-in:</strong> ${subscribe === "yes" ? "Yes" : "No"}</p>
      ${figuresBlock}
    `,
  });

  /*
   * Add the lead to MailerLite. The guide itself is delivered by the welcome
   * automation attached to the magnet's group, which is why skipping this call
   * skips the document too — and why the confirmation screen offers the file
   * directly rather than relying on the email alone.
   */
  const enrol = enrolable
    ? fetch("https://connect.mailerlite.com/api/subscribers", {
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
           * marketing tool. It reaches Lena in the notification above instead.
           */
          fields: {
            name: firstName,
            ...(lastName ? { last_name: lastName } : {}),
            ...(typeof source === "string" && source ? { lead_source: source } : {}),
          },
          groups,
        }),
      })
    : null;

  /*
   * The calculation itself goes out transactionally, not through MailerLite.
   * Two reasons it cannot be an automation: an automation email is one template
   * for every subscriber, so it cannot carry this person's numbers; and it
   * fires once per subscriber, so the second calculation someone runs would
   * silently send nothing.
   */
  const common = {
    firstName,
    guideTitle: title,
    // Derived, not taken from the request: the browser has no business telling
    // the server whether a document exists.
    guideReady: isReady(magnet),
    guideUrl: magnet.file ? `${baseUrl}${magnet.file}` : undefined,
    // What to say when there is no document. A split structure review is
    // answered by Lena, not written, so "it is being finished" is simply wrong.
    pendingNote: magnet.pendingNote,
    baseUrl,
  };

  const mail = borrowing
    ? renderAffordabilityEmail({ ...common, snapshot: borrowing })
    : split
      ? renderSplitEmail({ ...common, snapshot: split })
      : snapshot
        ? renderRepaymentEmail({ ...common, snapshot })
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
  if (mailerlite && !mailerlite.ok) {
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
