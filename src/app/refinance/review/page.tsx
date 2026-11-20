import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { REFINANCE_LIVE } from "@/lib/refinance";
import { openReviewRequest } from "@/lib/refinance-link";
import ReviewContent from "./page-content";

/*
 * Where "Let's review my mortgage" in the refinance email lands. Private by
 * nature: one link per visitor, so it stays out of search and the sitemap.
 */
export const metadata: Metadata = {
  title: "Thank you | Valar Financial Advisors",
  robots: { index: false, follow: false },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (!REFINANCE_LIVE && process.env.NODE_ENV !== "development") notFound();
  const { t, m } = await searchParams;
  const token = typeof t === "string" ? t : "";
  // Opened here only for the name on the ready message; the API checks it again on send.
  const request = openReviewRequest(token, new Date().toISOString().slice(0, 10));
  return (
    <ReviewContent
      token={token}
      firstName={request?.firstName ?? null}
      kind={m === "address" ? "address" : "review"}
    />
  );
}
