import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ArticleCard from "@/components/insights/article-card";
import {
  INSIGHTS_LIVE,
  TAG_LABELS,
  formatDate,
  getArticle,
  relatedArticles,
  visibleArticles,
} from "@/lib/insights";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return visibleArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Article not found | Valar" };

  return {
    title: `${article.title} | Valar`,
    description: article.excerpt,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      images: ["/opengraph.jpg"],
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

  return (
    <div data-cmp="ArticlePage" className="flex min-h-screen w-full flex-col bg-white">
      {/* Header */}
      <header data-cmp="ArticlePage.Header" className="border-b border-gray-100 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl pt-8">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-sm text-valar-steel transition-colors hover:text-valar-navy"
          >
            <ArrowLeft className="h-4 w-4" />
            Insights
          </Link>
        </div>

        <div className="container mx-auto max-w-6xl pt-6 pb-9">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.13em] text-valar-amber">
              {TAG_LABELS[article.tag]}
            </span>
            {article.draft && (
              <span className="rounded bg-valar-concrete px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-valar-navy">
                Draft — visible locally only
              </span>
            )}
          </div>

          <h1 className="mb-5 max-w-[22ch] text-3xl font-bold leading-tight text-valar-navy md:text-5xl">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-valar-steel">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-valar-indigo text-[17px] font-medium text-white"
            >
              LB
            </span>
            <span className="leading-tight">
              <span className="block font-semibold text-valar-navy">Lena Bykova</span>
              Financial Adviser, Valar
            </span>
            <span aria-hidden="true">·</span>
            <time dateTime={article.published}>{formatDate(article.published)}</time>
            <span aria-hidden="true">·</span>
            <span>{article.readingMinutes} min read</span>
          </div>
        </div>
      </header>

      {/* Body */}
      <article data-cmp="ArticlePage.Body" className="mx-auto w-full max-w-[680px] px-4 pt-11 md:px-6">
        {article.body.map((block, i) => {
          if (block.type === "lede")
            return (
              <p key={i} className="mb-5 text-lg leading-[1.65] text-valar-navy md:text-xl">
                {block.text}
              </p>
            );
          if (block.type === "h2")
            return (
              <h2 key={i} className="mt-9 mb-3.5 text-2xl font-bold text-valar-navy">
                {block.text}
              </h2>
            );
          if (block.type === "list")
            return (
              <ul key={i} className="mb-5 flex list-disc flex-col gap-2 pl-5 text-[17px] text-gray-700">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          return (
            <p key={i} className="mb-5 text-[17px] leading-[1.75] text-gray-700">
              {block.text}
            </p>
          );
        })}

        {article.takeaways.length > 0 && (
          <aside
            data-cmp="ArticlePage.Takeaways"
            className="my-9 rounded-r-xl border-l-[3px] border-valar-amber bg-valar-fog p-7"
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
