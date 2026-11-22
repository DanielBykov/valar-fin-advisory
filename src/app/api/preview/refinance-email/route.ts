import { NextResponse } from "next/server";
import { parseRefinanceSnapshot } from "@/lib/refinance-report";
import { renderRefinanceEmail } from "@/lib/emails/refinance-calculation";
import { sealReviewRequest } from "@/lib/refinance-link";
import { isReady, LEAD_MAGNETS } from "@/lib/lead-magnets";

/*
 * Renders the refinance email in the browser, so Lena can look at it without
 * anything being sent. Development only: in production it 404s, as the other
 * previews in this folder do.
 *
 * The default is the page's own starting example. Any field can be overridden:
 *
 *   /api/preview/refinance-email
 *   /api/preview/refinance-email?balance=600000&rate=4.79&repayment=3508&fixedEnd=&loanEnd=2051-11-20
 *
 * Not a substitute for one real send: Gmail and Outlook rewrite what they get.
 */

function monthsFrom(iso: string, months: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString().slice(0, 10);
}

export async function GET(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse("Not found", { status: 404 });
  }

  const p = new URL(req.url).searchParams;
  const today = new Date().toISOString().slice(0, 10);
  const snapshot = parseRefinanceSnapshot({
    kind: "refinance",
    balance: Number(p.get("balance") ?? 600_000),
    rate: Number(p.get("rate") ?? 4.79),
    repayment: Number(p.get("repayment") ?? 3_435),
    frequency: p.get("frequency") ?? "monthly",
    fixedEnd: p.get("fixedEnd") ?? monthsFrom(today, 8),
    loanEnd: p.get("loanEnd") ?? monthsFrom(today, 300),
    propertyValue: Number(p.get("propertyValue") ?? 800_000),
    address: p.get("address") ?? undefined,
    rise: 0.5,
  });
  if (!snapshot) return new NextResponse("Bad figures", { status: 400 });

  const baseUrl = new URL(req.url).origin;
  const magnet = LEAD_MAGNETS["refinance-calculation"];
  const { subject, html } = renderRefinanceEmail({
    firstName: p.get("name") ?? "Sam",
    snapshot,
    guideTitle: magnet.title,
    guideUrl: isReady(magnet) && magnet.file ? `${baseUrl}${magnet.file}` : undefined,
    today,
    baseUrl,
    // A working one-click link with test contact details. Pressing it in the
    // preview really notifies Lena, which is how the round trip gets tested.
    reviewUrl: (() => {
      const token = sealReviewRequest({
        firstName: p.get("name") ?? "Sam",
        email: p.get("email") ?? "test@example.com",
        snapshot,
        issued: today,
      });
      return token ? `${baseUrl}/refinance/review?t=${token}` : undefined;
    })(),
  });

  // The subject line is part of what the visitor sees, so the preview shows it.
  const framed = html.replace(
    "<body",
    `<div style="font-family:Helvetica,Arial,sans-serif;background:#fff3cd;padding:10px 16px;font-size:13px;">Subject: <strong>${subject}</strong></div><body`,
  );
  return new NextResponse(framed, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
