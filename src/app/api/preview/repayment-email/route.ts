import { NextResponse } from "next/server";
import { parseRepaymentSnapshot } from "@/lib/repayment-report";
import { renderRepaymentEmail } from "@/lib/emails/repayment-calculation";
import { isReady, LEAD_MAGNETS } from "@/lib/lead-magnets";
import { SITE_URL } from "@/lib/schema";

/*
 * Renders the calculation email in the browser, so it can be looked at without
 * sending anything to anybody. Development only — in production it 404s.
 *
 * Email HTML is the one kind of markup you cannot check by reading it, and the
 * alternative is mailing a real person a draft. Query params match the report
 * page, plus ?name=. The guide state comes from the registry, the way the real
 * send gets it — ?guideReady= only exists to preview the other branch.
 *
 *   /api/preview/repayment-email?amount=650000&rate=5.5&years=30&frequency=fortnightly&extraMode=amount&extra=150&name=Sam
 *
 * It is not a substitute for one real send: Gmail and Outlook each rewrite what
 * they receive, and only a delivered message shows that.
 */
export async function GET(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse("Not found", { status: 404 });
  }

  const p = new URL(req.url).searchParams;
  const snapshot = parseRepaymentSnapshot({
    amount: p.get("amount") ?? 650_000,
    rate: p.get("rate") ?? 5,
    years: p.get("years") ?? 30,
    frequency: p.get("frequency") ?? "fortnightly",
    extraMode: p.get("extraMode") ?? "amount",
    extra: p.get("extra") ?? 0,
  });
  if (!snapshot) return new NextResponse("Bad figures", { status: 400 });

  const magnet = LEAD_MAGNETS["pay-your-mortgage-off-faster"];
  const override = p.get("guideReady");
  const ready = override === null ? isReady(magnet) : override === "true";

  const { html } = renderRepaymentEmail({
    firstName: p.get("name") ?? "Sam",
    snapshot,
    guideTitle: p.get("guideTitle") ?? magnet.title,
    guideReady: ready,
    guideUrl: ready && magnet.file ? `${SITE_URL}${magnet.file}` : undefined,
  });

  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
