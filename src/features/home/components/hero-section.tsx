import {
  ArrowLeft,
  BadgeCheck,
  Check,
  ClipboardCheck,
  FileCheck2,
  MapPin,
  Star,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Container } from "@/src/components/shared/container";
import { mapPublicProvider } from "@/src/features/catalog/utils/map-public-provider";
import type { PublicProvider } from "@/src/features/catalog/api/providers.api";
import { HeroSearch } from "./hero-search";

export function HeroSection({ providers }: { providers: PublicProvider[] }) {
  const featuredProvider = providers
    .filter((provider) => provider.verified)
    .sort((a, b) => b.reviewsCount - a.reviewsCount)[0];
  const featuredSpecialist = featuredProvider
    ? mapPublicProvider(featuredProvider)
    : null;

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

      <Container className="relative grid grid-cols-1 items-center gap-10 py-10 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-16">
        <div className="flex min-w-0 flex-col items-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/75 px-3.5 py-2 text-xs font-medium text-primary shadow-sm">
            <BadgeCheck size={15} aria-hidden="true" />
            اطلاعات روشن، انتخاب آگاهانه
          </span>

          <h1 className="mt-6 w-full max-w-2xl text-[1.9rem] font-black leading-[1.5] tracking-tight text-foreground sm:text-5xl sm:leading-[1.35] lg:text-[3.35rem]">
            متخصص مناسب را پیدا کن،
            <br />
            <span className="relative inline-block text-primary">
              با چشم باز انتخاب کن
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
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-8 text-foreground/70 sm:text-lg">
            تخصص، محدوده‌ی فعالیت، امتیاز و نظرهای ثبت‌شده را بررسی کنید. مبلغ
            را پیش از پرداخت ببینید و درخواستتان را از حساب خود پیگیری کنید.
          </p>

          <div className="mt-8 w-full">
            <HeroSearch />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs leading-6 text-foreground/60 sm:text-sm">
            <span className="inline-flex items-center gap-2">
              <BadgeCheck size={16} className="text-primary" aria-hidden="true" />
              پروفایل‌ها را قبل از انتخاب ببین
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

        <div className="relative mx-auto w-full min-w-0 max-w-[34rem] py-5 sm:py-8">
          <div
            aria-hidden="true"
            className="absolute inset-x-6 bottom-0 top-8 rounded-[2.5rem] bg-[#dfe8d9] dark:bg-primary/10"
          />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[#fffdf8] p-5 shadow-[0_24px_70px_-32px_rgba(27,54,41,0.32)] dark:border-white/10 dark:bg-card sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-primary">
                  قبل از انتخاب چه می‌بینید؟
                </p>
                <h2 className="mt-1 text-lg font-bold text-foreground sm:text-xl">
                  تصمیم با اطلاعات واقعی
                </h2>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <FileCheck2 size={21} aria-hidden="true" />
              </span>
            </div>

            {featuredSpecialist ? (
              <Link
                href={`/specialists/${featuredSpecialist.id}`}
                className="group mt-5 block overflow-hidden rounded-2xl border border-foreground/10 bg-background transition-colors hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="flex items-center gap-4 p-4 sm:p-5">
                  <span className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
                    {featuredSpecialist.image ? (
                      <Image
                        src={featuredSpecialist.image}
                        alt=""
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      featuredSpecialist.name.charAt(0)
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">
                      <BadgeCheck size={13} aria-hidden="true" />
                      پروفایل تأییدشده
                    </span>
                    <span className="mt-2 block truncate text-base font-bold text-foreground">
                      {featuredSpecialist.name}
                    </span>
                    <span className="mt-0.5 block truncate text-sm text-foreground/60">
                      {featuredSpecialist.field}
                    </span>
                  </span>
                  <ArrowLeft
                    size={18}
                    className="shrink-0 text-foreground/35 transition-transform group-hover:-translate-x-1 group-hover:text-primary"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-foreground/[0.07] px-4 py-3 text-xs text-foreground/60 sm:px-5">
                  {featuredSpecialist.reviews > 0 ? (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                      <Star
                        size={14}
                        className="fill-amber-500 text-amber-500"
                        aria-hidden="true"
                      />
                      {new Intl.NumberFormat("fa-IR", {
                        maximumFractionDigits: 1,
                      }).format(featuredSpecialist.rating)}
                      <span className="font-normal text-foreground/55">
                        ({new Intl.NumberFormat("fa-IR").format(featuredSpecialist.reviews)} نظر)
                      </span>
                    </span>
                  ) : (
                    <span>هنوز نظری برای این متخصص ثبت نشده</span>
                  )}
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={14} aria-hidden="true" />
                    {featuredSpecialist.city}
                  </span>
                  {featuredSpecialist.jobs > 0 ? (
                    <span>
                      {new Intl.NumberFormat("fa-IR").format(featuredSpecialist.jobs)} کار تکمیل‌شده
                    </span>
                  ) : null}
                </div>
              </Link>
            ) : (
              <div className="mt-5 rounded-2xl border border-foreground/10 bg-background p-5 sm:p-6">
                <p className="text-sm font-semibold text-foreground">
                  انتخابتان را بر پایه‌ی اطلاعات بسازید
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-foreground/65">
                  <li className="flex items-start gap-2.5">
                    <Check size={17} className="mt-1 shrink-0 text-primary" />
                    تخصص و محدوده‌ی فعالیت را در پروفایل ببینید.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check size={17} className="mt-1 shrink-0 text-primary" />
                    نظرهای ثبت‌شده را پیش از انتخاب بخوانید.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check size={17} className="mt-1 shrink-0 text-primary" />
                    قیمت را پیش از پرداخت بررسی کنید.
                  </li>
                </ul>
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-2">
              <span className="flex items-center gap-2 rounded-xl bg-[#f3f0e7] px-3 py-3 text-xs font-medium leading-5 text-foreground/70 dark:bg-foreground/[0.05]">
                <ClipboardCheck size={17} className="shrink-0 text-primary" />
                پیگیری درخواست در حساب کاربری
              </span>
              <span className="flex items-center gap-2 rounded-xl bg-[#f3f0e7] px-3 py-3 text-xs font-medium leading-5 text-foreground/70 dark:bg-foreground/[0.05]">
                <BadgeCheck size={17} className="shrink-0 text-primary" />
                امکان ثبت و پیگیری اختلاف
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
