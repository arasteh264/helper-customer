"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Star } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { ApiError, ApiErrorCode } from "@/src/lib/api/error";
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
  const router = useRouter();
  const [submittedRating, setSubmittedRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState(0);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReviewValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, text: "" },
  });

  const rating = useWatch({ control, name: "rating" });
  const reviewText = useWatch({ control, name: "text" });

  const onSubmit = async (values: ReviewValues) => {
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        toast.error("نشست شما منقضی شده؛ دوباره وارد شوید.");
        return;
      }
      await customerApi.submitReview(requestId, values, session.accessToken);
      setSubmittedRating(values.rating);
      toast.success("نظر شما ثبت شد. ممنون از وقتی که گذاشتید");
      onSubmitted?.();
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        const message =
          error.code === ApiErrorCode.CONFLICT
            ? "برای این درخواست قبلاً نظر ثبت شده است."
            : error.message;
        toast.error(message);
      } else {
        toast.error("ثبت نظر انجام نشد. دوباره تلاش کنید.");
      }
    }
  };

  if (submittedRating !== null) {
    return (
      <div
        className="rounded-xl border border-primary/15 bg-primary/5 p-4"
        role="status"
      >
        <p className="font-medium text-foreground">نظر شما ثبت شد.</p>
        <div
          className="mt-2 flex items-center gap-1"
          role="img"
          aria-label={`امتیاز ثبت‌شده: ${submittedRating} از ۵`}
        >
          {Array.from({ length: 5 }, (_, index) => (
            <Star
              key={index}
              size={18}
              aria-hidden="true"
              className={
                index < submittedRating
                  ? "fill-amber-500 text-amber-500"
                  : "text-foreground/20"
              }
            />
          ))}
          <span className="ms-2 text-sm text-foreground/65">
            {submittedRating} از ۵
          </span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <p className="text-sm text-foreground/70">
          تجربه‌ی همکاری‌تان با{" "}
          <span className="font-medium text-foreground">{specialistName}</span>{" "}
          چطور بود؟
        </p>

        <Controller
          control={control}
          name="rating"
          render={({ field }) => (
            <fieldset
              className="mt-3"
              aria-invalid={!!errors.rating}
              aria-describedby={
                errors.rating ? "review-rating-error" : undefined
              }
            >
              <legend className="sr-only">امتیاز از یک تا پنج ستاره</legend>
              <div
                className="flex items-center gap-1"
                onMouseLeave={() => setHoveredRating(0)}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <label
                    key={n}
                    className="group relative flex cursor-pointer rounded p-1 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary"
                    onMouseEnter={() => setHoveredRating(n)}
                  >
                    <input
                      type="radio"
                      name={field.name}
                      value={n}
                      checked={field.value === n}
                      onChange={() => field.onChange(n)}
                      onBlur={field.onBlur}
                      ref={n === 1 ? field.ref : undefined}
                      disabled={isSubmitting}
                      aria-label={`${n} ستاره`}
                      className="sr-only"
                    />
                    <Star
                      size={28}
                      aria-hidden="true"
                      className={
                        n <= (hoveredRating || rating || 0)
                          ? "fill-amber-500 text-amber-500"
                          : "text-foreground/20"
                      }
                    />
                  </label>
                ))}
              </div>
              <p className="mt-1 text-xs text-foreground/55" aria-live="polite">
                {rating && rating > 0
                  ? `${rating} از ۵ ستاره`
                  : "برای ثبت نظر، امتیاز دهید"}
              </p>
            </fieldset>
          )}
        />
        {errors.rating && (
          <p
            id="review-rating-error"
            className="mt-1 text-xs text-destructive"
            role="alert"
          >
            {errors.rating.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="review-text" className="sr-only">
          توضیحات نظر
        </label>
        <textarea
          id="review-text"
          rows={3}
          maxLength={500}
          disabled={isSubmitting}
          placeholder="نظرتان را بنویسید (اختیاری)"
          aria-invalid={!!errors.text}
          aria-describedby={
            errors.text
              ? "review-text-error review-text-count"
              : "review-text-count"
          }
          className="w-full resize-y rounded-xl border border-foreground/15 bg-background px-3.5 py-3 text-sm leading-7 outline-none transition-colors placeholder:text-foreground/40 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
          {...register("text")}
        />
        <p
          id="review-text-count"
          className="mt-1 text-xs text-foreground/50"
        >
          {`${reviewText?.length ?? 0} از ۵۰۰ نویسه`}
        </p>
        {errors.text && (
          <p
            id="review-text-error"
            className="mt-1 text-xs text-destructive"
            role="alert"
          >
            {errors.text.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="gap-1.5">
        {isSubmitting && <Loader2 size={16} className="animate-spin" />}
        {isSubmitting ? "در حال ثبت…" : "ثبت امتیاز و نظر"}
      </Button>
    </form>
  );
}
