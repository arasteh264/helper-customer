import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, MapPin, Star } from "lucide-react";

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
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-card transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-foreground/[0.07]">
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 sm:h-56">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 78vw"
            className="object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-card text-3xl font-bold text-primary shadow-lg shadow-primary/10">
              {name.charAt(0)}
            </span>
          </span>
        )}

        {verified && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-medium text-primary backdrop-blur">
            <BadgeCheck size={14} />
            تأییدشده
          </span>
        )}
        {available && (
          <span className="absolute bottom-3 right-3 rounded-full bg-green-700/90 px-2.5 py-1 text-[11px] font-medium text-white">
            آماده‌ی پذیرش کار
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-base font-bold text-foreground">{name}</h3>
        <p className="mt-1 line-clamp-2 min-h-10 text-sm leading-6 text-foreground/60">
          {field}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-foreground/60">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1.5 font-semibold text-foreground">
            <Star size={14} className="fill-amber-500 text-amber-500" aria-hidden="true" />
            {faRating.format(rating)}
            {reviews > 0 && (
              <span className="font-normal text-foreground/55">
                ({fa.format(reviews)})
              </span>
            )}
          </span>
          {jobs > 0 && (
            <span className="rounded-full bg-foreground/[0.045] px-2.5 py-1.5">
              {fa.format(jobs)} کار
            </span>
          )}
          <span className="inline-flex min-w-0 items-center gap-1 rounded-full bg-foreground/[0.045] px-2.5 py-1.5">
            <MapPin size={13} className="shrink-0" aria-hidden="true" />
            {distanceKm != null ? `${fa.format(distanceKm)} کیلومتر` : city}
          </span>
        </div>

        <div className="mt-auto pt-5">
          <p className="mb-3 border-t border-foreground/10 pt-3 text-xs leading-5 text-foreground/55">
            {startingPrice > 0 ? (
              <>
                از{" "}
                <span className="font-bold text-foreground">
                  {fa.format(startingPrice)} تومان
                </span>
              </>
            ) : (
              "هزینه پس از بررسی جزئیات درخواست مشخص می‌شود"
            )}
          </p>
          <Link
            href={`/specialists/${id}`}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            مشاهده‌ی پروفایل متخصص
            <span aria-hidden="true">←</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
