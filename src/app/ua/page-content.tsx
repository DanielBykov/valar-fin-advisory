"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { InlineWidget } from "react-calendly";
import {
  ArrowRight,
  Bookmark,
  Download,
  ExternalLink,
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
import webinarImg from "../../../public/images/lena-intro.webp";
import aboutImg from "../../../public/images/lena-portrait.webp";
import { GuideCaptureForm } from "@/components/guide-capture-form";
import { LEAD_MAGNETS } from "@/lib/lead-magnets";
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
 * Two capture points on one page, so each says which one it was. They share a
 * MailerLite group, and `lead_source` is the only thing that distinguishes
 * "asked for the recording" from "asked for the guide" once they are in it.
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
];/*
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
 * ⚠️ REQUIRED BEFORE `/ua` IS PUBLISHED. Until this is set the form takes an
 * email and has nothing to open, which is the one thing the block promises.
 * Set it to the host's *embed* URL (the one meant for an iframe), not the
 * page URL a viewer would see.
 */
const WEBINAR_EMBED_URL: string | null = null;

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
 * Facts about the format, not claims about the content. The recording does not
 * exist yet and its running order is not decided, so anything describing what
 * is *in* it would be a promise written before the thing it promises. Lena is
 * sending the list of what the webinar covers; that replaces these.
 *
 * "Українською" is deliberately not here. It was in the eyebrow, in the first
 * fact and in the description all at once — three times inside one block, which
 * is where the page started sounding like it was insisting. It survives in the
 * eyebrow only.
 */
const WEBINAR_FACTS = [
  "Це запис, тож дивіться коли зручно і з паузами",
  "Можна розгорнути на весь екран",
  "PDF-матеріали з вебінару приходять на пошту",
];

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
      if (json.success) setSucceeded(true);
      else setError("Не вдалося надіслати. Спробуйте ще раз, будь ласка.");
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
          Відповім протягом одного робочого дня. Лист із підтвердженням уже надіслано на вашу
          пошту.
        </p>
        <p className="mt-5 text-sm leading-relaxed">
          <a href="#book" className="font-semibold text-valar-navy underline hover:text-valar-amber">
            або оберіть час для розмови
          </a>
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
          away, which is what "приблизил" was. */}
      <section
        data-cmp="UaPage.Hero"
        className="relative isolate flex min-h-[480px] items-center overflow-hidden md:aspect-[1920/819] md:max-h-[680px] md:min-h-[520px]"
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
                postpone. The webinar and the calculators keep their sections
                and their anchors; they just stop competing with the ask.

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
                href="#guide"
                data-cmp="UaPage.Cta.Guide"
                className={`${HERO_CTA} ${HERO_CTA_SECONDARY}`}
              >
                <Download className="h-[18px] w-[18px] shrink-0 text-valar-amber" />
                Гайд First Home Buyer
              </a>
            </div>
          </div>
        </div>
      </section>

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
              Після розмови у вас буде чітке розуміння, де ви зараз, які можливості маєте і які кроки
              попереду.
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
                  Мені важливо працювати з людьми довго. Якщо одного дня ваші діти прийдуть до мене
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

      {/* ─────────────────────── ЯК МИ ПРАЦЮЄМО ─────────────────────── */}
      <section data-cmp="UaPage.Steps" className="bg-white px-6 py-16">
        <div className="container mx-auto max-w-5xl">
          <div className="h-[2px] w-8 bg-valar-amber" />
          <h2 className="mt-4 text-[26px] font-bold tracking-tight text-valar-navy md:text-[32px]">
            Як ми працюємо
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.n} className="flex h-full flex-col rounded-sm border border-valar-concrete bg-white p-6">
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
                closingLine: "Будуть питання, пишіть або записуйтесь на розмову.",
                learnMoreLabel: "Наступний крок:",
                learnMoreLinks: [
                  { href: "#webinar", label: "подивитися вебінар" },
                  { href: "#book", label: "записатися на розмову" },
                ],
                closeLabel: "Закрити",
              }}
              />

            {/* Under the form, not above it: someone who has already given
                their email is the person most likely to spend twenty minutes
                on the recording, and anything offered before the form competes
                with it. */}
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
      <section data-cmp="UaPage.Faq" className="bg-valar-fog px-6 py-14">
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
            <a href="#contact" className="font-bold text-valar-navy underline hover:text-valar-amber">
              Напишіть мені
            </a>
            , відповім особисто. Або подивіться вебінар нижче: там багато цих питань розібрано
            детальніше.
          </p>
        </div>
      </section>

      {/* ──────────────────────── ВЕБІНАР ──────────────────────── */}
      {/* Above the guide because it is the stronger offer: a recording of Lena
          talking does in ten minutes what a PDF cannot do at all, which is let
          someone decide whether they want this person handling their mortgage.

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
            Безкоштовний вебінар українською
          </p>
          <h2 className="mt-3 max-w-3xl text-[28px] font-bold leading-tight tracking-tight text-valar-navy md:text-[38px]">
            {WEBINAR.title}
          </h2>
          <p className="mt-4 max-w-2xl text-[17px] font-light leading-relaxed text-valar-indigo md:text-[19px]">
            {WEBINAR.description}
          </p>

          {/* Columns stretch to the same height and the player frame takes the
              slack, exactly as in the guide block above. */}
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <div className="flex flex-col">
              <div className="relative min-h-[220px] w-full flex-1 overflow-hidden rounded-sm bg-valar-navy">
                {webinarUnlocked && WEBINAR_EMBED_URL ? (
                  <iframe
                    src={WEBINAR_EMBED_URL}
                    title={WEBINAR.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                  />
                ) : (
                  <>
                    {/* 16:9 out of a 1122x1402 portrait — the crop window is
                        631px tall, centred at 38% to hold the face and
                        shoulders. If the photo is ever swapped this needs
                        re-tuning with it. */}
                    <Image
                      src={webinarImg}
                      alt="Ліна Бикова"
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      placeholder="blur"
                      className="object-cover object-[center_38%]"
                    />
                    <div className="absolute inset-0 bg-valar-navy/35" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-valar-amber shadow-lg">
                        <Play className="ml-1 h-7 w-7 fill-valar-navy text-valar-navy" />
                      </span>
                      <span className="text-sm font-light text-white/90">
                        {webinarUnlocked
                          ? "Запис ось-ось буде тут."
                          : "Залиште пошту, і запис відкриється тут."}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <ul className="mt-7 space-y-3">
                {WEBINAR_FACTS.map((fact) => (
                  <li
                    key={fact}
                    className="flex gap-3 text-[16px] leading-relaxed text-valar-indigo"
                  >
                    <Check className="mt-1 h-4 w-4 shrink-0 text-valar-amber" />
                    {fact}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-valar-concrete bg-valar-fog p-7 md:p-8">
              <div className="mb-6">
                <div className="h-[2px] w-6 bg-valar-amber mb-4" />
                <h3 className="text-[19px] font-bold leading-snug text-valar-navy">
                  Залиште пошту і дивіться
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-valar-indigo">
                  Запис відкривається одразу. Вам на пошту прийдуть PDF-матеріали з цього вебінару.
                </p>
              </div>

              <GuideCaptureForm
                guide={WEBINAR}
                source={SOURCE_WEBINAR}
                onSuccess={webinarUnlock.write}
                copy={{
                  firstNameLabel: "Ім’я",
                  lastNameLabel: "Прізвище",
                  emailLabel: "Електронна пошта",
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
                  closingLine: "Будуть питання, пишіть або записуйтесь на розмову.",
                  learnMoreLabel: "Далі:",
                  learnMoreLinks: [{ href: "#book", label: "записатися на розмову" }],
                  closeLabel: "Закрити",
                }}
              />
            </div>
          </div>
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

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {section.items.map((r) => {
                const inner = (
                  <>
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
      {/* The first call to action on the page lands here, ahead of the
          calendar. Writing a message is a smaller step than picking a slot in
          someone's diary, and for a stranger arriving from a Facebook group the
          smaller step is the one that gets taken. The calendar is directly
          below for the people who are already past that. */}
      <section id="contact" data-cmp="UaPage.Contact" className="scroll-mt-6 bg-white px-6 py-16">
        <div className="container mx-auto max-w-5xl">
          <div className="h-[2px] w-8 bg-valar-amber" />
          <h2 className="mt-4 text-[26px] font-bold tracking-tight text-valar-navy md:text-[32px]">
            Напишіть мені
          </h2>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-valar-indigo">
            Опишіть коротко свою ситуацію, і я відповім протягом одного робочого дня. Українською.
          </p>

          <div className="mt-9 grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-start">
            <div className="space-y-4 text-[16px] leading-relaxed text-valar-indigo">
              <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-valar-amber">
                Що буде далі
              </p>
              <p>
                Я прочитаю ваше повідомлення сама. Це не служба підтримки й не бот.
              </p>
              <p>
                Якщо питання швидке, відповім листом. Якщо ні, запропоную поговорити, і тоді можна
                одразу обрати час нижче.
              </p>
              <p className="border-l-2 border-valar-concrete pl-5 text-[15px] text-valar-indigo/80">
                Написати листа ні до чого не зобов’язує. Регульована консультація починається лише
                після того, як обидві сторони підписали обсяг послуг (scope of engagement).
              </p>
              <p className="pt-2 text-[15px]">
                Або просто напишіть на{" "}
                <a
                  href="mailto:lena.bykova@valar.co.nz"
                  className="font-semibold text-valar-navy underline hover:text-valar-amber"
                >
                  lena.bykova@valar.co.nz
                </a>
              </p>
            </div>

            <div className="rounded-xl border border-valar-concrete bg-valar-fog p-7 md:p-8">
              <UaContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── ЗАПИС ───────────────────────── */}
      <section id="book" data-cmp="UaPage.Book" className="scroll-mt-6 bg-valar-fog px-6 pt-16">
        <div className="container mx-auto max-w-3xl">
          <div className="h-[2px] w-8 bg-valar-amber" />
          <h2 className="mt-4 text-[26px] font-bold tracking-tight text-valar-navy md:text-[32px]">
            Записатися на розмову
          </h2>
          <p className="mt-3 text-[16px] text-valar-indigo">
            Безкоштовно, 20–30 хвилин. Оберіть зручний час, або напишіть вище, якщо так простіше.
          </p>

          {/* The same wording the English booking page carries, and it is not
              decorative: a free introductory call is not a financial advice
              service, and saying where regulated advice actually begins is what
              keeps this page on the right side of that line. */}
          <div className="mt-6 flex items-start gap-4">
            <div className="min-h-[1.5rem] w-[2px] shrink-0 self-stretch bg-valar-amber" />
            <div className="space-y-2 text-sm leading-relaxed text-valar-indigo">
              <p className="font-semibold text-valar-navy">Що буде на цій розмові</p>
              <p>
                Безкоштовні 20–30 хвилин про те, де ви зараз, чого хочете досягти й чи підходимо ми
                одне одному.
              </p>
              <p className="italic text-valar-indigo/70">
                Ця розмова не є наданням фінансової консультації. Регульована консультація
                починається лише після того, як обидві сторони підписали обсяг послуг (scope of
                engagement). Жодних зобов’язань і жодної оплати за цю розмову.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-3xl">
          <InlineWidget
            url="https://calendly.com/lena-bykova-valar/new-meeting"
            styles={{ height: "750px" }}
            /* Tags the booking with where it came from, so "did the Ukrainian
               page produce anything" is a question Calendly can answer. */
            utm={{ utmSource: "valar-ua", utmMedium: "website", utmCampaign: "ukrainian-community" }}
            pageSettings={{
              backgroundColor: "f6f7f9",
              hideEventTypeDetails: false,
              hideLandingPageDetails: false,
              primaryColor: "f0a500",
              textColor: "061634",
            }}
          />
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
                  { href: "https://www.instagram.com/lena.valarnz/", Icon: Instagram, label: "Instagram" },
                  { href: "https://www.facebook.com/lena.valarnz", Icon: Facebook, label: "Facebook" },
                  { href: "https://www.linkedin.com/company/valar-advisors", Icon: Linkedin, label: "LinkedIn" },
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
