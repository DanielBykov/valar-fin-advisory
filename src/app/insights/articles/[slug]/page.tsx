import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ArticleCard from "@/components/insights/article-card";
import { JsonLd } from "@/components/json-ld";
import {
  INSIGHTS_LIVE,
  TAG_LABELS,
  formatDate,
  getArticle,
  relatedArticles,
  visibleArticles,
} from "@/lib/insights";
import {
  SITE_URL,
  getArticleSchema,
  getBreadcrumbSchema,
  getPersonSchema,
} from "@/lib/schema";

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
      images: [article.image?.src ?? "/opengraph.jpg"],
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
        <div className="mx-auto w-full max-w-[720px] pt-8">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-sm text-valar-steel transition-colors hover:text-valar-navy"
          >
            <ArrowLeft className="h-4 w-4" />
            Insights
          </Link>
        </div>

        <div className="mx-auto w-full max-w-[720px] pt-6 pb-9">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.13em] text-valar-amber">
              {TAG_LABELS[article.tag]}
            </span>
          </div>

          <h1 className="mb-5 max-w-[22ch] text-3xl font-bold leading-tight text-valar-navy md:text-5xl">
            {article.title}
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
      <article data-cmp="ArticlePage.Body" className="mx-auto w-full max-w-[720px] px-4 pt-10 md:px-6">
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
                {block.text}
              </p>
            );
          if (block.type === "h2")
            return (
              <h2
                key={i}
                className="mt-11 mb-4 border-t border-valar-concrete pt-8 text-2xl font-bold text-balance text-valar-navy"
              >
                {block.text}
              </h2>
            );
          if (block.type === "list")
            return (
              <ul key={i} className="mb-6 flex list-disc flex-col gap-3 pl-5 text-[18px] leading-[1.7] text-gray-700">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          if (block.type === "deflist")
            return (
              <dl key={i} data-cmp="ArticlePage.Deflist" className="my-7 rounded-xl bg-valar-fog px-7 py-3">
                {block.items.map((item) => (
                  <div
                    key={item.term}
                    className="border-b border-valar-concrete py-5 last:border-b-0"
                  >
                    <dt className="mb-1 font-bold text-valar-navy">{item.term}</dt>
                    <dd className="m-0 text-[16px] leading-[1.65] text-gray-700">{item.text}</dd>
                  </div>
                ))}
              </dl>
            );
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
                            {item.direction === "down" ? "▼" : item.direction === "flat" ? "→" : "▲"}
                          </span>{" "}
                          {item.delta}
                        </p>
                      )}
                      {item.note && (
                        <p className="mt-1.5 text-[12px] leading-[1.5] text-valar-steel">{item.note}</p>
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
                          <li key={p} className="flex gap-2.5 text-[15px] leading-[1.6] text-gray-700">
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
                          <li key={c} className="flex gap-2.5 text-[15px] leading-[1.6] text-gray-700">
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
                <p className="text-[16px] leading-[1.7] text-valar-navy">{block.text}</p>
              </aside>
            );
          if (block.type === "pull")
            return (
              <p
                key={i}
                data-cmp="ArticlePage.Pull"
                className="my-9 border-t border-valar-concrete pt-8 text-center text-2xl leading-[1.35] font-medium text-balance text-valar-navy md:text-[1.9rem]"
              >
                {block.text}
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
                <p className="text-[16px] leading-[1.7] text-gray-700">{block.text}</p>
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
                    <p className="text-[15px] leading-[1.65] text-gray-700">{item.text}</p>
                  </div>
                ))}
              </div>
            );
          if (block.type === "p")
            return (
              <p key={i} className="mb-6 text-[18px] leading-[1.75] text-gray-700">
                {block.text}
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

        <div
          data-cmp="ArticlePage.Cta"
          className="mb-4 rounded-xl bg-valar-navy p-8 text-center text-valar-lilac"
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
