import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock3 } from "lucide-react";

import { Container } from "@/src/components/shared/container";
import { blogServerApi } from "@/src/features/blog/api/blog.server";
import type {
  BlogArticle,
  BlogArticleSummary,
} from "@/src/features/blog/types/blog.types";
import { ArticleContent } from "@/src/features/blog/components/article-content";
import { AuthorBox } from "@/src/features/blog/components/author-box";
import { RelatedArticles } from "@/src/features/blog/components/related-articles";
import { formatReadingTime } from "@/src/features/blog/utils/format-reading-time";
import { formatDate } from "@/src/utils/format";
import { ApiError } from "@/src/lib/api/error";
import { cache } from "react";

type Props = { params: Promise<{ slug: string }> };

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://helper-customer.vercel.app";

export const revalidate = 300;

const getArticle = cache(async (slug: string): Promise<BlogArticle> => {
  try {
    return await blogServerApi.getBySlug(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let article: BlogArticle;
  try {
    article = await getArticle(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return { title: "مقاله پیدا نشد", robots: { index: false, follow: true } };
    }
    throw error;
  }
  const canonical = article.canonicalUrl || `${SITE_URL}/blog/${article.slug}`;
  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.excerpt;
  const image = article.coverImage ? [{ url: article.coverImage, alt: article.coverAlt ?? article.title }] : [];

  return {
    title: `${title} | وبلاگ هلپر`,
    description,
    alternates: { canonical },
    keywords: article.tags,
    openGraph: {
      type: "article",
      locale: "fa_IR",
      url: canonical,
      title,
      description,
      publishedTime: article.publishedAt ?? undefined,
      modifiedTime: article.updatedAt,
      authors: [article.authorName],
      tags: article.tags,
      images: image,
    },
    twitter: {
      card: article.coverImage ? "summary_large_image" : "summary",
      title,
      description,
      images: article.coverImage ? [article.coverImage] : [],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);
  const canonical = article.canonicalUrl || `${SITE_URL}/blog/${article.slug}`;
  let relatedArticles: BlogArticleSummary[] = [];
  try {
    const related = await blogServerApi.list({
      page: 1,
      pageSize: 4,
      category: article.categorySlug,
    });
    relatedArticles = related.items
      .filter((item) => item.slug !== article.slug)
      .slice(0, 3);
  } catch {
    relatedArticles = [];
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.seoDescription || article.excerpt,
    image: article.coverImage ? [article.coverImage] : undefined,
    datePublished: article.publishedAt ?? undefined,
    dateModified: article.updatedAt,
    author: {
      "@type": "Organization",
      name: article.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "هلپر",
      url: SITE_URL,
    },
    mainEntityOfPage: canonical,
    inLanguage: "fa-IR",
    keywords: article.tags.join(", "),
  };
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "خانه", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "وبلاگ", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: article.title, item: canonical },
    ],
  };

  return (
    <article className="py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([structuredData, breadcrumbData]).replace(/</g, "\\u003c"),
        }}
      />
      <Container className="max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-foreground/60 transition-colors hover:text-primary"
        >
          <ArrowRight size={15} aria-hidden="true" />
          بازگشت به وبلاگ
        </Link>

        <header className="mt-5">
          <Link
            href={`/blog?category=${encodeURIComponent(article.categorySlug)}`}
            className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
          >
            {article.category}
          </Link>
          <h1 className="mt-4 text-2xl font-bold leading-[1.55] tracking-tight text-foreground sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-3 text-base leading-8 text-foreground/65">{article.excerpt}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-foreground/50">
            {article.publishedAt ? <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time> : null}
            <span className="flex items-center gap-1">
              <Clock3 size={13} aria-hidden="true" />
              {formatReadingTime(article.readingMinutes)}
            </span>
            <span>{article.authorName} · {article.authorRole}</span>
          </div>
        </header>

        <div
          className={`mt-7 h-48 rounded-2xl bg-gradient-to-br sm:h-64 ${
            article.coverTint
          }`}
          role="img"
          aria-label={article.coverAlt || `تصویر مقاله: ${article.title}`}
          style={
            article.coverImage
              ? {
                  backgroundImage: `url("${encodeURI(article.coverImage)}")`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }
              : undefined
          }
        />

        <div className="mt-8">
          <ArticleContent blocks={article.content} />
        </div>

        {article.tags.length ? (
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="برچسب‌های مقاله">
            {article.tags.map((tag) => (
              <li key={tag}>
                <Link
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="rounded-full border border-foreground/10 px-3 py-1.5 text-xs text-foreground/60 hover:border-primary/30 hover:text-primary"
                >
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-10">
          <AuthorBox
            author={{ name: article.authorName, role: article.authorRole }}
            publishedLabel={article.publishedAt ? formatDate(article.publishedAt) : ""}
          />
        </div>

        <div className="mt-12 border-t border-foreground/10 pt-10">
          <RelatedArticles articles={relatedArticles} />
        </div>
      </Container>
    </article>
  );
}
