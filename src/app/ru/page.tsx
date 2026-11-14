import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RuContent from "./page-content";
import { JsonLd } from "@/components/json-ld";
import { getFaqSchema } from "@/lib/schema";
import { RU_FAQ } from "@/lib/ru-faq";
import { RU_LIVE } from "@/lib/ru-live";

export const metadata: Metadata = {
  /* Same limits as `/ua`: title under ~60 characters and description under ~155,
     where Google cuts them. Its share card is its own for the same reason too:
     the link is posted in Russian-speaking groups. */
  title: "Ипотека в Новой Зеландии | Valar",
  description:
    "Как купить дом в Новой Зеландии: от первого шага до ключей. Бесплатный вебинар, подробный гайд и консультация.",
  alternates: { canonical: "https://valar.co.nz/ru" },
  openGraph: {
    title: "Как купить дом в Новой Зеландии | Valar",
    description:
      "Всё о покупке жилья и ипотеке: от первого шага до ключей. Бесплатный вебинар, пошаговый гайд и консультация финансового советника.",
    url: "https://valar.co.nz/ru",
    type: "website",
    siteName: "Valar Financial Advisors",
    locale: "ru_RU",
    images: [
      {
        url: "/images/og-ru.jpg",
        width: 2400,
        height: 1260,
        alt: "Недвижимость и инвестиции в Новой Зеландии. От покупки первого дома до инвестиций и финансовой независимости.",
      },
    ],
  },
};

export default function Page() {
  if (process.env.NODE_ENV !== "development" && !RU_LIVE) notFound();
  return (
    <>
      <JsonLd data={getFaqSchema(RU_FAQ)} />
      <RuContent />
    </>
  );
}
