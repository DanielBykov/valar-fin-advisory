import Image from "next/image";
import Link from "next/link";
import { TAG_LABELS, type Article } from "@/lib/insights";

export default function ArticleCard({ article, tone = "light" }: { article: Article; tone?: "light" | "fog" }) {
  return (
    <article
      data-cmp="ArticleCard"
      className={[
        // `relative` anchors the stretched link on the title, which makes the
        // whole card clickable without nesting interactive elements.
        "group relative flex flex-col overflow-hidden rounded-xl border transition-shadow hover:shadow-md",
        tone === "fog" ? "border-gray-100 bg-valar-fog" : "border-gray-100 bg-white shadow-sm",
      ].join(" ")}
    >
      {article.image && (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-valar-concrete">
          <Image
            src={article.image.src}
            alt={article.image.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 380px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] font-bold tracking-[0.12em] uppercase">
          <span className="text-valar-amber">{TAG_LABELS[article.tag]}</span>
          <span aria-hidden="true" className="text-valar-steel">
            ·
          </span>
          <span className="text-valar-steel">{article.readingMinutes} min read</span>
        </div>

        <h3 className="text-lg leading-snug font-bold text-valar-navy transition-colors group-hover:text-valar-indigo">
          <Link
            href={`/insights/articles/${article.slug}`}
            className="before:absolute before:inset-0 before:content-[''] focus-visible:ring-2 focus-visible:ring-valar-amber focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {article.title}
          </Link>
        </h3>

        <p className="line-clamp-2 text-sm leading-relaxed text-gray-600">{article.excerpt}</p>
      </div>
    </article>
  );
}
