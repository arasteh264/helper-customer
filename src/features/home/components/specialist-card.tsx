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
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 78vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
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

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-semibold text-foreground">{name}</h3>
        <p className="mt-0.5 text-sm text-foreground/60">{field}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground/60">
          <span className="flex items-center gap-1 font-medium text-foreground">
            <Star size={14} className="fill-amber-500 text-amber-500" />
            {faRating.format(rating)}
            {reviews > 0 && (
              <span className="font-normal text-foreground/50">
                ({fa.format(reviews)})
              </span>
            )}
          </span>
          {jobs > 0 && <span>{fa.format(jobs)} پروژه</span>}
          <span className="flex items-center gap-1">
            <MapPin size={13} />
            {distanceKm != null ? `${fa.format(distanceKm)} کیلومتر` : city}
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-foreground/5 pt-4">
          <div>
            <p className="text-[11px] text-foreground/50">هزینه</p>
            <p className="text-sm font-semibold text-foreground">
              {startingPrice > 0 ? (
                <>
                  {fa.format(startingPrice)}{" "}
                  <span className="text-xs font-normal text-foreground/60">
                    تومان به بالا
                  </span>
                </>
              ) : (
                "پس از بررسی درخواست"
              )}
            </p>
          </div>

          <Link
            href={`/specialists/${id}`}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            مشاهده پروفایل
          </Link>
        </div>
      </div>
    </article>
  );
}
