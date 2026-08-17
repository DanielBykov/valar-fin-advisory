"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import heroImg from "../../../public/images/insights-hero.jpg";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Calculator, LineChart, Wallet } from "lucide-react";
import ArticleCard from "@/components/insights/article-card";
import FaqAccordion from "@/components/insights/faq-accordion";
import NewsletterSignup from "@/components/insights/newsletter-signup";
import { TAG_LABELS, TAG_ORDER, visibleArticles, type InsightTag } from "@/lib/insights";
import type { FaqItem } from "@/lib/faqs";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const TOOLS = [
  {
    href: "/insights/calculators",
    icon: Calculator,
    title: "Mortgage Repayments",
    copy: "Weekly, fortnightly or monthly — and what an extra $100 a week takes off the term.",
    live: true,
  },
  {
    href: "/insights/calculators",
    icon: LineChart,
    title: "Borrowing Power",
    copy: "What a bank is likely to lend on your income, and what moves the number.",
    live: false,
  },
  {
    href: "/insights/calculators",
    icon: Wallet,
    title: "Cashflow",
    copy: "Where the money actually goes each month, before a lender asks.",
    live: false,
  },
];

export default function InsightsContent({ faqs }: { faqs: FaqItem[] }) {
  const articles = useMemo(() => visibleArticles(), []);
  const [filter, setFilter] = useState<InsightTag | "all">("all");

  // Menu links like /insights?tag=market land on the page with that filter
  // applied. Deferred a frame: the query string is state owned by the browser,
  // so applying it is a sync step rather than part of the first render.
  useEffect(() => {
    const tag = new URLSearchParams(window.location.search).get("tag");
    if (!tag || !(TAG_ORDER as string[]).includes(tag)) return;
    const frame = requestAnimationFrame(() => setFilter(tag as InsightTag));
    return () => cancelAnimationFrame(frame);
  }, []);

  const shown = filter === "all" ? articles : articles.filter((a) => a.tag === filter);
  const availableTags = TAG_ORDER.filter((tag) => articles.some((a) => a.tag === tag));

  return (
    <div data-cmp="InsightsPage" className="flex min-h-screen w-full flex-col bg-valar-fog">
      {/* ── A · Hero ─────────────────────────────────────────── */}
      {/* Layout mirrors the site-wide hero pattern (Services / About / service
          sub-pages): kicker rule + eyebrow, h1, amber-ruled standfirst. */}
      <section
        data-cmp="InsightsPage.Hero"
        className="relative overflow-hidden bg-valar-navy text-white"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImg}
            alt="Reviewing the New Zealand market outlook over a Marlborough Sounds view"
            fill
            priority
            placeholder="blur"
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Left-to-right navy wash: the copy sits over the pale wall on the
              left, so this runs heavier than the Services hero to hold contrast. */}
          <div className="absolute inset-0 bg-linear-to-r from-valar-navy/95 via-valar-navy/70 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/60 to-transparent z-10" />
        </div>
        <div className="container relative z-10 mx-auto max-w-6xl px-4 pt-36 pb-20 md:px-6">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl">
            <motion.div variants={fadeIn} className="mb-4 flex flex-col space-y-3">
              <div className="h-[2px] w-6 bg-valar-amber" />
              <span className="text-valar-steel font-bold tracking-widest text-xs uppercase">Market Commentary &amp; Tools</span>
            </motion.div>
            <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-[1.1] text-white">
              Insights<span className="text-valar-amber">.</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="max-w-2xl text-lg text-white/80 leading-relaxed border-l-2 border-valar-amber pl-4 font-light">
              Property market commentary, financial education and practical tools — so the numbers behind
              your decisions are visible before you make them.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── B · Latest articles ──────────────────────────────── */}
      {articles.length > 0 && (
        <section
          data-cmp="InsightsPage.Articles"
          className="container mx-auto max-w-6xl px-4 py-16 md:px-6"
        >
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-bold text-valar-navy">Latest</h2>
          </div>

          <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter articles by topic">
            {(["all", ...availableTags] as const).map((tag) => {
              const active = filter === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setFilter(tag as InsightTag | "all")}
                  aria-pressed={active}
                  className={[
                    "rounded-full border px-6 py-2 text-sm font-medium transition-colors",
                    active
                      ? "border-valar-navy bg-valar-navy text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:border-valar-amber",
                  ].join(" ")}
                >
                  {tag === "all" ? "All" : TAG_LABELS[tag as InsightTag]}
                </button>
              );
            })}
          </div>

          {shown.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {shown.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Nothing under this topic yet.</p>
          )}
        </section>
      )}

      {/* ── C · Tools ────────────────────────────────────────── */}
      <section data-cmp="InsightsPage.Tools" className="bg-white px-4 py-16 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-valar-amber">
                Tools
              </p>
              <h2 className="text-3xl font-bold text-valar-navy">Run your own numbers</h2>
            </div>
            <Link
              href="/insights/calculators"
              className="text-sm font-semibold text-valar-indigo hover:text-valar-navy"
            >
              See all calculators →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              const body = (
                <>
                  <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-[10px] bg-valar-amber/15 text-valar-amber">
                    <Icon className="h-5 w-5" />
                  </span>
                  {!tool.live && (
                    <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.1em] text-valar-steel">
                      Coming later
                    </span>
                  )}
                  <h3 className="mb-2 text-lg font-bold text-valar-navy">{tool.title}</h3>
                  <p className="mb-5 flex-1 text-sm leading-relaxed text-gray-600">{tool.copy}</p>
                  {tool.live && (
                    <span className="inline-flex items-center text-sm font-semibold text-valar-navy">
                      Open <ArrowRight className="ml-2 h-4 w-4 text-valar-amber" />
                    </span>
                  )}
                </>
              );

              return tool.live ? (
                <Link
                  key={tool.title}
                  href={tool.href}
                  data-cmp="InsightsPage.Tools.Card"
                  className="flex flex-col rounded-xl border border-gray-100 bg-valar-fog p-7 transition-shadow hover:shadow-md"
                >
                  {body}
                </Link>
              ) : (
                <div
                  key={tool.title}
                  data-cmp="InsightsPage.Tools.Card"
                  className="flex flex-col rounded-xl border border-gray-100 bg-valar-fog p-7 opacity-60"
                >
                  {body}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── D · First Home Buyers Academy ────────────────────── */}
      <section
        data-cmp="InsightsPage.Academy"
        className="relative overflow-hidden bg-valar-navy px-4 py-16 md:px-6"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-valar-navy via-valar-navy to-valar-indigo/50"
        />
        <div className="container relative mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-valar-amber">
              First Home Buyers Academy
            </p>
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Everything you need before your first offer<span className="text-valar-amber">.</span>
            </h2>
            <p className="text-base leading-relaxed text-valar-lilac">
              A step-by-step path through deposits, KiwiSaver, borrowing power and the buying process —
              free, and in the order you actually need it.
            </p>
            <Link
              href="/services/first-home-buyers"
              className="mt-7 inline-flex items-center gap-2.5 rounded-lg bg-valar-amber px-6 py-3.5 text-[15px] font-bold text-valar-navy transition-colors hover:bg-valar-amber-hover"
            >
              <BookOpen className="h-[18px] w-[18px]" />
              Start the Academy
            </Link>
          </div>
        </div>
      </section>

      {/* ── E · FAQ ──────────────────────────────────────────── */}
      <section id="faq" data-cmp="InsightsPage.Faq" className="scroll-mt-24 px-4 py-16 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-valar-amber">
              Common questions
            </p>
            <h2 className="text-3xl font-bold text-valar-navy">Asked most often</h2>
          </div>
          <FaqAccordion items={faqs} />
          <Link
            href="/insights/faq"
            className="mt-7 inline-flex items-center gap-1 font-semibold text-valar-amber hover:underline"
          >
            All questions, by topic <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── F · Newsletter ───────────────────────────────────── */}
      <section data-cmp="InsightsPage.Newsletter" className="bg-white px-4 py-16 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center gap-8 rounded-xl border border-gray-100 bg-valar-fog p-8 md:p-10">
            <div className="min-w-[260px] flex-1">
              <h3 className="mb-2 text-2xl font-bold text-valar-navy">Stay updated</h3>
              <p className="text-[15px] leading-relaxed text-gray-600">
                Market commentary and practical lending guidance — when there&apos;s something worth
                saying, not on a schedule.
              </p>
            </div>
            <div className="min-w-[280px] flex-1">
              <NewsletterSignup />
            </div>
          </div>
        </div>
      </section>

      {/* ── G · Final CTA ────────────────────────────────────── */}
      <section data-cmp="InsightsPage.FinalCta" className="px-4 py-20 text-center md:px-6">
        <div className="container mx-auto max-w-2xl">
          <h2 className="mb-3 text-3xl font-bold text-valar-navy md:text-4xl">
            Talk it through with someone<span className="text-valar-amber">.</span>
          </h2>
          <p className="mb-7 text-gray-600">
            Thirty minutes, no obligation — bring the question you have been circling.
          </p>
          <Link
            href="/book"
            className="inline-flex items-center rounded-lg bg-valar-amber px-7 py-3.5 text-[15px] font-bold text-valar-navy transition-colors hover:bg-valar-amber-hover"
          >
            Book Strategy Call
          </Link>
        </div>
      </section>
    </div>
  );
}
