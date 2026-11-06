"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  ExternalLink,
  FileText,
  Sparkles,
  Check,
  Play,
  Mail,
  Compass,
  PiggyBank,
  ChartCandlestick,
  Briefcase,
  Home,
  TrendingUp,
  Instagram,
  Linkedin,
  Facebook,
} from "lucide-react";
import heroBandImg from "../../../public/images/first-home-villa.png";
import firstHomeImg from "../../../public/images/first-home-guide.png";
import contactImg from "../../../public/images/lena-client.webp";
import aboutImg from "../../../public/images/lena-portrait.webp";
import { GuideCaptureForm } from "@/components/guide-capture-form";
import { UaWebinarPlayer, type WebinarSection } from "@/components/ua-webinar-player";
import { LEAD_MAGNETS } from "@/lib/lead-magnets";
import { trackMetaEvent } from "@/lib/meta-pixel";
import type { UaResource } from "@/lib/ua-resources";
import { ruResourcesOfKind } from "@/lib/ru-resources";
import { RU_FAQ, RU_FAQ_GROUPS } from "@/lib/ru-faq";
import FaqAccordion from "@/components/insights/faq-accordion";

/**
 * The Russian landing page: `/ua` in Russian, section for section.
 *
 * A copy rather than one component fed two languages, because `/ua` is live and
 * this one is a draft. Sharing the markup now would mean every correction here
 * risks the page that is already taking leads. The reasoning behind the layout
 * is written up in `src/app/ua/page-content.tsx`; only what differs is noted here.
 */

const HERO_CTA =
  "flex items-center gap-3 rounded-sm px-5 py-3.5 text-[15px] font-semibold transition-colors [text-shadow:none]";
const HERO_CTA_SECONDARY =
  "border border-white/40 bg-valar-navy/55 text-white hover:border-white/70 hover:bg-valar-navy/75";

const GUIDE = LEAD_MAGNETS["ru-home-buying-journey"];
const WEBINAR = LEAD_MAGNETS["ru-first-home-webinar"];

const SOURCE_GUIDE = "Russian landing page — guide";
const SOURCE_WEBINAR = "Russian landing page — webinar";

const SITUATIONS = [
  {
    icon: Compass,
    title: "Хочу свой дом. С чего начать?",
    body: "Давно снимаете жильё, мечтаете о своём? Разберёмся, сколько вы можете занять и с чего начать.",
  },
  {
    icon: PiggyBank,
    title: "Депозит есть. Что дальше?",
    body: "Накопили деньги на первый взнос, но не знаете, хватит ли их? Помогу оценить ваши возможности.",
  },
  {
    icon: ChartCandlestick,
    title: "Хочу начать инвестировать",
    body: "Недвижимость, mutual funds, KiwiSaver. Помогу разобраться в вариантах, выстроить стратегию.",
  },
  {
    icon: Briefcase,
    title: "Нестандартный доход",
    body: "Самозанятость, контрактная работа или доход из-за границы. Разберёмся, как банк посчитает ваш доход.",
  },
  {
    icon: Home,
    title: "Рефинанс или top-up",
    body: "Ремонт, покупка авто. Посмотрим, какие варианты доступны и как оптимизировать ваши долги.",
  },
  {
    icon: TrendingUp,
    title: "Стратегия на годы вперёд",
    body: "Инвестиции, капитал и пенсия. Помогу составить финансовую стратегию на 15–20 лет.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Первый разговор",
    body: "Знакомимся, обсуждаем ваши цели и финансовую ситуацию. Первая консультация бесплатная, обычно 20–30 минут.",
  },
  {
    n: "02",
    title: "Стратегия",
    body: "Сравниваем варианты, просчитываем риски и выбираем структуру кредита, которая подходит вам сегодня и на будущее.",
  },
  /* "Финансирования", not "покупки": Lena's correction on `/ua`. She does not run
     the lawyer, the agent or the builder's report, and must not appear to. */
  {
    n: "03",
    title: "Получение ипотеки",
    body: "Я общаюсь с банками, веду заявку, сопровождаю одобрение и помогаю пройти весь путь до settlement.",
  },
  {
    n: "04",
    title: "Остаёмся на связи",
    body: "Ставки и обстоятельства меняются. Пересматриваем ипотеку и финансовую стратегию по мере необходимости.",
  },
];

const GUIDE_CONTENTS = [
  "С чего начать, если вы ещё ничего не делали",
  "Сколько на самом деле нужно на депозит",
  "Как банк смотрит на ваш доход и что на это влияет",
  "Каждый шаг процесса вплоть до ключей",
  "Коучинговые вопросы в конце, чтобы составить собственную стратегию покупки",
];

/*
 * ⛔ Null until the Russian recording is on Cloudflare Stream, with its allowed
 * origins restricted to valar.co.nz. While it is null the form takes an email and
 * the frame keeps showing the poster, which is why `RU_LIVE` stays false.
 */
const WEBINAR_EMBED_URL: string | null = null;

const WEBINAR_UNLOCK_KEY = "valar.ru.webinar.unlocked";

const unlockListeners = new Set<() => void>();

const webinarUnlock = {
  subscribe(onChange: () => void) {
    unlockListeners.add(onChange);
    const relay = (e: StorageEvent) => {
      if (e.key === null || e.key === WEBINAR_UNLOCK_KEY) onChange();
    };
    window.addEventListener("storage", relay);
    return () => {
      unlockListeners.delete(onChange);
      window.removeEventListener("storage", relay);
    };
  },
  read(): boolean {
    try {
      return window.localStorage.getItem(WEBINAR_UNLOCK_KEY) === "1";
    } catch {
      return false;
    }
  },
  write() {
    try {
      window.localStorage.setItem(WEBINAR_UNLOCK_KEY, "1");
    } catch {
      /* not being able to remember it is not a reason to not show it now */
    }
    unlockListeners.forEach((notify) => notify());
  },
};

/*
 * ⚠️ These timings and the duration are the UKRAINIAN recording's, kept only as
 * a scaffold. Every line has to be re-read off the Russian recording once it
 * exists, and so do the claims in `WEBINAR_TEASER.facts`.
 */
const WEBINAR_DURATION = "1 ч 54 мин";

const WEBINAR_SECTIONS: WebinarSection[] = [
  {
    title: "Вступление",
    chapters: [
      { at: "0:00", title: "Для кого этот вебинар" },
      { at: "4:09", title: "Обо мне" },
      { at: "5:47", title: "Путь к ключам и базовые термины" },
    ],
  },
  {
    title: "1. Кто и зачем покупает",
    chapters: [{ at: "11:17", title: "Аренда или свой дом. Кто может покупать" }],
  },
  {
    title: "2. Банк, депозит и бюджет",
    chapters: [
      { at: "14:10", title: "Как банк оценивает вас и сколько можно занять" },
      { at: "18:17", title: "Депозит: 5%, 10–20% или 20%" },
      { at: "22:49", title: "Откуда берётся депозит" },
      { at: "25:15", title: "Дополнительные расходы и ваш бюджет" },
    ],
  },
  {
    title: "3. Ставки и стресс-тест",
    chapters: [
      { at: "29:21", title: "Ставки: OCR, фиксированная, сплит, offset" },
      { at: "38:09", title: "Стресс-тест: сколько брать на самом деле" },
    ],
  },
  {
    title: "4. Рынок и выборы",
    chapters: [{ at: "44:17", title: "Рынок сейчас, регионы и выборы" }],
  },
  {
    title: "5. Выбор и проверка дома",
    chapters: [
      { at: "58:12", title: "Типы недвижимости" },
      { at: "1:03:39", title: "Состояние дома и building inspection" },
    ],
  },
  {
    title: "6. Процесс покупки",
    chapters: [
      { at: "1:06:53", title: "Ваша команда: адвайзер, юрист, инспектор" },
      { at: "1:10:30", title: "Аукцион, переговоры, тендер" },
      { at: "1:14:06", title: "Этапы заключения договора купли-продажи" },
    ],
  },
  {
    title: "7. Реальные кейсы",
    chapters: [
      { at: "1:23:14", title: "Четыре реальных кейса" },
      { at: "1:35:38", title: "Мыслить как инвестор" },
    ],
  },
  {
    title: "8. План действий и ошибки",
    chapters: [
      { at: "1:40:16", title: "План на 8 недель и типичные ошибки" },
      { at: "1:47:47", title: "Итоги, консультация и бонус Valári" },
    ],
  },
];

const WEBINAR_TEASER = {
  facts: ["8 разделов", "2 часа", "4 реальных кейса", "план на 8 недель"],
  heading: "Вопросы, на которые отвечает вебинар",
  questions: [
    "Как построить стратегию покупки?",
    "Как банк оценивает ваш доход?",
    "Сколько занимать, чтобы пережить рост ставок?",
    "Как пройти путь от оффера до ключей?",
    "Кого взять в команду и что проверить?",
    "Каких ошибок избегать, покупая впервые?",
  ],
  outcomes: [
    {
      icon: Compass,
      lead: "Структура в голове:",
      text: "что делать, в каком порядке, на что обратить внимание.",
    },
    {
      icon: Sparkles,
      lead: "Valári на почту:",
      text: "AI skill, который поможет построить собственную систему и ответить на ваши вопросы.",
    },
  ],
};

const HELP_WITH = [
  "Покупка первого дома",
  "Рефинансирование",
  "Renovation и top-up",
  "Инвестиционная недвижимость",
  "KiwiSaver и инвестиции",
  "Стратегия на будущее",
];

const RESOURCE_SECTIONS: { kind: UaResource["kind"]; title: string; intro: string }[] = [
  {
    kind: "course",
    title: "Курс «Как купить дом»",
    intro: "Пошагово и в своём темпе: весь процесс от депозита до ключей.",
  },
  { kind: "video", title: "Видео", intro: "Короткие разборы того, о чём чаще всего спрашивают." },
  {
    kind: "tool",
    title: "Калькуляторы",
    intro: "Посчитайте свои цифры самостоятельно, ещё до разговора.",
  },
];

/* `locale: "ru"` decides the language of the automatic reply; see the contact route. */
function RuContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale: "ru" }),
      });
      const json = await res.json();
      if (json.success) {
        setSucceeded(true);
        trackMetaEvent("Contact", "Contact form (RU)");
      } else setError("Не удалось отправить. Попробуйте ещё раз, пожалуйста.");
    } catch {
      setError("Не удалось отправить. Попробуйте ещё раз, пожалуйста.");
    }
    setSubmitting(false);
  }

  if (succeeded) {
    return (
      <div className="py-2 text-center">
        <div className="mx-auto mb-6 inline-flex items-center justify-center rounded-md bg-valar-navy px-5 py-3">
          <Image
            src="/images/valar-logo.webp"
            alt="Valar Financial Advisors"
            width={180}
            height={48}
            className="h-5 w-auto object-contain"
          />
        </div>
        <h3 className="mb-1 text-xl font-bold text-valar-navy">Спасибо!</h3>
        <p className="text-base text-valar-navy/80">Ваше сообщение у меня.</p>
        <div className="mx-auto my-5 h-[2px] w-8 bg-valar-amber" />
        <p className="text-sm leading-relaxed text-valar-indigo">
          Отвечу в течение одного рабочего дня. Письмо с подтверждением уже отправлено на вашу
          почту.
        </p>
      </div>
    );
  }

  const field =
    "bg-valar-fog w-full px-3 rounded-md border border-valar-concrete text-sm focus:outline-none focus:ring-2 focus:ring-valar-navy/20";
  const label = "text-xs font-semibold text-valar-navy uppercase tracking-wide";

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1.5">
        <label htmlFor="ru-contact-firstName" className={label}>
          Имя
        </label>
        <input
          id="ru-contact-firstName"
          name="firstName"
          type="text"
          required
          autoComplete="given-name"
          className={`${field} h-10`}
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="ru-contact-lastName" className={label}>
          Фамилия
        </label>
        <input
          id="ru-contact-lastName"
          name="lastName"
          type="text"
          required
          autoComplete="family-name"
          className={`${field} h-10`}
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="ru-contact-email" className={label}>
          Электронная почта
        </label>
        <input
          id="ru-contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={`${field} h-10`}
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="ru-contact-phone" className={label}>
          Телефон{" "}
          <span className="font-normal normal-case text-valar-indigo/40">(по желанию)</span>
        </label>
        <input
          id="ru-contact-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          className={`${field} h-10`}
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="ru-contact-message" className={label}>
          Ваш вопрос
        </label>
        <textarea
          id="ru-contact-message"
          name="message"
          rows={5}
          required
          placeholder="Коротко о вашей ситуации: где вы сейчас и что хотите понять."
          className={`${field} resize-none p-3 placeholder:text-valar-indigo/40`}
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-sm bg-valar-amber py-3 text-sm font-bold text-valar-navy transition-colors hover:bg-valar-amber-hover disabled:opacity-60"
      >
        {submitting ? "Отправляю…" : "Отправить сообщение"}
      </button>
      <p className="text-center text-xs text-valar-indigo/50">
        Отправляя форму, вы соглашаетесь с{" "}
        <a href="/privacy-policy" className="underline hover:text-valar-navy">
          политикой конфиденциальности
        </a>
        .
      </p>
    </form>
  );
}

export default function RuContent() {
  const sections = RESOURCE_SECTIONS.map((s) => ({
    ...s,
    items: ruResourcesOfKind(s.kind),
  })).filter((s) => s.items.length > 0);

  const webinarUnlocked = useSyncExternalStore(
    webinarUnlock.subscribe,
    webinarUnlock.read,
    () => false,
  );

  return (
    <div lang="ru" data-cmp="RuPage" className="w-full bg-valar-fog font-sans">
      {/* ───────────────────────── HERO ───────────────────────── */}
      <section
        data-cmp="RuPage.Hero"
        className="relative isolate flex min-h-[480px] w-full items-center overflow-hidden md:aspect-[1920/819] md:max-h-[680px] md:min-h-[520px]"
      >
        <Image
          src={heroBandImg}
          alt="Новозеландский дом с мальвами и подсолнухами, вдали море"
          fill
          sizes="100vw"
          priority
          placeholder="blur"
          className="-z-10 object-cover object-[70%_center] md:object-[center_38%]"
        />
        {/* Below md the text sits over the bright house, not over sky, so the
            phone overlay is heavier (Lena, 2026-11-03: hard to read). */}
        <div className="absolute inset-0 -z-10 bg-valar-navy/60 md:bg-valar-navy/30 md:bg-linear-to-r md:from-valar-navy/75 md:via-valar-navy/22 md:via-48% md:to-transparent md:to-72%" />

        <div className="container mx-auto px-6 py-10 md:px-12 md:py-14">
          <div className="relative h-7 w-[132px]">
            <Image
              src="/images/valar-logo.webp"
              alt="Valar Financial Advisors"
              fill
              sizes="132px"
              priority
              className="object-contain"
            />
          </div>

          <div className="mt-8 max-w-xl text-white [text-shadow:0_1px_2px_rgb(6_22_52_/_0.9),0_2px_18px_rgb(6_22_52_/_0.6)]">
            {/* Lena, 2026-11-03: the yellow line names what she works on, in English on
                purpose; the heading says it in Russian and places it in New Zealand.
                Smaller and tighter on phones: it wraps onto "Building" at 360px otherwise. */}
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-valar-amber sm:text-[12px] sm:tracking-[0.14em]">
              Mortgage · Investments · Wealth Building
            </p>

            <h1 className="mt-3 text-[30px] font-medium leading-tight tracking-tight md:text-[40px]">
              Недвижимость и инвестиции в Новой Зеландии
              <span className="text-valar-amber">.</span>
            </h1>

            <p className="mt-3 text-[15px] font-light leading-relaxed text-white/80 md:text-[16px]">
              От покупки первого дома до инвестиций и финансовой независимости.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <a
                href="#contact"
                data-cmp="RuPage.Cta.Contact"
                className={`${HERO_CTA} bg-valar-amber text-valar-navy hover:bg-valar-amber-hover`}
              >
                <Mail className="h-[18px] w-[18px] shrink-0" />
                Написать мне
              </a>
              <a
                href="#webinar"
                data-cmp="RuPage.Cta.Webinar"
                className={`${HERO_CTA} ${HERO_CTA_SECONDARY}`}
              >
                <Play className="h-[18px] w-[18px] shrink-0 fill-valar-amber text-valar-amber" />
                Смотреть вебинар
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────── УЖЕ ЕСТЬ ─────────────────────── */}
      <nav
        aria-label="Материалы на русском"
        data-cmp="RuPage.Materials"
        className="bg-valar-fog px-6 py-10"
      >
        <div className="container mx-auto max-w-5xl">
          <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-valar-amber">
            Полезные материалы
          </p>
          <ul className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              {
                href: "#webinar",
                Icon: Play,
                label: "Вебинар",
                body: "Как получить ипотеку и купить дом в Новой Зеландии.",
              },
              {
                href: "#guide",
                Icon: FileText,
                label: "Гайд",
                body: "Пошаговое руководство по покупке первого дома + Coaching Workbook.",
              },
              {
                href: "#webinar",
                Icon: Sparkles,
                label: "AI-помощник Valári",
                body: "Ответы на вопросы об ипотеке и недвижимости на вашем языке.",
              },
            ].map(({ href, Icon, label, body }) => (
              <li key={label}>
                <a
                  href={href}
                  className="group flex h-full items-start gap-3 rounded-sm border border-valar-concrete bg-white p-4 transition-colors hover:border-valar-amber"
                >
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-valar-amber/15">
                    <Icon className="h-[18px] w-[18px] text-valar-amber" strokeWidth={1.75} />
                  </span>
                  <span>
                    <span className="flex items-center gap-1.5 text-[15px] font-bold text-valar-navy">
                      {label}
                      <ArrowRight className="h-3.5 w-3.5 text-valar-amber transition-transform group-hover:translate-x-0.5" />
                    </span>
                    <span className="mt-1 block text-[14px] leading-snug text-valar-indigo">
                      {body}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ───────────────────── ЭТО ПРО ВАС ───────────────────── */}
      <section data-cmp="RuPage.Pains" className="bg-white px-6 py-16">
        <div className="container mx-auto max-w-5xl">
          <div className="h-[2px] w-8 bg-valar-amber" />
          <h2 className="mt-4 text-[26px] font-bold tracking-tight text-valar-navy md:text-[32px]">
            Узнаёте себя?
          </h2>

          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SITUATIONS.map((s) => (
              <div
                key={s.title}
                className="flex h-full flex-col rounded-sm border border-valar-concrete bg-valar-fog p-6 transition-colors hover:border-valar-amber"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-valar-amber/15">
                    <s.icon className="h-[18px] w-[18px] text-valar-amber" strokeWidth={1.75} />
                  </span>
                  <h3 className="text-[17px] font-bold leading-snug text-valar-navy">{s.title}</h3>
                </div>
                <p className="mt-4 text-[15px] leading-relaxed text-valar-indigo">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 border-l-2 border-valar-amber pl-6">
            <p className="text-[18px] font-bold leading-snug text-valar-navy md:whitespace-nowrap md:text-[20px]">
              Если хотя бы один пункт про вас, давайте поговорим.
            </p>
            <p className="mt-3 text-[16px] leading-relaxed text-valar-indigo">
              Помогу разобраться в вашей финансовой ситуации, оценить возможности и определить
              следующие шаги.
            </p>
            <p className="mt-3 text-[16px] leading-relaxed text-valar-indigo">
              А как действовать дальше, вы решите сами.
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────────────── ОБО МНЕ ───────────────────────── */}
      <section data-cmp="RuPage.About" className="bg-valar-fog px-6 py-14">
        <div className="container mx-auto max-w-5xl">
          <div className="h-[2px] w-8 bg-valar-amber" />
          <h2 className="mt-4 text-[26px] font-bold tracking-tight text-valar-navy md:text-[32px]">
            Кто я и чем могу помочь
          </h2>

          <div className="mt-8 grid gap-8 md:grid-cols-[300px_1fr] md:items-start md:gap-14">
            <div className="relative aspect-[4/5] w-full max-w-[280px] overflow-hidden rounded-sm md:max-w-none">
              <Image
                src={aboutImg}
                alt="Лина Быкова"
                width={1920}
                height={2152}
                sizes="(min-width: 768px) 480px, 440px"
                placeholder="blur"
                className="absolute left-[-28%] top-[-12%] h-auto w-[155%] max-w-none"
              />
            </div>

            <div className="space-y-4 text-[16px] leading-relaxed text-valar-indigo">
              <p>
                Меня зовут Лина Быкова. У меня более 20 лет опыта в финансах, инвестиционном анализе,
                оценке бизнеса и финансовом моделировании.
              </p>
              <p>
                В Новой Зеландии живу больше десяти лет. За это время сама прошла путь от переезда и
                покупки первого дома до инвестиционной недвижимости, renovation-проектов и жизни на
                lifestyle property.
              </p>
              <p>
                Valar Financial Advisors это моя собственная лицензированная практика FAP. Я не
                просто помогаю получить кредит. Я просчитываю варианты, смотрю на всю вашу
                финансовую картину и помогаю строить стратегию на годы вперёд.
              </p>
              <p>
                Говорю на русском, украинском и английском. Выбирайте язык, на котором вам удобнее
                думать о деньгах.
              </p>
              <div className="border-l-2 border-valar-amber pl-5 pt-1">
                <p className="text-valar-navy">
                  Мне нравится работать с людьми вдолгую. От первой ипотеки до инвестиций и
                  детального финансового плана. А если однажды ко мне придут ваши близкие, это будет
                  лучшей оценкой моей работы.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-12 text-[13px] font-bold uppercase tracking-[0.14em] text-valar-amber">
            С чем ко мне приходят
          </p>
          <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {HELP_WITH.map((item) => (
              <li key={item} className="flex gap-3 text-[16px] leading-relaxed text-valar-navy">
                <Check className="mt-1 h-4 w-4 shrink-0 text-valar-amber" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ──────────────────────── ВЕБИНАР ──────────────────────── */}
      <section id="webinar" data-cmp="RuPage.Webinar" className="scroll-mt-6 bg-white px-6 py-16">
        <div className="container mx-auto max-w-5xl">
          <div className="h-[2px] w-8 bg-valar-amber" />
          <p className="mt-4 text-[13px] font-bold uppercase tracking-[0.14em] text-valar-amber">
            Бесплатный вебинар
          </p>
          <h2 className="mt-3 max-w-3xl text-[28px] font-bold leading-tight tracking-tight text-valar-navy md:text-[38px]">
            Как купить дом в Новой Зеландии?
          </h2>
          <p className="mt-4 max-w-2xl text-[17px] font-light leading-relaxed text-valar-indigo md:text-[19px]">
            {WEBINAR.description}
          </p>

          <UaWebinarPlayer
            embedUrl={WEBINAR_EMBED_URL}
            unlocked={webinarUnlocked}
            title={WEBINAR.title}
            sections={WEBINAR_SECTIONS}
            teaser={WEBINAR_TEASER}
            duration={WEBINAR_DURATION}
            contentsLabels={{
              heading: "Содержание вебинара",
              jumpHint: "нажмите на раздел, чтобы перейти к нему",
              pendingHint: "разделы станут кликабельными, как только запись будет на странице",
            }}
            poster={
              <>
                {/* A stand-in until Lena's Russian title slide exists. The `/ua`
                    cover cannot be borrowed: it is a slide in Ukrainian. */}
                <Image
                  src={heroBandImg}
                  alt="Новозеландский дом с мальвами и подсолнухами"
                  fill
                  sizes="(min-width: 768px) 60vw, 100vw"
                  placeholder="blur"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-valar-navy/15" />
                <div className="absolute inset-y-0 left-0 flex w-[37.5%] flex-col items-center justify-center gap-3 px-2 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-valar-amber shadow-lg">
                    <Play className="ml-1 h-7 w-7 fill-valar-navy text-valar-navy" />
                  </span>
                  <span className="rounded-sm bg-valar-navy/85 px-3 py-1.5 text-sm font-light text-white">
                    {webinarUnlocked
                      ? "Запись вот-вот будет здесь."
                      : "Оставьте почту, и запись откроется здесь."}
                  </span>
                </div>
              </>
            }
            unlockedNote={
              <div className="flex flex-col gap-2 rounded-sm bg-valar-amber/15 px-5 py-4 text-[15px] leading-relaxed text-valar-navy sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <p>
                  <span className="font-bold">Спасибо!</span> PDF-презентация и AI-помощник Valári
                  придут вам на почту.
                </p>
                <a href="#contact" className="shrink-0 font-bold underline hover:text-valar-amber">
                  Написать мне
                </a>
              </div>
            }
            aside={
              <div className="rounded-xl border border-valar-concrete bg-valar-fog p-7 md:p-8">
                <div className="mb-6">
                  <div className="h-[2px] w-6 bg-valar-amber mb-4" />
                  <h3 className="text-[19px] font-bold leading-snug text-valar-navy">
                    Получите доступ к вебинару
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-valar-indigo">
                    Запись откроется сразу после отправки формы. На почту пришлю презентацию вебинара
                    и доступ к AI-помощнику Valári.
                  </p>
                </div>

                <GuideCaptureForm
                  guide={WEBINAR}
                  source={SOURCE_WEBINAR}
                  onSuccess={() => {
                    webinarUnlock.write();
                    requestAnimationFrame(() =>
                      document
                        .getElementById("webinar")
                        ?.scrollIntoView({ behavior: "smooth", block: "start" }),
                    );
                  }}
                  copy={{
                    firstNameLabel: "Имя",
                    lastNameLabel: "Фамилия",
                    emailLabel: "Электронная почта",
                    emailSuggestion: (fix) => <>Возможно, вы имели в виду {fix}?</>,
                    phoneLabel: "Телефон",
                    phoneOptional: "(по желанию)",
                    subscribeLabel:
                      "Подписаться на новости и материалы от Valar. Рассылка на английском.",
                    submit: "Смотреть вебинар",
                    submitting: "Отправляю…",
                    genericError: "Что-то пошло не так. Попробуйте ещё раз, пожалуйста.",
                    privacy: (link) => <>Отправляя форму, вы соглашаетесь с {link}.</>,
                    privacyLinkLabel: "политикой конфиденциальности",
                    successTitle: "Спасибо!",
                    successReady: "Запись открыта.",
                    successPending: "Запись открыта.",
                    downloadLabel: "Смотреть вебинар →",
                    emailedNote: () => <>Запись открыта на этой странице. Включайте.</>,
                    closingLine: "Будут вопросы, пишите.",
                    learnMoreLabel: "Дальше:",
                    learnMoreLinks: [{ href: "#contact", label: "написать мне" }],
                    closeLabel: "Закрыть",
                  }}
                />
              </div>
            }
          />
        </div>
      </section>

      {/* ─────────────────────── КАК МЫ РАБОТАЕМ ─────────────────────── */}
      <section data-cmp="RuPage.Steps" className="bg-valar-fog px-6 py-16">
        <div className="container mx-auto max-w-5xl">
          <div className="h-[2px] w-8 bg-valar-amber" />
          <h2 className="mt-4 text-[26px] font-bold tracking-tight text-valar-navy md:text-[32px]">
            Как мы работаем
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="flex h-full flex-col rounded-sm border border-valar-concrete bg-white p-6"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-valar-navy text-[13px] font-bold text-valar-amber">
                  {s.n}
                </span>
                <h3 className="mt-5 text-[18px] font-bold text-valar-navy">{s.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-valar-indigo">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 max-w-2xl rounded-sm bg-valar-amber/15 px-6 py-5">
            <p className="text-[16px] font-bold leading-snug text-valar-navy">
              В большинстве случаев мои услуги для вас бесплатны: платит банк.
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-valar-indigo/80">
              Если случай нетипичный, скажу о стоимости заранее. Детали в{" "}
              <Link href="/disclosure" className="underline hover:text-valar-navy">
                Disclosure Statement
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────────────── ГАЙД ───────────────────────── */}
      <section id="guide" data-cmp="RuPage.Guide" className="scroll-mt-6 bg-valar-navy px-6 py-14">
        <div className="container mx-auto grid max-w-5xl gap-10 md:grid-cols-2">
          <div className="flex flex-col">
            <div className="h-[2px] w-8 bg-valar-amber" />
            <p className="mt-4 text-[13px] font-bold uppercase tracking-[0.14em] text-valar-amber">
              Бесплатный гайд
            </p>
            <h2 className="mt-3 text-[26px] font-bold leading-tight tracking-tight text-white md:text-[30px]">
              {GUIDE.title}
            </h2>
            <p className="mt-3 text-[16px] font-light leading-relaxed text-white/85 md:text-[17px]">
              {GUIDE.description}
            </p>

            <div className="relative mt-6 min-h-[200px] w-full flex-1 overflow-hidden rounded-sm">
              <Image
                src={firstHomeImg}
                alt="Белый новозеландский дом с садом, мальвами и подсолнухами"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                placeholder="blur"
                className="object-cover"
              />
            </div>

            <p className="mt-6 text-[13px] font-bold uppercase tracking-[0.14em] text-valar-amber">
              Что внутри
            </p>
            <ul className="mt-3 space-y-2.5">
              {GUIDE_CONTENTS.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-white/85">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-valar-amber" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-white p-7 shadow-2xl md:p-8">
            <div className="mb-6">
              <div className="h-[2px] w-6 bg-valar-amber mb-4" />
              <h3 className="text-[19px] font-bold leading-snug text-valar-navy">
                Куда отправить гайд?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-valar-indigo">
                Скачаете сразу после отправки. Копию пришлю на почту.
              </p>
            </div>

            <GuideCaptureForm
              guide={GUIDE}
              source={SOURCE_GUIDE}
              copy={{
                firstNameLabel: "Имя",
                lastNameLabel: "Фамилия",
                emailLabel: "Электронная почта",
                emailSuggestion: (fix) => <>Возможно, вы имели в виду {fix}?</>,
                phoneLabel: "Телефон",
                phoneOptional: "(по желанию)",
                subscribeLabel:
                  "Подписаться на новости и материалы от Valar. Рассылка на английском.",
                submit: "Отправить мне гайд",
                submitting: "Отправляю…",
                genericError: "Что-то пошло не так. Попробуйте ещё раз, пожалуйста.",
                privacy: (link) => <>Отправляя форму, вы соглашаетесь с {link}.</>,
                privacyLinkLabel: "политикой конфиденциальности",
                successTitle: "Спасибо!",
                successReady: "Ваш гайд готов.",
                successPending: "Уже идёт к вам.",
                downloadLabel: "Скачать гайд →",
                emailedNote: (title) => (
                  <>Копия ({title}) также отправлена вам на почту. Проверьте входящие.</>
                ),
                pendingNote: (title) => <>{title}: пришлю, как только будет готов.</>,
                closingLine: "Будут вопросы, пишите.",
                learnMoreLabel: "Следующий шаг:",
                learnMoreLinks: [
                  { href: "#webinar", label: "посмотреть вебинар" },
                  { href: "#contact", label: "написать мне" },
                ],
                closeLabel: "Закрыть",
              }}
            />

            <div className="mt-5 rounded-sm bg-valar-amber/15 px-5 py-4">
              <p className="text-[14px] leading-relaxed text-valar-navy">
                Очень советую посмотреть ещё{" "}
                <a href="#webinar" className="font-bold underline hover:text-valar-amber">
                  мой вебинар
                </a>
                : он закроет многие ваши вопросы о покупке дома.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── ВОПРОСЫ ───────────────────────── */}
      <section data-cmp="RuPage.Faq" className="bg-white px-6 py-14">
        <div className="container mx-auto max-w-5xl">
          <div className="h-[2px] w-8 bg-valar-amber" />
          <h2 className="mt-4 text-[26px] font-bold tracking-tight text-valar-navy md:text-[32px]">
            Вопросы, которые задают чаще всего
          </h2>

          <div className="mt-9 max-w-3xl space-y-10">
            {RU_FAQ_GROUPS.map((group, g) => (
              <div key={group}>
                <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-valar-amber">
                  {group}
                </p>
                <div className="mt-3">
                  <FaqAccordion
                    defaultOpen={null}
                    items={RU_FAQ.filter((item) => item.group === group).map((item, i) => ({
                      id: `ru-faq-${g}-${i}`,
                      question: item.question,
                      answer: item.answer.map((text) => ({ type: "p" as const, text })),
                    }))}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 text-[16px] leading-relaxed text-valar-indigo">
            Не нашли свой вопрос?{" "}
            <a
              href="#contact"
              className="font-bold text-valar-navy underline hover:text-valar-amber"
            >
              Напишите мне
            </a>
            , отвечу лично. Или посмотрите мой{" "}
            <a
              href="#webinar"
              className="font-bold text-valar-navy underline hover:text-valar-amber"
            >
              вебинар «Как купить дом в Новой Зеландии»
            </a>
            . Там многие вопросы разобраны подробнее, с реальными примерами.
          </p>
        </div>
      </section>

      {/* ──────────────────── КУРС · ВИДЕО · ИНСТРУМЕНТЫ ──────────────────── */}
      {sections.map((section, i) => (
        <section
          key={section.kind}
          id={section.kind === "tool" ? "tools" : undefined}
          data-cmp={`RuPage.Resources.${section.kind}`}
          className={`scroll-mt-6 px-6 py-16 ${i % 2 === 0 ? "bg-valar-fog" : "bg-white"}`}
        >
          <div className="container mx-auto max-w-5xl">
            <div className="h-[2px] w-8 bg-valar-amber" />
            <h2 className="mt-4 text-[26px] font-bold tracking-tight text-valar-navy md:text-[32px]">
              {section.title}
            </h2>
            <p className="mt-3 text-[16px] text-valar-indigo">{section.intro}</p>

            <div
              className={`mt-8 grid gap-4 md:grid-cols-2 ${section.kind === "tool" ? "lg:grid-cols-3" : ""}`}
            >
              {section.items.map((r) => {
                const inner = (
                  <>
                    {r.icon && (
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-valar-amber/15">
                        <r.icon className="h-[18px] w-[18px] text-valar-amber" strokeWidth={1.75} />
                      </span>
                    )}
                    <div className="flex-1">
                      <span className="block font-bold text-valar-navy">{r.title}</span>
                      {r.meta && (
                        <span className="mt-0.5 block text-xs uppercase tracking-wide text-valar-indigo/50">
                          {r.meta}
                        </span>
                      )}
                      <span className="mt-2 block text-[15px] leading-relaxed text-valar-indigo">
                        {r.description}
                      </span>
                    </div>
                    {r.external ? (
                      <ExternalLink className="h-5 w-5 shrink-0 text-valar-amber" />
                    ) : (
                      <ArrowRight className="h-5 w-5 shrink-0 text-valar-amber transition-transform group-hover:translate-x-1" />
                    )}
                  </>
                );
                const className =
                  "group flex items-start gap-4 rounded-sm border border-valar-concrete bg-white p-6 transition-colors hover:border-valar-amber";

                return r.external ? (
                  <a
                    key={r.href}
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                  >
                    {inner}
                  </a>
                ) : (
                  <Link key={r.href} href={r.href} className={className}>
                    {inner}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      {/* ─────────────────────── СОХРАНИТЕ ─────────────────────── */}
      <section data-cmp="RuPage.Save" className="bg-valar-navy px-6 py-12">
        <div className="container mx-auto flex max-w-5xl flex-col gap-5 md:flex-row md:items-center">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-valar-amber/20">
            <Bookmark className="h-5 w-5 text-valar-amber" strokeWidth={1.75} />
          </span>
          <div>
            <p className="text-[18px] font-bold leading-snug text-white md:text-[20px]">
              Сохраните эту страницу в закладках.
            </p>
            <p className="mt-2 max-w-2xl text-[16px] font-light leading-relaxed text-white/85">
              Здесь я собираю полезные материалы о недвижимости, ипотеке и финансах в Новой
              Зеландии: гайды, вебинары, калькуляторы и практические советы. Коллекция пополняется,
              так что заглядывайте время от времени.
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────────────── КОНТАКТ ───────────────────────── */}
      <section id="contact" data-cmp="RuPage.Contact" className="scroll-mt-6 bg-white px-6 py-16">
        <div className="container mx-auto grid max-w-5xl gap-10 md:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col text-[16px] leading-relaxed text-valar-indigo">
            <div className="h-[2px] w-8 bg-valar-amber" />
            <h2 className="mt-4 text-[26px] font-bold tracking-tight text-valar-navy md:text-[32px]">
              Напишите мне
            </h2>
            <p className="mt-3">
              Коротко расскажите о своей ситуации. Я отвечу в течение одного рабочего дня.
            </p>
            <p className="mt-3">Если потребуется, договоримся о времени для консультации.</p>
            <p className="mt-4 text-[15px]">
              Или свяжитесь со мной напрямую:{" "}
              <a
                href="mailto:lena.bykova@valar.co.nz"
                className="font-semibold text-valar-navy underline hover:text-valar-amber"
              >
                lena.bykova@valar.co.nz
              </a>
            </p>

            <div className="mt-8 flex flex-1 flex-col">
              <div className="relative min-h-[240px] w-full max-w-[380px] flex-1 overflow-hidden rounded-sm">
                <Image
                  src={contactImg}
                  alt="Лина Быкова за столом с клиенткой"
                  fill
                  sizes="380px"
                  placeholder="blur"
                  className="object-cover object-center"
                />
              </div>
              <p className="mt-3 text-[14px] leading-snug">
                <span className="font-bold text-valar-navy">Лина Быкова</span>, Mortgage & Investment
                Adviser
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-valar-concrete bg-valar-fog p-7 md:p-8">
            <RuContactForm />
          </div>
        </div>
      </section>

      {/* ───────────────────────── ПОДВАЛ ───────────────────────── */}
      <footer data-cmp="RuPage.Footer" className="bg-valar-navy px-6 py-12 text-valar-lilac">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col gap-8 md:flex-row md:justify-between">
            <div>
              <div className="relative h-6 w-[130px]">
                <Image
                  src="/images/valar-logo.webp"
                  alt="Valar Financial Advisors"
                  fill
                  sizes="130px"
                  className="object-contain"
                />
              </div>
              <p className="mt-4 text-sm">
                <a
                  href="mailto:lena.bykova@valar.co.nz"
                  className="transition-colors hover:text-white"
                >
                  lena.bykova@valar.co.nz
                </a>
              </p>
              <div className="mt-4 flex gap-3">
                {[
                  {
                    href: "https://www.instagram.com/lena.valarnz/",
                    Icon: Instagram,
                    label: "Instagram",
                  },
                  {
                    href: "https://www.facebook.com/lena.valarnz",
                    Icon: Facebook,
                    label: "Facebook",
                  },
                  {
                    href: "https://www.linkedin.com/company/valar-advisors",
                    Icon: Linkedin,
                    label: "LinkedIn",
                  },
                ].map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-valar-indigo text-white transition-colors hover:bg-valar-amber hover:text-valar-navy"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div className="text-sm">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-valar-amber">
                Документы
              </p>
              <ul className="space-y-2">
                {[
                  { href: "/disclosure", label: "Disclosure Statement" },
                  { href: "/privacy-policy", label: "Privacy Policy" },
                  { href: "/terms", label: "Terms & Conditions" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-valar-lilac/60">Документы на английском.</p>
            </div>
          </div>

          <p className="mt-10 border-t border-valar-indigo pt-6 text-xs leading-relaxed text-valar-lilac/70">
            {/* The Russian form on the page, the registered form in brackets: the
                licence is checked on the register, under the English spelling. */}
            Valar Financial Advisors Limited (FSP1012862) имеет лицензию Financial Advice Provider,
            выданную FMA. Финансовые консультации предоставляет Лина Быкова (Lena Bykova,
            FSP1010055), директор и финансовый советник. Заявление о раскрытии информации (Disclosure
            Statement): valar.co.nz/disclosure
          </p>
        </div>
      </footer>
    </div>
  );
}
