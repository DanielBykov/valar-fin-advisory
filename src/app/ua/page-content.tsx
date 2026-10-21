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
  MessageCircle,
  Briefcase,
  Home,
  TrendingUp,
  Instagram,
  Linkedin,
  Facebook,
} from "lucide-react";
import heroBandImg from "../../../public/images/first-home-villa.png";
import firstHomeImg from "../../../public/images/first-home-guide.png";
import webinarImg from "../../../public/images/webinar-ua-cover.jpg";
import contactImg from "../../../public/images/lena-client.webp";
import aboutImg from "../../../public/images/lena-portrait.webp";
import { GuideCaptureForm } from "@/components/guide-capture-form";
import { UaWebinarPlayer, type WebinarSection } from "@/components/ua-webinar-player";
import { LEAD_MAGNETS } from "@/lib/lead-magnets";
import { trackMetaEvent } from "@/lib/meta-pixel";
import { resourcesOfKind, type UaResource } from "@/lib/ua-resources";
import { UA_FAQ, UA_FAQ_GROUPS } from "@/lib/ua-faq";
import FaqAccordion from "@/components/insights/faq-accordion";

/**
 * The Ukrainian landing page.
 *
 * One page, and it grows rather than gets replaced: everything it links out to
 * comes from `UA_RESOURCES`, and a section is simply absent while its list is
 * empty. Adding a video or the course is a row in that file, not a change here.
 *
 * Two things it does differently from the rest of the site, both on purpose:
 *
 * The capture form sits on the page rather than behind a button. Its traffic
 * arrives cold from a Facebook group or an ad, and every tap between arriving
 * and typing an email is a share of the visitors that were going to convert.
 *
 * The site's own navbar and footer are hidden (see `standalone-routes.ts`) and
 * a Ukrainian footer is rendered at the bottom instead. English chrome around
 * Ukrainian copy tells a first-time visitor the page is a translation bolted
 * onto somebody else's site.
 */

/* One definition for both header buttons: same padding, same type size, same
   icon box. They differ by colour and by nothing else.

   `text-shadow:none` is not decoration, it is a fix. The header column carries a
   text shadow so white type survives over a pale photograph, and buttons inherit
   it — which put a dark halo around dark navy lettering on an amber button and
   made it look grubby and half-transparent. A button has its own surface and
   needs no shadow.

   The secondary sits on navy rather than on a white film for the same reason:
   `bg-white/[0.08]` over a bright photograph is barely a surface at all, and its
   white text was relying on the shadow that just went. */
const HERO_CTA =
  "flex items-center gap-3 rounded-sm px-5 py-3.5 text-[15px] font-semibold transition-colors [text-shadow:none]";
const HERO_CTA_SECONDARY =
  "border border-white/40 bg-valar-navy/55 text-white hover:border-white/70 hover:bg-valar-navy/75";

const GUIDE = LEAD_MAGNETS["ua-home-buying-journey"];
const WEBINAR = LEAD_MAGNETS["ua-first-home-webinar"];

/*
 * Two capture points on one page, so each says which one it was. They enrol
 * into separate MailerLite groups now, but `lead_source` still tells Lena's
 * notification and the subscriber record which form on the page was used.
 */
const SOURCE_GUIDE = "Ukrainian landing page — guide";
const SOURCE_WEBINAR = "Ukrainian landing page — webinar";

/*
 * The situations someone might recognise themselves in — six, and deliberately
 * not all about a first house. Lena is an investment adviser as well as a
 * mortgage one, and a page that only speaks to first-home buyers turns away the
 * person who already owns and is asking the bigger question.
 *
 * The headings are three or four words, most of them questions. They are read
 * the way a person scans a shelf, and a heading that is already a sentence gets
 * skipped along with the paragraph under it. The body only has to confirm what
 * the heading already asked, and runs to about fifteen words so it comes out as
 * three lines in the card and every card in the row ends level.
 */
const SITUATIONS = [
  {
    icon: Compass,
    title: "Хочу своє. Як почати?",
    body: "Ви кілька років в оренді, відкладаєте гроші, але з якого кроку починається купівля дому, досі незрозуміло.",
  },
  {
    icon: PiggyBank,
    title: "Депозит наче є. А далі?",
    body: "Гроші відкладені. Питання в тому, як їх правильно використати і чи вистачить того, що вже зібрано.",
  },
  {
    icon: MessageCircle,
    title: "Англійська є. А деталі?",
    body: "Англійську ви розумієте добре. Але деталі хочеться обговорити з людиною, яка мислить так само, як ви.",
  },
  {
    icon: Briefcase,
    title: "Нестандартний дохід",
    body: "Самозайнятість, контракт, дохід за кордоном. Як усе це сприйме конкретний банк, наперед незрозуміло.",
  },
  {
    icon: Home,
    title: "Оптимізація іпотеки",
    body: "Рефінансування, renovation loan, як перерозподілити фінанси і скільки банк готовий дати вам саме зараз.",
  },
  {
    icon: TrendingUp,
    title: "Стратегія на роки вперед",
    body: "Капітал, інвестиції, безпека для родини, погляд на 15–20 років уперед і retirement plan (мандри або город).",
  },
]; /*
 * The same four stages the English service pages describe, in Ukrainian and in
 * the first person. It was three steps invented for this page; mirroring the
 * site means a person who reads both is told the same thing about how the work
 * actually runs.
 *
 * Stage one is named as the conversation rather than "Bigger Picture View":
 * that is what the visitor is being asked to do, and the buttons above already
 * offered it.
 */
const STEPS = [
  {
    n: "01",
    title: "Перша розмова",
    body: "Перша розмова безкоштовна, 20–30 хвилин. Дивимось, де ви є, що для вас важливо і що саме має дати рішення про житло.",
  },
  {
    n: "02",
    title: "Стратегія",
    body: "Прораховуємо різні варіанти фінансування і ризики. Я будую структуру кредиту, яка працює зараз і зможе змінюватися далі.",
  },
  /*
   * "Фінансування", not "купівлі", and Lena's own correction: buying a house
   * also involves a lawyer, an agent and a builder's report, and she is not
   * running those. Claiming the whole purchase would be claiming work she does
   * not do — and would be read as a promise by someone who has never bought a
   * house here before.
   */
  {
    n: "03",
    title: "Application process",
    body: "Коли стратегія зрозуміла, я веду весь процес фінансування: спілкуюся з банками, супроводжую схвалення і допомагаю дійти до settlement.",
  },
  {
    n: "04",
    title: "Супровід далі",
    body: "Ставки, можливості та життєві обставини змінюються. Разом переглядаємо стратегію і коригуємо її з часом.",
  },
];

/*
 * What the guide covers, said on the page rather than left to the PDF.
 *
 * The offer was a title and a Send button, and Lena's read of it was the right
 * one: a visitor could not tell what they were being given. Four lines is what
 * turns "гайд" into a thing worth an email address.
 *
 * Deliberately about the shape of the problem rather than specific numbers or
 * schemes — the document is being rewritten and these have to stay true across
 * that rewrite, and a lead magnet's promises are the firm's promises.
 */
const GUIDE_CONTENTS = [
  "З чого почати, якщо ви ще нічого не робили",
  "Скільки насправді потрібно на депозит",
  "Як банк дивиться на ваш дохід і що на це впливає",
  "Кожен крок процесу аж до ключів",
  "Коучингові питання в кінці, щоб скласти власну стратегію купівлі",
];

/**
 * The player, embedded rather than linked.
 *
 * Lena's requirement is that the recording plays on this page and nowhere
 * else — a link that can be forwarded is the thing she does not want. Nothing
 * makes a web video truly unforwardable, so the mechanism that actually does
 * the work is not here: it is the host's domain restriction, which refuses to
 * play the file unless the embed is running on valar.co.nz. This page's job is
 * only to be that embed.
 *
 * That rules out an unlisted YouTube link, which plays for anyone holding the
 * URL no matter where they open it.
 *
 * ⚠️ REQUIRED BEFORE `/ua` IS PUBLISHED: the video's allowed origins in the
 * Cloudflare dashboard must be restricted to valar.co.nz. Without that this
 * URL plays anywhere it is pasted. It is the host's *embed* URL (the one
 * meant for an iframe), not the page URL a viewer would see.
 */
/*
 * Cloudflare Stream, "First home in New Zealand, Sep 26 UA.mp4" (uploaded
 * 2026-10-16). `primaryColor` is Valar amber, so the progress bar and buttons
 * belong to the page rather than to Cloudflare.
 */
const WEBINAR_EMBED_URL: string | null =
  "https://customer-mnwb9zq4xbqrb8ya.cloudflarestream.com/78b0edc3b0cec942a6b3027fb5dabaf9/iframe?primaryColor=%23f0a500";

/*
 * Remembers, in this browser only, that the form has already been filled in, so
 * coming back to the page does not mean filling it in again. It is a
 * convenience and not a lock: it never leaves the device, tells us nothing, and
 * a visitor who clears it simply sees the form once more. On another device
 * they fill it in again — which is the cost of the recording having no
 * shareable link, and the reason it has none.
 */
const WEBINAR_UNLOCK_KEY = "valar.ua.webinar.unlocked";

const unlockListeners = new Set<() => void>();

/*
 * Read through `useSyncExternalStore` rather than an effect that calls
 * setState. localStorage does not exist on the server, so the first paint has
 * to be the locked state and the stored value can only be consulted on the
 * client — which is exactly the split this hook exists for. The `storage`
 * listener is what makes a second tab agree with the one the form was
 * submitted in.
 */
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
  /** Not the gate — the gate is the host refusing to play off-domain. */
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
 * The recording's chapters, read off the transcript's subtitle timings and
 * named by Lena (2026-10-16). They replace the three format facts that stood
 * here while the recording did not exist: a list of what is actually in two
 * hours is a better reason to leave an email than a promise about the player.
 *
 * Times are the moment the topic starts in the recording. If it is ever
 * re-cut or re-uploaded with a different intro, every line shifts with it.
 */
const WEBINAR_DURATION = "1 год 54 хв";

/* Grouped into the eight blocks Lena announces at 2:50 in the recording, so
   the page and the webinar describe the same structure. The intro sits ahead
   of them unnumbered, as it does in the recording. */
const WEBINAR_SECTIONS: WebinarSection[] = [
  {
    title: "Вступ",
    chapters: [
      { at: "0:00", title: "Для кого цей вебінар" },
      { at: "4:09", title: "Про мене" },
      { at: "5:47", title: "Шлях до ключів і базові терміни" },
    ],
  },
  {
    title: "1. Хто і навіщо купує",
    chapters: [{ at: "11:17", title: "Оренда чи свій дім. Хто може купувати" }],
  },
  {
    title: "2. Банк, депозит і бюджет",
    chapters: [
      { at: "14:10", title: "Як банк оцінює вас і скільки можна позичити" },
      { at: "18:17", title: "Депозит: 5%, 10–20% чи 20%" },
      { at: "22:49", title: "Звідки береться депозит" },
      { at: "25:15", title: "Додаткові витрати і ваш бюджет" },
    ],
  },
  {
    title: "3. Ставки і стрес-тест",
    chapters: [
      { at: "29:21", title: "Ставки: OCR, фіксована, спліт, offset" },
      { at: "38:09", title: "Стрес-тест: скільки брати насправді" },
    ],
  },
  {
    title: "4. Ринок і вибори",
    chapters: [{ at: "44:17", title: "Ринок зараз, регіони і вибори" }],
  },
  {
    title: "5. Вибір і перевірка будинку",
    chapters: [
      { at: "58:12", title: "Типи нерухомості" },
      { at: "1:03:39", title: "Стан будинку і building inspection" },
    ],
  },
  {
    title: "6. Процес купівлі",
    chapters: [
      { at: "1:06:53", title: "Ваша команда: адвайзер, юрист, інспектор" },
      { at: "1:10:30", title: "Аукціон, переговори, тендер" },
      { at: "1:14:06", title: "Етапи укладення договору купівлі-продажу" },
    ],
  },
  {
    title: "7. Реальні кейси",
    chapters: [
      { at: "1:23:14", title: "Чотири реальні кейси" },
      { at: "1:35:38", title: "Мислити як інвестор" },
    ],
  },
  {
    title: "8. План дій і помилки",
    chapters: [
      { at: "1:40:16", title: "План на 8 тижнів і типові помилки" },
      { at: "1:47:47", title: "Підсумки, консультація і бонус Valári" },
    ],
  },
];

/* What sits under the video before the form, in Lena's words (2026-10-16).
   Questions rather than topics: a visitor scans for their own question, and a
   topic name makes them work out whether it is in there. */
const WEBINAR_TEASER = {
  facts: ["8 розділів", "2 години", "4 реальні кейси", "план на 8 тижнів"],
  heading: "Питання, на які відповідає вебінар",
  /* Six, each short enough for one or two lines in a half-width column: seven
     long ones pushed the closing note well below the form beside them. */
  questions: [
    "Як побудувати стратегію купівлі?",
    "Як банк оцінює ваш дохід?",
    "Скільки брати, щоб пережити ріст ставок?",
    "Як пройти шлях від оферу до ключів?",
    "Кого взяти в команду і що перевірити?",
    "Яких помилок уникати, купуючи вперше?",
  ],
  outcomes: [
    {
      icon: Compass,
      lead: "Структура в голові:",
      text: "що робити, у якому порядку, на що звернути увагу.",
    },
    {
      icon: Sparkles,
      lead: "Valári на пошту:",
      text: "AI skill, який допоможе побудувати власну систему й відповісти на ваші запитання.",
    },
  ],
};

/*
 * What people actually arrive with, not a services menu. It sits under the
 * introduction because "хто я" without "чим можу допомогти" leaves a stranger
 * holding a biography and no reason to act on it.
 *
 * Names only. They were written out with an explanation each and Lena cut them:
 * "не треба розписувати, і так зрозуміло". She is right — a person who came
 * about refinancing does not need refinancing described to them, and the
 * explanations turned a glance into a paragraph.
 *
 * Ordered borrowing, then investing, then strategy. Six entries fill two rows
 * of three exactly, which is why KiwiSaver and investments are one line and not
 * two — Lena's own call, and they are one conversation anyway.
 */
const HELP_WITH = [
  "Купівля першого будинку",
  "Рефінансування",
  "Renovation та top-up",
  "Інвестиційна нерухомість",
  "KiwiSaver та інвестиції",
  "Стратегія на майбутнє",
];

const RESOURCE_SECTIONS: { kind: UaResource["kind"]; title: string; intro: string }[] = [
  {
    kind: "course",
    title: "Курс «Як купити дім»",
    intro: "Покроково і у своєму темпі: весь процес від депозиту до ключів.",
  },
  { kind: "video", title: "Відео", intro: "Короткі розбори того, що найчастіше запитують." },
  {
    kind: "tool",
    title: "Калькулятори",
    intro: "Порахуйте свої цифри самостійно, ще до розмови.",
  },
];

/**
 * The Ukrainian contact form.
 *
 * It posts to the site's own `/api/contact` with `locale: "uk"`, which is what
 * decides the language of the automatic reply. Without that flag a person who
 * wrote in Ukrainian gets an English robot email back within seconds — the same
 * failure the newsletter opt-in was left off this page to avoid.
 */
function UaContactForm() {
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
        body: JSON.stringify({ ...data, locale: "uk" }),
      });
      const json = await res.json();
      if (json.success) {
        setSucceeded(true);
        trackMetaEvent("Contact", "Contact form (UA)");
      } else setError("Не вдалося надіслати. Спробуйте ще раз, будь ласка.");
    } catch {
      setError("Не вдалося надіслати. Спробуйте ще раз, будь ласка.");
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
        <h3 className="mb-1 text-xl font-bold text-valar-navy">Дякую!</h3>
        <p className="text-base text-valar-navy/80">Ваше повідомлення в мене.</p>
        <div className="mx-auto my-5 h-[2px] w-8 bg-valar-amber" />
        <p className="text-sm leading-relaxed text-valar-indigo">
          Відповім протягом одного робочого дня. Лист із підтвердженням уже надіслано на вашу пошту.
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
        <label htmlFor="ua-contact-firstName" className={label}>
          Ім’я
        </label>
        <input
          id="ua-contact-firstName"
          name="firstName"
          type="text"
          required
          autoComplete="given-name"
          className={`${field} h-10`}
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="ua-contact-lastName" className={label}>
          Прізвище
        </label>
        <input
          id="ua-contact-lastName"
          name="lastName"
          type="text"
          required
          autoComplete="family-name"
          className={`${field} h-10`}
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="ua-contact-email" className={label}>
          Електронна пошта
        </label>
        <input
          id="ua-contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={`${field} h-10`}
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="ua-contact-phone" className={label}>
          Телефон{" "}
          <span className="font-normal normal-case text-valar-indigo/40">(за бажанням)</span>
        </label>
        <input
          id="ua-contact-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          className={`${field} h-10`}
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="ua-contact-message" className={label}>
          Ваше питання
        </label>
        <textarea
          id="ua-contact-message"
          name="message"
          rows={5}
          required
          placeholder="Коротко про вашу ситуацію: де ви зараз і що хочете зрозуміти."
          className={`${field} resize-none p-3 placeholder:text-valar-indigo/40`}
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-sm bg-valar-amber py-3 text-sm font-bold text-valar-navy transition-colors hover:bg-valar-amber-hover disabled:opacity-60"
      >
        {submitting ? "Надсилаю…" : "Надіслати повідомлення"}
      </button>
      <p className="text-center text-xs text-valar-indigo/50">
        Надсилаючи форму, ви погоджуєтесь із{" "}
        <a href="/privacy-policy" className="underline hover:text-valar-navy">
          політикою конфіденційності
        </a>
        .
      </p>
    </form>
  );
}

export default function UaContent() {
  const sections = RESOURCE_SECTIONS.map((s) => ({ ...s, items: resourcesOfKind(s.kind) })).filter(
    (s) => s.items.length > 0,
  );

  const webinarUnlocked = useSyncExternalStore(
    webinarUnlock.subscribe,
    webinarUnlock.read,
    () => false,
  );

  return (
    // The document's language is set here rather than in the root layout: one
    // page is in Ukrainian and the rest of the site is not, so `lang` belongs
    // to the page. Screen readers and search both take the nearest one.
    <div lang="uk" data-cmp="UaPage" className="w-full bg-valar-fog font-sans">
      {/* ───────────────────────── HERO ───────────────────────── */}
      {/* A band, not a profile. The page used to open with Lena's portrait and
          her name, which puts the adviser before the visitor's own problem —
          the introduction belongs further down, once someone has recognised
          themselves. The photograph carries the promise instead: a house, a
          couple, and the Auckland skyline behind them.

          Deliberately short. It exists to say what this is and offer three
          ways in; everything that explains sits below it. */}
      {/* The box is shaped to the photograph, not the other way round.
          `aspect-[1920/819]` is the image's own ratio, so on a normal laptop
          width the whole picture is on screen and nothing is cropped at all; the
          min and max heights only take over at the extremes. Before this the
          header was a 3.7:1 letterbox and a third of the image was being thrown
          away, which is what "приблизил" was.

          `w-full` is load-bearing. Without a definite width, the max height
          is transferred back through the aspect ratio and the box narrows to
          680 × 1920/819 ≈ 1594px, so on any wider screen the photograph
          stopped short of the right edge (found 2026-10-16, when a
          full-width block below it made the gap visible). */}
      <section
        data-cmp="UaPage.Hero"
        className="relative isolate flex min-h-[480px] w-full items-center overflow-hidden md:aspect-[1920/819] md:max-h-[680px] md:min-h-[520px]"
      >
        {/* Vertical position is the whole game here, and the horizontal value
            was doing nothing at all.

            On a phone the box is far taller than the photo is, so the overflow
            is horizontal and X is what matters: 70% keeps the house rather than
            the trees. From `md` up the box carries the image's own ratio, the
            overflow flips to vertical, and X stops doing anything. */}
        <Image
          src={heroBandImg}
          alt="Новозеландський дім з мальвами й соняшниками, вдалині море"
          fill
          sizes="100vw"
          priority
          placeholder="blur"
          className="-z-10 object-cover object-[70%_center] md:object-[center_38%]"
        />
        {/* Flat scrim on a phone, where the crop lands on the house and text
            would sit over the busiest part of the frame; a left-weighted ramp
            from tablet up, where the open sky and the paddock are doing that
            job.

            The desktop ramp is copied from the service pages, `/services/
            small-business-loans` in particular, and then taken lighter still:
            that page runs navy/80 → navy/20, this one navy/70 → navy/10.

            The midpoint is the number that matters and every earlier attempt
            here had it far too high (85, then 70, then 55, then 40) — at 40 the
            navy was still lying across the villa and turning a white house
            blue. It goes lighter than the service pages because this photograph
            is brighter than theirs: a white house under a pale sky shows every
            percent of navy that a darker image would swallow.

            The text keeps its legibility from a shadow instead (see below).
            Darkening a whole picture to hold up one paragraph is paying for the
            text with the image, and the image is the reason the section is
            here. */}
        <div className="absolute inset-0 -z-10 bg-valar-navy/30 md:bg-linear-to-r md:from-valar-navy/75 md:via-valar-navy/22 md:via-48% md:to-transparent md:to-72%" />

        {/* No max-width, just page padding — the same `container mx-auto px-6
            md:px-12` the service-page heroes use. The column therefore sits
            about as far left as it can without touching the edge, and the
            header stops lining up with the narrower text sections below it,
            which is correct: it is a full-bleed photograph, not a text column. */}
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

          {/* Narrow, and that is the point: the villa begins around 48% of the
              frame, so a column that stopped at 56% was sitting on the house and
              forcing the scrim to cover it. At this width the text clears the
              building entirely and the gradient can stay as light as it is.

              The shadow does the rest, and it is two shadows: a tight 1px one
              that does the actual legibility work at any size, plus a soft wide
              one for weight. A single soft shadow looked fine on the headline
              and left the small line underneath swimming. Darkening the whole
              picture instead would pay for the text with the image. */}
          <div className="mt-8 max-w-xl text-white [text-shadow:0_1px_2px_rgb(6_22_52_/_0.9),0_2px_18px_rgb(6_22_52_/_0.6)]">
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-valar-amber">
              UA · New Zealand
            </p>

            {/* New Zealand is not in the headline — the eyebrow above already
                says it, and repeating it costs the line its rhythm. */}
            <h1 className="mt-3 text-[30px] font-medium leading-tight tracking-tight md:text-[40px]">
              Від першого дому до капіталу
              <span className="text-valar-amber">.</span>
            </h1>

            {/* Lena's own line, and a clear step smaller than the headline.
                The join used to read badly because the line under the headline
                repeated its arc in verbs; this one names the three services
                instead, so the headline says where you are going and the line
                says what is actually on offer. */}
            <p className="mt-3 text-[15px] font-light leading-relaxed text-white/80 md:text-[16px]">
              Допомагаю розібратися з іпотекою, рефінансуванням та інвестиціями.
            </p>

            {/* Two doors, not four. Four made the header a menu to be chosen
                from rather than a thing to act on, and choosing is what people
                postpone. The guide and the calculators keep their sections and
                their anchors; they just stop competing with the ask.

                The second door is the webinar, not the guide (Lena,
                2026-10-16): two hours of her explaining the whole process does
                more to earn a first message than a PDF can, and the guide is
                offered again under the webinar's own form anyway.

                Same box for both, differing only in colour. */}
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <a
                href="#contact"
                data-cmp="UaPage.Cta.Contact"
                className={`${HERO_CTA} bg-valar-amber text-valar-navy hover:bg-valar-amber-hover`}
              >
                <Mail className="h-[18px] w-[18px] shrink-0" />
                Написати мені
              </a>
              <a
                href="#webinar"
                data-cmp="UaPage.Cta.Webinar"
                className={`${HERO_CTA} ${HERO_CTA_SECONDARY}`}
              >
                <Play className="h-[18px] w-[18px] shrink-0 fill-valar-amber text-valar-amber" />
                Дивитися вебінар
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────── УЖЕ Є ─────────────────────── */}
      {/* A thin strip of what already exists in Ukrainian, straight under the
          header (Lena, 2026-10-16). Most of the page is about the visitor's
          situation; this is the one place that says "there is material here
          already", and doubles as navigation for someone who came back for
          one thing. Valári has no section of its own: it arrives by email
          with the webinar, so its link goes to the webinar. */}
      <nav
        aria-label="Матеріали українською"
        data-cmp="UaPage.Materials"
        className="bg-valar-fog px-6 py-10"
      >
        {/* Its own section with room above it, not a band glued to the
            photograph: the first version sat flush under the header and read
            as part of it (Lena, 2026-10-16). Three small cards, the same
            shape as the cards further down, so it belongs to the page. */}
        <div className="container mx-auto max-w-5xl">
          <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-valar-amber">
            Українською вже є
          </p>
          <ul className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              {
                href: "#webinar",
                Icon: Play,
                label: "Вебінар",
                body: "Як працює іпотека в Новій Зеландії. Запис на 2 години.",
              },
              {
                href: "#guide",
                Icon: FileText,
                label: "Гайд",
                body: "Як купити свій перший будинок, з Coaching Workbook.",
              },
              {
                href: "#webinar",
                Icon: Sparkles,
                label: "AI-помічник Valári",
                body: "Відповідає на питання вашою мовою. Приходить бонусом до вебінару.",
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

      {/* ───────────────────── ЧИ ЦЕ ПРО ВАС ───────────────────── */}
      {/* Cards rather than a list of sentences. As a two-column bullet list this
          read as one grey block and nobody found themselves in it — which is
          the only thing the section is for. Each card is a single situation,
          named in the heading so it can be recognised without reading on. */}
      <section data-cmp="UaPage.Pains" className="bg-white px-6 py-16">
        <div className="container mx-auto max-w-5xl">
          <div className="h-[2px] w-8 bg-valar-amber" />
          <h2 className="mt-4 text-[26px] font-bold tracking-tight text-valar-navy md:text-[32px]">
            Чи впізнаєте себе?
          </h2>

          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SITUATIONS.map((s) => (
              <div
                key={s.title}
                className="flex h-full flex-col rounded-sm border border-valar-concrete bg-valar-fog p-6 transition-colors hover:border-valar-amber"
              >
                {/* Icon and heading share a row. Stacked, the two of them cost
                    three lines of height before the card has said anything, and
                    six cards paid it. The body still runs the full width of the
                    card — indenting it under the heading would narrow the
                    column and turn three lines into four.

                    The amber wash replaced a navy block: six dark squares down
                    a light section read as the loudest thing on it, which is
                    not what an icon is for. */}
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
            {/* `md:whitespace-nowrap` keeps this on one line on a desktop, which
                is how Lena wants it read: one sentence, one line. It is lifted
                on small screens, where forcing it would push the section into a
                horizontal scroll. */}
            <p className="text-[18px] font-bold leading-snug text-valar-navy md:whitespace-nowrap md:text-[20px]">
              Якщо хоча б один пункт про вас, нам варто поговорити.
            </p>
            {/* No `max-w` on either line. The block sits in a max-w-5xl
                container that is nearly a thousand pixels wide, and capping the
                text at 672 was breaking a sentence in half for no reason while
                the space to its right stayed empty. Size the container, not the
                paragraph. */}
            <p className="mt-3 text-[16px] leading-relaxed text-valar-indigo">
              Після розмови у вас буде чітке розуміння, де ви зараз, які можливості маєте і які
              кроки попереду.
            </p>
            {/* Its own paragraph, not a second sentence. What the visitor is
                promised and what they are not obliged to do afterwards are two
                different points, and running them together lets the second one
                be read as sales talk attached to the first. */}
            <p className="mt-3 text-[16px] leading-relaxed text-valar-indigo">
              Далі вибір за вами: реалізувати цей план самостійно чи разом зі мною.
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────────────── ПРО МЕНЕ ───────────────────────── */}
      {/* Directly after "нам варто поговорити", because that sentence raises the
          question this section answers: talk to whom? It is not at the top of
          the page for the same reason — a stranger recognises their own problem
          first and only then wants to know who is offering to help with it.

          Light and narrow after a first pass on navy with a third-width photo:
          that version outweighed the offer, and this is an introduction. The
          list runs full width underneath rather than beside the portrait, so
          six entries cost two rows instead of six. */}
      <section data-cmp="UaPage.About" className="bg-valar-fog px-6 py-14">
        <div className="container mx-auto max-w-5xl">
          <div className="h-[2px] w-8 bg-valar-amber" />
          <h2 className="mt-4 text-[26px] font-bold tracking-tight text-valar-navy md:text-[32px]">
            Хто я і чим можу допомогти
          </h2>

          <div className="mt-8 grid gap-8 md:grid-cols-[300px_1fr] md:items-start md:gap-14">
            {/* Cropped by sizing the image, not by `transform: scale`, so the
                crop is arithmetic rather than a guess.

                Source is 1920x2152. Measured off it: her face centres on x 0.50,
                her head runs y 0.19–0.40 and her hands rest at y 0.72. The
                window is x 0.178–0.823, y 0.09–0.81, which puts the face on the
                centre line and leaves air above her head.

                The first attempt ran x 0.147–0.703. That window centres on 0.425
                while the face sits at 0.50, so she came out pushed to the right
                of the frame — the crop was built around her whole body rather
                than around her face.

                All percentages, so the same crop holds at both frame widths.
                `sizes` quotes the rendered width (180% of the frame), not the
                column width, or Next serves a file too small and it goes soft. */}
            <div className="relative aspect-[4/5] w-full max-w-[280px] overflow-hidden rounded-sm md:max-w-none">
              <Image
                src={aboutImg}
                alt="Ліна Бикова"
                width={1920}
                height={2152}
                sizes="(min-width: 768px) 480px, 440px"
                placeholder="blur"
                className="absolute left-[-28%] top-[-12%] h-auto w-[155%] max-w-none"
              />
            </div>

            <div className="space-y-4 text-[16px] leading-relaxed text-valar-indigo">
              <p>
                Мене звати Ліна Бикова. У мене більше 20 років досвіду у фінансах, інвестиційному
                аналізі, оцінці бізнесу, фінансовому моделюванні.
              </p>
              <p>
                У Новій Зеландії живу понад десять років. За цей час сама пройшла шлях від міграції
                та купівлі першого дому до інвестиційної нерухомості, renovation-проєктів і життя на
                lifestyle property.
              </p>
              <p>
                Valar Financial Advisors є моєю власною ліцензованою практикою Financial Advice
                Provider. Я не просто допомагаю отримати кредит: я прораховую варіанти, дивлюся на
                всю вашу фінансову картину і допомагаю будувати стратегію на роки вперед.
              </p>

              {/* Lena's own wording, restored twice over.
                  
                  It was shortened once too far — the first pass cut the human
                  half of both paragraphs and kept the credentials, which left a
                  CV. Then the licence sentence got welded to the next one with
                  "це означає", which is simply false: holding a FAP licence
                  means she answers for the advice she gives. It does not mean
                  she looks at the whole financial picture. That is how she
                  chooses to work, and it is a separate sentence. */}
              <p>
                Розмовляю українською, російською та англійською. Ви можете говорити зі мною тією
                мовою, якою вам зручніше думати про гроші.
              </p>

              {/* The one sentence on the page that is not about a service. It is
                  set apart because a paragraph would bury it, and it is the
                  line most likely to be the reason somebody writes in. */}
              <div className="border-l-2 border-valar-amber pl-5 pt-1">
                <p className="text-valar-navy">
                  Мені важливо працювати з людьми довго. Якщо одного дня ваші друзі чи діти прийдуть до мене
                  купувати свій перший дім, для мене це буде найкращою оцінкою моєї роботи.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-12 text-[13px] font-bold uppercase tracking-[0.14em] text-valar-amber">
            З чим до мене приходять
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

      {/* ──────────────────────── ВЕБІНАР ──────────────────────── */}
      {/* Straight after the introduction, not after the FAQ where it started
          (Lena, 2026-10-16). It sat low while it was imagined as a short video
          and the biggest ask on the page; at two hours it is the page's
          strongest asset — the whole process in her own voice, which is what
          lets someone decide they want her handling their mortgage. "Хто я"
          stays directly above it: the cards end on "нам варто поговорити", and
          that section answers "with whom" before anything else is offered.

          It is written as a recording that exists and can be watched now —
          there is no "coming soon" state, by Lena's instruction.

          The email buys the player, not a link: on success the thumbnail is
          replaced in place by the embed, and there is no URL anywhere for a
          viewer to copy and pass on. See `WEBINAR_EMBED_URL` for the part of
          that promise this page cannot keep on its own. */}
      <section id="webinar" data-cmp="UaPage.Webinar" className="scroll-mt-6 bg-white px-6 py-16">
        <div className="container mx-auto max-w-5xl">
          <div className="h-[2px] w-8 bg-valar-amber" />
          <p className="mt-4 text-[13px] font-bold uppercase tracking-[0.14em] text-valar-amber">
            Вебінар українською
          </p>
          {/* The page's own heading, not `WEBINAR.title`: the magnet's title
              keeps the word "Вебінар" because it is also the subject line of
              Lena's lead notification, where it has to say what was asked for.
              Here the eyebrow already says it. */}
          <h2 className="mt-3 max-w-3xl text-[28px] font-bold leading-tight tracking-tight text-valar-navy md:text-[38px]">
            Як працює іпотека в Новій Зеландії
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
            poster={
              <>
                {/* The recording's own title slide, taken from Cloudflare's
                    thumbnail at 2s (2026-10-16) and kept as a file here, so
                    the poster is what the player opens on rather than a
                    portrait that promised a different video. 16:9 like the
                    frame, so nothing is cropped.

                    The slide is mostly white, so the scrim is light and the
                    caption sits on its own navy chip instead of relying on
                    the picture behind it to be dark. */}
                <Image
                  src={webinarImg}
                  alt="Ваш шлях до першого дому в Новій Зеландії. Титульний слайд вебінару"
                  fill
                  sizes="(min-width: 768px) 60vw, 100vw"
                  placeholder="blur"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-valar-navy/15" />
                {/* Over the illustration, which is the left 37.5% of the slide
                    (720 of 1920px). Centred on the whole frame, the button sat
                    on top of the slide's title. */}
                <div className="absolute inset-y-0 left-0 flex w-[37.5%] flex-col items-center justify-center gap-3 px-2 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-valar-amber shadow-lg">
                    <Play className="ml-1 h-7 w-7 fill-valar-navy text-valar-navy" />
                  </span>
                  <span className="rounded-sm bg-valar-navy/85 px-3 py-1.5 text-sm font-light text-white">
                    {webinarUnlocked
                      ? "Запис ось-ось буде тут."
                      : "Залиште пошту, і запис відкриється тут."}
                  </span>
                </div>
              </>
            }
            unlockedNote={
              <div className="flex flex-col gap-2 rounded-sm bg-valar-amber/15 px-5 py-4 text-[15px] leading-relaxed text-valar-navy sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <p>
                  <span className="font-bold">Дякую!</span> PDF-презентація і AI-помічник Valári
                  прийдуть вам на пошту.
                </p>
                <a href="#contact" className="shrink-0 font-bold underline hover:text-valar-amber">
                  Написати мені
                </a>
              </div>
            }
            aside={
              <div className="rounded-xl border border-valar-concrete bg-valar-fog p-7 md:p-8">
                <div className="mb-6">
                  <div className="h-[2px] w-6 bg-valar-amber mb-4" />
                  <h3 className="text-[19px] font-bold leading-snug text-valar-navy">
                    Залиште пошту і дивіться
                  </h3>
                  {/* ⚠️ A promise of two files. Neither is delivered yet: the
                      Ukrainian MailerLite group and its automation do not
                      exist, and the presentation and the AI skill are not on
                      the site. Both have to be in place before `/ua` goes
                      live, or this line is the first thing the page breaks. */}
                  <p className="mt-2 text-sm leading-relaxed text-valar-indigo">
                    Запис відкривається одразу. Вам на пошту прийде PDF-презентація з цього вебінару
                    і AI-помічник Valári.
                  </p>
                </div>

                <GuideCaptureForm
                  guide={WEBINAR}
                  source={SOURCE_WEBINAR}
                  onSuccess={() => {
                    webinarUnlock.write();
                    // The form disappears and the player widens, so the
                    // section reflows under the visitor's feet. Bring its top
                    // back into view so the first thing they see is the video.
                    requestAnimationFrame(() =>
                      document
                        .getElementById("webinar")
                        ?.scrollIntoView({ behavior: "smooth", block: "start" }),
                    );
                  }}
                  copy={{
                    firstNameLabel: "Ім’я",
                    lastNameLabel: "Прізвище",
                    emailLabel: "Електронна пошта",
                    emailSuggestion: (fix) => <>Можливо, ви мали на увазі {fix}?</>,
                    phoneLabel: "Телефон",
                    phoneOptional: "(за бажанням)",
                    subscribeLabel:
                      "Підписатися на новини та матеріали від Valar. Розсилка англійською.",
                    submit: "Дивитися вебінар",
                    submitting: "Надсилаю…",
                    genericError: "Щось пішло не так. Спробуйте ще раз, будь ласка.",
                    privacy: (link) => <>Надсилаючи форму, ви погоджуєтесь із {link}.</>,
                    privacyLinkLabel: "політикою конфіденційності",
                    successTitle: "Дякую!",
                    successReady: "Запис відкрито.",
                    successPending: "Запис відкрито.",
                    downloadLabel: "Дивитися вебінар →",
                    emailedNote: () => <>Запис відкрито на цій сторінці. Вмикайте.</>,
                    closingLine: "Будуть питання, пишіть.",
                    learnMoreLabel: "Далі:",
                    learnMoreLinks: [{ href: "#contact", label: "написати мені" }],
                    closeLabel: "Закрити",
                  }}
                />
              </div>
            }
          />
        </div>
      </section>

      {/* ─────────────────────── ЯК МИ ПРАЦЮЄМО ─────────────────────── */}
      {/* Fog, where it used to be white: the webinar now sits between it and
          "Хто я", and the alternation has to hold on both sides of it. */}
      <section data-cmp="UaPage.Steps" className="bg-valar-fog px-6 py-16">
        <div className="container mx-auto max-w-5xl">
          <div className="h-[2px] w-8 bg-valar-amber" />
          <h2 className="mt-4 text-[26px] font-bold tracking-tight text-valar-navy md:text-[32px]">
            Як ми працюємо
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

          {/* The claim people came for, in one line, on the amber wash the
              cards above use. It was a four-line paragraph and Lena cut it: at
              that length nobody reads the good news.

              The second line stays, small. "Мої послуги безкоштовні" on its own
              is the version that produces a complaint when a non-bank deal
              comes with an invoice, and the exception is the site's own
              Disclosure Statement, not caution invented here. */}
          <div className="mt-8 max-w-2xl rounded-sm bg-valar-amber/15 px-6 py-5">
            <p className="text-[16px] font-bold leading-snug text-valar-navy">
              У більшості випадків мої послуги для вас безкоштовні: платить банк.
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-valar-indigo/80">
              Якщо випадок нетиповий, скажу про вартість заздалегідь. Деталі у{" "}
              <Link href="/disclosure" className="underline hover:text-valar-navy">
                Disclosure Statement
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────────────── ГАЙД ───────────────────────── */}
      <section id="guide" data-cmp="UaPage.Guide" className="scroll-mt-6 bg-valar-navy px-6 py-14">
        {/* Two columns from the top, not a full-width headline above them. The
            headline block pushed the form most of a screen down, and the form
            is the point of the section: the offer and the thing that accepts it
            now start on the same line. Everything is a size smaller with it. */}
        {/* The columns stretch to the same height instead of each running to
            its own, and the photograph takes up the slack (`flex-1` below). A
            fixed aspect ratio could not do this: at 4:3 the left column ran well
            past the form, at the picture's own 2.33:1 it stopped short of it,
            and every screen width moves the target anyway. */}
        <div className="container mx-auto grid max-w-5xl gap-10 md:grid-cols-2">
          <div className="flex flex-col">
            <div className="h-[2px] w-8 bg-valar-amber" />
            <p className="mt-4 text-[13px] font-bold uppercase tracking-[0.14em] text-valar-amber">
              Безкоштовний гайд українською
            </p>
            <h2 className="mt-3 text-[26px] font-bold leading-tight tracking-tight text-white md:text-[30px]">
              {GUIDE.title}
            </h2>
            <p className="mt-3 text-[16px] font-light leading-relaxed text-white/85 md:text-[17px]">
              {GUIDE.description}
            </p>

            {/* No aspect ratio: this frame takes whatever height is left over
                once the text above and below it is placed, down to a floor of
                200px. That is what makes the left column finish level with the
                form however the text wraps.

                `object-cover` therefore crops the sides as the frame gets
                taller. The picture is 1916x821 and its subject sits right of
                centre, so it takes the trim without losing the house. */}
            <div className="relative mt-6 min-h-[200px] w-full flex-1 overflow-hidden rounded-sm">
              <Image
                src={firstHomeImg}
                alt="Білий новозеландський будинок із садом, мальвами й соняшниками"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                placeholder="blur"
                className="object-cover"
              />
            </div>

            <p className="mt-6 text-[13px] font-bold uppercase tracking-[0.14em] text-valar-amber">
              Що всередині
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
                Куди надіслати гайд?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-valar-indigo">
                Завантажите одразу після відправки. Копію надішлю на пошту.
              </p>
            </div>

            <GuideCaptureForm
              guide={GUIDE}
              source={SOURCE_GUIDE}
              copy={{
                firstNameLabel: "Ім’я",
                lastNameLabel: "Прізвище",
                emailLabel: "Електронна пошта",
                emailSuggestion: (fix) => <>Можливо, ви мали на увазі {fix}?</>,
                phoneLabel: "Телефон",
                phoneOptional: "(за бажанням)",
                /* The newsletter is in English and the label says so. It was
                   left off entirely at first for that reason; disclosed, the
                   objection goes away and the choice belongs to the reader. */
                subscribeLabel:
                  "Підписатися на новини та матеріали від Valar. Розсилка англійською.",
                submit: "Надіслати мені гайд",
                submitting: "Надсилаю…",
                genericError: "Щось пішло не так. Спробуйте ще раз, будь ласка.",
                privacy: (link) => <>Надсилаючи форму, ви погоджуєтесь із {link}.</>,
                privacyLinkLabel: "політикою конфіденційності",
                successTitle: "Дякую!",
                successReady: "Ваш гайд готовий.",
                successPending: "Уже прямує до вас.",
                downloadLabel: "Завантажити гайд →",
                emailedNote: (title) => (
                  <>Копію ({title}) також надіслано вам на пошту. Перевірте вхідні.</>
                ),
                pendingNote: (title) => <>{title}: надішлю, щойно буде готовий.</>,
                closingLine: "Будуть питання, пишіть.",
                learnMoreLabel: "Наступний крок:",
                learnMoreLinks: [
                  { href: "#webinar", label: "подивитися вебінар" },
                  { href: "#contact", label: "написати мені" },
                ],
                closeLabel: "Закрити",
              }}
            />

            {/* Under the form, not above it: someone who has already given
                their email is the person most likely to spend time on the
                recording, and anything offered before the form competes with
                it. */}
            <div className="mt-5 rounded-sm bg-valar-amber/15 px-5 py-4">
              <p className="text-[14px] leading-relaxed text-valar-navy">
                Дуже раджу подивитися ще{" "}
                <a href="#webinar" className="font-bold underline hover:text-valar-amber">
                  мій вебінар
                </a>
                : він закриє багато ваших питань про купівлю будинку.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── ПИТАННЯ ───────────────────────── */}
      {/* After both magnets and before the tools: someone who has read this far
          is close, and what is left in the way is not information but doubt.
          Open on the page rather than behind a form — an objection answered in
          exchange for an email address is an objection answered too late. */}
      {/* White since the webinar moved up: the first resource section below is
          fog, and two fog sections in a row read as one. */}
      <section data-cmp="UaPage.Faq" className="bg-white px-6 py-14">
        <div className="container mx-auto max-w-5xl">
          <div className="h-[2px] w-8 bg-valar-amber" />
          <h2 className="mt-4 text-[26px] font-bold tracking-tight text-valar-navy md:text-[32px]">
            Питання, які ставлять найчастіше
          </h2>

          {/* The site's own accordion, not a second one written here: the FAQ
              page already has this exact interaction and a visitor who sees
              both should not meet two of them.

              It hides answers with `hidden`, so every answer is still in the
              HTML — collapsed for a reader, present for a crawler. */}
          <div className="mt-9 max-w-3xl space-y-10">
            {UA_FAQ_GROUPS.map((group, g) => (
              <div key={group}>
                <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-valar-amber">
                  {group}
                </p>
                <div className="mt-3">
                  {/* Every group starts closed. With the first answer open,
                      the section led with a wall of text about advisers before
                      the reader had asked anything; collapsed, the fourteen
                      questions read as fourteen offers to answer something. */}
                  <FaqAccordion
                    defaultOpen={null}
                    items={UA_FAQ.filter((item) => item.group === group).map((item, i) => ({
                      id: `ua-faq-${g}-${i}`,
                      question: item.question,
                      answer: item.answer.map((text) => ({ type: "p" as const, text })),
                    }))}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 text-[16px] leading-relaxed text-valar-indigo">
            Не знайшли свого питання?{" "}
            <a
              href="#contact"
              className="font-bold text-valar-navy underline hover:text-valar-amber"
            >
              Напишіть мені
            </a>
            , відповім особисто. Або{" "}
            <a
              href="#webinar"
              className="font-bold text-valar-navy underline hover:text-valar-amber"
            >
              подивіться вебінар
            </a>
            : там багато цих питань розібрано детальніше.
          </p>
        </div>
      </section>

      {/* ──────────────────── КУРС · ВІДЕО · ІНСТРУМЕНТИ ──────────────────── */}
      {/* The background alternates within this list, not by the section's
          position on the page. It used to be `nth-of-type(even)`, which counts
          every section above it — so moving "Хто я" up the page silently
          repainted this one and could stand it next to a neighbour of the same
          colour. */}
      {sections.map((section, i) => (
        <section
          key={section.kind}
          id={section.kind === "tool" ? "tools" : undefined}
          data-cmp={`UaPage.Resources.${section.kind}`}
          className={`scroll-mt-6 px-6 py-16 ${i % 2 === 0 ? "bg-valar-fog" : "bg-white"}`}
        >
          <div className="container mx-auto max-w-5xl">
            <div className="h-[2px] w-8 bg-valar-amber" />
            <h2 className="mt-4 text-[26px] font-bold tracking-tight text-valar-navy md:text-[32px]">
              {section.title}
            </h2>
            <p className="mt-3 text-[16px] text-valar-indigo">{section.intro}</p>

            {/* Three across for the calculators, which are exactly three; two
                across for everything else, where a long title needs the width. */}
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

      {/* ─────────────────────── ЗБЕРЕЖІТЬ ─────────────────────── */}
      {/* Right under the growing collection, because that is what it is talking
          about. The ask is small and unusual on a landing page: not an email,
          not a call, just a bookmark — which is the only thing that costs a
          visitor nothing and still brings them back after the ad stops running.

          A navy strip rather than another light section: it is an aside, and it
          should look like one rather than like a third offer. */}
      <section data-cmp="UaPage.Save" className="bg-valar-navy px-6 py-12">
        <div className="container mx-auto flex max-w-5xl flex-col gap-5 md:flex-row md:items-center">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-valar-amber/20">
            <Bookmark className="h-5 w-5 text-valar-amber" strokeWidth={1.75} />
          </span>
          <div>
            <p className="text-[18px] font-bold leading-snug text-white md:text-[20px]">
              Збережіть цю сторінку в закладки.
            </p>
            <p className="mt-2 max-w-2xl text-[16px] font-light leading-relaxed text-white/85">
              Тут я збираю все, що допомагає розібратися з житлом і фінансами в Новій Зеландії:
              гайди, вебінари, калькулятори, курс. Матеріали додаються, тож заходьте час від часу.
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────────────── КОНТАКТ ───────────────────────── */}
      {/* The first call to action on the page lands here. Writing a message is
          the smallest step a stranger from a Facebook group can take, and since
          2026-10-16 it is the only one: Lena removed the booking calendar, and
          a time is agreed by reply instead.

          The "nothing obliges you" note and "I read it myself, not a bot" are
          gone at Lena's instruction: the section says what happens next and
          stops. */}
      <section id="contact" data-cmp="UaPage.Contact" className="scroll-mt-6 bg-white px-6 py-16">
        {/* Two columns from the top, the heading level with the form, and the
            left column no taller than the form beside it (Lena, 2026-10-16).
            The first pass put the heading above both columns and a 300px
            portrait under the text, which made this the tallest block on the
            page for the smallest ask. */}
        <div className="container mx-auto grid max-w-5xl gap-10 md:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col text-[16px] leading-relaxed text-valar-indigo">
            <div className="h-[2px] w-8 bg-valar-amber" />
            <h2 className="mt-4 text-[26px] font-bold tracking-tight text-valar-navy md:text-[32px]">
              Напишіть мені
            </h2>
            {/* One sentence per line, as Lena reads it. */}
            <p className="mt-3">Опишіть коротко свою ситуацію.</p>
            <p>Я відповім вам протягом одного робочого дня.</p>
            <p>Українською.</p>

            <p className="mt-8 text-[13px] font-bold uppercase tracking-[0.14em] text-valar-amber">
              Що буде далі
            </p>
            <p className="mt-2">
              Якщо питання швидке, я відповім вам листом. Якщо ні, запропоную поговорити, і ми
              призначимо з вами час.
            </p>
            <p className="mt-4 text-[15px]">
              Або просто напишіть на{" "}
              <a
                href="mailto:lena.bykova@valar.co.nz"
                className="font-semibold text-valar-navy underline hover:text-valar-amber"
              >
                lena.bykova@valar.co.nz
              </a>
            </p>

            {/* A face next to the form: the person is about to write to
                someone, and this is who.

                The frame takes whatever height the text leaves beside the
                form (`flex-1`), so the column ends level with it and nothing
                is left empty. A small fixed thumbnail was tried first: it left
                a hole above it, and a full-length portrait shrank her face to
                a few pixels.

                The at-desk photograph, by Lena's choice (2026-10-16): her at
                work across the table from a client, the same one the service
                pages use. It reads as the conversation the form is asking
                for, rather than as a portrait. */}
            <div className="mt-8 flex flex-1 flex-col">
              <div className="relative min-h-[240px] w-full max-w-[380px] flex-1 overflow-hidden rounded-sm">
                <Image
                  src={contactImg}
                  alt="Ліна Бикова за столом із клієнткою"
                  fill
                  sizes="380px"
                  placeholder="blur"
                  className="object-cover object-center"
                />
              </div>
              <p className="mt-3 text-[14px] leading-snug">
                {/* In English, as on the webinar's title slide (Lena, 2026-10-16). */}
                <span className="font-bold text-valar-navy">Ліна Бикова</span>, Mortgage &
                Investment Advisor
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-valar-concrete bg-valar-fog p-7 md:p-8">
            <UaContactForm />
          </div>
        </div>
      </section>

      {/* ───────────────────────── ПІДВАЛ ───────────────────────── */}
      <footer data-cmp="UaPage.Footer" className="bg-valar-navy px-6 py-12 text-valar-lilac">
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
                Документи
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
              <p className="mt-3 text-xs text-valar-lilac/60">Документи англійською.</p>
            </div>
          </div>

          <p className="mt-10 border-t border-valar-indigo pt-6 text-xs leading-relaxed text-valar-lilac/70">
            {/* The Ukrainian form on the page, the registered form in brackets.
                A visitor who wants to check the licence searches the Financial
                Service Providers Register, and "Ліна Бикова" is not what is
                written there. */}
            Valar Financial Advisors Limited (FSP1012862) має ліцензію Financial Advice Provider,
            видану FMA. Фінансові консультації надає Ліна Бикова (Lena Bykova, FSP1010055),
            директорка та фінансова радниця. Заява про розкриття інформації (Disclosure Statement):
            valar.co.nz/disclosure
          </p>
        </div>
      </footer>
    </div>
  );
}
