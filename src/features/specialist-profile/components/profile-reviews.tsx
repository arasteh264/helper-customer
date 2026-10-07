import { Star } from "lucide-react";

import type { ProfileReview } from "../types/specialist-profile.types";
import { formatDate, formatNumber } from "@/src/utils/format";

export function ProfileReviews({
  reviews,
  rating,
  reviewsCount,
}: {
  reviews: ProfileReview[];
  rating: number;
  reviewsCount: number;
}) {
  return (
    <section className="rounded-3xl border border-foreground/10 bg-card p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-foreground">نظر مشتریان</h2>
          <p className="mt-1 text-xs text-foreground/50">
            بازخوردهای ثبت‌شده پس از انجام کار
          </p>
        </div>
        {reviewsCount > 0 ? (
          <span className="flex items-center gap-1 text-sm font-medium text-foreground">
            <Star size={15} className="fill-amber-500 text-amber-500" />
            {rating.toFixed(1)}
            <span className="font-normal text-foreground/50">
              ({formatNumber(reviewsCount)})
            </span>
          </span>
        ) : (
          <span className="text-xs font-normal text-foreground/50">
            بدون امتیاز
          </span>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="mt-5 rounded-2xl border border-dashed border-foreground/10 bg-foreground/[0.025] px-4 py-9 text-center text-sm leading-7 text-foreground/55">
          هنوز نظری برای این متخصص ثبت نشده است.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-foreground/10">
          {reviews.map((r) => (
            <li key={r.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {r.customerName.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{r.customerName}</p>
                    <p className="text-xs text-foreground/50">{formatDate(r.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5" role="img" aria-label={`امتیاز ${r.rating} از ۵`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={i < r.rating ? "fill-amber-500 text-amber-500" : "text-foreground/20"}
                    />
                  ))}
                </div>
              </div>
              {r.text ? (
                <p className="mt-2.5 text-sm leading-7 text-foreground/75">{r.text}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}