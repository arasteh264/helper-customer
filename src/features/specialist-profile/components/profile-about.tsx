import { MapPin } from "lucide-react";

import type { SpecialistProfile } from "../types/specialist-profile.types";

export function ProfileAbout({ profile }: { profile: SpecialistProfile }) {
  return (
    <div className="rounded-2xl border border-foreground/10 bg-card p-5 sm:p-6">
      <h2 className="text-base font-semibold text-foreground">درباره‌ی {profile.name}</h2>
      <p className="mt-3 text-sm leading-7 text-foreground/70">{profile.bio}</p>

      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold text-foreground/50">تخصص‌ها</p>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-foreground/50">
          <MapPin size={13} />
          محدوده‌ی خدمت‌رسانی
        </p>
        <div className="flex flex-wrap gap-2">
          {profile.serviceAreas.map((area) => (
            <span
              key={area}
              className="rounded-full border border-foreground/15 px-3 py-1.5 text-xs text-foreground/65"
            >
              {area}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}