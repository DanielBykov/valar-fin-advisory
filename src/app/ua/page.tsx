import type { Metadata } from "next";
import { notFound } from "next/navigation";
import UaContent from "./page-content";
import { JsonLd } from "@/components/json-ld";
import { getFaqSchema } from "@/lib/schema";
import { UA_FAQ } from "@/lib/ua-faq";

/*
 * Indexed, unlike `/start`.
 *
 * `/start` is a link handed out in a bio and has nothing to gain from search.
 * This page has the opposite problem: "іпотека Нова Зеландія" and "як купити
 * дім у Новій Зеландії" are searched by exactly the people it is for and
 * almost nobody is answering them in Ukrainian. Search is the half of its
 * traffic that keeps arriving after the ad budget stops.
 */
export const metadata: Metadata = {
  /*
   * Lena's wording, 2026-10-20. The title leads with the question people type
   * ("як купити дім у Новій Зеландії") and matches the share image, so search
   * and social say the same thing. It stays under ~60 characters and the
   * description under ~155, the points where Google cuts them: the description
   * ends on the free consultation, which is the part that must survive.
   *
   * "Родинам" stays out of both, at Lena's instruction: she advises people who
   * are not families too, and the word quietly turned some of them away.
   */
  title: "Як купити дім у Новій Зеландії: іпотека покроково | Valar",
  description:
    "Весь шлях від оферу до ключів: скільки можна позичити і як банк оцінює ваш дохід. Вебінар, детальний гайд і безкоштовна консультація українською.",
  alternates: { canonical: "https://valar.co.nz/ua" },
  openGraph: {
    title: "Від першого дому до власного капіталу | Нова Зеландія",
    /* Short on purpose: Facebook cuts the preview line at about 70
       characters, and this one has to survive whole (Lena, 2026-10-20). */
    description: "Вебінар, детальний гайд і AI-помічник Valári. Українською.",
    // Facebook's debugger flags both as missing; it guesses them, but should not have to.
    url: "https://valar.co.nz/ua",
    type: "website",
    siteName: "Valar Financial Advisors",
    locale: "uk_UA",
    /* Its own card, not the site's English lighthouse (2026-10-20): the link
       is posted in Ukrainian groups, and an English headline on the preview
       tells that reader the page is not for them before they click. The
       image says the task, the og:title under it says the journey, so the
       two lines of a preview never repeat each other. */
    images: [
      {
        url: "/images/og-ua.jpg",
        /* Double size: LinkedIn recompresses every share image, and at
           1200 wide the result looked soft on high-density screens. */
        width: 2400,
        height: 1260,
        alt: "Як купити дім у Новій Зеландії. Покроково. Українською.",
      },
    ],
  },
};

/*
 * Live since 2026-10-19, on Lena's word that the page and both MailerLite
 * flows are finished. Turning it off again answers 404 in production while
 * local development ignores the switch, the same rule the calculators use.
 * Nothing on the site links here; its traffic comes from Ukrainian community
 * groups, the webinar emails and search (it is in the sitemap since 2026-10-20).
 */
const UA_LIVE = true;

export default function Page() {
  if (process.env.NODE_ENV !== "development" && !UA_LIVE) notFound();
  return (
    <>
      {/* The same six questions the page shows, as FAQ structured data. They
          come from one module so the markup and the page can never disagree —
          which is the failure Google penalises rather than rewards. */}
      <JsonLd data={getFaqSchema(UA_FAQ)} />
      <UaContent />
    </>
  );
}
