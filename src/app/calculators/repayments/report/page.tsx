import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { calculatorVisible } from "@/lib/calculators";
import { snapshotFromSearchParams } from "@/lib/repayment-report";
import RepaymentReportContent from "./page-content";

/*
 * A report URL describes one person's loan, so it stays out of search and out
 * of the sitemap. It is not secret — there is nothing here the sender did not
 * type themselves — but it has no business being indexed.
 */
export const metadata: Metadata = {
  title: "Your mortgage repayment summary | Valar",
  robots: { index: false, follow: false },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (!calculatorVisible("repayments")) notFound();

  // No figures, or figures that are not a loan: there is no report to show, and
  // an empty sheet with default numbers on it would be worse than a 404.
  const snapshot = snapshotFromSearchParams(await searchParams);
  if (!snapshot) notFound();

  return <RepaymentReportContent snapshot={snapshot} />;
}
