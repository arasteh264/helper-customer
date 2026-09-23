import Link from "next/link";
import { Clock3 } from "lucide-react";

import { blogCategories } from "../api/mock-data";
import type { BlogArticle } from "../types/blog.types";
import { formatReadingTime } from "../utils/format-reading-time";
import { formatDate } from "@/src/utils/format";

export function ArticleCard({ article, featured = false }: { article: BlogArticle; featured?: boolean }) {
  const category = blogCategories.find((c) => c.id === article.categoryId);

  return (
    <Link
      href={`/blog/${article.slug}`}
      className={[
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-foreground/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        featured ? "sm:flex-row" : "",
      ].join(" ")}
    >
      <div
        className={`relative shrink-0 bg-gradient-to-br ${article.coverTint} ${
          featured ? "h-48 sm:h-auto sm:w-2/5" : "h-36"
        }`}
      >
        {category && (
          <span className="absolute start-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur">
            {category.label}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3
          className={`font-semibold leading-7 text-foreground transition-colors group-hover:text-primary ${
            featured ? "text-lg sm:text-xl" : "text-sm sm:text-base"
          }`}
        >
          {article.title}
        </h3>
        <p className="mt-2 flex-1 text-xs leading-6 text-foreground/55 sm:text-sm">
          {article.excerpt}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-foreground/5 pt-3 text-[11px] text-foreground/45">
          <span>{formatDate(article.publishedAt)}</span>
          <span className="flex items-center gap-1">
            <Clock3 size={12} />
            {formatReadingTime(article.readingMinutes)}
          </span>
        </div>
      </div>
    </Link>
  );
}