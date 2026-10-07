import Link from "next/link";
import { Container } from "@/src/components/shared/container";
import { ProviderStartButton } from "./provider-start-button";

export function ProviderHero({
  authenticated,
}: {
  authenticated: boolean;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-hover py-16 text-primary-foreground sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -end-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -start-16 h-80 w-80 rounded-full bg-white/10 blur-3xl"
      />

      <Container className="relative flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium">
          مسیر همکاری متخصصان
        </span>

        <h1 className="mt-5 max-w-2xl text-3xl font-bold leading-[1.35] tracking-tight sm:text-5xl sm:leading-[1.3]">
          با تخصص‌تان درآمد کسب کنید
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-primary-foreground/85 sm:text-base">
          پروفایل متخصصتان را با حساب فعلی بسازید، اطلاعات حرفه‌ای و تخصصتان را
          تکمیل کنید و پس از بررسی، درخواست‌های متناسب را ببینید.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ProviderStartButton authenticated={authenticated} />
          <Link
            href="#how-it-works"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/30 px-6 text-sm font-medium text-white transition-colors hover:border-white/60 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary sm:text-base"
          >
            چطور کار می‌کند؟
          </Link>
        </div>

      </Container>
    </section>
  );
}