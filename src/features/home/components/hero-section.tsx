import { ArrowLeft, BadgeCheck, Check } from "lucide-react";
import Link from "next/link";

import { Container } from "@/src/components/shared/container";
import { HeroSearch } from "./hero-search";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#fbf2e8] dark:bg-[#2b211b]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-32 size-[28rem] rounded-full bg-amber-300/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 left-[28%] size-[24rem] rounded-full bg-primary/10 blur-3xl"
      />

      <Container className="relative py-10 sm:py-14 lg:py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center home-enter">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/80 px-3.5 py-2 text-xs font-bold text-primary shadow-sm">
            <BadgeCheck size={15} aria-hidden="true" />
            قیمت‌ها را ببین، خودت انتخاب کن
          </span>

          <h1 className="mt-5 text-[2rem] font-black leading-[1.48] tracking-tight text-foreground sm:text-5xl sm:leading-[1.32] lg:text-[3.25rem]">
            متخصص مناسب کارت
            <span className="block text-primary">همین‌جاست</span>
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-foreground/65 sm:mt-4 sm:text-base">
            خدمتت را جست‌وجو کن و پیشنهاد متخصص‌ها را مقایسه کن.
          </p>

          <div className="mt-6 w-full sm:mt-8">
            <HeroSearch />
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-medium text-foreground/65 sm:text-sm">
            <span className="inline-flex items-center gap-1.5">
              <Check size={15} className="text-primary" aria-hidden="true" />
              بدون پرداخت پیش از انتخاب
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check size={15} className="text-primary" aria-hidden="true" />
              انتخاب نهایی با خودت
            </span>
          </div>

          <Link
            href="/request"
            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-primary-hover"
          >
            یا درخواستت را مستقیم ثبت کن
            <ArrowLeft size={16} aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
