import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  BadgeCheck,
  Bell,
  BriefcaseBusiness,
  Clock3,
  FileCheck2,
  House,
  MapPinned,
  UserRound,
} from "lucide-react";

import { auth } from "@/src/auth";
import { providerApi } from "@/src/features/provider/api/provider.api";
import { getProfileCompletion } from "@/src/features/provider/lib/completion";
import { ProfileCompletionCard } from "@/src/features/provider/components/profile-completion-card";
import { VerificationSection } from "@/src/features/provider/components/basicInformation/verification-section";
import { ProfileForm } from "@/src/features/provider/components/basicInformation/profile-form";
import { ServiceAreaEditor } from "@/src/features/provider/components/basicInformation/service-area-editor";
import { ProviderAddressEditor } from "@/src/features/provider/components/basicInformation/provider-address-editor";
import { PageHeader } from "@/src/components/shared/page-header";
import { NotificationPreferencesPanel } from "@/src/features/notifications/components/notification-preferences-panel";
import { notificationPreferencesApi } from "@/src/features/notifications/api/notification-preferences.api";
import { SkillsSection } from "@/src/features/provider/components/basicInformation/skills-section";
import { PortfolioUploader } from "@/src/features/provider/components/Portfolio/portfolio-uploader";
import type { VerificationDoc } from "@/src/features/provider/types/provider.types";

export const metadata: Metadata = { title: "پروفایل | پنل متخصص" };

export default async function ProviderProfilePage() {
  const session = await auth();
  if (!session?.accessToken) redirect("/login");

  const [provider, notificationPreferences] = await Promise.all([
    providerApi.getProfile(session.accessToken),
    notificationPreferencesApi.get(session.accessToken).catch(() => null),
  ]);
  const { percent, items } = getProfileCompletion(provider, []);
  const docs: VerificationDoc[] = [
    {
      id: "NATIONAL_CARD",
      label: "کارت ملی",
      description: "تصویر واضح از روی کارت ملی",
      status: "missing",
    },
    {
      id: "CERTIFICATE",
      label: "مدرک یا گواهی مهارت",
      description: "گواهینامه‌ی فنی‌وحرفه‌ای یا مدرک مرتبط با تخصص",
      status: "missing",
    },
    {
      id: "CRIMINAL_RECORD",
      label: "گواهی عدم سوءپیشینه",
      description: "برای ورود به منزل مشتریان الزامی است",
      status: "missing",
    },
  ];
  return (
    <div className="space-y-5">
      <PageHeader
        title="پروفایل حرفه‌ای"
        description="اطلاعات و تخصص‌های حرفه‌ای‌تان را مدیریت کنید."
        action={
          <span
            className={`inline-flex h-9 items-center gap-2 self-start rounded-full px-3 text-xs font-medium sm:self-auto ${
              provider.isVerified
                ? "bg-emerald-600/10 text-emerald-800"
                : "bg-amber-500/12 text-amber-800"
            }`}
          >
            {provider.isVerified ? (
              <BadgeCheck size={16} />
            ) : (
              <Clock3 size={16} />
            )}
            {provider.isVerified ? "هویت تأیید شده" : "در انتظار تأیید"}
          </span>
        }
      />

      <nav
        aria-label="بخش‌های پروفایل"
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {[
          { href: "#basic", label: "اطلاعات پایه", Icon: UserRound },
          { href: "#skills", label: "تخصص‌ها", Icon: BriefcaseBusiness },
          { href: "#service-area", label: "محدوده فعالیت", Icon: MapPinned },
          { href: "#private-address", label: "نشانی محرمانه", Icon: House },
          { href: "#documents", label: "مدارک", Icon: FileCheck2 },
          { href: "#portfolio", label: "نمونه‌کار", Icon: BriefcaseBusiness },
          { href: "#notifications", label: "اعلان‌ها", Icon: Bell },
        ].map(({ href, label, Icon }) => (
          <a
            key={href}
            href={href}
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-foreground/10 bg-card px-3 text-xs font-medium text-foreground/65 transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Icon size={15} />
            {label}
          </a>
        ))}
      </nav>

      <ProfileCompletionCard percent={percent} items={items} />

      <div className="grid items-start gap-5 xl:grid-cols-2">
        <div className="contents xl:flex xl:min-w-0 xl:flex-col xl:gap-5">
          <ProfileForm provider={provider} />
          <SkillsSection
            initial={provider.specialties ?? []}
            accessToken={session.accessToken}
          />
        </div>
        <div className="contents xl:flex xl:min-w-0 xl:flex-col xl:gap-5">
          <VerificationSection docs={docs} />
        </div>
        <div className="min-w-0 xl:col-span-2">
          <ServiceAreaEditor
            initialLatitude={provider.serviceAreaLatitude}
            initialLongitude={provider.serviceAreaLongitude}
            initialRadiusKm={provider.serviceAreaRadiusKm ?? 10}
          />
        </div>
        <div className="min-w-0 xl:col-span-2">
          <ProviderAddressEditor
            initialAddress={provider.providerAddress}
            initialAddressType={provider.providerAddressType}
          />
        </div>
        <div className="min-w-0 xl:col-span-2">
          <PortfolioUploader initial={[]} />
        </div>
        <div id="notifications" className="min-w-0 scroll-mt-24 xl:col-span-2">
          <NotificationPreferencesPanel
            role="PROVIDER"
            accessToken={session.accessToken}
            initial={notificationPreferences}
          />
        </div>
      </div>
    </div>
  );
}
