"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Droplets,
  TriangleAlert,
} from "lucide-react";

import { Container } from "@/src/components/shared/container";

const tips = [
  {
    slug: "seasonal-home-maintenance",
    category: "بازبینی فصلی",
    title: "با چند بررسی ساده، زودتر متوجه فرسودگی شو",
    description:
      "نشانه‌های رطوبت را بعد از بارندگی ببین، فیلتر وسایل سرمایشی را طبق دفترچه بررسی کن و سرویس تجهیزات گرمایشی را به متخصص بسپار.",
    icon: CalendarDays,
    tone: "bg-emerald-500/10 text-emerald-700",
    label: "چک‌لیست نگهداری خانه",
  },
  {
    slug: "prevent-pipe-leaks",
    category: "لوله‌کشی",
    title: "لکه‌ی نم را قبل از بزرگ‌شدن پیگیری کن",
    description:
      "زیر سینک و اطراف اتصالات را نگاه کن و محل لکه را ثبت کن. اگر آب نزدیک برق است، وارد محدوده‌ی خیس نشو و به وسایل برقی دست نزن.",
    icon: Droplets,
    tone: "bg-cyan-500/10 text-cyan-700",
    label: "راهنمای بررسی نشتی",
  },
  {
    slug: "electrical-safety-checklist",
    category: "ایمنی برق",
    title: "بوی سوختگی یا داغی پریز را جدی بگیر",
    description:
      "استفاده از وسیله‌ی مشکوک را متوقف کن؛ پریز را باز نکن و فیوز را مرتب بالا نزن. بررسی سیم‌کشی را به برق‌کار بسپار.",
    icon: TriangleAlert,
    tone: "bg-amber-500/10 text-amber-700",
    label: "چک‌لیست ایمنی برق",
  },
  {
    slug: "how-to-choose-a-specialist",
    category: "انتخاب متخصص",
    title: "پیشنهادها را فقط با مبلغ نهایی نسنج",
    description:
      "قبل از انتخاب، دامنه‌ی کار، هزینه‌ی بازدید و قطعه، زمان انجام و نظرهای مرتبط با همان خدمت را کنار هم مقایسه کن.",
    icon: ClipboardCheck,
    tone: "bg-violet-500/10 text-violet-700",
    label: "راهنمای مقایسه‌ی پیشنهادها",
  },
];

export function HomeMaintenanceCarousel() {
  const scrollerRef = useRef<HTMLUListElement>(null);

  const scroll = (direction: 1 | -1) => {
    const element = scrollerRef.current;
    if (!element) return;

    const isRtl = getComputedStyle(element).direction === "rtl";
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    element.scrollBy({
      left: element.clientWidth * 0.8 * direction * (isRtl ? -1 : 1),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <section
      aria-labelledby="home-maintenance-heading"
      className="overflow-hidden bg-secondary/45 py-16 sm:py-20"
    >
      <Container>
        <div className="mb-7 flex flex-col gap-5 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
              <CalendarDays size={15} aria-hidden="true" />
              راهنمای کوتاه خانه
            </span>
            <h2
              id="home-maintenance-heading"
              className="mt-3 text-2xl font-bold leading-9 text-foreground sm:text-3xl"
            >
              قبل از خرابی، چند نشانه را بشناس
            </h2>
            <p className="mt-3 text-sm leading-7 text-foreground/65 sm:text-base">
              نکته‌های کوتاه و ایمن برای نگهداری خانه و انتخاب آگاهانه‌ی متخصص؛
              برای جزئیات بیشتر هر راهنما را بخوان.
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <Link
              href="/blog"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-primary/20 bg-background px-4 text-sm font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-primary/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              خواندن راهنماها
              <ArrowLeft size={16} aria-hidden="true" />
            </Link>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scroll(-1)}
                aria-label="نکته‌های قبلی"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 bg-background text-foreground/70 transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scroll(1)}
                aria-label="نکته‌های بعدی"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 bg-background text-foreground/70 transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <ul
          ref={scrollerRef}
          aria-label="نکته‌های نگهداری و تعمیر خانه"
          className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {tips.map((tip) => {
            const Icon = tip.icon;

            return (
              <li
                key={tip.slug}
                className="w-[88%] shrink-0 snap-start sm:w-[48%] lg:w-[calc((100%-2rem)/3)]"
              >
                <Link
                  href={`/blog/${tip.slug}`}
                  className="group flex h-full min-h-64 flex-col rounded-2xl border border-foreground/[0.08] bg-card p-5 shadow-sm shadow-foreground/[0.025] transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:p-6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tip.tone}`}
                    >
                      <Icon size={23} aria-hidden="true" />
                    </span>
                    <span className="rounded-full bg-foreground/[0.045] px-3 py-1.5 text-xs font-medium text-foreground/65">
                      {tip.category}
                    </span>
                  </div>
                  <h3 className="mt-5 text-base font-bold leading-7 text-foreground sm:text-lg">
                    {tip.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-7 text-foreground/65">
                    {tip.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    {tip.label}
                    <ArrowLeft
                      size={16}
                      aria-hidden="true"
                      className="transition-transform group-hover:-translate-x-1"
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
