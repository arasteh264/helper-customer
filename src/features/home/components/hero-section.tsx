import {
  ArrowLeft,
  BadgeCheck,
  GraduationCap,
  House,
  Search,
  Sparkles,
  Wrench,
} from "lucide-react";
import Link from "next/link";

import { Container } from "@/src/components/shared/container";
import { HeroSearch } from "./hero-search";

const serviceIdeas = [
  {
    icon: Wrench,
    label: "تعمیرات لوازم",
    color: "bg-[#f6d8bd] text-[#8d4b27]",
  },
  {
    icon: GraduationCap,
    label: "خدمات آموزشی",
    color: "bg-[#d7e5d5] text-[#315c47]",
  },
  {
    icon: Sparkles,
    label: "نظافت",
    color: "bg-[#f2e7b9] text-[#77611d]",
  },
];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#f3f0e7] dark:bg-[#17231e]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-36 h-[28rem] w-[28rem] rounded-full bg-[#d8e4d4]/80 blur-3xl dark:bg-primary/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 right-[38%] h-80 w-80 rounded-full bg-[#edd9c4]/70 blur-3xl dark:bg-amber-900/10"
      />

      <Container className="relative grid items-center gap-12 py-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-20">
        <div className="flex flex-col items-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/75 px-3.5 py-2 text-xs font-medium text-primary shadow-sm">
            <House size={15} aria-hidden="true" />
            یک راه ساده برای پیدا کردن متخصص
          </span>

          <h1 className="mt-6 max-w-2xl text-[2.2rem] font-black leading-[1.45] tracking-tight text-foreground sm:text-5xl sm:leading-[1.35] lg:text-[3.55rem]">
            برای هر کاری،
            <br />
            <span className="relative inline-block text-primary">
              آدمِ کاربلدش
              <svg
                aria-hidden="true"
                viewBox="0 0 280 14"
                className="absolute -bottom-1 right-0 h-2.5 w-full text-[#d49a53]"
                preserveAspectRatio="none"
              >
                <path
                  d="M4 9C67 3 188 2 276 8"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="5"
                />
              </svg>
            </span>{" "}
            را پیدا کنید.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-8 text-foreground/70 sm:text-lg">
            از تعمیر شیر آب تا تدریس و طراحی؛ نیازتان را بگویید، متخصص‌ها را
            ببینید و با خیال راحت انتخاب کنید.
          </p>

          <div className="mt-8 w-full">
            <HeroSearch />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs leading-6 text-foreground/60 sm:text-sm">
            <span className="inline-flex items-center gap-2">
              <BadgeCheck size={16} className="text-primary" aria-hidden="true" />
              بررسی پروفایل و نظرها پیش از انتخاب
            </span>
            <Link
              href="/request"
              className="inline-flex items-center gap-1 font-semibold text-primary transition-colors hover:text-primary-hover"
            >
              یا درخواستت را مستقیم ثبت کن
              <ArrowLeft size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[34rem] py-5 sm:py-8">
          <div
            aria-hidden="true"
            className="absolute inset-x-6 bottom-0 top-8 rounded-[2.5rem] bg-[#dfe8d9] dark:bg-primary/10"
          />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[#fffdf8] p-4 shadow-[0_24px_70px_-32px_rgba(27,54,41,0.32)] dark:border-white/10 dark:bg-card sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-primary">شروع کار</p>
                <h2 className="mt-1 text-lg font-bold text-foreground sm:text-xl">
                  چه کاری از دست ما برمی‌آید؟
                </h2>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f5e2ca] text-[#8d4b27]">
                <Search size={21} aria-hidden="true" />
              </span>
            </div>

            <div className="relative mt-5 flex min-h-48 items-center justify-center overflow-hidden rounded-[1.5rem] bg-[#244d3d] px-5 py-7 sm:min-h-56">
              <div
                aria-hidden="true"
                className="absolute -left-10 -top-16 h-48 w-48 rounded-full bg-[#d99c5c]"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-24 -right-8 h-52 w-52 rounded-full bg-[#78977b]"
              />
              <div className="relative flex flex-col items-center text-center">
                <span className="flex h-24 w-24 items-center justify-center rounded-[2rem] border border-white/20 bg-white/10 text-[#fff8e8] shadow-xl backdrop-blur-sm sm:h-28 sm:w-28">
                  <House size={58} strokeWidth={1.35} aria-hidden="true" />
                </span>
                <p className="mt-4 text-sm font-semibold text-white sm:text-base">
                  کارهای خانه، یک‌جا و بی‌دردسر
                </p>
                <p className="mt-1 text-xs text-white/70">
                  از پیدا کردن متخصص تا هماهنگی انجام کار
                </p>
              </div>

              <span className="absolute right-4 top-4 rounded-full bg-[#fffdf8] px-3 py-1.5 text-[11px] font-semibold text-[#315c47] shadow-lg sm:right-6 sm:top-6">
                خدمات روزمره
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
              {serviceIdeas.map(({ icon: Icon, label, color }) => (
                <Link
                  key={label}
                  href={`/services?q=${encodeURIComponent(label)}`}
                  className="group flex items-center justify-center gap-2 rounded-xl border border-foreground/[0.06] bg-background/80 px-2 py-3 text-xs font-semibold text-foreground/75 transition-colors hover:border-primary/25 hover:text-primary sm:text-sm"
                >
                  <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
                    <Icon size={17} aria-hidden="true" />
                  </span>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
