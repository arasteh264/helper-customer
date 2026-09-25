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
    <div className="rounded-2xl border border-foreground/10 bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">نظرات مشتریان</h2>
        <span className="flex items-center gap-1 text-sm font-medium text-foreground">
          <Star size={15} className="fill-amber-500 text-amber-500" />
          {rating}
          <span className="font-normal text-foreground/50">
            ({formatNumber(reviewsCount)})
          </span>
        </span>
      </div>

      {reviews.length === 0 ? (
        <p className="mt-6 rounded-xl bg-foreground/[0.03] px-4 py-8 text-center text-sm text-foreground/55">
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
              <p className="mt-2.5 text-sm leading-7 text-foreground/75">{r.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}