"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { Specialist } from "../types/types";
import { SpecialistCard } from "./specialist-card";

export function SpecialistsCarousel({
  specialists,
  label,
}: {
  specialists: Specialist[];
  label: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const isRtl = getComputedStyle(el).direction === "rtl";
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    el.scrollBy({
      left: el.clientWidth * 0.8 * dir * (isRtl ? -1 : 1),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <div>
      {specialists.length > 1 && (
        <div className="mb-2 flex items-center justify-between gap-3 px-4 sm:px-6">
          <p className="text-[11px] text-foreground/50 sm:text-xs">
            برای دیدن بقیه، بکشید
          </p>
          <div className="flex shrink-0 gap-1.5">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label={`متخصصان قبلی ${label}`}
              className="flex size-9 items-center justify-center rounded-xl border border-foreground/10 bg-background text-foreground/65 transition-colors hover:border-primary/35 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ChevronRight size={17} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label={`متخصصان بعدی ${label}`}
              className="flex size-9 items-center justify-center rounded-xl border border-foreground/10 bg-background text-foreground/65 transition-colors hover:border-primary/35 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ChevronLeft size={17} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      <div
        ref={scrollerRef}
        aria-label={label}
        role="list"
        className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-3 [scrollbar-width:none] sm:-mx-6 sm:gap-4 sm:scroll-px-6 sm:px-6 sm:pb-4 lg:mx-0 lg:scroll-px-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {specialists.map((specialist) => (
          <div
            key={specialist.id}
            role="listitem"
            className={`shrink-0 snap-start ${
              specialists.length > 1
                ? "w-[84%] sm:w-[48%] lg:w-[calc((100%-3rem)/4)]"
                : "w-full"
            }`}
          >
            <SpecialistCard specialist={specialist} />
          </div>
        ))}
      </div>
    </div>
  );
}