"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { Specialist } from "../types/types";
import { SpecialistCard } from "./specialist-card";

export function SpecialistsCarousel({
  specialists,
}: {
  specialists: Specialist[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const isRtl = getComputedStyle(el).direction === "rtl";
    el.scrollBy({
      left: el.clientWidth * 0.8 * dir * (isRtl ? -1 : 1),
      behavior: "smooth",
    });
  };

  return (
    <div>
      <div className="mb-4 hidden justify-end gap-2 md:flex">
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label="قبلی"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 bg-background text-foreground/70 transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ChevronRight size={20} />
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label="بعدی"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 bg-background text-foreground/70 transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      <div
        ref={scrollerRef}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {specialists.map((specialist) => (
          <div
            key={specialist.id}
            className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[calc((100%-3rem)/4)]"
          >
            <SpecialistCard specialist={specialist} />
          </div>
        ))}
      </div>
    </div>
  );
}