import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/src/auth";
import { ApiError } from "@/src/lib/api/error";

import { JobsBoard } from "@/src/features/provider/components/jobs/jobs-board";
import { PageHeader } from "@/src/components/shared/page-header";
import { SectionCard } from "@/src/components/shared/section-card";
import { providerJobsApi } from "@/src/features/provider/api/jobs.api";

export const metadata: Metadata = { title: "کارها | پنل متخصص" };

export default async function ProviderJobsPage() {
  const session = await auth();
  if (!session?.accessToken) {
    redirect("/login?callbackUrl=%2Fprovider%2Fjobs");
  }

  let jobs;
  try {
    jobs = await providerJobsApi.list(session.accessToken);
  } catch (error) {
    const message =
      error instanceof ApiError && error.status === 403
        ? "برای دریافت درخواست‌ها، حساب متخصص شما باید تأیید شده باشد."
        : "دریافت درخواست‌ها انجام نشد. دوباره تلاش کنید.";
    return (
      <div className="space-y-6">
        <PageHeader
          title="درخواست‌های کاری"
          description="درخواست‌های متناسب با تخصص خود را بررسی و مدیریت کنید."
        />
        <SectionCard title="امکان دریافت درخواست‌ها نیست">
          <div className="flex flex-col items-start gap-4 text-sm text-foreground/65 sm:flex-row sm:items-center sm:justify-between">
            <p>{message}</p>
            <Link
              href="/provider/jobs"
              className="inline-flex h-10 items-center rounded-lg bg-primary px-4 font-medium text-primary-foreground"
            >
              تلاش دوباره
            </Link>
          </div>
        </SectionCard>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="درخواست‌های کاری"
        description="درخواست‌های متناسب با تخصص خود را بررسی و مدیریت کنید."
      />
      <JobsBoard initialJobs={jobs} accessToken={session.accessToken} />
    </>
  );
}
