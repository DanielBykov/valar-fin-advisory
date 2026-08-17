import { redirect } from "next/navigation";

/**
 * Articles live at /insights/articles/[slug]. The bare /insights/articles
 * segment has no page of its own — the article list is on /insights — so
 * anyone who trims the URL back lands there instead of a 404.
 */
export default function Page() {
  redirect("/insights");
}
