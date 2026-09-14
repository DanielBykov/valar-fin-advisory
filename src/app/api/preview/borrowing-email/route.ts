import { NextResponse } from "next/server";
import { DEFAULTS } from "@/lib/affordability";
import { parseAffordabilitySnapshot, snapshotFromInputs } from "@/lib/affordability-report";
import { renderAffordabilityEmail } from "@/lib/emails/affordability-calculation";
import { isReady, LEAD_MAGNETS } from "@/lib/lead-magnets";

/*
 * Renders the borrowing email in the browser, so it can be looked at without
 * sending anything to anybody. Development only — in production it 404s.
 * The other two are /api/preview/repayment-email and /api/preview/split-email.
 *
 * With no query it uses the calculator's own starting numbers. Every input can
 * be overridden, which is the only practical way to see the branches: the
 * verdict has five of them and most sets of numbers only ever reach one.
 *
 *   /api/preview/borrowing-email
 *   /api/preview/borrowing-email?inc1=95000&who=1&dep=40000     (deposit is thin)
 *   /api/preview/borrowing-email?inc1=150000&inc2=150000&dep=600000  (income caps every row)
 *   /api/preview/borrowing-email?inc1=48000&who=1&deps=2&spend=3200  (cannot service)
 *
 * It is not a substitute for one real send: Gmail and Outlook each rewrite what
 * they receive, and only a delivered message shows that.
 */

export async function GET(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse("Not found", { status: 404 });
  }

  const p = new URL(req.url).searchParams;
  const pick = (key: keyof typeof DEFAULTS, fallback: string) =>
    p.get(key) ?? (DEFAULTS[key] as string) ?? fallback;

  const snapshot = parseAffordabilitySnapshot(
    snapshotFromInputs({
      who: (p.get("who") === "1" ? "1" : DEFAULTS.who) as "1" | "2",
      inc1: pick("inc1", "85000"),
      inc2: pick("inc2", "70000"),
      deps: pick("deps", "0"),
      kiwi1: pick("kiwi1", "3.5"),
      kiwi2: pick("kiwi2", "3.5"),
      spend: pick("spend", "2200"),
      dep: pick("dep", "120000"),
      cc: pick("cc", "0"),
      car: pick("car", "0"),
      stud: pick("stud", "0"),
      other: pick("other", "0"),
      rate: pick("rate", "6.50"),
      rins: pick("rins", "400"),
      ins: pick("ins", "0"),
      extra: pick("extra", "0"),
      detailed: p.get("detailed") === "true",
    }),
  );
  if (!snapshot) return new NextResponse("Bad figures", { status: 400 });

  const baseUrl = new URL(req.url).origin;
  const magnet = LEAD_MAGNETS["first-home-buyer-guide"];
  const override = p.get("guideReady");
  const ready = override === null ? isReady(magnet) : override === "true";

  const { html } = renderAffordabilityEmail({
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
