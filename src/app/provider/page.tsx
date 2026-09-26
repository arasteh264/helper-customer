import type { Metadata } from "next";
import { Briefcase, Star, TrendingUp, Zap } from "lucide-react";

import { getProfileCompletion } from "@/src/features/provider/lib/completion";
import {
  defaultSchedule,
  finance,
  jobs,
  provider,
  reviews,
  verificationDocs,
} from "@/src/features/provider/types/data";
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

export default function ProviderOverviewPage() {
  // TODO: داده‌ها را از API / دیتابیس بگیرید
  const { percent, items } = getProfileCompletion(
    provider,
    verificationDocs,
    defaultSchedule,
  );

  const months = finance.monthly;
  const current = months[months.length - 1];
  const previous = months[months.length - 2];
  const growth = previous
    ? Math.round(((current.amount - previous.amount) / previous.amount) * 100)
    : 0;

  const activeJobs = jobs.filter(
    (j) => j.status === "accepted" || j.status === "in_progress",
  ).length;
  const newJobs = jobs.filter((j) => j.status === "new").length;

  const firstName = provider.fullName.split(" ")[0];

  return (
    <div className="space-y-6">
      {/* خوش‌آمد + وضعیت */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            سلام {firstName}، خوش آمدید 👋
          </h1>
          <p className="mt-2 text-sm leading-7 text-foreground/60">
            {newJobs > 0
              ? `${formatNumber(newJobs)} درخواست جدید منتظر پاسخ شماست.`
              : "خلاصه‌ی فعالیت‌های اخیرتان را اینجا می‌بینید."}
          </p>
        </div>
        <div className="md:w-80">
          <AvailabilityToggle accessToken={undefined} />
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
          hint={`${formatNumber(provider.completedJobs)} کار تکمیل‌شده`}
        />
        <StatCard
          icon={Star}
          label="امتیاز شما"
          value={new Intl.NumberFormat("fa-IR", {
            minimumFractionDigits: 1,
          }).format(provider.rating)}
          hint={`از ${formatNumber(provider.reviewsCount)} نظر`}
        />
        <StatCard
          icon={Zap}
          label="نرخ پاسخ‌گویی"
          value={`${formatNumber(provider.responseRate)}٪`}
          hint="پاسخ سریع، شانس بیشتر"
        />
      </div>

      {/* کارها + نمودار */}
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

      <RecentReviewsCard reviews={reviews} />
    </div>
  );
}
