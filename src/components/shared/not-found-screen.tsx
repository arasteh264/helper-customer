import Link from "next/link";
import { ArrowLeft, Compass, Home, Search } from "lucide-react";

import { Container } from "./container";

export function NotFoundScreen() {
  return (
    <main className="relative isolate flex min-h-[75vh] items-center overflow-hidden py-16 sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-1/4 -z-10 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl"
      />
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-primary/15 bg-card text-primary shadow-lg shadow-primary/[0.08]">
            <Compass size={36} strokeWidth={1.6} aria-hidden="true" />
          </span>
          <p className="mt-7 text-sm font-bold tracking-[0.25em] text-primary">
            ۴۰۴
          </p>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight text-foreground sm:text-5xl">
            این صفحه را پیدا نکردیم
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-foreground/60 sm:text-base">
            شاید آدرس اشتباه باشد یا صفحه جابه‌جا شده باشد. از اینجا می‌توانید
            مسیرتان را ادامه دهید.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition-all hover:-translate-y-0.5 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Home size={17} aria-hidden="true" />
              بازگشت به صفحه‌ی اصلی
            </Link>
            <Link
              href="/services"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-foreground/15 bg-card px-6 text-sm font-semibold text-foreground/75 transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Search size={17} aria-hidden="true" />
              دیدن خدمات
              <ArrowLeft size={15} aria-hidden="true" />
            </Link>
          </div>

          <p className="mt-8 text-sm text-foreground/50">
            دنبال متخصص می‌گردید؟{" "}
            <Link
              href="/specialists"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              فهرست متخصصان را ببینید
            </Link>
          </p>
        </div>
      </Container>
    </main>
  );
}
