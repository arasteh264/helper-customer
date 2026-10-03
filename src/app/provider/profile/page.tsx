import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/src/auth";
import { providerApi } from "@/src/features/provider/api/provider.api";
import { getProfileCompletion } from "@/src/features/provider/lib/completion";
import { AvailabilityEditor } from "@/src/features/provider/components/availability/availability-editor";
import { ProfileCompletionCard } from "@/src/features/provider/components/profile-completion-card";
import { VerificationSection } from "@/src/features/provider/components/basicInformation/verification-section";
import { ProfileForm } from "@/src/features/provider/components/basicInformation/profile-form";
import { ServiceAreaEditor } from "@/src/features/provider/components/basicInformation/service-area-editor";
import { PageHeader } from "@/src/components/shared/page-header";
import { NotificationPreferencesPanel } from "@/src/features/notifications/components/notification-preferences-panel";
import { notificationPreferencesApi } from "@/src/features/notifications/api/notification-preferences.api";
import { SkillsSection } from "@/src/features/provider/components/basicInformation/skills-section";
import { buildAvailabilityDays } from "@/src/features/provider/lib/availability";
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
  const days = buildAvailabilityDays(provider.workingHours);
  const { percent, items } = getProfileCompletion(
    provider,
    [],
    provider.workingHours,
  );
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
    <div className="space-y-6">
      <PageHeader
        title="پروفایل من"
        description="اطلاعات‌تان را کامل و به‌روز نگه دارید تا مشتریان بیشتری شما را انتخاب کنند."
      />
      <ProfileCompletionCard percent={percent} items={items} />
      <ProfileForm provider={provider} />
      <ServiceAreaEditor
        initialLatitude={provider.serviceAreaLatitude}
        initialLongitude={provider.serviceAreaLongitude}
      />
      <SkillsSection
        initial={provider.specialties ?? []}
        accessToken={session.accessToken}
      />
      <VerificationSection docs={docs} />
      <PortfolioUploader initial={[]} />
      <AvailabilityEditor initial={days} accessToken={session.accessToken} />
      <NotificationPreferencesPanel
        role="PROVIDER"
        accessToken={session.accessToken}
        initial={notificationPreferences}
      />
    </div>
  );
}
