"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronDown, Loader2, Search } from "lucide-react";

import { Button } from "@/src/components/ui/button";
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

const SUGGESTIONS = [
  "تعمیرات لوازم",
  "نظافت",
  "خدمات آموزشی",
  "حمل‌ونقل",
  "خدمات خودرو",
];

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
  const rootRef = useRef<HTMLDivElement>(null);
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
    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const filteredSuggestions = useMemo(() => {
    const normalizedQuery = normalizeSearch(query);
    if (!normalizedQuery) return [];

    const queryTokens = normalizedQuery.split(" ").filter(Boolean);
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
      return (
        searchable.includes(normalizedQuery) ||
        queryTokens.every((token) => searchable.includes(token))
      );
    });
    return matches
      .sort((a, b) => {
        const queryText = normalizeSearch(query);
        const aName = normalizeSearch(a.specialtyName);
        const bName = normalizeSearch(b.specialtyName);
        return (
          Number(bName.startsWith(queryText)) -
          Number(aName.startsWith(queryText))
        );
      })
      .slice(0, 8);
  }, [query, suggestions]);

  const goToRequest = (suggestion: SearchSuggestion) => {
    const params = new URLSearchParams({
      specialtyId: suggestion.specialtyId,
      specialtyName: suggestion.specialtyName,
      groupName: suggestion.groupName,
    });
    if (suggestion.specialtySlug) {
      params.set("specialtySlug", suggestion.specialtySlug);
    }
    setIsOpen(false);
    router.push(`/request?${params.toString()}`);
  };

  const goToServiceSearch = (value: string) => {
    const search = value.trim();
    setIsOpen(false);
    router.push(
      search ? `/services?q=${encodeURIComponent(search)}` : "/services",
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const suggestion =
      filteredSuggestions[activeIndex] ?? filteredSuggestions[0];
    if (suggestion) {
      goToRequest(suggestion);
      return;
    }
    goToServiceSearch(query);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" && filteredSuggestions.length) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) =>
        index < 0 ? 0 : (index + 1) % filteredSuggestions.length,
      );
    } else if (event.key === "ArrowUp" && filteredSuggestions.length) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) =>
        index < 0
          ? filteredSuggestions.length - 1
          : (index - 1 + filteredSuggestions.length) %
            filteredSuggestions.length,
      );
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative w-full max-w-xl">
      <div className="relative">
        <form
          role="search"
          onSubmit={handleSubmit}
          className={[
            "flex items-center gap-2 rounded-2xl border border-foreground/10 bg-card p-2 shadow-lg shadow-foreground/[0.05] transition-shadow focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10",
            isOpen && query.trim() ? "rounded-b-none border-b-transparent" : "",
          ].join(" ")}
        >
          <Search
            size={20}
            className="mr-2 shrink-0 text-foreground/40"
            aria-hidden
          />
          <label htmlFor="hero-search" className="sr-only">
            جستجوی خدمت یا متخصص
          </label>
          <input
            id="hero-search"
            type="search"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isOpen && filteredSuggestions.length > 0}
            aria-controls="hero-search-suggestions"
            aria-activedescendant={
              isOpen && activeIndex >= 0 && filteredSuggestions[activeIndex]
                ? `hero-search-option-${filteredSuggestions[activeIndex].specialtyId}`
                : undefined
            }
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(-1);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="مثلاً تعمیر کولر یا نظافت منزل…"
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm outline-none placeholder:text-foreground/40 sm:text-base"
          />
          <Button type="submit" className="h-11 shrink-0 px-5 sm:px-7">
            جستجو
          </Button>
        </form>

        {isOpen && query.trim() && (
          <div className="absolute inset-x-0 top-full z-30 mt-0 overflow-hidden rounded-b-2xl rounded-t-none border border-t-0 border-foreground/10 bg-card shadow-2xl shadow-foreground/10">
            {loading ? (
              <p className="flex items-center gap-2 px-4 py-4 text-sm text-foreground/60">
                <Loader2
                  size={16}
                  className="animate-spin"
                  aria-hidden="true"
                />
                در حال جست‌وجو بین خدمات…
              </p>
            ) : filteredSuggestions.length ? (
              <ul
                id="hero-search-suggestions"
                role="listbox"
                aria-label="خدمات پیشنهادی"
                className="max-h-80 overflow-y-auto p-2"
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
                        "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-start transition-colors",
                        index === activeIndex
                          ? "bg-primary/[0.07]"
                          : "hover:bg-foreground/[0.035]",
                      ].join(" ")}
                    >
                      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary/70">
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
                        <span className="block truncate text-sm font-semibold text-foreground">
                          {suggestion.specialtyName}
                        </span>
                        <span className="mt-1 block truncate text-xs text-foreground/55">
                          {suggestion.groupName}
                        </span>
                      </span>
                      <ChevronDown
                        size={16}
                        className="shrink-0 -rotate-90 text-primary"
                        aria-hidden="true"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-4">
                <p className="text-sm text-foreground/65">
                  {loadError
                    ? "پیشنهاد خدمات در دسترس نیست؛ می‌توانید جست‌وجو را ادامه دهید."
                    : "خدمتی با این نام پیدا نشد؛ همه‌ی خدمات را جست‌وجو کنید."}
                </p>
                <button
                  type="button"
                  onClick={() => goToServiceSearch(query)}
                  className="mt-3 text-sm font-semibold text-primary hover:underline"
                >
                  جست‌وجوی «{query.trim()}» در همه‌ی خدمات
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs text-foreground/50">پرطرفدار:</span>
        {SUGGESTIONS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setQuery(item);
              setActiveIndex(-1);
              setIsOpen(true);
            }}
            className="rounded-full border border-foreground/10 bg-background px-3 py-1.5 text-xs text-foreground/70 transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
