import { NextResponse } from "next/server";
import { parseBorrowSnapshot } from "@/lib/borrow-report";
import { renderBorrowEmail } from "@/lib/emails/borrow-calculation";
import { isReady, LEAD_MAGNETS } from "@/lib/lead-magnets";

/*
 * The payment-first borrowing email, rendered in the browser without sending
 * anything. Development only.
 *
 *   /api/preview/borrow-email?frequency=monthly&income=9000&payment=3000&rate=4.99&years=30&name=Sam
 */
export async function GET(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse("Not found", { status: 404 });
  }

  const p = new URL(req.url).searchParams;
  const snapshot = parseBorrowSnapshot({
    kind: "borrow",
    frequency: p.get("frequency") ?? "monthly",
    income: p.get("income") ?? 9000,
    payment: p.get("payment") ?? 3000,
    rate: p.get("rate") ?? 4.99,
    years: p.get("years") ?? 30,
  });
  if (!snapshot) return new NextResponse("Bad figures", { status: 400 });

  const baseUrl = new URL(req.url).origin;
  const magnet = LEAD_MAGNETS["pay-your-mortgage-off-faster"];
  const ready = isReady(magnet);

  const { html } = renderBorrowEmail({
    firstName: p.get("name") ?? "Sam",
    snapshot,
    guideTitle: magnet.title,
    guideReady: ready,
    guideUrl: ready && magnet.file ? `${baseUrl}${magnet.file}` : undefined,
    pendingNote: magnet.pendingNote,
    baseUrl,
  });

  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
