import Link from "next/link";
import { ArrowLeft, Clock3 } from "lucide-react";

import type { BlogArticleSummary } from "../types/blog.types";
import { formatReadingTime } from "../utils/format-reading-time";
import { formatDate } from "@/src/utils/format";

export function ArticleCard({
  article,
  featured = false,
}: {
  article: BlogArticleSummary;
  featured?: boolean;
}) {
  return (
    <article
      className={[
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-foreground/[0.06]",
        featured ? "sm:flex-row" : "",
      ].join(" ")}
    >
      <Link
        href={`/blog/${article.slug}`}
        aria-label={`خواندن مقاله: ${article.title}`}
        className={`relative block shrink-0 bg-gradient-to-br ${article.coverTint} ${
          featured ? "h-48 sm:h-auto sm:w-2/5" : "h-36"
        }`}
        style={
          article.coverImage
            ? {
                backgroundImage: `linear-gradient(135deg, rgba(20,45,35,.12), rgba(20,45,35,.04)), url("${article.coverImage.replaceAll('"', "%22")}")`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }
            : undefined
        }
      >
        <span className="absolute start-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur">
          {article.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h2
          className={`font-semibold leading-7 text-foreground transition-colors group-hover:text-primary ${
            featured ? "text-lg sm:text-xl" : "text-sm sm:text-base"
          }`}
        >
          <Link href={`/blog/${article.slug}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            {article.title}
          </Link>
        </h2>
        <p className="mt-2 flex-1 text-xs leading-6 text-foreground/55 sm:text-sm">
          {article.excerpt}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-foreground/5 pt-3 text-[11px] text-foreground/45">
          <span>
            {article.publishedAt ? formatDate(article.publishedAt) : "پیش‌نویس"}
          </span>
          <span className="flex items-center gap-1">
            <Clock3 size={12} />
            {formatReadingTime(article.readingMinutes)}
          </span>
          <span className="inline-flex items-center gap-1 font-medium text-primary">
            خواندن
            <ArrowLeft size={13} aria-hidden="true" />
          </span>
        </div>
      </div>
    </article>
  );
}
