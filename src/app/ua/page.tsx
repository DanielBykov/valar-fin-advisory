import type { Metadata } from "next";
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
   * The search title leads with "іпотека" and the page's own name follows it.
   * Nobody searches for "дім і капітал" — they search for the problem, and the
   * title tag is the one piece of this page written for the search box rather
   * than for the person once they arrive.
   *
   * "Родинам" is gone from both, at Lena's instruction: she advises people who
   * are not families too, and the word quietly turned some of them away.
   */
  title: "Іпотека та капітал у Новій Зеландії українською | Valar Financial Advisors",
  description:
    "Іпотека, рефінансування та побудова капіталу в Новій Зеландії, українською. Скільки можна позичити, який потрібен депозит, як пройти шлях до ключів. Безкоштовна розмова.",
  alternates: { canonical: "https://valar.co.nz/ua" },
  openGraph: {
    title: "Від першого дому до власного капіталу | Нова Зеландія",
    description:
      "Від першої розмови до ключів. І далі. Ліцензована іпотечна та інвестиційна радниця, яка говорить вашою мовою.",
    locale: "uk_UA",
    images: ["/opengraph.jpg"],
  },
};

export default function Page() {
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
