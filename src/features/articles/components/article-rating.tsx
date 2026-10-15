"use client";

import { useState } from "react";
import { Star } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { ApiError } from "@/src/lib/api/error";
import { publicProviderArticlesApi } from "../api/provider-articles.api";

export function ArticleRating({
  articleId,
  accessToken,
  canRate,
  average,
  count,
}: {
  articleId: string;
  accessToken?: string;
  canRate: boolean;
  average: number | null;
  count: number;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit() {
    if (!accessToken || !rating) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await publicProviderArticlesApi.rate(articleId, rating, accessToken, comment);
      setMessage("از ثبت امتیاز شما سپاسگزاریم.");
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "ثبت امتیاز انجام نشد.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-10 rounded-2xl border border-foreground/10 bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold">امتیاز خوانندگان</h2>
        <p className="flex items-center gap-1.5 text-sm text-foreground/60">
          <Star size={16} className="text-amber-500" />
          {average ? average.toFixed(1) : "هنوز امتیازی ثبت نشده"}{count ? ` · ${count} امتیاز` : ""}
        </p>
      </div>
      {canRate ? (
        <div className="mt-4 space-y-3">
          <div className="flex gap-1" role="radiogroup" aria-label="انتخاب امتیاز مقاله">
            {[1, 2, 3, 4, 5].map((value) => (
              <button key={value} type="button" role="radio" aria-checked={rating === value} aria-label={`${value} از ۵`} onClick={() => setRating(value)} className="flex h-11 w-11 items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <Star size={22} className={value <= rating ? "fill-amber-400 text-amber-500" : "text-foreground/30"} />
              </button>
            ))}
          </div>
          <label className="grid gap-1.5 text-sm">
            نظر کوتاه (اختیاری)
            <textarea value={comment} onChange={(event) => setComment(event.target.value)} maxLength={2000} rows={3} className="rounded-lg border border-foreground/15 bg-background p-3 leading-6" />
          </label>
          <Button type="button" disabled={!rating || busy || Boolean(message)} onClick={() => void submit()}>
            ثبت امتیاز
          </Button>
        </div>
      ) : (
        <p className="mt-3 text-sm leading-6 text-foreground/60">
          برای امتیازدهی به مقاله با حساب مشتری وارد شوید.
        </p>
      )}
      {message ? <p className="mt-3 text-sm text-emerald-700" role="status">{message}</p> : null}
      {error ? <p className="mt-3 text-sm text-destructive" role="alert">{error}</p> : null}
    </section>
  );
}
