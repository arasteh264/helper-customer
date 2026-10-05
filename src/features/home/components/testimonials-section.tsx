import Link from "next/link";
import { ArrowLeft, BadgeCheck, Star } from "lucide-react";

import { Container } from "@/src/components/shared/container";
import { SectionHeading } from "@/src/components/shared/section-heading";
import { publicProvidersApi } from "@/src/features/catalog/api/providers.api";

export async function TestimonialsSection() {
  let reviews: {
    id: string;
    providerId: string;
    providerName: string;
    customerName: string;
    rating: number;
    text: string;
    service: string;
  }[] = [];
  let hasError = false;

  try {
    const page = await publicProvidersApi.listPage(1, 16);
    reviews = page.items
      .flatMap((provider) =>
        provider.reviews.map((review) => ({
          ...review,
          providerId: provider.id,
          providerName: provider.name,
        })),
      )
      .filter((review) => review.text.trim().length > 0)
      .slice(0, 3);
  } catch {
    hasError = true;
  }

  return (
    <section
      id="testimonials"
      className="scroll-mt-20 bg-[#f7f5ef] py-16 dark:bg-foreground/[0.025] sm:py-24"
    >
      <Container>
        <SectionHeading
          align="center"
          eyebrow="تجربه‌ی مشتریان"
          title="نظرها را از خود مشتری‌ها بخوانید"
          description="پیش از انتخاب، تجربه‌ی کسانی را ببینید که با این متخصص کار کرده‌اند."
        />

        {reviews.length > 0 ? (
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {reviews.map((review) => (
              <li key={review.id}>
                <article className="flex h-full flex-col rounded-2xl border border-foreground/[0.07] bg-card p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className="flex items-center gap-1.5 text-sm font-semibold text-foreground"
                      aria-label={`امتیاز ${review.rating} از ۵`}
                    >
                      <Star
                        size={16}
                        className="fill-[#d99c5c] text-[#d99c5c]"
                        aria-hidden="true"
                      />
                      {new Intl.NumberFormat("fa-IR").format(review.rating)}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/8 px-2.5 py-1 text-[11px] font-medium text-primary">
                      <BadgeCheck size={13} aria-hidden="true" />
                      نظر ثبت‌شده
                    </span>
                  </div>

                  <p className="mt-4 flex-1 text-sm leading-8 text-foreground/75">
                    «{review.text}»
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-foreground/[0.07] pt-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {review.customerName}
                      </p>
                      <p className="mt-1 truncate text-xs text-foreground/50">
                        {review.service} · برای {review.providerName}
                      </p>
                    </div>
                    <Link
                      href={`/specialists/${review.providerId}`}
                      aria-label={`دیدن پروفایل ${review.providerName}`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-foreground/10 text-foreground/60 transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <ArrowLeft size={16} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <p
            className="mx-auto mt-10 max-w-xl rounded-2xl border border-foreground/[0.07] bg-card px-6 py-8 text-center text-sm leading-7 text-foreground/60"
            role={hasError ? "status" : undefined}
          >
            {hasError
              ? "دریافت نظرها فعلاً ممکن نشد. می‌توانید نظرهای ثبت‌شده را در پروفایل متخصص‌ها ببینید."
              : "هنوز نظری برای نمایش نداریم. با ثبت تجربه‌ی خودتان، به دیگران در انتخاب کمک کنید."}
          </p>
        )}
      </Container>
    </section>
  );
}
