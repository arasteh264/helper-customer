import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, BriefcaseBusiness, MapPin, Star } from "lucide-react";

import type { Specialist } from "../types/types";

const fa = new Intl.NumberFormat("fa-IR");
const faRating = new Intl.NumberFormat("fa-IR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function SpecialistCard({ specialist }: { specialist: Specialist }) {
  const {
    id,
    name,
    field,
    rating,
    reviews,
    jobs,
    city,
    startingPrice,
    verified,
    image,
    available,
    distanceKm,
  } = specialist;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-foreground/[0.08] bg-card shadow-sm shadow-foreground/[0.035] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lg hover:shadow-primary/[0.08]">
      <div className="relative h-2 shrink-0 bg-gradient-to-l from-primary via-primary/70 to-amber-300/80" />

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative size-[4.25rem] shrink-0 rounded-2xl bg-secondary p-1 ring-1 ring-foreground/[0.06]">
            <span className="relative flex size-full items-center justify-center overflow-hidden rounded-[0.9rem] bg-gradient-to-br from-primary/10 to-amber-500/15 text-2xl font-bold text-primary">
              {image ? (
                <Image
                  src={image}
                  alt={name}
                  fill
                  sizes="68px"
                  className="object-cover"
                />
              ) : (
                name.charAt(0)
              )}
            </span>
            {verified && (
              <span
                className="absolute -bottom-1 -left-1 flex size-6 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground"
                aria-label="متخصص تأییدشده"
              >
                <BadgeCheck size={14} aria-hidden="true" />
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-1.5">
              <h3 className="truncate text-[15px] font-extrabold text-foreground sm:text-base">
                {name}
              </h3>
            </div>
            <p className="mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-foreground/60 sm:text-sm">
              {field}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex min-h-8 items-center gap-1.5 rounded-lg bg-amber-500/10 px-2.5 text-xs font-bold text-foreground">
            <Star
              size={14}
              className="fill-amber-500 text-amber-500"
              aria-hidden="true"
            />
            {faRating.format(rating)}
            {reviews > 0 && (
              <span className="font-normal text-foreground/55">
                ({fa.format(reviews)} نظر)
              </span>
            )}
          </span>
          {jobs > 0 && (
            <span className="inline-flex min-h-8 items-center gap-1.5 rounded-lg bg-secondary px-2.5 text-xs font-medium text-foreground/70">
              <BriefcaseBusiness
                size={13}
                className="text-primary"
                aria-hidden="true"
              />
              {fa.format(jobs)} کار
            </span>
          )}
        </div>

        <div className="mt-3 flex min-w-0 items-center gap-1.5 text-xs text-foreground/55">
          <MapPin size={14} className="shrink-0 text-primary" aria-hidden="true" />
          <span className="truncate">
            {distanceKm != null ? `${fa.format(distanceKm)} کیلومتر` : city}
          </span>
          {available && (
            <>
              <span className="mx-0.5 size-1 shrink-0 rounded-full bg-foreground/25" />
              <span className="inline-flex shrink-0 items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-300">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                آماده‌به‌کار
              </span>
            </>
          )}
        </div>

        <div className="mt-auto pt-4">
          <div className="mb-3 flex min-h-8 items-center justify-between gap-2 border-t border-foreground/[0.07] pt-3">
            <span className="text-[11px] text-foreground/50">هزینه‌ی خدمات</span>
            {startingPrice > 0 ? (
              <span className="text-xs font-bold text-foreground">
                از {fa.format(startingPrice)} تومان
              </span>
            ) : (
              <span className="text-[11px] font-medium text-foreground/65">
                توافق پس از بررسی درخواست
              </span>
            )}
          </div>
          <Link
            href={`/specialists/${id}`}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            دیدن پروفایل
            <ArrowLeft
              size={16}
              aria-hidden="true"
              className="transition-transform group-hover:-translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
