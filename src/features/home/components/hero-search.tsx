"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent, MouseEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Search, X } from "lucide-react";

import { requestApi } from "@/src/features/request/api/request.api";
import type {
  Specialty,
  SpecialtyGroup,
} from "@/src/features/request/types/specialty.types";

type SearchSuggestion = {
  groupName: string;
  specialtyId: string;
  specialtyName: string;
  specialtySlug?: string;
  specialtyIcon?: string | null;
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

async function getSearchSuggestions(): Promise<SearchSuggestion[]> {
  const groups = await requestApi.getSpecialtyGroups();
  const groupsWithSpecialties = await Promise.allSettled(
    groups.map(async (group: SpecialtyGroup) => ({
      group,
      specialties:
        group.specialties ??
        (await requestApi.getSpecialtyGroupSpecialties(group.id)),
    })),
  );

  return groupsWithSpecialties.flatMap((result, index) => {
    if (result.status === "rejected") {
      console.error(
        `Homepage search suggestions for group "${groups[index]?.name ?? index}" could not be loaded`,
        result.reason,
      );
      return [];
    }

    return result.value.specialties.map((specialty: Specialty) => ({
      groupName: result.value.group.name,
      specialtyId: specialty.id,
      specialtyName: specialty.name,
      specialtySlug: specialty.slug,
      specialtyIcon: specialty.icon,
    }));
  });
}

export function HeroSearch() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    let active = true;
    getSearchSuggestions()
      .then((items) => {
        if (active) setSuggestions(items);
      })
      .catch((error: unknown) => {
        console.error(
          "Homepage service suggestions could not be loaded",
          error,
        );
        if (active) setLoadError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
      inputRef.current?.focus();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const normalizedQuery = normalizeSearch(query);
  const filteredSuggestions = useMemo(() => {
    const matches = suggestions.filter((suggestion) => {
      const searchable = normalizeSearch(
        [
          suggestion.groupName,
          suggestion.specialtyName,
          suggestion.specialtySlug?.replaceAll("-", " "),
        ]
          .filter(Boolean)
          .join(" "),
      );
      const queryTokens = normalizedQuery.split(" ").filter(Boolean);
      return (
        !normalizedQuery ||
        searchable.includes(normalizedQuery) ||
        queryTokens.every((token) => searchable.includes(token))
      );
    });

    return matches
      .sort((a, b) => {
        const aName = normalizeSearch(a.specialtyName);
        const bName = normalizeSearch(b.specialtyName);
        return (
          Number(bName.startsWith(normalizedQuery)) -
          Number(aName.startsWith(normalizedQuery))
        );
      })
      .slice(0, normalizedQuery ? 8 : 6);
  }, [normalizedQuery, suggestions]);

  const closeDialog = () => {
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const goToRequest = (suggestion: SearchSuggestion) => {
    const params = new URLSearchParams({
      specialtyId: suggestion.specialtyId,
      specialtyName: suggestion.specialtyName,
      groupName: suggestion.groupName,
    });
    if (suggestion.specialtySlug) {
      params.set("specialtySlug", suggestion.specialtySlug);
    }
    closeDialog();
    router.push(`/request?${params.toString()}`);
  };

  const goToServiceSearch = (value: string) => {
    const search = value.trim();
    closeDialog();
    router.push(
      search ? `/services?q=${encodeURIComponent(search)}` : "/services",
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const suggestion =
      activeIndex >= 0
        ? filteredSuggestions[activeIndex]
        : filteredSuggestions[0];
    if (suggestion) {
      goToRequest(suggestion);
      return;
    }
    goToServiceSearch(query);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" && filteredSuggestions.length) {
      event.preventDefault();
      setActiveIndex((index) =>
        index < 0 ? 0 : (index + 1) % filteredSuggestions.length,
      );
    } else if (event.key === "ArrowUp" && filteredSuggestions.length) {
      event.preventDefault();
      setActiveIndex((index) =>
        index < 0
          ? filteredSuggestions.length - 1
          : (index - 1 + filteredSuggestions.length) %
            filteredSuggestions.length,
      );
    }
  };

  const handleDialogClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) closeDialog();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-label="جستجوی خدمات"
        className="group flex min-h-[4.5rem] w-full items-center gap-3 rounded-2xl border border-foreground/10 bg-card px-4 text-start shadow-lg shadow-foreground/[0.06] transition hover:border-primary/30 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 sm:min-h-[5rem] sm:px-5"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground sm:size-11">
          <Search size={20} aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold text-foreground sm:text-base">
            چه خدمتی لازم داری؟
          </span>
          <span className="mt-1 block truncate text-xs text-foreground/45 sm:text-sm">
            مثلاً نصب کولر یا نظافت منزل
          </span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground">
          جستجو
          <ArrowLeft size={15} aria-hidden="true" />
        </span>
      </button>

      <dialog
        ref={dialogRef}
        onCancel={(event) => {
          event.preventDefault();
          closeDialog();
        }}
        onClose={() => setIsOpen(false)}
        onClick={handleDialogClick}
        aria-labelledby="hero-search-title"
        className="fixed inset-x-0 bottom-0 m-0 max-h-[88dvh] w-full max-w-none overflow-hidden rounded-t-[1.75rem] border border-b-0 border-foreground/10 bg-card p-0 text-foreground shadow-2xl backdrop:bg-foreground/45 sm:inset-0 sm:bottom-auto sm:m-auto sm:max-h-[min(82dvh,44rem)] sm:w-[min(100%-2rem,42rem)] sm:rounded-[1.75rem] sm:border-b"
      >
        <div className="flex max-h-[88dvh] flex-col sm:max-h-[min(82dvh,44rem)]">
          <div className="flex items-start justify-between gap-4 border-b border-foreground/[0.07] px-5 pb-4 pt-5 sm:px-7 sm:pt-7">
            <div>
              <p className="text-xs font-bold text-primary">هلپا۲۴</p>
              <h2
                id="hero-search-title"
                className="mt-1 text-lg font-black sm:text-xl"
              >
                دنبال چه خدمتی هستی؟
              </h2>
              <p className="mt-1 text-xs leading-6 text-foreground/55 sm:text-sm">
                نام خدمت یا دسته‌بندی را بنویس.
              </p>
            </div>
            <button
              type="button"
              onClick={closeDialog}
              aria-label="بستن جستجو"
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary/60 text-foreground/65 transition hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X size={19} aria-hidden="true" />
            </button>
          </div>

          <form
            role="search"
            onSubmit={handleSubmit}
            className="px-5 pt-4 sm:px-7"
          >
            <label htmlFor="hero-search" className="sr-only">
              جستجوی خدمت یا متخصص
            </label>
            <div className="flex items-center gap-2 rounded-2xl border border-primary/20 bg-background px-3 py-2 shadow-sm transition focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10">
              <Search
                size={19}
                className="shrink-0 text-primary"
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                id="hero-search"
                type="search"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={filteredSuggestions.length > 0}
                aria-controls="hero-search-suggestions"
                aria-activedescendant={
                  activeIndex >= 0 && filteredSuggestions[activeIndex]
                    ? `hero-search-option-${filteredSuggestions[activeIndex].specialtyId}`
                    : undefined
                }
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                placeholder="مثلاً تعمیر کولر یا نظافت منزل"
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-foreground/40 sm:text-base"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setActiveIndex(-1);
                    inputRef.current?.focus();
                  }}
                  aria-label="پاک کردن عبارت جستجو"
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg text-foreground/45 hover:bg-secondary hover:text-foreground"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              ) : null}
            </div>
          </form>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5 pt-4 sm:px-7 sm:pb-7">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="text-xs font-bold text-foreground/55">
                {normalizedQuery ? "پیشنهادهای مرتبط" : "خدمات پرطرفدار"}
              </h3>
              {!loading && suggestions.length > 0 ? (
                <span className="text-[11px] text-foreground/40">
                  برای انتخاب لمس کن
                </span>
              ) : null}
            </div>

            {loading ? (
              <p
                className="flex items-center gap-2 rounded-xl bg-secondary/35 px-4 py-5 text-sm text-foreground/60"
                role="status"
              >
                <Loader2
                  size={16}
                  className="animate-spin"
                  aria-hidden="true"
                />
                در حال بارگذاری خدمات…
              </p>
            ) : filteredSuggestions.length ? (
              <ul
                id="hero-search-suggestions"
                role="listbox"
                aria-label="خدمات پیشنهادی"
                className="space-y-1"
              >
                {filteredSuggestions.map((suggestion, index) => (
                  <li key={suggestion.specialtyId}>
                    <button
                      type="button"
                      role="option"
                      id={`hero-search-option-${suggestion.specialtyId}`}
                      aria-selected={index === activeIndex}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => goToRequest(suggestion)}
                      className={[
                        "flex min-h-16 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        index === activeIndex
                          ? "bg-primary/[0.08]"
                          : "hover:bg-secondary/60",
                      ].join(" ")}
                    >
                      <span className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secondary/60">
                        {suggestion.specialtyIcon ||
                        suggestion.specialtySlug ? (
                          <Image
                            src={
                              suggestion.specialtyIcon ??
                              `/icons/specialties/${suggestion.specialtySlug}.svg`
                            }
                            alt=""
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        ) : (
                          <Search
                            size={17}
                            className="text-primary"
                            aria-hidden="true"
                          />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-foreground">
                          {suggestion.specialtyName}
                        </span>
                        <span className="mt-1 block truncate text-xs text-foreground/50">
                          {suggestion.groupName}
                        </span>
                      </span>
                      <ArrowLeft
                        size={16}
                        className="shrink-0 text-foreground/35"
                        aria-hidden="true"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-xl bg-secondary/35 px-4 py-4">
                <p className="text-sm leading-6 text-foreground/65">
                  {loadError
                    ? "خدمات فعلاً بارگذاری نشدند."
                    : "خدمتی با این عبارت پیدا نشد."}
                </p>
                <button
                  type="button"
                  onClick={() => goToServiceSearch(query)}
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
                >
                  جستجو در همه‌ی خدمات
                  <ArrowLeft size={15} aria-hidden="true" />
                </button>
              </div>
            )}

            {!loading && normalizedQuery ? (
              <button
                type="button"
                onClick={() => goToServiceSearch(query)}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-foreground/10 px-4 py-3 text-sm font-semibold text-foreground/70 transition hover:border-primary/30 hover:text-primary"
              >
                جستجوی «{query.trim()}» در همه‌ی خدمات
                <ArrowLeft size={15} aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </div>
      </dialog>
    </>
  );
}
