import type { Metadata } from "next";

import { JobsBoard } from "@/src/features/provider/components/jobs/jobs-board";

import { jobs } from "@/src/features/provider/types/data";
import { PageHeader } from "@/src/components/shared/page-header";

export const metadata: Metadata = { title: "کارها | پنل متخصص" };

export default function ProviderJobsPage() {
  // TODO: کارهای متخصص را از API / دیتابیس بگیرید
  return (
    <>
      <PageHeader
        title="کارهای من"
        description="درخواست‌های جدید را بررسی کنید و کارهای در دست اجرا را مدیریت کنید."
      />
      <JobsBoard initialJobs={jobs} />
    </>
  );
}
