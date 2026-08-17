"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import heroImg from "../../../../public/images/faq-hero.jpg";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Minus, Plus, Search, X } from "lucide-react";
import type { FaqBlock, FaqCategory } from "@/lib/faqs";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

/** Everything a question can be matched against, lower-cased once up front. */
function haystack(question: string, answer: FaqBlock[]): string {
  const body = answer
    .map((b) => (b.type === "p" ? b.text : b.items.join(" ")))
    .join(" ");
  return `${question} ${body}`.toLowerCase();
}

function AnswerBody({ blocks }: { blocks: FaqBlock[] }) {
  // No measure cap: the answer tracks the width of the question row above it,
  // which is what makes the two read as one block on a wide screen.
  return (
    <div className="space-y-3 text-base leading-relaxed text-gray-600">
      {blocks.map((block, i) =>
        block.type === "p" ? (
          <p key={i}>{block.text}</p>
        ) : (
          <ul key={i} className="list-disc space-y-1 pl-5">
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ),
      )}
    </div>
  );
}

export default function FaqContent({ categories }: { categories: FaqCategory[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | "all">("all");
  const [open, setOpen] = useState<Set<string>>(new Set());

  // Search index built once — the question text plus the full answer, so
  // "kiwisaver" finds the deposit answer that only mentions it in passing.
  const indexed = useMemo(
    () =>
      categories.map((c) => ({
        ...c,
        items: c.items.map((i) => ({ ...i, search: haystack(i.question, i.answer) })),
      })),
    [categories],
  );

  const normalized = query.trim().toLowerCase();
  const searching = normalized.length > 0;

  const shown = useMemo(() => {
    // Every word has to appear somewhere in the question or answer, so
    // "kiwisaver deposit" narrows rather than widens.
    const terms = normalized.split(/\s+/).filter(Boolean);
    return indexed
      .filter((c) => activeCategory === "all" || c.id === activeCategory)
      .map((c) => ({
        ...c,
        items: c.items.filter((i) => terms.every((t) => i.search.includes(t))),
      }))
      .filter((c) => c.items.length > 0);
  }, [indexed, activeCategory, normalized]);

  const matchCount = shown.reduce((n, c) => n + c.items.length, 0);
  const totalCount = categories.reduce((n, c) => n + c.items.length, 0);

  // A shared link like /insights/faq#can-i-use-kiwisaver-towards-my-first-home
  // should land with that answer already open.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Deferred a frame so this reads as a response to the browser's hash
    // navigation rather than part of the first render; the panel then needs
    // one more frame to expand before scrolling lands in the right place.
    let scrollFrame = 0;
    const openFrame = requestAnimationFrame(() => {
      setOpen(new Set([id]));
      scrollFrame = requestAnimationFrame(() =>
        document.getElementById(id)?.scrollIntoView({ block: "center" }),
      );
    });
    return () => {
      cancelAnimationFrame(openFrame);
      cancelAnimationFrame(scrollFrame);
    };
  }, []);

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div data-cmp="FaqPage" className="flex min-h-screen w-full flex-col bg-valar-fog">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        data-cmp="FaqPage.Hero"
        className="relative overflow-hidden bg-valar-navy text-white"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImg}
            alt="A desk with a first-home buyer's list of questions, plans and a coffee"
            fill
            priority
            placeholder="blur"
            sizes="100vw"
            // The band is a wider crop than the photo, so it trims top and
            // bottom; biased low to keep the notebook of questions in frame.
            className="object-cover object-[center_65%]"
          />
          <div className="absolute inset-0 bg-linear-to-r from-valar-navy/95 via-valar-navy/75 to-valar-navy/25" />
          <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/60 to-transparent z-10" />
        </div>
        <div className="container relative z-10 mx-auto max-w-6xl px-4 pt-28 pb-12 md:px-6">
          <Link
            href="/insights"
            className="mb-6 inline-flex items-center gap-2 text-sm text-valar-lilac transition-colors hover:text-valar-amber"
          >
            <ArrowLeft className="h-4 w-4" />
            Insights
          </Link>
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl">
            <motion.div variants={fadeIn} className="mb-3 flex flex-col space-y-2">
              <div className="h-[2px] w-6 bg-valar-amber" />
              <span className="text-valar-steel font-bold tracking-widest text-xs uppercase">Common Questions</span>
            </motion.div>
            <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl font-bold mb-3 tracking-tight leading-[1.1] text-white">
              Questions<span className="text-valar-amber">.</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="max-w-2xl text-base text-white/80 leading-relaxed border-l-2 border-valar-amber pl-4 font-light">
              The things people ask before they book — deposits, KiwiSaver, how much a bank will
              actually lend, and what the process really looks like.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Search + category filter ─────────────────────────── */}
      <div
        data-cmp="FaqPage.Filters"
        className="sticky top-0 z-30 border-b border-valar-concrete bg-valar-fog/95 backdrop-blur-sm"
      >
        <div className="container mx-auto max-w-6xl px-4 py-4 md:px-6">
          <div className="relative mb-4">
            <Search
              className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the questions — try “deposit” or “KiwiSaver”"
              aria-label="Search frequently asked questions"
              className="w-full rounded-sm border border-valar-concrete bg-white py-3 pr-11 pl-11 text-[15px] text-valar-navy placeholder:text-gray-400 focus:border-valar-navy focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-sm p-1 text-gray-400 transition-colors hover:text-valar-navy"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter questions by topic">
            {[{ id: "all", title: "All" }, ...categories].map((c) => {
              const active = activeCategory === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveCategory(c.id as string)}
                  aria-pressed={active}
                  className={[
                    "rounded-sm px-3 py-1.5 text-[13px] font-semibold transition-colors",
                    active
                      ? "bg-valar-navy text-white"
                      : "border border-valar-concrete bg-white text-valar-navy hover:border-valar-navy",
                  ].join(" ")}
                >
                  {c.title}
                </button>
              );
            })}
          </div>

          <p className="mt-3 text-[13px] text-gray-500" aria-live="polite">
            {searching
              ? `${matchCount} of ${totalCount} questions match “${query.trim()}”`
              : `${totalCount} questions`}
          </p>
        </div>
      </div>

      {/* ── Questions ────────────────────────────────────────── */}
      <section data-cmp="FaqPage.List" className="container mx-auto max-w-6xl px-4 py-14 md:px-6">
        {shown.length === 0 ? (
          <div className="rounded-xl border border-valar-concrete bg-white p-10 text-center">
            <h2 className="mb-2 text-xl font-bold text-valar-navy">Nothing matches that yet</h2>
            <p className="mx-auto mb-6 max-w-md text-[15px] leading-relaxed text-gray-600">
              Try a shorter word, or just ask — a real answer beats a search box.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-sm bg-valar-navy px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-valar-indigo"
            >
              Ask your question
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {shown.map((category) => (
              <div key={category.id} id={category.id} className="scroll-mt-44">
                <h2 className="mb-1 text-2xl font-bold text-valar-navy">{category.title}</h2>
                <div className="mb-5 h-[2px] w-6 bg-valar-amber" />

                <div className="border-t border-valar-concrete">
                  {category.items.map((item) => {
                    const isOpen = open.has(item.id) || searching;
                    return (
                      <div
                        key={item.id}
                        id={item.id}
                        data-cmp="FaqPage.Item"
                        className="scroll-mt-44 border-b border-valar-concrete"
                      >
                        <h3>
                          <button
                            type="button"
                            onClick={() => toggle(item.id)}
                            aria-expanded={isOpen}
                            aria-controls={`panel-${item.id}`}
                            className="flex w-full items-center justify-between gap-6 py-5 text-left text-lg font-semibold text-valar-navy transition-colors hover:text-valar-indigo focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-valar-amber"
                          >
                            <span>
                              {item.question}
                              {item.draft && (
                                <span className="ml-3 rounded-sm bg-valar-amber/20 px-2 py-0.5 align-middle text-[11px] font-bold tracking-wide text-valar-navy uppercase">
                                  Draft
                                </span>
                              )}
                              {item.review && (
                                <span className="ml-3 rounded-sm bg-valar-navy/10 px-2 py-0.5 align-middle text-[11px] font-bold tracking-wide text-valar-navy uppercase">
                                  Review by {item.review}
                                </span>
                              )}
                            </span>
                            <span className="shrink-0 text-valar-amber" aria-hidden="true">
                              {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                            </span>
                          </button>
                        </h3>
                        <div id={`panel-${item.id}`} hidden={!isOpen} className="pb-6">
                          <AnswerBody blocks={item.answer} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section data-cmp="FaqPage.Cta" className="bg-white px-4 pb-20 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center gap-8 rounded-xl bg-valar-navy p-8 md:p-10">
            <div className="min-w-[260px] flex-1">
              <h2 className="mb-2 text-2xl font-bold text-white">Still not sure?</h2>
              <p className="text-[15px] leading-relaxed text-valar-lilac">
                Most of these depend on your situation. A short conversation answers them properly.
              </p>
            </div>
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-valar-amber px-8 py-4 font-bold text-valar-navy transition-colors hover:bg-valar-amber-hover"
            >
              <Calendar className="h-5 w-5" /> Book a Clarity Call
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
