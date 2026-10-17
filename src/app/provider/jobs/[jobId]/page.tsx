import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/src/auth";
import { SectionCard } from "@/src/components/shared/section-card";
import { JobsBoard } from "@/src/features/provider/components/jobs/jobs-board";
import { providerJobsApi } from "@/src/features/provider/api/jobs.api";
import { walletApi } from "@/src/features/provider/api/wallet.api";

export const metadata: Metadata = { title: "جزئیات درخواست | پنل متخصص" };

export default async function ProviderJobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const session = await auth();
  if (!session?.accessToken) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/provider/jobs/${jobId}`)}`);
  }

  let jobs;
  try {
    jobs = await providerJobsApi.list(session.accessToken);
  } catch {
    return (
      <SectionCard title="دریافت جزئیات درخواست انجام نشد">
        <div className="space-y-4 text-sm text-foreground/65">
          <p>لطفاً دوباره تلاش کنید یا از فهرست درخواست‌ها وارد شوید.</p>
          <Link
            href="/provider/jobs"
            className="inline-flex h-10 items-center rounded-lg bg-primary px-4 font-medium text-primary-foreground"
          >
            بازگشت به فهرست درخواست‌ها
          </Link>
        </div>
      </SectionCard>
    );
  }

  const job = jobs.find((item) => item.id === jobId);
  if (!job) notFound();

  let commissionRate: number | null = null;
  let commissionRateError = false;
  try {
    commissionRate = (await walletApi.getSummary(session.accessToken)).commissionRate;
  } catch (error) {
    console.error("Failed to load provider commission rate for job details.", error);
    commissionRateError = true;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">جزئیات درخواست</h1>
        <p className="mt-1 text-sm text-foreground/60">
          اطلاعات را بررسی کنید و اقدام مناسب را برای همین درخواست انجام دهید.
        </p>
      </div>
      <JobsBoard
        initialJobs={[job]}
        accessToken={session.accessToken}
        commissionRate={commissionRate}
        commissionRateError={commissionRateError}
        detailJobId={jobId}
      />
    </div>
  );
}
