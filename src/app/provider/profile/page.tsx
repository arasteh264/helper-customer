import type { Metadata } from "next";

import { getProfileCompletion } from "@/src/features/provider/lib/completion";
import { AvailabilityEditor } from "@/src/features/provider/components/availability/availability-editor";
import { PortfolioUploader } from "@/src/features/provider/components/Portfolio/portfolio-uploader";
import { ProfileCompletionCard } from "@/src/features/provider/components/profile-completion-card";

import { VerificationSection } from "@/src/features/provider/components/basicInformation/verification-section";
import { ProfileForm } from "@/src/features/provider/components/basicInformation/profile-form";
import {
  defaultSchedule,
  provider,
  verificationDocs,
} from "@/src/features/provider/types/data";
import { PageHeader } from "@/src/components/shared/page-header";

export const metadata: Metadata = { title: "پروفایل | پنل متخصص" };

export default function ProviderProfilePage() {
  // TODO: داده‌ها را از API / دیتابیس بگیرید
  const { percent, items } = getProfileCompletion(
    provider,
    verificationDocs,
    defaultSchedule,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="پروفایل من"
        description="اطلاعات‌تان را کامل و به‌روز نگه دارید تا مشتریان بیشتری شما را انتخاب کنند."
      />

      <ProfileCompletionCard percent={percent} items={items} />

      <ProfileForm provider={provider} />
      <VerificationSection docs={verificationDocs} />
      <PortfolioUploader initial={provider.portfolio} />
      <AvailabilityEditor initial={defaultSchedule} />
    </div>
  );
}
