import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";

import { articles, blogCategories } from "@/src/features/blog/api/mock-data";
import { ArticleContent } from "@/src/features/blog/components/article-content";
import { AuthorBox } from "@/src/features/blog/components/author-box";
import { RelatedArticles } from "@/src/features/blog/components/related-articles";
import { formatReadingTime } from "@/src/features/blog/utils/format-reading-time";
import { Container } from "@/src/components/shared/container";
import { formatDate } from "@/src/utils/format";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) return { title: "مقاله یافت نشد" };
  return { title: `${article.title} | وبلاگ هلپر`, description: article.excerpt };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) notFound();

  const category = blogCategories.find((c) => c.id === article.categoryId);

  return (
    <article className="py-10 sm:py-14">
      <Container className="max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-foreground/60 transition-colors hover:text-primary"
        >
          <ArrowRight size={15} />
          بازگشت به وبلاگ
        </Link>

        <div className="mt-5">
          {category && (
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {category.label}
            </span>
          )}
          <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
            {article.title}
          </h1>
          <div className="mt-4 flex items-center gap-4 text-xs text-foreground/50">
            <span>{formatDate(article.publishedAt)}</span>
            <span className="flex items-center gap-1">
              <Clock3 size={13} />
              {formatReadingTime(article.readingMinutes)}
            </span>
          </div>
        </div>

        <div
          className={`mt-6 h-48 rounded-2xl bg-gradient-to-br sm:h-64 ${article.coverTint}`}
          aria-hidden
        />

        <div className="mt-8">
          <ArticleContent blocks={article.content} />
        </div>

        <div className="mt-10">
          <AuthorBox author={article.author} publishedLabel={formatDate(article.publishedAt)} />
        </div>

        <div className="mt-12 border-t border-foreground/10 pt-10">
          <RelatedArticles current={article} />
        </div>
      </Container>
    </article>
  );
}