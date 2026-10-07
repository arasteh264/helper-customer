"use client";

import { useMemo, useState } from "react";
import {
  Loader2,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { SpecialistCard } from "@/src/features/home/components/specialist-card";
import type { DirectorySpecialist } from "../types/catalog.types";
import {
  DEFAULT_FILTERS,
  type SortOption,
  type SpecialistFilters,
} from "../types/catalog.types";
import { filterSpecialists } from "../utils/filter-specialists";
import { formatNumber } from "@/src/utils/format";
import { publicProvidersApi } from "../api/providers.api";
import { mapPublicProvider } from "../utils/map-public-provider";

const SORTS: { id: SortOption; label: string }[] = [
  { id: "recommended", label: "پیشنهادی" },
  { id: "rating", label: "بیشترین امتیاز" },
  { id: "distance", label: "نزدیک‌ترین" },
];

const RATING_OPTIONS = [0, 4, 4.5];

export function SpecialistsDirectory({
  specialists: initialSpecialists,
  specialistsTotal: initialSpecialistsTotal,
  categories,
  initialLoadFailed = false,
  categoriesLoadFailed = false,
}: {
  specialists: DirectorySpecialist[];
  specialistsTotal: number;
  categories: { id: string; label: string }[];
  initialLoadFailed?: boolean;
  categoriesLoadFailed?: boolean;
}) {
  const router = useRouter();
  const [specialists, setSpecialists] = useState(initialSpecialists);
  const [specialistsTotal, setSpecialistsTotal] = useState(
    initialSpecialistsTotal,
  );
  const [filters, setFilters] = useState<SpecialistFilters>(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  const update = (patch: Partial<SpecialistFilters>) =>
    setFilters((f) => ({ ...f, ...patch }));

  const results = useMemo(
    () => filterSpecialists(specialists, filters),
    [filters, specialists],
  );

  const findNearby = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const providers = await publicProvidersApi.list({
            latitude: coords.latitude,
            longitude: coords.longitude,
          });
          setSpecialists(providers.map(mapPublicProvider));
          setSpecialistsTotal(providers.length);
          setPage(1);
          update({ sort: "distance" });
        } catch {
          toast.error("دریافت متخصصان نزدیک انجام نشد. دوباره تلاش کنید.");
        } finally {
          setLocating(false);
        }
      },
      () => {
        toast.error(
          "دسترسی موقعیت مکانی داده نشد؛ می‌توانید همه متخصصان را جستجو کنید.",
        );
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 12000 },
    );
  };

  const loadMore = async () => {
    if (loadingMore || specialists.length >= specialistsTotal) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const response = await publicProvidersApi.listPage(nextPage, 24);
      setSpecialists((current) => [
        ...current,
        ...response.items.map(mapPublicProvider),
      ]);
      setPage(response.page);
      setSpecialistsTotal(response.total);
    } catch {
      toast.error("دریافت ادامه‌ی فهرست متخصصان انجام نشد. دوباره تلاش کنید.");
    } finally {
      setLoadingMore(false);
    }
  };

  const activeCount = [
    filters.categoryId,
    filters.minRating > 0,
    filters.verifiedOnly,
  ].filter(Boolean).length;

  const FiltersPanel = (
    <div className="space-y-6">
      {/* دسته‌بندی */}
      <div>
        <p className="mb-2.5 text-xs font-semibold text-foreground/50">
          دسته‌بندی
        </p>
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
          {categories.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() =>
                update({
                  categoryId: filters.categoryId === id ? null : id,
                })
              }
              className={[
                "rounded-full border px-3 py-1.5 text-xs transition-colors",
                filters.categoryId === id
                  ? "border-primary bg-primary/10 font-medium text-primary"
                  : "border-foreground/15 text-foreground/65 hover:border-primary/40",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2.5 text-xs font-semibold text-foreground/50">
          حداقل امتیاز
        </p>
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
    <div className="space-y-4">
      {categoriesLoadFailed && (
        <div
          role="alert"
          className="flex flex-col items-start justify-between gap-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-4 text-sm text-amber-900 sm:flex-row sm:items-center"
        >
          <p>
            دسته‌بندی‌ها بارگذاری نشدند؛ فیلتر دسته‌بندی موقتاً در دسترس نیست.
          </p>
          <button
            type="button"
            onClick={() => router.refresh()}
            className="shrink-0 font-medium underline underline-offset-4"
          >
            تلاش دوباره
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[17rem_1fr]">
        {/* فیلترها - دسکتاپ */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-3xl border border-foreground/10 bg-card p-5 shadow-sm">
            <p className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
              <SlidersHorizontal size={16} className="text-primary" />
              فیلترها
            </p>
            {FiltersPanel}
          </div>
        </aside>

        <div>
          {/* نوار جستجو و مرتب‌سازی */}
          <div className="rounded-2xl border border-foreground/10 bg-card p-3 shadow-sm sm:flex sm:items-center sm:gap-3">
            <div className="relative flex-1">
              <Search
                size={17}
                className="pointer-events-none absolute end-3.5 top-1/2 -translate-y-1/2 text-foreground/35"
              />
              <input
                type="search"
                value={filters.query}
                onChange={(e) => update({ query: e.target.value })}
                placeholder="جستجو در نام یا تخصص…"
                className="h-11 w-full rounded-xl border border-foreground/10 bg-foreground/[0.025] pe-10 ps-4 text-sm outline-none transition-colors focus:border-primary/50 focus:bg-background focus:ring-4 focus:ring-primary/10"
              />
            </div>

            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="mt-2 inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-foreground/10 bg-background px-4 text-sm font-medium text-foreground/75 transition-colors hover:border-primary/40 hover:text-primary sm:mt-0 lg:hidden"
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
              aria-label="مرتب‌سازی متخصصان"
              className="mt-2 h-11 w-full rounded-xl border border-foreground/10 bg-background px-3.5 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-4 focus:ring-primary/10 sm:mt-0 sm:w-auto"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={findNearby}
              disabled={locating || loadingMore}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-primary/25 px-3.5 text-sm font-medium text-primary transition-colors hover:bg-primary/[0.05] disabled:opacity-60"
            >
              {locating ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <MapPin size={16} />
              )}
              متخصصان نزدیک من
            </button>
          </div>

          {!initialLoadFailed && (
            <p className="mt-4 text-sm text-foreground/55">
              نمایش {formatNumber(specialists.length)} از {formatNumber(specialistsTotal)} متخصص؛
              {" "}{formatNumber(results.length)} نتیجه با فیلترهای فعلی
            </p>
          )}

          {/* نتایج */}
          {initialLoadFailed ? (
            <div
              role="alert"
              className="mt-6 rounded-2xl border border-foreground/10 bg-card px-6 py-12 text-center"
            >
              <p className="text-sm text-foreground/65">
                دریافت فهرست متخصصان انجام نشد. اتصال اینترنت را بررسی و دوباره
                تلاش کنید.
              </p>
              <button
                type="button"
                onClick={() => router.refresh()}
                className="mt-4 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
              >
                تلاش دوباره
              </button>
            </div>
          ) : results.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-foreground/15 bg-card px-6 py-16 text-center">
              <p className="text-sm text-foreground/60">
                متخصصی با این فیلترها پیدا نشد. فیلترها را کم‌تر کنید.
              </p>
            </div>
          ) : (
            <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((s) => (
                <li key={s.id}>
                  <SpecialistCard specialist={s} />
                </li>
              ))}
            </ul>
          )}
          {!initialLoadFailed && specialists.length < specialistsTotal ? (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore || locating}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-foreground/15 px-5 text-sm font-medium text-foreground/75 transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-60"
              >
                {loadingMore ? <Loader2 size={16} className="animate-spin" /> : null}
                دریافت متخصصان بیشتر
              </button>
            </div>
          ) : null}
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
                <p className="text-base font-semibold text-foreground">
                  فیلترها
                </p>
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
    </div>
  );
}
