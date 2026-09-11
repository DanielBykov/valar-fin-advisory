"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Search, X } from "lucide-react";
// Types only: the terms arrive as props, so the data file stays out of the client bundle.
import type { GlossaryCategory, GlossaryEntry } from "@/lib/glossary";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

type Category = { id: GlossaryCategory; title: string };

/** A paragraph with **bold** runs — Deposit uses them to name its two meanings. */
function Rich({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-valar-navy">
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

export default function GlossaryContent({
  entries,
  categories,
}: {
  entries: GlossaryEntry[];
  categories: Category[];
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<GlossaryCategory | "all">("all");
  // The term to scroll to once it is on the page, and the one briefly lit up after.
  const [target, setTarget] = useState<string | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);

  const titles = useMemo(() => new Map(categories.map((c) => [c.id, c.title])), [categories]);

  // Search index built once — the term plus its full definition, so "deposit"
  // also finds Auction and First Home Loan, which only use the word.
  const indexed = useMemo(
    () =>
      entries.map((entry) => ({
        ...entry,
        search: `${entry.term} ${entry.body.join(" ").replace(/\*\*/g, "")}`.toLowerCase(),
      })),
    [entries],
  );

  const normalized = query.trim().toLowerCase();
  const searching = normalized.length > 0;

  const shown = useMemo(() => {
    // Every word has to appear, so "fixed break" narrows rather than widens.
    const words = normalized.split(/\s+/).filter(Boolean);
    return indexed.filter(
      (entry) =>
        (activeCategory === "all" || entry.categories.includes(activeCategory)) &&
        words.every((word) => entry.search.includes(word)),
    );
  }, [indexed, activeCategory, normalized]);

  // Entries arrive sorted A–Z, so grouping in order keeps the letters in order.
  const groups = useMemo(() => {
    const byLetter = new Map<string, typeof shown>();
    for (const entry of shown) {
      byLetter.set(entry.letter, [...(byLetter.get(entry.letter) ?? []), entry]);
    }
    return [...byLetter.entries()];
  }, [shown]);

  const lettersShown = new Set(groups.map(([letter]) => letter));

  const countFor = (id: GlossaryCategory) => entries.filter((e) => e.categories.includes(id)).length;

  // A see-also link can point at a term the current filter hides. Clear the
  // filter first, then scroll once the term is back on the page.
  const goTo = (slug: string) => {
    if (!shown.some((entry) => entry.slug === slug)) {
      setQuery("");
      setActiveCategory("all");
    }
    setTarget(slug);
    window.history.replaceState(null, "", `#${slug}`);
  };

  useEffect(() => {
    if (!target) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
      setHighlight(target);
      setTarget(null);
    });
    return () => cancelAnimationFrame(frame);
  }, [target, shown]);

  useEffect(() => {
    if (!highlight) return;
    const timer = setTimeout(() => setHighlight(null), 2200);
    return () => clearTimeout(timer);
  }, [highlight]);

  // A shared link like /insights/glossary#break-fee lands on that term, lit up.
  useEffect(() => {
    const slug = decodeURIComponent(window.location.hash.slice(1));
    if (!slug) return;
    const frame = requestAnimationFrame(() => setTarget(slug));
    return () => cancelAnimationFrame(frame);
  }, []);

  const jumpToLetter = (letter: string) =>
    document
      .getElementById(`letter-${letter.toLowerCase()}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });

  const activeTitle = activeCategory === "all" ? null : titles.get(activeCategory);

  return (
    <div data-cmp="GlossaryPage" className="flex min-h-screen w-full flex-col bg-valar-fog">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section data-cmp="GlossaryPage.Hero" className="relative overflow-hidden bg-valar-navy text-white">
        {/* No photograph yet — a letterform stands in until Lena picks one. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -bottom-16 hidden select-none text-[18rem] leading-none font-bold tracking-tighter text-white/[0.04] md:block"
        >
          A–Z
        </span>
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
              <span className="text-valar-steel font-bold tracking-widest text-xs uppercase">Plain English</span>
            </motion.div>
            <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl font-bold mb-3 tracking-tight leading-[1.1] text-white">
              Glossary<span className="text-valar-amber">.</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="max-w-2xl text-base text-white/80 leading-relaxed border-l-2 border-valar-amber pl-4 font-light">
              What the words in a home loan, a purchase agreement, KiwiSaver and an investment actually
              mean, and why each one matters to you.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Search, categories, letters ──────────────────────── */}
      <div
        data-cmp="GlossaryPage.Filters"
        className="sticky top-0 z-30 border-b border-valar-concrete bg-valar-fog/95 backdrop-blur-sm"
      >
        <div className="container mx-auto max-w-6xl px-4 py-4 md:px-6">
          <div className="relative mb-3">
            <Search
              className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the terms, for example “deposit” or “KiwiSaver”"
              aria-label="Search the glossary"
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

          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter terms by topic">
            {[{ id: "all" as const, title: "All", count: entries.length }, ...categories.map((c) => ({ ...c, count: countFor(c.id) }))].map(
              (chip) => {
                const active = activeCategory === chip.id;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => setActiveCategory(chip.id)}
                    aria-pressed={active}
                    className={[
                      "rounded-sm px-3 py-1.5 text-[13px] font-semibold transition-colors",
                      active
                        ? "bg-valar-navy text-white"
                        : "border border-valar-concrete bg-white text-valar-navy hover:border-valar-navy",
                    ].join(" ")}
                  >
                    {chip.title}
                    <span className={active ? "ml-1.5 text-white/60" : "ml-1.5 text-gray-400"}>{chip.count}</span>
                  </button>
                );
              },
            )}
          </div>

          {/* Scrolls sideways on a phone rather than wrapping into three rows of letters. */}
          <nav aria-label="Jump to a letter" className="-mx-4 mt-3 overflow-x-auto px-4 md:mx-0 md:px-0">
            <ol className="flex min-w-max gap-0.5 md:min-w-0 md:justify-between">
              {ALPHABET.map((letter) => {
                const available = lettersShown.has(letter);
                return (
                  <li key={letter}>
                    <button
                      type="button"
                      disabled={!available}
                      onClick={() => jumpToLetter(letter)}
                      aria-label={available ? `Jump to ${letter}` : `No terms under ${letter}`}
                      className={[
                        "flex h-8 w-8 items-center justify-center rounded-sm text-[13px] font-bold transition-colors",
                        available
                          ? "text-valar-navy hover:bg-valar-navy hover:text-white"
                          : "cursor-default text-gray-300",
                      ].join(" ")}
                    >
                      {letter}
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          <p className="mt-2 text-[13px] text-gray-500" aria-live="polite">
            {searching
              ? `${shown.length} of ${activeTitle ? `${countFor(activeCategory as GlossaryCategory)} ${activeTitle}` : entries.length} terms match “${query.trim()}”`
              : activeTitle
                ? `${shown.length} terms under ${activeTitle}`
                : `${entries.length} terms`}
          </p>
        </div>
      </div>

      {/* ── Terms ────────────────────────────────────────────── */}
      <section data-cmp="GlossaryPage.List" className="container mx-auto max-w-6xl px-4 py-14 md:px-6">
        {groups.length === 0 ? (
          <div className="rounded-xl border border-valar-concrete bg-white p-10 text-center">
            <h2 className="mb-2 text-xl font-bold text-valar-navy">No term matches that yet</h2>
            <p className="mx-auto mb-6 max-w-md text-[15px] leading-relaxed text-gray-600">
              Try a shorter word, or just ask. A real answer beats a search box.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-sm bg-valar-navy px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-valar-indigo"
            >
              Ask your question
            </Link>
          </div>
        ) : (
          <div className="space-y-14">
            {groups.map(([letter, items]) => (
              <div key={letter} id={`letter-${letter.toLowerCase()}`} className="scroll-mt-60">
                <h2 className="mb-1 text-3xl font-bold text-valar-navy">{letter}</h2>
                <div className="mb-5 h-[2px] w-6 bg-valar-amber" />

                <div className="border-t border-valar-concrete">
                  {items.map((entry) => (
                    <article
                      key={entry.slug}
                      id={entry.slug}
                      data-cmp="GlossaryPage.Term"
                      className={[
                        "scroll-mt-60 border-b border-valar-concrete py-7 transition-colors duration-700 md:grid md:grid-cols-[15rem_1fr] md:gap-10",
                        highlight === entry.slug ? "bg-valar-amber/10" : "",
                      ].join(" ")}
                    >
                      <div className="mb-3 md:mb-0">
                        <h3 className="text-lg leading-snug font-bold text-valar-navy">
                          <a
                            href={`#${entry.slug}`}
                            onClick={(e) => {
                              e.preventDefault();
                              goTo(entry.slug);
                            }}
                            className="transition-colors hover:text-valar-indigo"
                          >
                            {entry.term}
                          </a>
                        </h3>
                        <p className="mt-1.5 text-[11px] font-bold tracking-widest text-valar-steel uppercase">
                          {entry.categories.map((id) => titles.get(id)).join(" · ")}
                        </p>
                      </div>

                      {/* No measure cap: the term sits beside the text, so the definition fills its column. */}
                      <div>
                        <div className="space-y-3 text-base leading-relaxed text-gray-600">
                          {entry.body.map((paragraph, i) => (
                            <p key={i}>
                              <Rich text={paragraph} />
                            </p>
                          ))}
                        </div>
                        <p className="mt-4 text-sm text-gray-500">
                          <span className="font-semibold text-valar-navy">See also: </span>
                          {entry.related.map((related, i) => (
                            <span key={related.slug}>
                              {i > 0 && (
                                <span aria-hidden="true" className="mx-1.5 text-gray-300">
                                  ·
                                </span>
                              )}
                              <a
                                href={`#${related.slug}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  goTo(related.slug);
                                }}
                                className="font-medium text-valar-horizon underline-offset-4 transition-colors hover:text-valar-navy hover:underline"
                              >
                                {related.term}
                              </a>
                            </span>
                          ))}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <aside
          data-cmp="GlossaryPage.Disclaimer"
          className="mt-12 border-t border-valar-concrete pt-5 text-[13px] leading-[1.65] text-valar-steel"
        >
          <span className="font-semibold text-valar-navy">General information.</span> These definitions do
          not take your personal circumstances into account and are not personalised financial or tax
          advice. Lender policies and government rules differ and change. For advice on your own
          situation,{" "}
          <Link href="/book" className="text-valar-horizon underline underline-offset-2">
            book a strategy call
          </Link>{" "}
          or speak to a licensed financial adviser.
        </aside>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section data-cmp="GlossaryPage.Cta" className="bg-white px-4 pb-20 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center gap-8 rounded-xl bg-valar-navy p-8 md:p-10">
            <div className="min-w-[260px] flex-1">
              <h2 className="mb-2 text-2xl font-bold text-white">Still not sure?</h2>
              <p className="text-[15px] leading-relaxed text-valar-lilac">
                A definition tells you what a word means. A conversation tells you what it means for you.
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
