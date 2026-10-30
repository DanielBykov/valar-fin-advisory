import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ArticleCard from "@/components/insights/article-card";
import { JsonLd } from "@/components/json-ld";
import { glossaryEntries, glossarySlug } from "@/lib/glossary";
import {
  GLOSSARY_LIVE,
  INSIGHTS_LIVE,
  TAG_LABELS,
  formatDate,
  getArticle,
  relatedArticles,
  visibleArticles,
} from "@/lib/insights";
import { SITE_URL, getArticleSchema, getBreadcrumbSchema, getPersonSchema } from "@/lib/schema";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return visibleArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Article not found | Valar" };

  const path = `/insights/articles/${article.slug}`;

  return {
    title: `${article.title} | Valar`,
    description: article.excerpt,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title: article.title,
      description: article.excerpt,
      // The article's own image when it has one, so a shared link previews the
      // article rather than the generic site card.
      locale: "en_NZ",
      images: [
        article.image
          ? { url: article.image.src, alt: article.image.alt }
          : { url: "/opengraph.jpg" },
      ],
      publishedTime: article.published,
    },
  };
}

export default async function Page({ params }: Props) {
  if (!INSIGHTS_LIVE && process.env.NODE_ENV !== "development") notFound();

  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = relatedArticles(slug);

  // A wide article runs its whole column at the width the breakout blocks
  // (roadmap, cards) otherwise reach on their own, so headings, text and cards
  // share one edge. 1008px = the 720px column plus the 144px breakout each side.
  const column = article.wide ? "max-w-[1008px]" : "max-w-[720px]";
  const breakout = article.wide ? "" : "xl:-mx-36";

  // Step headings take their number and phase from the roadmap, so the map and
  // the sections can't disagree. Articles without a roadmap get an empty map.
  const steps = new Map<
    string,
    { n: number; phaseNumber: number; phaseTitle: string; phaseNote?: string; opensPhase: boolean }
  >();
  for (const block of article.body) {
    if (block.type !== "roadmap") continue;
    block.phases.forEach((phase, p) =>
      phase.steps.forEach((s, k) =>
        steps.set(s.id, {
          n: s.n,
          phaseNumber: p + 1,
          phaseTitle: phase.title,
          phaseNote: phase.note,
          opensPhase: k === 0,
        }),
      ),
    );
  }

  // Person is emitted here as well as on /about: the Article's author @id
  // only resolves if the Person node is on the same page. Organization
  // comes from the root layout.
  const structuredData = [
    getPersonSchema(),
    getBreadcrumbSchema([
      { name: "Home", url: `${SITE_URL}/` },
      { name: "Insights", url: `${SITE_URL}/insights` },
      { name: article.title, url: `${SITE_URL}/insights/articles/${article.slug}` },
    ]),
    getArticleSchema({
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      published: article.published,
      image: article.image?.src,
      section: TAG_LABELS[article.tag],
      topics: article.topics,
    }),
  ];

  return (
    <div data-cmp="ArticlePage" className="flex min-h-screen w-full flex-col bg-white">
      <JsonLd data={structuredData} />
      {/* Header */}
      <header data-cmp="ArticlePage.Header" className="border-b border-gray-100 px-4 md:px-6">
        <div className={`mx-auto w-full ${column} pt-8`}>
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-sm text-valar-steel transition-colors hover:text-valar-navy"
          >
            <ArrowLeft className="h-4 w-4" />
            Insights
          </Link>
        </div>

        <div className={`mx-auto w-full ${column} pt-6 pb-9`}>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.13em] text-valar-amber">
              {TAG_LABELS[article.tag]}
            </span>
          </div>

          <h1
            className={`mb-5 text-3xl font-bold leading-tight text-valar-navy md:text-5xl ${article.titleBreak ? "" : "max-w-[22ch]"}`}
          >
            {article.titleBreak && article.title.includes(": ") ? (
              <>
                {article.title.slice(0, article.title.indexOf(": ") + 1)}
                <br />
                {article.title.slice(article.title.indexOf(": ") + 2)}
              </>
            ) : (
              article.title
            )}
          </h1>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-valar-steel">
            <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-valar-concrete">
              {/* sizes is deliberately much larger than the 56px box: the image is
                  zoomed 2.2x in CSS to crop to the face, so it needs the source
                  resolution to match, not a 56px thumbnail. */}
              <Image
                src="/images/lena-portrait.webp"
                alt="Lena Bykova"
                fill
                sizes="256px"
                quality={90}
                className="scale-[2.2] object-cover"
                style={{ objectPosition: "50% 0%", transformOrigin: "50% 35%" }}
              />
            </span>
            <span className="leading-tight">
              <span className="block font-semibold text-valar-navy">Lena Bykova</span>
              Financial Adviser, Valar
              <span aria-hidden="true"> · </span>
              <time dateTime={article.published}>{formatDate(article.published)}</time>
              <span aria-hidden="true"> · </span>
              {article.readingMinutes} min read
            </span>
          </div>

          {article.topics && article.topics.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {article.topics.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-valar-concrete px-3 py-1 text-[12px] font-medium text-valar-indigo"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Body */}
      <article
        data-cmp="ArticlePage.Body"
        className={`mx-auto w-full ${column} px-4 pt-10 md:px-6`}
      >
        {article.takeaways.length > 0 && (
          <aside
            data-cmp="ArticlePage.Takeaways"
            className="mb-10 rounded-r-xl border-l-[3px] border-valar-amber bg-valar-fog p-7"
          >
            <h2 className="mb-3.5 text-[13px] font-bold uppercase tracking-[0.12em] text-valar-navy">
              Key takeaways
            </h2>
            <ul className="flex list-disc flex-col gap-2.5 pl-5 text-[15px] text-gray-700">
              {article.takeaways.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </aside>
        )}

        {article.body.map((block, i) => {
          if (block.type === "lede")
            return (
              <p key={i} className="mb-6 text-xl leading-[1.6] text-valar-navy md:text-[1.35rem]">
                {withGlossaryLinks(block.text)}
              </p>
            );
          if (block.type === "h2") {
            if (block.band)
              return (
                // The rule above each band closes the previous subject's cards, so
                // a reader can tell which cards belong to which heading.
                <div
                  key={i}
                  className="mt-14 mb-6 scroll-mt-28 border-t-2 border-valar-concrete pt-12"
                  id={block.id}
                >
                  <div
                    data-cmp="ArticlePage.HeadingBand"
                    className="rounded-r-xl border-l-[6px] border-valar-navy bg-valar-fog px-6 py-5"
                    // Inline because party colours are content, not design tokens:
                    // they belong to the article's subjects, not to Valar.
                    style={block.band.color ? { borderLeftColor: block.band.color } : undefined}
                  >
                    <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-valar-steel">
                      {block.band.label}
                    </p>
                    <h2 className="flex items-center gap-3 text-2xl font-bold text-balance text-valar-navy md:text-[1.75rem]">
                      {block.band.color && (
                        <span
                          aria-hidden="true"
                          // The ring keeps a pale colour (yellow, teal) visible on fog.
                          className="h-4 w-4 shrink-0 rounded-full ring-1 ring-black/15"
                          style={{ backgroundColor: block.band.color }}
                        />
                      )}
                      {block.text}
                    </h2>
                    {block.band.note && (
                      <p className="mt-1 text-[15px] leading-[1.6] text-gray-700">
                        {block.band.note}
                      </p>
                    )}
                  </div>
                </div>
              );
            const step = block.id ? steps.get(block.id) : undefined;
            if (!step)
              return (
                <h2
                  key={i}
                  id={block.id}
                  // The navbar is fixed, so a jump from the roadmap would otherwise
                  // land with the heading hidden behind it.
                  className="mt-11 mb-4 scroll-mt-28 border-t border-valar-concrete pt-8 text-2xl font-bold text-balance text-valar-navy"
                >
                  {withGlossaryLinks(block.text)}
                </h2>
              );
            // A heading that is a roadmap step repeats the map's number and phase,
            // so a reader dropped mid-article by a link still knows where they are.
            // The first step of each phase also opens that phase with a band:
            // ten identical sections read as one long wall, four chapters don't.
            return (
              <div key={i} data-cmp="ArticlePage.Step">
                {step.opensPhase && (
                  <div
                    data-cmp="ArticlePage.PhaseBand"
                    className="mt-14 rounded-xl bg-valar-navy px-6 py-5 text-valar-lilac"
                  >
                    <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-valar-amber">
                      Phase {step.phaseNumber}
                    </p>
                    <p className="text-2xl font-bold text-white">{step.phaseTitle}</p>
                    {step.phaseNote && <p className="mt-0.5 text-[14px]">{step.phaseNote}</p>}
                  </div>
                )}
                <h2
                  id={block.id}
                  className={`mb-4 scroll-mt-28 ${
                    step.opensPhase ? "mt-9" : "mt-11 border-t border-valar-concrete pt-8"
                  }`}
                >
                  {/* Under a phase band the label would just repeat it. */}
                  {!step.opensPhase && (
                    <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.13em] text-valar-steel">
                      Phase {step.phaseNumber} · {step.phaseTitle}
                    </span>
                  )}
                  <span className="flex items-center gap-3 text-2xl font-bold text-balance text-valar-navy md:text-[1.75rem]">
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-valar-navy text-[17px] font-bold tabular-nums text-white"
                    >
                      {step.n}
                    </span>
                    {/* The number is in the badge; screen readers still get it. */}
                    <span>
                      <span className="sr-only">{step.n}. </span>
                      {block.text.replace(/^\d+\.\s*/, "")}
                    </span>
                  </span>
                </h2>
              </div>
            );
          }
          if (block.type === "bottomline")
            return (
              <p
                key={i}
                data-cmp="ArticlePage.Bottomline"
                // The slide's own line: what a skimming reader should take from the
                // section, so it is the loudest thing in it.
                className="my-8 rounded-r-xl border-l-4 border-valar-amber bg-valar-fog px-6 py-5 text-[20px] leading-[1.4] font-semibold text-balance text-valar-navy md:text-[22px]"
              >
                {withGlossaryLinks(block.text)}
              </p>
            );
          if (block.type === "roadmap")
            return (
              <nav
                key={i}
                data-cmp="ArticlePage.Roadmap"
                aria-label={block.caption ?? "Steps in this guide"}
                // Breaks out of the 720px text column on wide screens: four phases
                // inside it leave ~170px each and wrap the step titles word by word.
                className={`my-10 ${breakout}`}
              >
                {block.caption && (
                  <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.13em] text-valar-indigo">
                    {block.caption}
                  </p>
                )}
                {/* Four phases in a row on a wide screen, two by two below that,
                    stacked on a phone: the order reads the same in every layout. */}
                <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {block.phases.map((phase, p) => (
                    <li
                      key={phase.title}
                      className="rounded-xl border border-valar-concrete border-t-[3px] border-t-valar-amber bg-valar-fog p-4"
                    >
                      <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-valar-steel">
                        Phase {p + 1}
                      </p>
                      <p className="text-[17px] font-bold text-valar-navy">{phase.title}</p>
                      {phase.note && (
                        <p className="mt-1 text-[13px] leading-[1.5] text-valar-steel">
                          {phase.note}
                        </p>
                      )}
                      <ol className="mt-3 flex flex-col gap-2">
                        {phase.steps.map((step) => (
                          <li key={step.id}>
                            <a
                              href={`#${step.id}`}
                              className="flex items-center gap-2 rounded-lg border border-valar-concrete bg-white px-2.5 py-2.5 text-[14px] leading-snug font-semibold whitespace-nowrap text-valar-navy transition-colors hover:border-valar-navy"
                            >
                              <span
                                aria-hidden="true"
                                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-valar-navy text-[12px] font-bold tabular-nums text-white"
                              >
                                {step.n}
                              </span>
                              <span>
                                {step.title}
                                {step.note && (
                                  <span className="mt-0.5 block text-[12px] font-normal text-valar-steel">
                                    {step.note}
                                  </span>
                                )}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ol>
                    </li>
                  ))}
                </ol>
              </nav>
            );
          if (block.type === "list")
            return (
              <ul
                key={i}
                className="mb-6 flex list-disc flex-col gap-3 pl-5 text-[18px] leading-[1.7] text-gray-700"
              >
                {block.items.map((item) => (
                  <li key={item}>{withGlossaryLinks(item)}</li>
                ))}
              </ul>
            );
          if (block.type === "deflist")
            return (
              <dl
                key={i}
                data-cmp="ArticlePage.Deflist"
                className={`rounded-xl bg-valar-fog ${block.compact ? "my-6 px-5 py-1" : "my-7 px-7 py-3"}`}
              >
                {block.items.map((item) => (
                  <div
                    key={item.term}
                    className={`border-b border-valar-concrete last:border-b-0 ${block.compact ? "py-3" : "py-5"}`}
                  >
                    <dt
                      className={`font-bold text-valar-navy ${block.compact ? "mb-0.5 text-[15px]" : "mb-1"}`}
                    >
                      {item.term}
                    </dt>
                    <dd
                      className={`m-0 text-gray-700 ${block.compact ? "text-[15px] leading-[1.6]" : "text-[16px] leading-[1.65]"}`}
                    >
                      {withGlossaryLinks(item.text)}
                    </dd>
                  </div>
                ))}
              </dl>
            );
          if (block.type === "cta") return <StrategyCallCta key={i} className="my-10" />;
          if (block.type === "stats")
            return (
              <figure key={i} data-cmp="ArticlePage.Stats" className="my-8">
                {block.caption && (
                  <figcaption className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.13em] text-valar-indigo">
                    {block.caption}
                  </figcaption>
                )}
                <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {block.items.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-valar-concrete bg-valar-fog px-4 py-4"
                    >
                      {/* Two lines reserved so the big numbers align across the row
                          even when one label wraps and its neighbours don't. */}
                      <dt className="min-h-[2.6em] text-[11px] font-bold uppercase leading-[1.3] tracking-[0.1em] text-valar-steel">
                        {item.label}
                      </dt>
                      <dd className="mt-2 text-[28px] font-bold leading-none tabular-nums text-valar-navy">
                        {item.value}
                      </dd>
                      {item.delta && (
                        <p className="mt-1.5 text-[13px] font-semibold tabular-nums text-valar-amber">
                          <span aria-hidden="true">
                            {item.direction === "down"
                              ? "▼"
                              : item.direction === "flat"
                                ? "→"
                                : "▲"}
                          </span>{" "}
                          {item.delta}
                        </p>
                      )}
                      {item.note && (
                        <p className="mt-1.5 text-[12px] leading-[1.5] text-valar-steel">
                          {item.note}
                        </p>
                      )}
                    </div>
                  ))}
                </dl>
              </figure>
            );
          if (block.type === "table")
            return (
              <figure key={i} data-cmp="ArticlePage.Table" className="my-8">
                {block.caption && (
                  <figcaption className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.13em] text-valar-indigo">
                    {block.caption}
                  </figcaption>
                )}
                {/* Scrolls rather than squashing: a squashed number column is unreadable. */}
                <div className="overflow-x-auto rounded-xl border border-valar-concrete">
                  <table className="w-full min-w-[26rem] border-collapse text-[15px]">
                    <thead>
                      <tr className="bg-valar-fog">
                        {block.headers.map((h, c) => (
                          <th
                            key={h}
                            scope="col"
                            className={`border-b border-valar-concrete px-4 py-3 font-bold text-valar-navy ${
                              c === 0 ? "text-left" : "text-right"
                            }`}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row, r) => (
                        <tr key={r} className="border-b border-valar-concrete last:border-b-0">
                          {row.map((cell, c) => (
                            <td
                              key={c}
                              className={`px-4 py-3 leading-[1.5] ${
                                c === 0
                                  ? "text-left font-medium text-valar-navy"
                                  : "text-right tabular-nums text-gray-700"
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {block.note && (
                  <p className="mt-2.5 text-[13px] leading-[1.6] text-valar-steel">{block.note}</p>
                )}
              </figure>
            );
          if (block.type === "objection")
            return (
              <section
                key={i}
                data-cmp="ArticlePage.Objection"
                className="my-6 rounded-xl border border-valar-concrete border-l-[3px] border-l-valar-amber bg-white p-6"
              >
                <p className="mb-5 text-[19px] leading-[1.4] font-semibold text-balance text-valar-navy md:text-[21px]">
                  “{block.quote}”
                </p>

                <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.13em] text-valar-steel">
                  What&rsquo;s true
                </p>
                <p className="mb-4 text-[16px] leading-[1.7] text-gray-700">{block.fair}</p>

                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.13em] text-valar-steel">
                  What it misses
                </p>
                <ul className="flex flex-col gap-2.5">
                  {block.points.map((pt) => (
                    <li key={pt} className="flex gap-3 text-[16px] leading-[1.65] text-gray-700">
                      <span
                        aria-hidden="true"
                        className="mt-[0.6em] h-[5px] w-[5px] shrink-0 rounded-full bg-valar-amber"
                      />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>

                {block.bottom && (
                  <p className="mt-4 border-t border-valar-concrete pt-4 text-[16px] leading-[1.6] font-semibold text-valar-navy">
                    {block.bottom}
                  </p>
                )}
              </section>
            );
          if (block.type === "proscons")
            return (
              <figure key={i} data-cmp="ArticlePage.ProsCons" className="my-8">
                {block.caption && (
                  <figcaption className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.13em] text-valar-indigo">
                    {block.caption}
                  </figcaption>
                )}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {block.columns.map((col) => (
                    <div
                      key={col.title}
                      className="rounded-xl border border-valar-concrete bg-valar-fog p-6"
                    >
                      <h3 className="mb-4 text-[17px] font-bold text-valar-navy">{col.title}</h3>

                      {/* Plus and minus rather than green and red: both columns are
                          legitimate choices, so colour would be taking a side. */}
                      <ul className="mb-4 flex flex-col gap-2.5">
                        {col.pros.map((p) => (
                          <li
                            key={p}
                            className="flex gap-2.5 text-[15px] leading-[1.6] text-gray-700"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-[0.15em] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-valar-navy text-[12px] font-bold leading-none text-white"
                            >
                              +
                            </span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>

                      <ul className="flex flex-col gap-2.5 border-t border-valar-concrete pt-4">
                        {col.cons.map((c) => (
                          <li
                            key={c}
                            className="flex gap-2.5 text-[15px] leading-[1.6] text-gray-700"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-[0.15em] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-valar-steel text-[12px] font-bold leading-none text-white"
                            >
                              −
                            </span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </figure>
            );
          if (block.type === "cards")
            return (
              <figure
                key={i}
                data-cmp="ArticlePage.Cards"
                // Breaks out of the text column on wide screens, like the roadmap:
                // three cards inside 720px leave each one too narrow for its bullets.
                className={`my-8 ${breakout}`}
              >
                {block.caption && (
                  <figcaption className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.13em] text-valar-indigo">
                    {block.caption}
                  </figcaption>
                )}
                <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {block.items.map((card, c) => (
                    <li
                      key={card.title}
                      className="rounded-xl border border-valar-concrete border-t-[3px] border-t-valar-amber bg-valar-fog p-5"
                    >
                      {/* Zero-padded so the numbers line up as category codes: a
                          reader skimming for "03" finds the same card in every grid. */}
                      <p className="text-[11px] font-bold uppercase tracking-[0.13em] tabular-nums text-valar-steel">
                        {String(c + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mb-3 text-[17px] font-bold text-valar-navy">{card.title}</h3>
                      <ul className="flex flex-col gap-2">
                        {card.points.map((pt) => (
                          <li
                            key={pt}
                            className="flex gap-2.5 text-[15px] leading-[1.55] text-gray-700"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-[0.6em] h-[5px] w-[5px] shrink-0 rounded-full bg-valar-amber"
                            />
                            <span>{withGlossaryLinks(pt)}</span>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
                {block.source && (
                  <p className="mt-2.5 text-[13px] leading-[1.6] text-valar-steel">
                    {block.source}
                  </p>
                )}
              </figure>
            );
          if (block.type === "figure")
            return (
              <figure key={i} data-cmp="ArticlePage.Figure" className="my-10">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
                  <Image
                    src={block.src}
                    alt={block.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 720px"
                    className="object-cover"
                  />
                </div>
                {block.caption && (
                  <figcaption className="mt-3 text-[13px] leading-[1.6] text-valar-steel">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          if (block.type === "callout")
            return (
              <aside
                key={i}
                data-cmp="ArticlePage.Callout"
                className="my-7 rounded-r-xl border-l-[3px] border-valar-amber bg-valar-concrete p-6"
              >
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-valar-navy">
                  {block.label}
                </p>
                <p className="text-[16px] leading-[1.7] text-valar-navy">
                  {withGlossaryLinks(block.text)}
                </p>
              </aside>
            );
          if (block.type === "pull")
            return (
              <p
                key={i}
                data-cmp="ArticlePage.Pull"
                className="my-9 border-t border-valar-concrete pt-8 text-center text-2xl leading-[1.35] font-medium text-balance text-valar-navy md:text-[1.9rem]"
              >
                {withGlossaryLinks(block.text)}
              </p>
            );
          if (block.type === "case")
            return (
              <aside
                key={i}
                data-cmp="ArticlePage.Case"
                className="mb-5 rounded-xl border border-valar-concrete border-t-[3px] border-t-valar-steel bg-white p-6"
              >
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.13em] text-valar-indigo">
                  {block.label}
                </p>
                <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.13em] text-valar-steel">
                  The real question
                </p>
                <p className="mb-4 text-[19px] leading-[1.4] font-semibold text-balance text-valar-navy">
                  {block.question}
                </p>
                <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.13em] text-valar-steel">
                  What it turns on
                </p>
                <p className="text-[16px] leading-[1.7] text-gray-700">
                  {withGlossaryLinks(block.text)}
                </p>
              </aside>
            );
          if (block.type === "tracks")
            return (
              <div
                key={i}
                data-cmp="ArticlePage.Tracks"
                className="my-7 grid grid-cols-1 gap-5 md:grid-cols-2"
              >
                {block.items.map((item) => (
                  <div
                    key={item.title}
                    className="border-l-[3px] border-valar-steel bg-valar-fog py-5 pr-5 pl-6"
                  >
                    <h3 className="mb-2 text-[17px] font-bold text-valar-navy">{item.title}</h3>
                    <p className="text-[15px] leading-[1.65] text-gray-700">
                      {withGlossaryLinks(item.text)}
                    </p>
                  </div>
                ))}
              </div>
            );
          if (block.type === "p")
            return (
              <p key={i} className="mb-6 text-[18px] leading-[1.75] text-gray-700">
                {withGlossaryLinks(block.text)}
              </p>
            );
          // A block type with no renderer yet draws nothing rather than
          // breaking the build. It shows up as a visible gap in dev, which is
          // the intended signal to come back and write the renderer.
          return null;
        })}

        {/* Standing disclosure. Lives in the template so every article carries it
            automatically and the wording can never drift between articles. */}
        <aside
          data-cmp="ArticlePage.Disclaimer"
          className="my-9 border-t border-valar-concrete pt-5 text-[13px] leading-[1.65] text-valar-steel"
        >
          <span className="font-semibold text-valar-navy">General information.</span> This article
          does not take your personal circumstances into account and is not personalised financial
          advice. For advice on your own situation,{" "}
          <Link href="/book" className="text-valar-horizon underline underline-offset-2">
            book a strategy call
          </Link>{" "}
          or speak to a licensed financial adviser.
        </aside>

        {!article.body.some((b) => b.type === "cta") && <StrategyCallCta className="mb-4" />}
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section data-cmp="ArticlePage.Related" className="mt-12 bg-valar-fog px-4 py-16 md:px-6">
          <div className="container mx-auto max-w-6xl">
            <h2 className="mb-7 text-3xl font-bold text-valar-navy">Related reading</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

/** One component for both placements, so the wording can't drift between them. */
function StrategyCallCta({ className }: { className: string }) {
  return (
    <div
      data-cmp="ArticlePage.Cta"
      className={`rounded-xl bg-valar-navy p-8 text-center text-valar-lilac ${className}`}
    >
      <h2 className="mb-2 text-2xl font-bold text-white">Want this run on your actual numbers?</h2>
      <p className="mx-auto mb-6 max-w-[34rem] text-[15px]">
        A strategy call is thirty minutes and costs nothing. Bring your income, your deposit and
        your questions.
      </p>
      <Link
        href="/book"
        className="inline-flex items-center rounded-lg bg-valar-amber px-6 py-3.5 text-[15px] font-bold text-valar-navy transition-colors hover:bg-valar-amber-hover"
      >
        Book Strategy Call
      </Link>
    </div>
  );
}

const GLOSSARY_SLUGS = new Set(glossaryEntries().map((e) => e.slug));
const GLOSSARY_LINK = /\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g;

/**
 * Article text marks a glossary term as [[LIM]], or [[LIM|LIM report]] when the
 * words on the page differ from the glossary entry. The link opens the glossary
 * in a new tab, scrolled to the term and lit up, so the reader keeps their place.
 * Mark the first mention only: every repeat underlined makes the page heavy.
 *
 * An unknown term fails the build rather than linking to nowhere. While the
 * glossary is switched off, the words render as plain text.
 *
 * [[words|article:slug]] links to another article instead, in the same tab.
 * It reuses this syntax so an article link gets the same build-time check: a
 * renamed or deleted slug fails loudly rather than leaving a dead link.
 */
function withGlossaryLinks(text: string): ReactNode {
  if (!text.includes("[[")) return text;
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(GLOSSARY_LINK)) {
    const [whole, shown, term = shown] = m;
    if (term.startsWith("article:")) {
      const target = term.slice("article:".length);
      if (!getArticle(target)) throw new Error(`Article link to unknown slug "${target}"`);
      out.push(text.slice(last, m.index));
      out.push(
        <Link
          key={m.index}
          href={`/insights/articles/${target}`}
          className="underline decoration-valar-amber decoration-2 underline-offset-4 transition-colors hover:text-valar-navy"
        >
          {shown}
        </Link>,
      );
      last = m.index + whole.length;
      continue;
    }
    const slug = glossarySlug(term);
    if (!GLOSSARY_SLUGS.has(slug)) throw new Error(`Glossary link to unknown term "${term}"`);
    out.push(text.slice(last, m.index));
    out.push(
      GLOSSARY_LIVE ? (
        <a
          key={m.index}
          href={`/insights/glossary#${slug}`}
          target="_blank"
          rel="noopener"
          className="underline decoration-valar-amber decoration-dotted decoration-2 underline-offset-4 transition-colors hover:decoration-solid"
        >
          {shown}
        </a>
      ) : (
        shown
      ),
    );
    last = m.index + whole.length;
  }
  out.push(text.slice(last));
  return out;
}
