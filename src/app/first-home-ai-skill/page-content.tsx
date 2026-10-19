import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ClipboardList,
  FileSpreadsheet,
  Languages,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ValariGetButton } from "@/components/valari-get-button";

// /first-home-ai-skill is where the QR code on the webinar slide lands, and the
// link in Lena's emails. The skill itself points people here for the blank
// planner, so the URL is permanent: never rename or remove the route.
// A centred landing with one action, "Get Valári", which opens the form
// (Lena, 2026-10-19): name, phone, email and a required agreement that Valári
// is general information, not advice.

const VALARI_VERSION = 1;

/**
 * Valári's avatar (Lena, 2026-10-19), cropped inside its rounded tile so the
 * source's black corners stay out. Framed as a rounded square, not a circle: a
 * circle cuts off the antenna tips. Null shows a placeholder mark instead.
 */
const VALARI_AVATAR: string | null = "/images/valari-avatar.jpg";

const features = [
  {
    Icon: BookOpen,
    title: "The 10 steps",
    text: "Walks you through every step of buying, in plain language.",
  },
  {
    Icon: FileSpreadsheet,
    title: "Your plan",
    text: "Builds your personal buying plan and a planner workbook.",
  },
  {
    Icon: ClipboardList,
    title: "Checklists",
    text: "Documents, open homes and offers, ready when you need them.",
  },
  { Icon: Languages, title: "Your language", text: "Speaks your language." },
];

const steps = [
  {
    title: "Get the file",
    text: "Tap Get Valári and fill in the short form. The file comes to your email.",
  },
  { title: "Set up", text: "Open it and follow the short setup for Claude or ChatGPT." },
  {
    title: "Say hi",
    text: "Say “Hi Valári” and answer a few short questions about where you are.",
  },
];

// Nodes and links of the hero constellation, in a 1200×600 box, spread to both
// sides so the centred text sits on clear navy. Hand-placed rather than random:
// a server render and a client render must draw the same picture.
const nodes: [number, number, number][] = [
  [90, 120, 2],
  [210, 60, 3],
  [260, 220, 4],
  [120, 340, 2],
  [230, 470, 3],
  [80, 540, 2],
  [330, 560, 2],
  [940, 80, 2],
  [1060, 170, 3],
  [990, 300, 4],
  [1140, 360, 2],
  [900, 460, 2],
  [1080, 520, 3],
  [1170, 90, 2],
];
const links: [number, number][] = [
  [0, 1],
  [1, 2],
  [0, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [4, 6],
  [2, 4],
  [7, 8],
  [8, 9],
  [8, 13],
  [9, 10],
  [9, 11],
  [11, 12],
  [10, 12],
  [7, 9],
];
// The brightest nodes take the amber; the rest stay horizon blue.
const bright = new Set([2, 9]);

function Constellation() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
    >
      <g stroke="#6f88c4" strokeOpacity="0.28" strokeWidth="1">
        {links.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={nodes[a][0]}
            y1={nodes[a][1]}
            x2={nodes[b][0]}
            y2={nodes[b][1]}
          />
        ))}
      </g>
      {nodes.map(([x, y, r], i) =>
        bright.has(i) ? (
          <g key={i}>
            <circle cx={x} cy={y} r={r * 5} fill="#e8a23a" fillOpacity="0.12" />
            <circle cx={x} cy={y} r={r} fill="#e8a23a" />
          </g>
        ) : (
          <circle key={i} cx={x} cy={y} r={r} fill="#c8cbe3" fillOpacity="0.7" />
        ),
      )}
    </svg>
  );
}

export default function FirstHomeAiSkillContent() {
  return (
    <div data-cmp="ValariPage" className="w-full flex flex-col font-sans">
      {/* HERO: centred, one action. */}
      <section
        data-cmp="ValariPage.Hero"
        className="relative overflow-hidden bg-valar-navy"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 50% 45%, #2b416d 0%, #14274f 45%, #061634 80%)",
        }}
      >
        <Constellation />
        <div className="absolute inset-x-0 top-0 z-10 h-40 bg-linear-to-b from-black/40 to-transparent" />
        <div className="container relative z-10 mx-auto flex flex-col items-center px-6 pt-32 pb-20 text-center md:px-12 md:pt-36 md:pb-24">
          <div
            data-cmp="ValariPage.Avatar"
            className="relative h-36 w-36 overflow-hidden rounded-[22%] bg-valar-indigo/40 ring-2 ring-valar-amber ring-offset-4 ring-offset-valar-navy md:h-44 md:w-44"
          >
            {VALARI_AVATAR ? (
              <Image
                src={VALARI_AVATAR}
                alt="Valári"
                fill
                sizes="176px"
                priority
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Sparkles className="h-14 w-14 text-valar-amber" />
              </div>
            )}
          </div>

          <span className="mt-8 text-xs font-bold uppercase tracking-widest text-valar-amber">
            Free AI skill · Version {VALARI_VERSION}
          </span>
          <h1 className="mt-3 text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl">
            Valári, your first home assistant<span className="text-valar-amber">.</span>
          </h1>
          {/* Lena's wording (2026-10-19), one sentence per line. */}
          <p className="mt-4 text-lg font-light leading-relaxed text-white/80">
            <span className="block">Buying your first home, step by step.</span>
            <span className="block">Ask it anything, anytime.</span>
          </p>
          <div className="mt-9">
            <ValariGetButton cmp="ValariPage.Hero.Get" />
          </div>
          <p className="mt-4 text-sm font-light text-valar-lilac">
            Free · Works with Claude and ChatGPT
          </p>
        </div>
      </section>

      {/* WHAT IT DOES */}
      <section data-cmp="ValariPage.Features" className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-10 flex flex-col items-center space-y-3 text-center">
            <div className="h-[2px] w-6 bg-valar-amber" />
            <h2 className="text-3xl font-bold tracking-tight text-valar-navy">What it does</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ Icon, title, text }) => (
              <div key={title} className="rounded-sm border border-valar-concrete p-6">
                <Icon className="mb-4 h-6 w-6 text-valar-amber" />
                <h3 className="mb-2 font-bold text-valar-navy">{title}</h3>
                <p className="text-sm leading-relaxed text-valar-indigo">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TO START */}
      <section data-cmp="ValariPage.Steps" className="bg-valar-fog py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-10 flex flex-col items-center space-y-3 text-center">
            <div className="h-[2px] w-6 bg-valar-amber" />
            <h2 className="text-3xl font-bold tracking-tight text-valar-navy">How to start</h2>
          </div>
          <ol className="grid gap-8 md:grid-cols-3">
            {steps.map(({ title, text }, i) => (
              <li key={title} className="flex flex-col items-center text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-valar-amber font-bold text-valar-navy">
                  {i + 1}
                </span>
                <h3 className="mt-3 font-bold text-valar-navy">{title}</h3>
                <p className="mt-1 max-w-xs text-sm leading-relaxed text-valar-indigo">{text}</p>
              </li>
            ))}
          </ol>

          <div
            data-cmp="ValariPage.Privacy"
            className="mx-auto mt-12 flex max-w-3xl items-start gap-4 rounded-sm bg-white px-6 py-5 text-sm leading-relaxed text-valar-indigo"
          >
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-valar-amber" />
            <p>
              Rough numbers are enough. Don&apos;t share account numbers, passport details or bank
              statements with any AI.
            </p>
          </div>

          {/* The second chance to act, for whoever read down the page first. */}
          <div className="mt-12 flex justify-center">
            <ValariGetButton cmp="ValariPage.Steps.Get" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section data-cmp="ValariPage.Cta" className="bg-valar-navy py-16">
        <div className="container mx-auto flex flex-col items-start gap-6 px-6 md:flex-row md:items-center md:justify-between md:px-12">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Want your own numbers looked at by a person?
            </h2>
            <p className="mt-2 font-light text-valar-lilac">
              Deposit, how much to borrow, which bank to start with.
            </p>
          </div>
          <Link
            href="/book"
            data-cmp="ValariPage.Link.Book"
            className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-sm border border-white/30 px-8 py-4 font-bold text-white transition-colors hover:border-valar-amber hover:text-valar-amber"
          >
            <Calendar className="h-5 w-5" /> Book a clarity call with Lena
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
