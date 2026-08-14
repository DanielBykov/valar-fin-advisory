import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TAG_LABELS, type Article } from "@/lib/insights";

export default function ArticleCard({ article, tone = "light" }: { article: Article; tone?: "light" | "fog" }) {
  return (
    <article
      data-cmp="ArticleCard"
      className={[
        "group flex flex-col rounded-xl border p-7 transition-shadow hover:shadow-md",
        tone === "fog" ? "border-gray-100 bg-valar-fog" : "border-gray-100 bg-white shadow-sm",
      ].join(" ")}
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-valar-amber">
          {TAG_LABELS[article.tag]}
        </span>
        {article.draft && (
          <span className="rounded bg-valar-concrete px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-valar-navy">
            Draft — local only
          </span>
        )}
      </div>

      <h3 className="mb-3 text-xl font-bold leading-snug text-valar-navy transition-colors group-hover:text-valar-indigo">
        {article.title}
      </h3>

      <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-600">{article.excerpt}</p>

      <p className="mb-4 text-xs text-valar-steel">{article.readingMinutes} min read</p>

      <Link
        href={`/insights/${article.slug}`}
        className="mt-auto inline-flex items-center text-sm font-semibold text-valar-navy transition-colors group-hover:text-valar-amber"
      >
        Read <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </article>
  );
}
