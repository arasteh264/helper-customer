import { BadgeCheck, MapPin } from "lucide-react";

import type { SpecialistProfile } from "../types/specialist-profile.types";

export function ProfileAbout({ profile }: { profile: SpecialistProfile }) {
  return (
    <section className="rounded-3xl border border-foreground/10 bg-card p-5 shadow-sm sm:p-7">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <BadgeCheck size={20} aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-base font-bold text-foreground">
            درباره‌ی {profile.name}
          </h2>
          <p className="mt-0.5 text-xs text-foreground/50">
            معرفی و خدمات متخصص
          </p>
        </div>
      </div>
      <p className="mt-5 whitespace-pre-line text-sm leading-8 text-foreground/70">
        {profile.bio}
      </p>

      {profile.skills.length > 0 ? (
        <div className="mt-6 border-t border-foreground/[0.07] pt-5">
          <p className="mb-3 text-sm font-semibold text-foreground">
            تخصص‌ها و مهارت‌ها
          </p>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-xl border border-primary/10 bg-primary/[0.06] px-3 py-2 text-xs font-medium text-primary"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {profile.serviceAreas.length > 0 ? (
        <div className="mt-6 border-t border-foreground/[0.07] pt-5">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <MapPin size={16} className="text-primary" aria-hidden="true" />
            محدوده‌ی خدمت‌رسانی
          </p>
          <div className="flex flex-wrap gap-2">
            {profile.serviceAreas.map((area) => (
              <span
                key={area}
                className="rounded-xl border border-foreground/10 bg-foreground/[0.025] px-3 py-2 text-xs text-foreground/65"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}