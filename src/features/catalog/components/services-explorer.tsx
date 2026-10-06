"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpLeft, Loader2, Search } from "lucide-react";

import { CategorySvgIcon } from "@/src/features/catalog/components/category-svg-icon";
import {
  normalizeSpecialtyGroup,
  type CatalogCategory,
} from "@/src/features/catalog/utils/category-mapping";
import { requestApi } from "@/src/features/request/api/request.api";

export function ServicesExplorer({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    requestApi
      .getSpecialtyGroups()
      .then((items) => {
        if (!active) return;
        setCategories(items.map(normalizeSpecialtyGroup));
        setError(null);
      })
      .catch(() => {
        if (!active) return;
        setError("دریافت دسته‌بندی‌ها انجام نشد. دوباره تلاش کنید.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? categories.filter((c) => c.label.toLowerCase().includes(q))
      : categories;
  }, [categories, query]);

  return (
    <div>
      <div className="relative mx-auto max-w-lg">
        <Search
          size={18}
          className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-foreground/35"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجو در دسته‌بندی‌ها…"
          className="h-12 w-full rounded-xl border border-foreground/15 bg-card pe-11 ps-4 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
        />
      </div>

      {loading ? (
        <div className="mt-10 flex items-center justify-center gap-2 text-sm text-foreground/55">
          <Loader2 size={16} className="animate-spin" />
          در حال بارگذاری دسته‌بندی‌ها…
        </div>
      ) : error ? (
        <p className="mt-10 text-center text-sm text-red-600">{error}</p>
      ) : results.length === 0 ? (
        <p className="mt-10 text-center text-sm text-foreground/55">
          دسته‌بندی‌ای با این عنوان پیدا نشد.
        </p>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {results.map(({ id, label, imageUrl, tint, href, svgKey }) => (
            <li key={id}>
              <Link
                href={href}
                className="group relative flex h-full flex-col gap-4 rounded-2xl border border-foreground/10 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-foreground/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:hover:-translate-y-1 sm:p-5"
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-primary ${tint}`}
                >
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt=""
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  ) : (
                    <CategorySvgIcon slug={svgKey} className="h-7 w-7" />
                  )}
                </span>
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-foreground sm:text-base">
                    {label}
                  </h3>
                  <p className="mt-1 text-xs text-foreground/50">
                    مشاهده متخصص‌ها
                  </p>
                </div>
                <ArrowUpLeft
                  size={18}
                  className="absolute end-4 top-4 text-foreground/25 transition-colors group-hover:text-primary"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
