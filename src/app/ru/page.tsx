import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RuContent from "./page-content";
import { JsonLd } from "@/components/json-ld";
import { getFaqSchema } from "@/lib/schema";
import { RU_FAQ } from "@/lib/ru-faq";

export const metadata: Metadata = {
  /* Same limits as `/ua`: title under ~60 characters and description under ~155,
     where Google cuts them. Its share card is its own for the same reason too:
     the link is posted in Russian-speaking groups. */
  title: "Как купить дом в Новой Зеландии: mortgage пошагово | Valar",
  description:
    "Весь путь от оффера до ключей: сколько можно занять и как банк оценивает ваш доход. Вебинар, подробный гайд и бесплатная консультация на русском.",
  alternates: { canonical: "https://valar.co.nz/ru" },
  openGraph: {
    title: "Недвижимость и инвестиции в Новой Зеландии | Valar",
    description: "Вебинар, подробный гайд и AI-помощник Valári. На русском.",
    url: "https://valar.co.nz/ru",
    type: "website",
    siteName: "Valar Financial Advisors",
    locale: "ru_RU",
    images: [
      {
        url: "/images/og-ru.jpg",
        width: 2400,
        height: 1260,
        alt: "Как купить дом в Новой Зеландии. Пошагово. На русском.",
      },
    ],
  },
};

/*
 * Off until Lena has corrected the copy and the Russian webinar is recorded and
 * uploaded: the form promises a recording, so publishing without one would take
 * an email and hand back nothing. Off answers 404 in production while local
 * development ignores the switch. Add the route to `sitemap.ts` when this flips.
 */
const RU_LIVE = false;

export default function Page() {
  if (process.env.NODE_ENV !== "development" && !RU_LIVE) notFound();
  return (
    <>
      <JsonLd data={getFaqSchema(RU_FAQ)} />
      <RuContent />
    </>
  );
}
