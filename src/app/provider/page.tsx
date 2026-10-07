import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Briefcase, Star, TrendingUp, Zap } from "lucide-react";
import { auth } from "@/src/auth";
import { ApiError } from "@/src/lib/api/error";

import { getProfileCompletion } from "@/src/features/provider/lib/completion";
import { providerApi } from "@/src/features/provider/api/provider.api";
import { getVerificationDocuments } from "@/src/features/provider/api/documents";
import { providerJobsApi } from "@/src/features/provider/api/jobs.api";
import { publicProvidersApi } from "@/src/features/catalog/api/providers.api";
import { walletApi } from "@/src/features/provider/api/wallet.api";
import type { VerificationDoc } from "@/src/features/provider/types/types";
import {
  formatMoney,
  formatNumber,
} from "@/src/features/provider/utils/format";
import { AvailabilityToggle } from "@/src/features/provider/components/availability/availability-toggle";
import { ProfileCompletionCard } from "@/src/features/provider/components/profile-completion-card";
import { UpcomingJobsCard } from "@/src/features/provider/components/jobs/upcoming-jobs-card";

import { EarningsChart } from "@/src/features/provider/components/Financial/earnings-chart";
import { RecentReviewsCard } from "@/src/features/provider/components/recent-reviews-card";
import { StatCard } from "@/src/components/shared/stat-card";
import { SectionCard } from "@/src/components/shared/section-card";

export const metadata: Metadata = { title: "نمای کلی | پنل متخصص" };

export default async function ProviderOverviewPage() {
  const session = await auth();
  if (!session?.accessToken) {
    redirect("/login?callbackUrl=%2Fprovider");
  }

  let profile;
  let jobs;
  let finance;
  let verificationDocs: VerificationDoc[];

  try {
    [profile, jobs, finance, verificationDocs] = await Promise.all([
      providerApi.getProfile(session.accessToken),
      providerJobsApi.list(session.accessToken),
      walletApi.getSummary(session.accessToken),
      getVerificationDocuments(session.accessToken).then((documents) =>
        documents.map((document) => {
          const labels: Record<string, string> = {
            NATIONAL_CARD: "کارت ملی",
            BUSINESS_LICENSE: "مجوز کسب‌وکار",
            CERTIFICATE: "مدرک مهارت",
            COMMITMENT_LETTER: "تعهدنامه",
            CRIMINAL_RECORD: "گواهی عدم سوءپیشینه",
            OTHER: "مدرک دیگر",
          };
          return {
            id: document.type,
            label: labels[document.type] ?? "مدرک احراز هویت",
            description: "مدرک احراز هویت متخصص",
            status:
              document.status === "APPROVED"
                ? "verified"
                : document.status === "REJECTED"
                  ? "rejected"
                  : "pending",
            note: document.rejectionNote ?? undefined,
            type: document.type,
          };
        }),
      ),
    ]);
  } catch (error) {
    const message =
      error instanceof ApiError && error.status === 403
        ? "حساب متخصص شما هنوز تأیید نشده است."
        : "دریافت اطلاعات نمای کلی انجام نشد. دوباره تلاش کنید.";
    return (
      <div className="space-y-6">
        <SectionCard title="نمای کلی در دسترس نیست">
          <div className="flex flex-col items-start gap-4 text-sm text-foreground/65 sm:flex-row sm:items-center sm:justify-between">
            <p>{message}</p>
            <Link
              href="/provider"
              className="inline-flex h-10 items-center rounded-lg bg-primary px-4 font-medium text-primary-foreground"
            >
              تلاش دوباره
            </Link>
          </div>
        </SectionCard>
      </div>
    );
  }

  const { percent, items } = getProfileCompletion(
    {
      bio: profile.bio,
      specialties: profile.specialties,
      skills: profile.skills,
      avatarUrl: profile.avatarUrl,
    },
    verificationDocs,
  );
  const months = finance.monthly;
  const current = months.at(-1) ?? { label: "این ماه", amount: 0 };
  const previous = months.at(-2);
  const growth = previous?.amount
    ? Math.round(((current.amount - previous.amount) / previous.amount) * 100)
    : 0;
  const activeJobs = jobs.filter(
    (job) => job.status === "accepted" || job.status === "in_progress",
  ).length;
  const newJobs = jobs.filter((job) => job.status === "new").length;
  const decisions = jobs.filter(
    (job) => job.status === "accepted" || job.status === "declined",
  ).length;
  const completedJobs = jobs.filter((job) => job.status === "completed").length;
  const firstName = profile.user.name.split(" ")[0];
  const recentReviews = profile.isVerified
    ? await publicProvidersApi
        .getById(profile.id)
        .then((provider) => provider.reviews)
        .catch(() => [])
    : [];

  return (
    <div className="space-y-6">
      {/* خوش‌آمد + وضعیت */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            سلام {firstName}، خوش آمدید
          </h1>
          <p className="mt-2 text-sm leading-7 text-foreground/60">
            {newJobs > 0
              ? `${formatNumber(newJobs)} درخواست جدید منتظر پاسخ شماست.`
              : "خلاصه‌ی فعالیت‌های اخیرتان را اینجا می‌بینید."}
          </p>
        </div>
        <div className="md:w-80">
          <AvailabilityToggle
            initial={profile.isAvailable && Boolean(profile.providerAddress?.trim())}
            accessToken={session.accessToken}
          />
        </div>
      </div>

      <ProfileCompletionCard percent={percent} items={items} />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          icon={TrendingUp}
          label="درآمد این ماه"
          value={formatMoney(current.amount)}
          hint={`${formatNumber(Math.abs(growth))}٪ ${growth >= 0 ? "بیشتر" : "کمتر"} از ماه قبل`}
          hintTone={growth >= 0 ? "positive" : "negative"}
        />
        <StatCard
          icon={Briefcase}
          label="کارهای فعال"
          value={formatNumber(activeJobs)}
          hint={`${formatNumber(completedJobs)} کار تکمیل‌شده`}
        />
        <StatCard
          icon={Star}
          label="امتیاز شما"
          value={new Intl.NumberFormat("fa-IR", {
            minimumFractionDigits: 1,
          }).format(profile.rating)}
          hint="میانگین امتیاز مشتریان"
        />
        <StatCard
          icon={Zap}
          label="تصمیم‌های ثبت‌شده"
          value={formatNumber(decisions)}
          hint="درخواست‌های پذیرفته یا ردشده"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <UpcomingJobsCard jobs={jobs} />
        </div>
        <div className="lg:col-span-2">
          <SectionCard
            title="درآمد ۶ ماه اخیر"
            description="مبلغ به تومان (م = میلیون)"
            className="h-full"
          >
            <EarningsChart data={months} />
          </SectionCard>
        </div>
      </div>

      <RecentReviewsCard reviews={recentReviews} />
    </div>
  );
}
