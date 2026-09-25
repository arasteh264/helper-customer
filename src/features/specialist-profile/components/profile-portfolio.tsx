import { ImageOff } from "lucide-react";

import type { SpecialistProfile } from "../types/specialist-profile.types";

export function ProfilePortfolio({ profile }: { profile: SpecialistProfile }) {
  if (profile.portfolioTints.length === 0) {
    return (
      <div className="rounded-2xl border border-foreground/10 bg-card p-5 sm:p-6">
        <h2 className="text-base font-semibold text-foreground">نمونه‌کارها</h2>
        <div className="mt-4 flex flex-col items-center gap-2 rounded-xl bg-foreground/[0.03] py-10 text-center">
          <ImageOff size={22} className="text-foreground/30" />
          <p className="text-xs text-foreground/50">هنوز نمونه‌کاری اضافه نشده است.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-foreground/10 bg-card p-5 sm:p-6">
      <h2 className="text-base font-semibold text-foreground">نمونه‌کارها</h2>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {profile.portfolioTints.map((tint, i) => (
          <li
            key={i}
            className={`aspect-square rounded-xl bg-gradient-to-br ${tint}`}
            aria-hidden
          />
        ))}
      </ul>
    </div>
  );
}