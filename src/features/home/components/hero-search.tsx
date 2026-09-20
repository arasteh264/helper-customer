"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Button } from "@/src/components/ui/button";

const SUGGESTIONS = ["لوله‌کش", "وکیل", "مدرس ریاضی", "طراح سایت", "عکاس"];

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const go = (value: string) => {
    const q = value.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/services");
  };

  return (
    <div className="w-full max-w-xl">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          go(query);
        }}
        className="flex items-center gap-2 rounded-2xl border border-foreground/10 bg-card p-2 shadow-lg shadow-foreground/[0.05] transition-shadow focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10"
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
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="چه خدمت یا متخصصی نیاز دارید؟"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm outline-none placeholder:text-foreground/40 sm:text-base"
        />
        <Button type="submit" className="h-11 shrink-0 px-5 sm:px-7">
          جستجو
        </Button>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs text-foreground/50">پرطرفدار:</span>
        {SUGGESTIONS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => go(item)}
            className="rounded-full border border-foreground/10 bg-background px-3 py-1.5 text-xs text-foreground/70 transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}