import Link from "next/link";
import { BadgeCheck, MapPin, ShieldCheck } from "lucide-react";
import type { SpecialistProfile } from "../types/specialist-profile.types";

export function BookingPanel({ profile }: { profile: SpecialistProfile }) {
  const params = new URLSearchParams({ specialistId: profile.id });
  if (profile.skills[0]) params.set("skillName", profile.skills[0]);
  const requestHref = `/request?${params.toString()}`;

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 rounded-2xl border border-foreground/10 bg-card p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <BadgeCheck size={17} className="text-primary" />
          متخصص تأییدشده
        </div>
        <p className="mt-3 text-sm leading-6 text-foreground/60">
          درخواست خدمت را مستقیماً برای {profile.name.split(" ")[0]} بفرستید. پس
          از پذیرش، اطلاعات تماس برای هماهنگی نمایش داده می‌شود.
        </p>
        <Link
          href={requestHref}
          className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-primary px-3 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          درخواست خدمت از این متخصص
        </Link>
        <p className="mt-4 flex items-start gap-2 text-xs leading-6 text-foreground/50">
          <MapPin size={15} className="mt-0.5 shrink-0 text-primary" />
          {profile.city}
        </p>
        <p className="mt-3 flex items-start gap-2 text-xs leading-6 text-foreground/50">
          <ShieldCheck size={15} className="mt-0.5 shrink-0 text-primary" />
          نشانی و موقعیت دقیق شما فقط پس از ارسال درخواست در اختیار متخصص منتخب
          قرار می‌گیرد.
        </p>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-foreground/10 bg-background/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden">
        <Link
          href={requestHref}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-primary px-3 text-center text-sm font-medium text-primary-foreground"
        >
          درخواست خدمت از {profile.name.split(" ")[0]}
        </Link>
      </div>
    </aside>
  );
}
