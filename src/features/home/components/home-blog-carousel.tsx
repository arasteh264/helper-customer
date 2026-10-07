"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";

import type { BlogArticleSummary } from "@/src/features/blog/types/blog.types";
import { ArticleCard } from "@/src/features/blog/components/article-card";
import { Container } from "@/src/components/shared/container";

export function HomeBlogCarousel({
  articles,
}: {
  articles: BlogArticleSummary[];
}) {
  const scrollerRef = useRef<HTMLUListElement>(null);

  const scroll = (direction: 1 | -1) => {
    const element = scrollerRef.current;
    if (!element) return;

    const isRtl = getComputedStyle(element).direction === "rtl";
    element.scrollBy({
      left: element.clientWidth * 0.8 * direction * (isRtl ? -1 : 1),
      behavior: "smooth",
    });
  };

  if (articles.length === 0) return null;

  return (
    <section
      aria-labelledby="home-blog-heading"
      className="overflow-hidden bg-gradient-to-b from-primary/[0.035] to-transparent py-16 sm:py-20"
    >
      <Container>
        <div className="mb-7 flex flex-col gap-5 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
              <BookOpen size={15} aria-hidden="true" />
              مجله‌ی هلپر
            </span>
            <h2
              id="home-blog-heading"
              className="mt-3 text-2xl font-bold leading-9 text-foreground sm:text-3xl"
            >
              راهنمایی‌های کاربردی برای انتخاب بهتر
            </h2>
            <p className="mt-3 text-sm leading-7 text-foreground/65 sm:text-base">
              نکته‌های مفید درباره‌ی نگهداری خانه، انتخاب متخصص و انجام مطمئن
              کارها را بخوانید.
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <Link
              href="/blog"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-primary/20 bg-background px-4 text-sm font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-primary/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              همه‌ی مقاله‌ها
              <ArrowLeft size={16} aria-hidden="true" />
            </Link>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scroll(-1)}
                aria-label="مقاله‌های قبلی"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 bg-background text-foreground/70 transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scroll(1)}
                aria-label="مقاله‌های بعدی"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 bg-background text-foreground/70 transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <ul
          ref={scrollerRef}
          aria-label="مقاله‌های تازه‌ی مجله‌ی هلپر"
          className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {articles.map((article) => (
            <li
              key={article.id}
              className="w-[84%] shrink-0 snap-start sm:w-[48%] lg:w-[calc((100%-3rem)/4)]"
            >
              <ArticleCard article={article} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
