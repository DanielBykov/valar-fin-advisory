import { NextResponse } from "next/server";
import { parseRepaymentSnapshot } from "@/lib/repayment-report";
import { renderRepaymentEmail } from "@/lib/emails/repayment-calculation";

/*
 * Renders the calculation email in the browser, so it can be looked at without
 * sending anything to anybody. Development only — in production it 404s.
 *
 * Email HTML is the one kind of markup you cannot check by reading it, and the
 * alternative is mailing a real person a draft. Query params match the report
 * page, plus ?name= and ?guideReady=true.
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

  const { html } = renderRepaymentEmail({
    firstName: p.get("name") ?? "Sam",
    snapshot,
    guideTitle: p.get("guideTitle") ?? "Ten Ways to Pay Your Mortgage Off Faster",
    guideReady: p.get("guideReady") === "true",
  });

  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
