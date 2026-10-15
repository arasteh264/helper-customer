import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock3 } from "lucide-react";

import { auth } from "@/src/auth";
import { Container } from "@/src/components/shared/container";
import { ArticleContent } from "@/src/features/blog/components/article-content";
import { ArticleRating } from "@/src/features/articles/components/article-rating";
import { publicProviderArticlesApi } from "@/src/features/articles/api/provider-articles.api";
import type { ProviderArticle } from "@/src/features/articles/types/provider-article.types";
import { ApiError } from "@/src/lib/api/error";
import { formatDate } from "@/src/utils/format";

type Props = { params: Promise<{ slug: string }> };

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://helper-customer.vercel.app";

async function getArticle(slug: string): Promise<ProviderArticle> {
  try {
    return await publicProviderArticlesApi.getBySlug(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  return {
    title: `${article.title} | دانستنی‌های هلپا24`,
    description: article.excerpt,
    alternates: { canonical: `${SITE_URL}/knowledge/${article.slug}` },
    openGraph: {
      type: "article",
      locale: "fa_IR",
      title: article.title,
      description: article.excerpt,
      images: article.coverImage ? [article.coverImage] : [],
    },
  };
}

export default async function ExpertKnowledgeArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);
  const session = await auth();
  const accessToken = session?.accessToken;
  const canRate =
    Boolean(accessToken) &&
    session?.user?.role?.toUpperCase() === "CUSTOMER";
  const canonical = `${SITE_URL}/knowledge/${article.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage ? [article.coverImage] : undefined,
    datePublished: article.publishedAt ?? undefined,
    dateModified: article.updatedAt,
    author: { "@type": "Person", name: article.authorName ?? "متخصص هلپا24" },
    publisher: { "@type": "Organization", name: "هلپا24", url: SITE_URL },
    mainEntityOfPage: canonical,
    inLanguage: "fa-IR",
    keywords: article.specialties?.map((specialty) => specialty.name).join(", "),
  };

  return (
    <article className="py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <Container className="max-w-3xl">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-foreground/60 hover:text-primary">
          <ArrowRight size={15} aria-hidden="true" />
          بازگشت به دانستنی‌ها
        </Link>
        <header className="mt-5">
          <div className="flex flex-wrap gap-2">
            {article.categories?.map((category) => (
              <span key={category.id} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{category.name}</span>
            ))}
          </div>
          <h1 className="mt-4 text-2xl font-bold leading-[1.55] tracking-tight sm:text-4xl">{article.title}</h1>
          <p className="mt-3 text-base leading-8 text-foreground/65">{article.excerpt}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-foreground/50">
            {article.publishedAt ? <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time> : null}
            <span className="inline-flex items-center gap-1"><Clock3 size={13} /> {article.readingMinutes} دقیقه مطالعه</span>
            <span>{article.authorName} · متخصص هلپا24</span>
          </div>
        </header>
        <div
          className="mt-7 h-48 rounded-2xl bg-secondary/70 sm:h-64"
          role="img"
          aria-label={article.coverAlt || `تصویر مقاله: ${article.title}`}
          style={article.coverImage ? {
            backgroundImage: `url("${article.coverImage.replaceAll('"', "%22")}")`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          } : undefined}
        />
        <div className="mt-8">
          {article.content ? (
            <ArticleContent blocks={article.content} />
          ) : (
            <p className="rounded-lg bg-amber-500/10 p-4 text-sm leading-6" role="status">
              متن این مقاله در حال حاضر بارگذاری نشد. صفحه را دوباره تازه کنید.
            </p>
          )}
        </div>
        {article.specialties?.length ? (
          <p className="mt-8 text-sm text-foreground/55">
            مرتبط با: {article.specialties.map((specialty) => specialty.name).join("، ")}
          </p>
        ) : null}
        <ArticleRating
          articleId={article.id}
          accessToken={accessToken}
          canRate={canRate}
          average={article.ratingSummary?.average ?? null}
          count={article.ratingSummary?.count ?? 0}
        />
      </Container>
    </article>
  );
}
