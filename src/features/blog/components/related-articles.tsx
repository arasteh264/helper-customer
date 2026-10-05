import type { BlogArticleSummary } from "../types/blog.types";
import { ArticleCard } from "./article-card";

export function RelatedArticles({
  articles,
}: {
  articles: BlogArticleSummary[];
}) {
  if (articles.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground">
        مقاله‌های مرتبط
      </h2>
      <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {articles.map((article) => (
          <li key={article.id}>
            <ArticleCard article={article} />
          </li>
        ))}
      </ul>
    </div>
  );
}
