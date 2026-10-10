import {
  ArrowLeft,
  BadgeCheck,
  Check,
  FileCheck2,
  ShieldCheck,
  WalletCards,
  Wrench,
} from "lucide-react";
import Link from "next/link";

import { Container } from "@/src/components/shared/container";
import { HeroSearch } from "./hero-search";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#eaf5f2] dark:bg-[#102521]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-32 size-[28rem] rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 left-[28%] size-[24rem] rounded-full bg-amber-300/15 blur-3xl"
      />

      <Container className="relative grid grid-cols-1 items-center gap-8 py-9 sm:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-14">
        <div className="flex min-w-0 flex-col items-start home-enter">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/80 px-3.5 py-2 text-xs font-bold text-primary shadow-sm">
            <BadgeCheck size={15} aria-hidden="true" />
            قیمت و انتخاب شفاف
          </span>

          <h1 className="mt-5 w-full max-w-2xl text-[2rem] font-black leading-[1.48] tracking-tight text-foreground sm:text-5xl sm:leading-[1.32] lg:text-[3.25rem]">
            برای هر کاری،
            <br />
            <span className="text-primary">متخصصش را پیدا کن</span>
          </h1>

          <p className="mt-4 max-w-xl text-base leading-8 text-foreground/70 sm:text-lg">
            درخواستت را ثبت کن، قیمت متخصص‌ها را بگیر و با مقایسه‌ی پیشنهادها،
            خودت انتخاب کن.
          </p>

          <div className="mt-6 w-full">
            <HeroSearch />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-foreground/65 sm:text-sm">
            <span className="inline-flex items-center gap-1.5">
              <WalletCards size={16} className="text-primary" aria-hidden="true" />
              قیمت را قبل از پرداخت ببین
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-primary" aria-hidden="true" />
              انتخاب با خودت
            </span>
          </div>

          <Link
            href="/request"
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-primary-hover"
          >
            ثبت مستقیم درخواست
            <ArrowLeft size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="relative mx-auto w-full min-w-0 max-w-[29rem] home-enter home-enter-delay-2">
          <div className="mb-4">
            <p className="text-xs font-bold text-primary">در هلپر چه اتفاقی می‌افتد؟</p>
            <h2 className="mt-1 text-xl font-black text-foreground sm:text-2xl">
              مقایسه کن، بعد انتخاب کن
            </h2>
          </div>

          <div className="relative overflow-hidden rounded-[1.65rem] border border-primary/10 bg-gradient-to-br from-primary/[0.11] via-card to-amber-100/60 p-4 shadow-xl shadow-primary/[0.08] sm:p-5 dark:to-amber-900/10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 size-52 rounded-full bg-primary/10 blur-3xl"
            />

            <div className="relative flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-background/80 px-3 py-1.5 text-xs font-bold text-primary">
                <FileCheck2 size={14} aria-hidden="true" />
                مسیر درخواست
              </span>
              <span className="text-xs font-medium text-foreground/45">
                ساده و شفاف
              </span>
            </div>

            <div className="relative mt-4 rounded-2xl border border-foreground/[0.07] bg-card p-4 shadow-lg shadow-primary/[0.07] sm:p-5">
              <div className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Wrench size={19} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-primary">
                    بعد از ثبت درخواست
                  </p>
                  <h3 className="mt-1 text-base font-black text-foreground sm:text-lg">
                    پیشنهاد متخصص‌ها می‌رسد
                  </h3>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-3 rounded-xl border border-primary/10 bg-primary/[0.045] px-3 py-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background text-primary">
                    <WalletCards size={16} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-foreground">
                      قیمت و توضیحات
                    </span>
                    <span className="mt-0.5 block text-xs text-foreground/55">
                      پیشنهاد هر متخصص را ببین
                    </span>
                  </span>
                  <Check size={16} className="shrink-0 text-primary" aria-hidden="true" />
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-foreground/[0.07] bg-background/80 px-3 py-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200">
                    <BadgeCheck size={16} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-foreground">
                      امتیاز و نظرها
                    </span>
                    <span className="mt-0.5 block text-xs text-foreground/55">
                      پروفایل‌ها را بررسی کن
                    </span>
                  </span>
                  <Check size={16} className="shrink-0 text-primary" aria-hidden="true" />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/15">
                <span>انتخاب نهایی با خودت</span>
                <ArrowLeft size={17} aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
