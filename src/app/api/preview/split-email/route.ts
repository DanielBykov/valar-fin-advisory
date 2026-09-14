import { NextResponse } from "next/server";
import { parseSplitSnapshot } from "@/lib/split-report";
import { renderSplitEmail } from "@/lib/emails/split-calculation";
import { isReady, LEAD_MAGNETS } from "@/lib/lead-magnets";

/*
 * Renders the split email in the browser, so it can be looked at without
 * sending anything to anybody. Development only — in production it 404s.
 * The single-loan equivalent is /api/preview/repayment-email.
 *
 * The default structure is the calculator's own starting point: $600k over 30
 * years, split three ways at one, two and three years fixed.
 *
 *   /api/preview/split-email
 *   /api/preview/split-email?parts=300000@4.99/1,300000@5.29/3&name=Sam
 *   /api/preview/split-email?parts=200000@4.99/1,200000@5.19/2,200000@5.29/3+300
 *
 * "+300" is $300 extra per payment on that part, "+2%" is 2% of it per year —
 * the only way to see the early-payoff line, which nothing else triggers.
 *
 * It is not a substitute for one real send: Gmail and Outlook each rewrite what
 * they receive, and only a delivered message shows that.
 */

const DEFAULT_PARTS = "200000@4.99/1,200000@5.19/2,200000@5.29/3";

/** "200000@4.99/1" — amount at rate, fixed for years, optionally "+300" or "+2%". */
function parseParts(spec: string) {
  return spec.split(",").map((chunk) => {
    const [structure, extra] = chunk.split("+");
    const [amountAndRate, fixedYears] = structure.split("/");
    const [amount, rate] = amountAndRate.split("@");
    const percent = Boolean(extra?.endsWith("%"));
    return {
      amount,
      rate,
      fixedYears: fixedYears ?? "1",
      type: "pi",
      extraMode: percent ? "percent" : "amount",
      extraValue: extra ? extra.replace("%", "") : 0,
    };
  });
}

export async function GET(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse("Not found", { status: 404 });
  }

  const p = new URL(req.url).searchParams;
  const snapshot = parseSplitSnapshot({
    kind: "split",
    loanYears: p.get("years") ?? 30,
    frequency: p.get("frequency") ?? "fortnightly",
    parts: parseParts(p.get("parts") ?? DEFAULT_PARTS),
  });
  if (!snapshot) return new NextResponse("Bad figures", { status: 400 });

  const baseUrl = new URL(req.url).origin;
  const magnet = LEAD_MAGNETS["split-structure-review"];
  const override = p.get("guideReady");
  const ready = override === null ? isReady(magnet) : override === "true";

  const { html } = renderSplitEmail({
    firstName: p.get("name") ?? "Sam",
    snapshot,
    guideTitle: p.get("guideTitle") ?? magnet.title,
    guideReady: ready,
    guideUrl: ready && magnet.file ? `${baseUrl}${magnet.file}` : undefined,
    pendingNote: magnet.pendingNote,
    baseUrl,
  });

  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
