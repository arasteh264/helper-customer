"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Star } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { customerApi } from "../api/customer.api";
import { reviewSchema, type ReviewValues } from "../schemas/review.schema";

export function ReviewForm({
  requestId,
  specialistName,
  onSubmitted,
}: {
  requestId: string;
  specialistName: string;
  onSubmitted?: () => void;
}) {
  const [hovered, setHovered] = useState(0);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReviewValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, text: "" },
  });

  const rating = watch("rating");

  const onSubmit = async (values: ReviewValues) => {
    try {
      await customerApi.submitReview(requestId, values);
      toast.success("نظر شما ثبت شد. ممنون از وقتی که گذاشتید 🙏");
      onSubmitted?.();
    } catch {
      toast.error("ثبت نظر انجام نشد. دوباره تلاش کنید.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <p className="text-sm text-foreground/70">
          تجربه‌ی همکاری‌تان با <span className="font-medium text-foreground">{specialistName}</span> چطور بود؟
        </p>

        <Controller
          control={control}
          name="rating"
          render={({ field }) => (
            <div
              className="mt-3 flex items-center gap-1"
              role="radiogroup"
              aria-label="امتیاز"
              onMouseLeave={() => setHovered(0)}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={field.value === n}
                  aria-label={`${n} ستاره`}
                  onMouseEnter={() => setHovered(n)}
                  onClick={() => field.onChange(n)}
                  className="rounded p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Star
                    size={28}
                    className={
                      n <= (hovered || rating)
                        ? "fill-amber-500 text-amber-500"
                        : "text-foreground/20"
                    }
                  />
                </button>
              ))}
            </div>
          )}
        />
        {errors.rating && (
          <p className="mt-1 text-xs text-destructive">{errors.rating.message}</p>
        )}
      </div>

      <div>
        <textarea
          rows={3}
          placeholder="نظرتان را بنویسید (اختیاری)"
          aria-invalid={!!errors.text}
          className="w-full resize-y rounded-xl border border-foreground/15 bg-background px-3.5 py-3 text-sm leading-7 outline-none transition-colors placeholder:text-foreground/40 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
          {...register("text")}
        />
        {errors.text && (
          <p className="mt-1 text-xs text-destructive">{errors.text.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="gap-1.5">
        {isSubmitting && <Loader2 size={16} className="animate-spin" />}
        ثبت نظر
      </Button>
    </form>
  );
}