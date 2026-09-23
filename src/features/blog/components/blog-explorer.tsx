"use client";

import { useMemo, useState } from "react";

import { articles, blogCategories } from "../api/mock-data";
import { ArticleCard } from "./article-card";

export function BlogExplorer() {
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const sorted = useMemo(
    () => [...articles].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)),
    []
  );

  const [featured, ...rest] = sorted;
  const filtered = categoryId ? rest.filter((a) => a.categoryId === categoryId) : rest;

  return (
    <div>
      {/* فیلتر دسته‌بندی */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategoryId(null)}
          className={[
            "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
            !categoryId
              ? "border-primary bg-primary/10 font-medium text-primary"
              : "border-foreground/15 text-foreground/65 hover:border-primary/40",
          ].join(" ")}
        >
          همه
        </button>
        {blogCategories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategoryId(c.id)}
            className={[
              "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
              categoryId === c.id
                ? "border-primary bg-primary/10 font-medium text-primary"
                : "border-foreground/15 text-foreground/65 hover:border-primary/40",
            ].join(" ")}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* مقاله‌ی ویژه (فقط وقتی فیلتری فعال نیست) */}
      {!categoryId && featured && (
        <div className="mt-8">
          <ArticleCard article={featured} featured />
        </div>
      )}

      {/* بقیه‌ی مقاله‌ها */}
      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-foreground/55">
          مقاله‌ای در این دسته پیدا نشد.
        </p>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <li key={a.slug}>
              <ArticleCard article={a} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}