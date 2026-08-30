import Link from "next/link";
import BalanceChart from "@/components/calculators/balance-chart";
import PrintButton from "@/components/calculators/print-button";
import { calculateRepayments } from "@/lib/repayments";
import { describeDuration, EXTRA_CAP_PERCENT, FREQUENCIES } from "@/lib/split-loan";
import { nzd, type RepaymentSnapshot } from "@/lib/repayment-report";

/*
 * The printable version of a repayment calculation, reached from the link in
 * the "here are your figures" email.
 *
 * One printed A4 sheet, exactly — the same rule the wealth plan report runs on.
 * Every print adjustment lives in PRINT_CSS below rather than in scattered
 * `print:` utilities, for one reason: that string can be re-applied with
 * media="all" to measure the printed height in a normal browser window, which
 * `print:` classes cannot. If a block is added here, measure it before
 * believing it fits.
 *
 * It is a server component. Only the chart's tooltip and the print button need
 * the browser, and both are imported as client components — rendering the whole
 * sheet on the client would ship the calculator's arithmetic twice.
 */

/*
 * Two things here are not cosmetic.
 *
 * `print-color-adjust: exact` is the whole report. Chrome does not print
 * background colours unless the reader ticks "Background graphics" in the print
 * dialog, and without it the navy results panel prints as white text on white
 * paper — the sheet comes out blank where the answer should be.
 *
 * The chart height is what keeps this to one page. At its natural aspect ratio
 * the plot is roughly 350px tall on a 186mm column, which alone is a third of
 * the sheet. Fixing the SVG height and letting the width follow scales it down
 * without redrawing anything.
 */
const PRINT_CSS = `
@page { size: A4 portrait; margin: 10mm 12mm; }

.report-print-only { display: none; }

@media print {
  html, body { background: #fff !important; }
  .report-sheet {
    box-shadow: none !important;
    border: 0 !important;
    border-radius: 0 !important;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
  .report-screen-only { display: none !important; }
  .report-print-only { display: block; }
  .report-page { max-width: none !important; padding: 0 !important; }
  .report-body { padding: 14px 0 0 !important; }
  .report-masthead { padding: 14px 16px !important; }
  .report-block { break-inside: avoid; }
  .report-cols { grid-template-columns: 1fr 1.05fr !important; gap: 14px !important; }
  .report-chart { margin-top: 10px !important; padding: 10px 14px !important; }
  /* The plot is already short and wide by aspect, so print only needs to stop
     it stretching: 100% of a 186mm column is about 180px tall, which the sheet
     has room for. The legend swatches are svgs too — hence the role filter. */
  .report-chart svg[role="img"] { max-height: 150px; }
  .report-chart details { display: none !important; }
  .report-title { font-size: 19px !important; margin-bottom: 2px !important; }
  .report-lede { margin-bottom: 10px !important; }
  .report-strip { margin-top: 12px !important; padding-top: 8px !important; padding-bottom: 8px !important; }
  .report-legal { margin-top: 10px !important; }
}
`;

export default function RepaymentReportContent({
  snapshot,
}: {
  snapshot: RepaymentSnapshot;
}) {
  const r = calculateRepayments(snapshot);
  const freqLabel = FREQUENCIES.find((f) => f.key === snapshot.frequency)?.label ?? "Fortnightly";
  const usingExtra = r.extraPerPeriod > 0;
  const clearsEarly = usingExtra && r.periods < r.scheduledPeriods;
  const interestPct = Math.round(r.interestShare * 100);
  const payoffAtYears = clearsEarly ? r.periods / r.perYear : null;

  const prepared = new Intl.DateTimeFormat("en-NZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const inputs: [string, string][] = [
    ["Loan amount", nzd(snapshot.amount)],
    ["Interest rate", `${snapshot.rate.toFixed(2)}%`],
    ["Loan term", `${snapshot.years} years`],
    ["Repayment frequency", freqLabel],
    [
      "Extra repayment",
      usingExtra
        ? snapshot.extraMode === "percent"
          ? `${snapshot.extraValue}% of the loan a year`
          : `${nzd(snapshot.extraValue)} per payment`
        : "None",
    ],
  ];

  return (
    <div data-cmp="RepaymentReport" className="min-h-screen bg-valar-fog py-8">
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />

      <div className="report-page mx-auto max-w-[820px] px-4">
        <div className="report-screen-only mb-4 flex items-center justify-between gap-4">
          <Link
            href="/calculators/repayments"
            className="text-sm font-semibold text-valar-navy hover:text-valar-amber"
          >
            &larr; Back to the calculator
          </Link>
          <PrintButton />
        </div>

        <div className="report-sheet rounded-lg border border-valar-concrete bg-white shadow-sm">
          <div className="report-masthead flex items-end justify-between gap-4 bg-valar-navy px-8 py-5">
            <div>
              <p className="text-base font-bold tracking-[0.08em] text-white">VALAR</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-valar-steel">
                Financial Advisors
              </p>
            </div>
            <p className="text-[11px] text-valar-lilac">Prepared {prepared}</p>
          </div>

          <div className="report-body px-8 py-7">
            <div className="h-[2px] w-8 bg-valar-amber" />
            <h1 className="report-title mt-3 mb-1 text-2xl font-bold text-valar-navy">
              Mortgage repayment summary<span className="text-valar-amber">.</span>
            </h1>
            <p className="report-lede mb-6 text-sm text-gray-600">
              The figures you ran on the Valar repayments calculator.
            </p>

            {/* What went in, and what came out. */}
            <div className="report-block report-cols grid gap-5 md:grid-cols-[1fr_1.05fr]">
              <div className="rounded-lg border border-valar-concrete p-5">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500">
                  What this is based on
                </p>
                <dl className="flex flex-col gap-2">
                  {inputs.map(([label, value]) => (
                    <div key={label} className="flex items-baseline justify-between gap-4">
                      <dt className="text-[13px] text-gray-600">{label}</dt>
                      <dd className="text-[13px] font-bold tabular-nums text-valar-navy">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="rounded-lg bg-valar-navy p-5 text-white">
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-valar-amber">
                  Your {freqLabel.toLowerCase()} repayment
                </p>
                <p className="text-3xl font-bold tabular-nums">{nzd(r.totalPayment, 2)}</p>
                {usingExtra && (
                  <p className="mt-1 text-xs text-valar-lilac">
                    {nzd(r.basePayment, 2)} required, plus {nzd(r.extraPerPeriod, 2)} extra
                  </p>
                )}

                <div className="mt-4 flex flex-col gap-1.5 border-t border-white/15 pt-3 text-[13px]">
                  <div className="flex justify-between gap-4">
                    <span className="text-valar-lilac">Paid per year</span>
                    <span className="font-semibold tabular-nums">
                      {nzd(r.totalPayment * r.perYear)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-valar-lilac">Total interest</span>
                    <span className="font-semibold tabular-nums">{nzd(r.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-valar-lilac">Total repaid</span>
                    <span className="font-semibold tabular-nums">{nzd(r.totalPaid)}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex h-1.5 overflow-hidden rounded-full">
                    <div
                      className="bg-valar-horizon"
                      style={{ width: `${(1 - r.interestShare) * 100}%` }}
                    />
                    <div className="w-[2px] shrink-0 bg-valar-navy" />
                    <div className="flex-1 bg-valar-amber" />
                  </div>
                  <div className="mt-1.5 flex justify-between text-[11px] text-valar-lilac">
                    <span>Amount borrowed</span>
                    <span>Interest &middot; {interestPct}%</span>
                  </div>
                </div>
              </div>
            </div>

            {clearsEarly && (
              <p className="report-block report-strip mt-4 rounded-lg bg-valar-amber/12 px-5 py-3 text-[13px] leading-relaxed text-valar-navy">
                <span className="font-bold">
                  Paying{" "}
                  {snapshot.extraMode === "amount"
                    ? nzd(r.extraPerPeriod)
                    : `${snapshot.extraValue}%`}{" "}
                  extra
                </span>{" "}
                clears the loan <b>{describeDuration(r.periodsSaved, r.perYear)}</b> early and saves{" "}
                <b>{nzd(r.interestSaved)}</b> in interest.
                {r.overAllowance && (
                  <>
                    {" "}
                    Note that this is more than {EXTRA_CAP_PERCENT}% of the loan a year — on a fixed
                    rate most lenders charge a break cost above roughly that, so check your loan
                    contract before setting it up.
                  </>
                )}
              </p>
            )}

            {/* The shape of it. This is the block that decides whether the
                sheet stays on one page — see the chart height in PRINT_CSS. */}
            <div className="report-block report-chart mt-5 rounded-lg bg-valar-navy p-5">
              <BalanceChart
                series={r.series}
                showExtra={usingExtra}
                payoffAtYears={payoffAtYears}
                payoffLabel={clearsEarly ? describeDuration(r.periods, r.perYear) : null}
                earlyLabel={clearsEarly ? describeDuration(r.periodsSaved, r.perYear) : null}
                /* Wider and shorter than on the calculator page. The curve is
                   the same; a document has width to spare and no height. */
                aspect={{ w: 620, h: 170 }}
              />
            </div>

            <div className="report-block report-strip mt-5 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-valar-concrete bg-valar-fog px-5 py-4">
              <p className="max-w-[46ch] text-[13px] leading-relaxed text-gray-700">
                <b className="text-valar-navy">
                  Knowing the repayment is not the same as knowing the structure.
                </b>{" "}
                How the loan is split, what you fix and for how long, and where the extra payment
                should go — that is the conversation a calculator cannot have.
              </p>
              <span className="rounded-md bg-valar-amber px-4 py-2 text-[13px] font-bold text-valar-navy">
                Book a clarity call &middot; valar.co.nz/book
              </span>
            </div>

            <p className="report-legal mt-5 text-[11px] leading-relaxed text-gray-500">
              Indicative only. It assumes the rate stays fixed for the full term, which it will not —
              this is a comparison tool, not a quote, and not personalised advice on any particular
              loan. Lena Bykova (FSP1010055) trades as Valar Financial Advisors. A disclosure
              statement is available free of charge on request. valar.co.nz
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
