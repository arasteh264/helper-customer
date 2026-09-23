"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Star, X } from "lucide-react";


import { SpecialistCard } from "@/src/features/home/components/specialist-card";
import { CITIES, directorySpecialists } from "../api/mock-data";
import { DEFAULT_FILTERS, type SortOption, type SpecialistFilters } from "../types/catalog.types";
import { filterSpecialists } from "../utils/filter-specialists";
import { formatNumber } from "@/src/utils/format";
import { categories } from "../../home/api/data";

const SORTS: { id: SortOption; label: string }[] = [
  { id: "recommended", label: "پیشنهادی" },
  { id: "rating", label: "بیشترین امتیاز" },
  { id: "price_asc", label: "ارزان‌ترین" },
  { id: "price_desc", label: "گران‌ترین" },
];

const RATING_OPTIONS = [0, 4, 4.5];

export function SpecialistsDirectory() {
  const [filters, setFilters] = useState<SpecialistFilters>(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const update = (patch: Partial<SpecialistFilters>) => setFilters((f) => ({ ...f, ...patch }));

  const results = useMemo(() => filterSpecialists(directorySpecialists, filters), [filters]);

  const activeCount = [
    filters.categoryId,
    filters.city,
    filters.minRating > 0,
    filters.verifiedOnly,
  ].filter(Boolean).length;

  const FiltersPanel = (
    <div className="space-y-6">
      {/* دسته‌بندی */}
      <div>
        <p className="mb-2.5 text-xs font-semibold text-foreground/50">دسته‌بندی</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => update({ categoryId: null })}
            className={[
              "rounded-full border px-3 py-1.5 text-xs transition-colors",
              !filters.categoryId
                ? "border-primary bg-primary/10 font-medium text-primary"
                : "border-foreground/15 text-foreground/65 hover:border-primary/40",
            ].join(" ")}
          >
            همه
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => update({ categoryId: filters.categoryId === c.id ? null : c.id })}
              className={[
                "rounded-full border px-3 py-1.5 text-xs transition-colors",
                filters.categoryId === c.id
                  ? "border-primary bg-primary/10 font-medium text-primary"
                  : "border-foreground/15 text-foreground/65 hover:border-primary/40",
              ].join(" ")}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* شهر */}
      <div>
        <p className="mb-2.5 text-xs font-semibold text-foreground/50">شهر</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => update({ city: null })}
            className={[
              "rounded-full border px-3 py-1.5 text-xs transition-colors",
              !filters.city
                ? "border-primary bg-primary/10 font-medium text-primary"
                : "border-foreground/15 text-foreground/65 hover:border-primary/40",
            ].join(" ")}
          >
            همه‌جا
          </button>
          {CITIES.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => update({ city: filters.city === city ? null : city })}
              className={[
                "rounded-full border px-3 py-1.5 text-xs transition-colors",
                filters.city === city
                  ? "border-primary bg-primary/10 font-medium text-primary"
                  : "border-foreground/15 text-foreground/65 hover:border-primary/40",
              ].join(" ")}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* حداقل امتیاز */}
      <div>
        <p className="mb-2.5 text-xs font-semibold text-foreground/50">حداقل امتیاز</p>
        <div className="flex flex-wrap gap-2">
          {RATING_OPTIONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => update({ minRating: r })}
              className={[
                "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs transition-colors",
                filters.minRating === r
                  ? "border-primary bg-primary/10 font-medium text-primary"
                  : "border-foreground/15 text-foreground/65 hover:border-primary/40",
              ].join(" ")}
            >
              {r === 0 ? (
                "همه"
              ) : (
                <>
                  <Star size={12} className="fill-amber-500 text-amber-500" />
                  {r}+
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* فقط تأییدشده */}
      <label className="flex cursor-pointer items-center justify-between rounded-xl bg-foreground/[0.04] px-4 py-3">
        <span className="text-sm text-foreground/75">فقط متخصصان تأییدشده</span>
        <input
          type="checkbox"
          checked={filters.verifiedOnly}
          onChange={(e) => update({ verifiedOnly: e.target.checked })}
          className="h-4 w-4 rounded border-foreground/25 accent-primary"
        />
      </label>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={() => setFilters(DEFAULT_FILTERS)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          <X size={13} />
          حذف همه‌ی فیلترها
        </button>
      )}
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
      {/* فیلترها - دسکتاپ */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl border border-foreground/10 bg-card p-5">
          <p className="mb-4 text-sm font-semibold text-foreground">فیلترها</p>
          {FiltersPanel}
        </div>
      </aside>

      <div>
        {/* نوار جستجو و مرتب‌سازی */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={17} className="pointer-events-none absolute end-3.5 top-1/2 -translate-y-1/2 text-foreground/35" />
            <input
              type="search"
              value={filters.query}
              onChange={(e) => update({ query: e.target.value })}
              placeholder="جستجو در نام یا تخصص…"
              className="h-11 w-full rounded-xl border border-foreground/15 bg-card pe-10 ps-4 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-foreground/15 bg-card px-4 py-2.5 text-sm font-medium text-foreground/75 transition-colors hover:border-primary/40 hover:text-primary lg:hidden"
          >
            <SlidersHorizontal size={16} />
            فیلترها
            {activeCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {formatNumber(activeCount)}
              </span>
            )}
          </button>

          <select
            value={filters.sort}
            onChange={(e) => update({ sort: e.target.value as SortOption })}
            className="h-11 rounded-xl border border-foreground/15 bg-card px-3.5 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <p className="mt-4 text-sm text-foreground/55">
          {formatNumber(results.length)} متخصص پیدا شد
        </p>

        {/* نتایج */}
        {results.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-foreground/15 bg-card px-6 py-16 text-center">
            <p className="text-sm text-foreground/60">
              متخصصی با این فیلترها پیدا نشد. فیلترها را کم‌تر کنید.
            </p>
          </div>
        ) : (
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((s) => (
              <li key={s.id}>
                <SpecialistCard specialist={s} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* فیلترها - موبایل (کشو از پایین) */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-background p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-base font-semibold text-foreground">فیلترها</p>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="بستن فیلترها"
                className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/50 hover:bg-foreground/5"
              >
                <X size={20} />
              </button>
            </div>
            {FiltersPanel}
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
            >
              نمایش {formatNumber(results.length)} نتیجه
            </button>
          </div>
        </div>
      )}
    </div>
  );
}