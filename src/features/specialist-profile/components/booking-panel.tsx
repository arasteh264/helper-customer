import Link from "next/link";
import { BadgeCheck, MapPin, ShieldCheck } from "lucide-react";
import type { SpecialistProfile } from "../types/specialist-profile.types";

export function BookingPanel({ profile }: { profile: SpecialistProfile }) {
  const params = new URLSearchParams({ specialistId: profile.id });
  if (profile.specialties?.[0]?.id) {
    params.set("specialtyId", profile.specialties[0].id);
  }
  const requestHref = `/request?${params.toString()}`;

  return (
    <>
      <aside className="hidden lg:block">
        <div className="sticky top-24 overflow-hidden rounded-3xl border border-foreground/10 bg-card shadow-sm">
          <div className="bg-gradient-to-l from-primary/10 to-primary/[0.03] p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <BadgeCheck size={18} className="text-primary" aria-hidden="true" />
              شروع همکاری با متخصص
            </div>
            <p className="mt-2 text-xs leading-6 text-foreground/60">
              درخواست را با تخصص {profile.specialties?.[0]?.name ?? profile.headline}
              برای {profile.name} ثبت کنید.
            </p>
          </div>
          <div className="p-5">
            <Link
              href={requestHref}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-primary px-3 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              ثبت درخواست برای این متخصص
            </Link>
            <div className="mt-4 space-y-3 border-t border-foreground/[0.07] pt-4">
              <p className="flex items-start gap-2 text-xs leading-6 text-foreground/55">
                <MapPin size={15} className="mt-0.5 shrink-0 text-primary" />
                {profile.city}
              </p>
              <p className="flex items-start gap-2 text-xs leading-6 text-foreground/55">
                <ShieldCheck size={15} className="mt-0.5 shrink-0 text-primary" />
                نشانی دقیق فقط برای انجام درخواست در اختیار متخصص منتخب قرار
                می‌گیرد.
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-foreground/10 bg-background/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur-xl lg:hidden">
        <Link
          href={requestHref}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-primary px-3 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          ثبت درخواست برای {profile.name.split(" ")[0]}
        </Link>
      </div>
    </>
  );
}
