"use client";

import Link from "next/link";

export default function ErrorPage({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl items-center px-4 py-12">
      <section
        role="alert"
        className="w-full rounded-2xl border border-foreground/10 bg-card p-6 text-center sm:p-10"
      >
        <h1 className="text-xl font-bold text-foreground">
          دریافت اطلاعات با مشکل روبه‌رو شد
        </h1>
        <p className="mt-3 text-sm leading-7 text-foreground/60">
          ارتباط با سرور برقرار نشد یا پردازش درخواست کامل نشد. دوباره تلاش
          کنید.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={retry}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            تلاش دوباره
          </button>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-foreground/15 px-5 text-sm font-medium text-foreground/70 transition-colors hover:border-primary/40 hover:text-primary"
          >
            بازگشت به خانه
          </Link>
        </div>
      </section>
    </main>
  );
}
