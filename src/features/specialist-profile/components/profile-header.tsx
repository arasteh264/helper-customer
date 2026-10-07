import { BadgeCheck, Briefcase, MapPin, ShieldCheck, Star } from "lucide-react";

import type { SpecialistProfile } from "../types/specialist-profile.types";
import { formatDate, formatNumber } from "@/src/utils/format";

export function ProfileHeader({ profile }: { profile: SpecialistProfile }) {
  return (
    <section className="overflow-hidden rounded-3xl border border-foreground/10 bg-card shadow-sm">
      <div className="relative h-28 bg-gradient-to-l from-primary/20 via-primary/10 to-amber-500/10 sm:h-36">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent"
        />
        <span className="absolute bottom-4 right-5 inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-background/85 px-3 py-1.5 text-xs font-medium text-primary shadow-sm backdrop-blur">
          <ShieldCheck size={14} aria-hidden="true" />
          پروفایل متخصص هلپر
        </span>
      </div>

      <div className="px-5 pb-5 sm:px-8 sm:pb-7">
        <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:gap-5">
          {profile.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar}
              alt={`تصویر ${profile.name}`}
              className="h-24 w-24 shrink-0 rounded-3xl border-4 border-card bg-card object-cover shadow-lg sm:h-28 sm:w-28"
            />
          ) : (
            <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border-4 border-card bg-primary/10 text-3xl font-bold text-primary shadow-lg sm:h-28 sm:w-28">
              {profile.name.charAt(0)}
            </span>
          )}

          <div className="min-w-0 flex-1 pb-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-extrabold text-foreground sm:text-2xl">
                {profile.name}
              </h1>
              {profile.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  <BadgeCheck size={14} aria-hidden="true" />
                  هویت تأییدشده
                </span>
              )}
            </div>
            <p className="mt-1.5 text-sm leading-6 text-foreground/60 sm:text-base">
              {profile.headline}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {profile.reviewsCount > 0 ? (
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/10 px-3 py-2 text-sm font-semibold text-foreground">
              <Star
                size={16}
                className="fill-amber-500 text-amber-500"
                aria-hidden="true"
              />
              {profile.rating.toFixed(1)}
              <span className="text-xs font-normal text-foreground/55">
                ({formatNumber(profile.reviewsCount)} نظر)
              </span>
            </span>
          ) : (
            <span className="rounded-xl bg-foreground/[0.045] px-3 py-2 text-xs text-foreground/55">
              هنوز امتیازی ثبت نشده
            </span>
          )}
          {profile.city ? (
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-foreground/[0.045] px-3 py-2 text-xs text-foreground/65">
              <MapPin size={15} className="text-primary" aria-hidden="true" />
              {profile.city}
            </span>
          ) : null}
          {profile.completedJobs > 0 ? (
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-foreground/[0.045] px-3 py-2 text-xs text-foreground/65">
              <Briefcase
                size={15}
                className="text-primary"
                aria-hidden="true"
              />
              {formatNumber(profile.completedJobs)} کار تکمیل‌شده
            </span>
          ) : null}
          {profile.experienceYears > 0 ? (
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-foreground/[0.045] px-3 py-2 text-xs text-foreground/65">
              <Briefcase
                size={15}
                className="text-primary"
                aria-hidden="true"
              />
              {formatNumber(profile.experienceYears)} سال سابقه
            </span>
          ) : null}
        </div>

        <p className="mt-4 border-t border-foreground/[0.07] pt-4 text-xs text-foreground/50">
          عضویت در هلپر از {formatDate(profile.memberSince)}
        </p>
      </div>
    </section>
  );
}
