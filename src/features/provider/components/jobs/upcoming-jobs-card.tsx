import Link from "next/link";
import { CalendarClock, ChevronLeft, MapPin } from "lucide-react";

import { formatDateTime, formatMoney } from "../../utils/format";
import { JOB_STATUS } from "../../utils/job-status";

import { Job } from "../../types/types";
import { SectionCard } from "@/src/components/shared/section-card";
import { StatusBadge } from "@/src/components/shared/status-badge";

export function UpcomingJobsCard({ jobs }: { jobs: Job[] }) {
  const upcoming = jobs
    .filter((j) => j.status === "accepted" || j.status === "in_progress")
    .sort((a, b) => +new Date(a.scheduledAt) - +new Date(b.scheduledAt))
    .slice(0, 3);

  return (
    <SectionCard
      title="کارهای پیش رو"
      description="کارهایی که پذیرفته‌اید یا در حال انجام‌اند"
      action={
        <Link
          href="/provider/jobs"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          همه‌ی کارها
          <ChevronLeft size={16} className="ltr:rotate-180" />
        </Link>
      }
    >
      {upcoming.length === 0 ? (
        <p className="rounded-xl bg-foreground/[0.03] px-4 py-8 text-center text-sm text-foreground/55">
          فعلاً کار فعالی ندارید. درخواست‌های جدید را بررسی کنید.
        </p>
      ) : (
        <ul className="space-y-3">
          {upcoming.map((job) => {
            const status = JOB_STATUS[job.status];
            return (
              <li
                key={job.id}
                className="rounded-xl border border-foreground/10 bg-background p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    {job.title}
                  </h3>
                  <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                </div>
                <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-foreground/60">
                  <div className="flex items-center gap-1.5">
                    <CalendarClock size={14} />
                    <dd>{formatDateTime(job.scheduledAt)}</dd>
                  </div>
                  <div className="flex min-w-0 items-center gap-1.5">
                    <MapPin size={14} className="shrink-0" />
                    <dd className="truncate">{job.address}</dd>
                  </div>
                  <div className="font-medium text-foreground">
                    <dd>{formatMoney(job.price)}</dd>
                  </div>
                </dl>
              </li>
            );
          })}
        </ul>
      )}
    </SectionCard>
  );
}
