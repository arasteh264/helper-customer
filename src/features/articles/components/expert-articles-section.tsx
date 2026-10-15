import Link from "next/link";
import { ArrowLeft, Clock3, Star } from "lucide-react";

import type { ProviderArticle } from "../types/provider-article.types";
import { formatDate } from "@/src/utils/format";

export function ExpertArticlesSection({
  articles,
  error = false,
}: {
  articles: ProviderArticle[];
  error?: boolean;
}) {
  return (
    <section className="mt-14 border-t border-foreground/10 pt-10">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-primary">تجربه و دانش متخصصان</p>
          <h2 className="mt-1 text-2xl font-bold">مقاله‌های علمی متخصصان</h2>
          <p className="mt-2 text-sm leading-6 text-foreground/60">
            محتوای آموزشی پس از بررسی تیم هلپا24 منتشر می‌شود.
          </p>
        </div>
      </div>
      {!articles.length ? (
        <p className="mt-6 rounded-xl border border-dashed border-foreground/15 p-6 text-center text-sm text-foreground/55">
          {error
            ? "دریافت مقاله‌های متخصصان در حال حاضر ممکن نشد."
            : "مقاله‌ی تأییدشده‌ای برای نمایش وجود ندارد."}
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <article key={article.id} className="overflow-hidden rounded-2xl border border-foreground/10 bg-card">
              <Link
                href={`/knowledge/${article.slug}`}
                aria-label={`خواندن مقاله: ${article.title}`}
                className="block h-40 bg-secondary/70"
                style={article.coverImage ? {
                  backgroundImage: `url("${article.coverImage.replaceAll('"', "%22")}")`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                } : undefined}
              />
              <div className="p-4">
                <p className="text-xs text-primary">{article.categories?.map((item) => item.name).join("، ") || "دانستنی تخصصی"}</p>
                <h3 className="mt-2 line-clamp-2 font-semibold leading-7">
                  <Link href={`/knowledge/${article.slug}`} className="hover:text-primary">{article.title}</Link>
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-foreground/60">{article.excerpt}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-foreground/5 pt-3 text-xs text-foreground/50">
                  <span>{article.authorName} · {article.publishedAt ? formatDate(article.publishedAt) : ""}</span>
                  <span className="inline-flex items-center gap-1">
                    <Star size={13} className="text-amber-500" />
                    {article.ratingSummary?.average
                      ? `${article.ratingSummary.average.toFixed(1)} (${article.ratingSummary.count})`
                      : "بدون امتیاز"}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock3 size={13} /> {article.readingMinutes} دقیقه
                  </span>
                  <Link href={`/knowledge/${article.slug}`} className="inline-flex items-center gap-1 font-medium text-primary">
                    خواندن <ArrowLeft size={13} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
