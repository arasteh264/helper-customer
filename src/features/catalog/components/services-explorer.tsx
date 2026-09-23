"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpLeft, Search } from "lucide-react";


import { formatNumber } from "@/src/utils/format";
import { categories } from "../../home/api/data";

export function ServicesExplorer() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.label.toLowerCase().includes(q));
  }, [query]);

  return (
    <div>
      <div className="relative mx-auto max-w-lg">
        <Search size={18} className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-foreground/35" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجو در دسته‌بندی‌ها…"
          className="h-12 w-full rounded-xl border border-foreground/15 bg-card pe-11 ps-4 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
        />
      </div>

      {results.length === 0 ? (
        <p className="mt-10 text-center text-sm text-foreground/55">
          دسته‌بندی‌ای با این عنوان پیدا نشد.
        </p>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {results.map(({ id, label, count, icon: Icon, tint, href }) => (
            <li key={id}>
              <Link
                href={href}
                className="group relative flex h-full flex-col gap-4 rounded-2xl border border-foreground/10 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-foreground/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:hover:-translate-y-1 sm:p-5"
              >
                <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${tint}`}>
                  <Icon size={24} />
                </span>
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-foreground sm:text-base">
                    {label}
                  </h3>
                  <p className="mt-1 text-xs text-foreground/50">{formatNumber(count)}+ متخصص</p>
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