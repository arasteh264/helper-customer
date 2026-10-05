"use client";

import { useRef, useState } from "react";
import { LoaderCircle, Search } from "lucide-react";

import { ArticleCard } from "./article-card";
import { blogApi } from "../api/blog.api";
import type { BlogArticleSummary, BlogPage } from "../types/blog.types";

export function BlogExplorer({
  initialPage,
  initialError = false,
  initialCategory,
  initialTag,
  initialSearch = "",
}: {
  initialPage: BlogPage;
  initialError?: boolean;
  initialCategory?: string;
  initialTag?: string;
  initialSearch?: string;
}) {
  const [items, setItems] = useState<BlogArticleSummary[]>(initialPage.items);
  const [categories, setCategories] = useState(initialPage.categories);
  const [total, setTotal] = useState(initialPage.total);
  const [page, setPage] = useState(initialPage.page);
  const [category, setCategory] = useState<string | undefined>(initialCategory);
  const [tag, setTag] = useState<string | undefined>(initialTag);
  const [search, setSearch] = useState(initialSearch);
  const [query, setQuery] = useState(initialSearch);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(
    initialError ? "مقاله‌ها فعلاً بارگذاری نشدند." : "",
  );
  const requestSequence = useRef(0);

  async function loadPage(options: {
    nextPage: number;
    nextCategory?: string;
    nextSearch?: string;
    nextTag?: string | null;
    append?: boolean;
  }) {
    const sequence = ++requestSequence.current;
    const more = options.append ?? false;
    if (more) setLoadingMore(true);
    else setLoading(true);
    setError("");
    try {
      const response = await blogApi.list({
        page: options.nextPage,
        pageSize: 9,
        category: options.nextCategory,
        search: options.nextSearch,
        tag: options.nextTag === null ? undefined : options.nextTag ?? tag,
      });
      if (sequence !== requestSequence.current) return;
      setItems((current) =>
        more ? [...current, ...response.items] : response.items,
      );
      setCategories(response.categories);
      setTotal(response.total);
      setPage(response.page);
    } catch {
      if (sequence === requestSequence.current) {
        setError("دریافت مقاله‌ها انجام نشد. اتصال را بررسی کنید و دوباره تلاش کنید.");
      }
    } finally {
      if (sequence === requestSequence.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }

  function selectCategory(value?: string) {
    setCategory(value);
    setTag(undefined);
    void loadPage({ nextPage: 1, nextCategory: value, nextSearch: search, nextTag: null });
  }

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setQuery(search.trim());
    void loadPage({ nextPage: 1, nextCategory: category, nextSearch: search.trim() });
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-foreground/[0.07] bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-foreground/60">
          راهنمای کاربردی برای انتخاب متخصص و نگهداری خانه
        </p>
        <form onSubmit={submitSearch} role="search" className="flex w-full gap-2 sm:max-w-md">
          <label htmlFor="blog-search" className="sr-only">جست‌وجو در مقاله‌ها</label>
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-foreground/40" aria-hidden="true" />
            <input
              id="blog-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="مثلاً پیدا کردن لوله‌کش"
              className="h-10 w-full rounded-lg border border-foreground/10 bg-background pe-9 ps-3 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
            />
          </div>
          <button type="submit" disabled={loading} className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60">
            جست‌وجو
          </button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2" aria-label="دسته‌بندی مقاله‌ها">
        <button
          type="button"
          onClick={() => selectCategory(undefined)}
          aria-pressed={!category}
          className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${!category ? "border-primary bg-primary/10 font-medium text-primary" : "border-foreground/15 text-foreground/65 hover:border-primary/40"}`}
        >
          همه‌ی مقاله‌ها
        </button>
        {categories.map((item) => (
          <button
            key={item.categorySlug}
            type="button"
            onClick={() => selectCategory(item.categorySlug)}
            aria-pressed={category === item.categorySlug}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${category === item.categorySlug ? "border-primary bg-primary/10 font-medium text-primary" : "border-foreground/15 text-foreground/65 hover:border-primary/40"}`}
          >
            {item.category}
          </button>
        ))}
      </div>

      <div className="mt-7 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-foreground">
          {query
            ? `نتیجه برای «${query}»`
            : tag
              ? `مقاله‌های «${tag}»`
              : category
                ? "مقاله‌های این دسته"
                : "تازه‌ترین راهنماها"}
        </h2>
        <span className="text-xs text-foreground/50">{total} مقاله</span>
      </div>

      {error ? (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm" role="alert">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => void loadPage({ nextPage: 1, nextCategory: category, nextSearch: query })}
            className="font-medium text-primary underline underline-offset-4"
          >
            تلاش دوباره
          </button>
        </div>
      ) : null}

      {loading && items.length === 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="در حال بارگذاری مقاله‌ها" aria-busy="true">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="h-64 animate-pulse rounded-2xl bg-foreground/[0.05]" />
          ))}
        </div>
      ) : items.length === 0 && !error ? (
        <p className="mt-10 rounded-2xl border border-dashed border-foreground/15 px-5 py-12 text-center text-sm text-foreground/55">
          مقاله‌ای با این جست‌وجو پیدا نشد.
        </p>
      ) : (
        <>
          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((article) => (
              <li key={article.id}>
                <ArticleCard article={article} />
              </li>
            ))}
          </ul>
          {items.length < total ? (
            <div className="mt-8 text-center">
              <button
                type="button"
                disabled={loadingMore}
                onClick={() => void loadPage({ nextPage: page + 1, nextCategory: category, nextSearch: query, append: true })}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-foreground/15 bg-card px-5 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-60"
              >
                {loadingMore ? <LoaderCircle className="size-4 animate-spin" /> : null}
                {loadingMore ? "در حال بارگذاری…" : "مقاله‌های بیشتر"}
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
