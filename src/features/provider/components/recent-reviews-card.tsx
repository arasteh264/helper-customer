import { Star } from "lucide-react";


import { formatDate } from "../utils/format";
import { Review } from "../types/types";
import { SectionCard } from "@/src/components/shared/section-card";

export function RecentReviewsCard({ reviews }: { reviews: Review[] }) {
  return (
    <SectionCard
      title="آخرین نظرات مشتریان"
      description="بازخوردهایی که اخیراً دریافت کرده‌اید"
    >
      <ul className="divide-y divide-foreground/10">
        {reviews.map((r) => (
          <li key={r.id} className="py-4 first:pt-0 last:pb-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {r.customerName.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {r.customerName}
                  </p>
                  <p className="text-xs text-foreground/50">
                    {r.service} · {formatDate(r.date)}
                  </p>
                </div>
              </div>
              <div
                className="flex items-center gap-0.5"
                role="img"
                aria-label={`امتیاز ${r.rating} از ۵`}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < r.rating
                        ? "fill-amber-500 text-amber-500"
                        : "text-foreground/20"
                    }
                  />
                ))}
              </div>
            </div>
            <p className="mt-3 text-sm leading-7 text-foreground/75">{r.text}</p>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}