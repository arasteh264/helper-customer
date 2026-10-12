"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpLeft, Loader2, RefreshCw, Search } from "lucide-react";

import { CategorySvgIcon } from "@/src/features/catalog/components/category-svg-icon";
import {
  normalizeSpecialtyGroup,
  type CatalogCategory,
} from "@/src/features/catalog/utils/category-mapping";
import { requestApi } from "@/src/features/request/api/request.api";
import type {
  Specialty,
  SpecialtyGroup,
} from "@/src/features/request/types/specialty.types";

type ServiceGroupResult = {
  category: CatalogCategory;
  specialties: Specialty[];
};

function normalizeSearch(value: string) {
  return value
    .trim()
    .toLocaleLowerCase("fa-IR")
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[\u200c\u200f]/g, " ")
    .replace(/\s+/g, " ");
}

function requestHref(group: CatalogCategory, specialty: Specialty) {
  const params = new URLSearchParams({
    specialtyId: specialty.id,
    specialtyName: specialty.name,
    groupName: group.label,
  });
  if (specialty.slug) params.set("specialtySlug", specialty.slug);
  return `/request?${params.toString()}`;
}

export function ServicesExplorer({
  initialQuery = "",
}: {
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [groups, setGroups] = useState<ServiceGroupResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloads, setReloads] = useState(0);

  useEffect(() => {
    let active = true;

    const loadServices = async () => {
      const items = await requestApi.getSpecialtyGroups();
      const results = await Promise.all(
        items.map(async (group: SpecialtyGroup) => ({
          category: normalizeSpecialtyGroup(group),
          specialties: await requestApi.getSpecialtyGroupSpecialties(group.id),
        })),
      );
      return results;
    };

    loadServices()
      .then((items) => {
        if (!active) return;
        setGroups(items);
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
  }, [reloads]);

  const results = useMemo(() => {
    const normalizedQuery = normalizeSearch(query);
    if (!normalizedQuery) {
      return groups.map((group) => ({
        ...group,
        groupMatches: false,
        matchingSpecialties: group.specialties,
      }));
    }

    const queryTokens = normalizedQuery.split(" ").filter(Boolean);
    return groups
      .map((group) => {
        const groupName = normalizeSearch(group.category.label);
        const groupMatches =
          groupName.includes(normalizedQuery) ||
          queryTokens.every((token) => groupName.includes(token));
        const matchingSpecialties = group.specialties.filter((specialty) => {
          const name = normalizeSearch(specialty.name);
          return (
            name.includes(normalizedQuery) ||
            queryTokens.every((token) => name.includes(token))
          );
        });
        return {
          ...group,
          groupMatches,
          matchingSpecialties: groupMatches
            ? group.specialties
            : matchingSpecialties,
        };
      })
      .filter(
        (group) => group.groupMatches || group.matchingSpecialties.length > 0,
      );
  }, [groups, query]);

  return (
    <div>
      <div className="relative max-w-xl">
        <Search
          size={18}
          className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-foreground/35"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجو در دسته‌بندی‌ها…"
          className="h-12 w-full rounded-xl border border-foreground/10 bg-foreground/[0.025] pe-11 ps-4 text-sm outline-none transition-colors focus:border-primary/50 focus:bg-background focus:ring-4 focus:ring-primary/10"
        />
      </div>

      {loading ? (
        <div className="mt-10 flex items-center justify-center gap-2 rounded-2xl bg-foreground/[0.025] py-12 text-sm text-foreground/55">
          <Loader2 size={16} className="animate-spin" />
          در حال بارگذاری دسته‌بندی‌ها…
        </div>
      ) : error ? (
        <div
          role="alert"
          className="mt-8 rounded-2xl bg-destructive/5 px-5 py-8 text-center"
        >
          <p className="text-sm text-destructive">{error}</p>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setError(null);
              setReloads((value) => value + 1);
            }}
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl border border-destructive/20 px-4 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/5"
          >
            <RefreshCw size={15} aria-hidden="true" />
            تلاش دوباره
          </button>
        </div>
      ) : results.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-foreground/15 py-10 text-center text-sm text-foreground/55">
          گروه یا خدمتی با این عنوان پیدا نشد.
        </p>
      ) : query.trim() ? (
        <div className="mt-7 space-y-5">
          {results.map(({ category, matchingSpecialties }) => (
            <section
              key={category.id}
              className="rounded-2xl border border-foreground/10 bg-background p-4 sm:p-5"
            >
              <Link
                href={category.href}
                className="inline-flex items-center gap-2 font-semibold text-foreground transition-colors hover:text-primary"
              >
                {category.label}
                <ArrowUpLeft size={16} aria-hidden />
              </Link>
              <p className="mt-1 text-xs text-foreground/50">گروه خدمات</p>
              {matchingSpecialties.length ? (
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {matchingSpecialties.map((specialty) => (
                    <li key={specialty.id}>
                      <Link
                        href={requestHref(category, specialty)}
                        className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-foreground/10 px-3 py-2.5 text-sm transition-colors hover:border-primary/30 hover:bg-primary/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-foreground">
                            {specialty.name}
                          </span>
                          <span className="mt-0.5 block text-[11px] text-foreground/50">
                            زیرگروه {category.label}
                          </span>
                        </span>
                        <ArrowUpLeft
                          size={15}
                          className="shrink-0 text-primary"
                          aria-hidden
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      ) : (
        <ul className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          {results.map(
            ({ category: { id, label, imageUrl, tint, href, svgKey } }) => (
              <li key={id}>
                <Link
                  href={href}
                  className="group relative flex h-full min-h-36 items-start gap-4 rounded-2xl border border-foreground/10 bg-background p-4 transition-all hover:border-primary/30 hover:bg-primary/[0.02] hover:shadow-lg hover:shadow-foreground/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:hover:-translate-y-1 sm:p-5"
                >
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-primary ${tint}`}
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
                  <div className="min-w-0 pe-5">
                    <h3 className="text-sm font-semibold leading-6 text-foreground sm:text-base">
                      {label}
                    </h3>
                    <p className="mt-2 text-xs text-foreground/50">
                      خدمات و متخصصان مرتبط
                    </p>
                  </div>
                  <ArrowUpLeft
                    size={18}
                    className="absolute end-4 top-4 text-foreground/25 transition-colors group-hover:text-primary"
                    aria-hidden
                  />
                </Link>
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
}
