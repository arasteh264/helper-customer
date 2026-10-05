"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { toEnglishDigits } from "@/src/utils/format";

const field =
  "w-full rounded-xl border border-foreground/15 bg-card px-4 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-4 focus:ring-primary/10";

export function RequestForm({
  categoryId,
  categoryLabel,
}: {
  categoryId: string;
  categoryLabel: string;
}) {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setLoading(true);
    try {
      // TODO: جایگزین با API واقعی
      // await fetch("/api/requests", { method: "POST", body: JSON.stringify({ categoryId, ...data }) });
      data.phone = toEnglishDigits(String(data.phone ?? ""));
      console.log({ categoryId, ...data });
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
        <CheckCircle2 className="mx-auto text-primary" size={36} />
        <h3 className="mt-3 font-bold text-foreground">درخواستتان ثبت شد</h3>
        <p className="mt-2 text-sm leading-7 text-foreground/60">
          به‌زودی متخصصان {categoryLabel} با شما تماس می‌گیرند.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-3 rounded-2xl border border-foreground/10 bg-card p-5 shadow-lg shadow-foreground/[0.04]"
    >
      <h3 className="text-base font-bold text-foreground">
        درخواست خدمات {categoryLabel}
      </h3>
      <p className="text-xs leading-6 text-foreground/55">
        نیازتان را بنویسید تا متخصصان پیشنهاد بدهند.
      </p>

      <input
        name="name"
        required
        placeholder="نام و نام خانوادگی"
        className={`${field} h-11`}
      />
      <Input
        name="phone"
        type="tel"
        required
        inputMode="tel"
        dir="ltr"
        placeholder="۰۹۱۲۳۴۵۶۷۸۹"
        className={`${field} h-11 text-start`}
      />
      <input
        name="city"
        required
        placeholder="شهر"
        className={`${field} h-11`}
      />
      <textarea
        name="description"
        required
        rows={4}
        placeholder="جزئیات کار را توضیح دهید…"
        className={`${field} py-3 leading-7`}
      />

      <button
        type="submit"
        disabled={loading}
        className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        {loading ? "در حال ارسال…" : "ثبت درخواست"}
      </button>
    </form>
  );
}
