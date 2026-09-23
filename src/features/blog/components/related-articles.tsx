import { articles } from "../api/mock-data";
import type { BlogArticle } from "../types/blog.types";
import { ArticleCard } from "./article-card";

export function RelatedArticles({ current }: { current: BlogArticle }) {
  const related = articles
    .filter((a) => a.slug !== current.slug && a.categoryId === current.categoryId)
    .slice(0, 3);

  const list = related.length > 0
    ? related
    : articles.filter((a) => a.slug !== current.slug).slice(0, 3);

  if (list.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground">مقاله‌های مرتبط</h2>
      <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {list.map((a) => (
          <li key={a.slug}>
            <ArticleCard article={a} />
          </li>
        ))}
      </ul>
    </div>
  );
}