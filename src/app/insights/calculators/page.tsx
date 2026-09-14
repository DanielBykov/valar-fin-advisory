import { permanentRedirect } from "next/navigation";

/**
 * Calculators moved out of Insights and onto their own top-level section on
 * 2026-08-28. This route stays so that the old address — which is in the
 * sitemap Google has already crawled, and in the header menu of every page
 * served before the move — lands on the new hub instead of a 404.
 */
export default function Page() {
  permanentRedirect("/calculators");
}
