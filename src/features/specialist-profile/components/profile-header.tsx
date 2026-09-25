import { BadgeCheck, Briefcase, MapPin, Star, Zap } from "lucide-react";

import type { SpecialistProfile } from "../types/specialist-profile.types";
import { formatDate, formatNumber } from "@/src/utils/format";

export function ProfileHeader({ profile }: { profile: SpecialistProfile }) {
  return (
    <div className="rounded-2xl border border-foreground/10 bg-card p-5 sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        {profile.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatar}
            alt=""
            className="h-20 w-20 shrink-0 rounded-full object-cover sm:h-24 sm:w-24"
          />
        ) : (
          <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary sm:h-24 sm:w-24">
            {profile.name.charAt(0)}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-foreground sm:text-2xl">{profile.name}</h1>
            {profile.verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                <BadgeCheck size={14} />
                تأییدشده
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-foreground/60 sm:text-base">{profile.headline}</p>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-foreground/60">
            <span className="flex items-center gap-1 font-medium text-foreground">
              <Star size={15} className="fill-amber-500 text-amber-500" />
              {profile.rating}
              <span className="font-normal text-foreground/50">
                ({formatNumber(profile.reviewsCount)} نظر)
              </span>
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {profile.city}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase size={14} />
              {formatNumber(profile.experienceYears)} سال سابقه
            </span>
          </div>
        </div>
      </div>

      {/* آمار سریع */}
      <div className="mt-6 grid grid-cols-3 gap-3 border-t border-foreground/10 pt-5">
        <div className="text-center">
          <p className="text-lg font-bold text-foreground">{formatNumber(profile.completedJobs)}</p>
          <p className="mt-0.5 text-xs text-foreground/50">کار تکمیل‌شده</p>
        </div>
        <div className="text-center">
          <p className="flex items-center justify-center gap-1 text-lg font-bold text-foreground">
            <Zap size={15} className="text-primary" />
            {formatNumber(profile.responseRate)}٪
          </p>
          <p className="mt-0.5 text-xs text-foreground/50">نرخ پاسخ‌گویی</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-foreground">{formatDate(profile.memberSince)}</p>
          <p className="mt-0.5 text-xs text-foreground/50">تاریخ عضویت</p>
        </div>
      </div>
    </div>
  );
}