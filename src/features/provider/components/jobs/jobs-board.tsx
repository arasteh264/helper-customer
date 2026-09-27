"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Inbox } from "lucide-react";
import { ApiError } from "@/src/lib/api/error";
import { providerJobsApi } from "../../api/jobs.api";

import { formatNumber } from "../../utils/format";
import { JobCard, type JobAction } from "./job-card";
import { Job, JobStatus } from "../../types/types";

const TABS: { id: JobStatus; label: string; empty: string }[] = [
  { id: "new", label: "جدید", empty: "درخواست جدیدی ندارید." },
  {
    id: "declined",
    label: "ردشده توسط من",
    empty: "درخواستی را رد نکرده‌اید.",
  },
  { id: "accepted", label: "پذیرفته‌شده", empty: "کار پذیرفته‌شده‌ای ندارید." },
  {
    id: "in_progress",
    label: "در حال انجام",
    empty: "کاری در حال انجام نیست.",
  },
  {
    id: "completed",
    label: "تکمیل‌شده",
    empty: "هنوز کاری را تکمیل نکرده‌اید.",
  },
  { id: "cancelled", label: "لغوشده", empty: "کار لغوشده‌ای وجود ندارد." },
];

const NEXT_STATUS: Record<JobAction, JobStatus> = {
  accept: "accepted",
  reject: "declined",
  start: "in_progress",
  complete: "completed",
};

const SUCCESS_MESSAGE: Record<JobAction, string> = {
  accept: "کار پذیرفته شد",
  reject: "درخواست رد شد",
  start: "کار شروع شد",
  complete: "کار تکمیل شد",
};

export function JobsBoard({
  initialJobs,
  accessToken,
}: {
  initialJobs: Job[];
  accessToken: string;
}) {
  const [jobs, setJobs] = useState(initialJobs);
  const [tab, setTab] = useState<JobStatus>("new");
  const [pendingJobId, setPendingJobId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const map = {} as Record<JobStatus, number>;
    TABS.forEach(
      (t) => (map[t.id] = jobs.filter((j) => j.status === t.id).length),
    );
    return map;
  }, [jobs]);

  const visible = useMemo(
    () =>
      jobs
        .filter((j) => j.status === tab)
        .sort((a, b) => +new Date(a.scheduledAt) - +new Date(b.scheduledAt)),
    [jobs, tab],
  );

  const handleAction = async (id: string, action: JobAction) => {
    if (action === "reject" && !window.confirm("این درخواست رد شود؟")) return;

    setPendingJobId(id);
    try {
      await providerJobsApi[action === "reject" ? "decline" : action](
        id,
        accessToken,
      );
      setJobs((prev) =>
        prev.map((job) =>
          job.id === id ? { ...job, status: NEXT_STATUS[action] } : job,
        ),
      );
      toast.success(SUCCESS_MESSAGE[action]);
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "ثبت تغییر انجام نشد؛ دوباره تلاش کنید.",
      );
    } finally {
      setPendingJobId(null);
    }
  };

  const active = TABS.find((t) => t.id === tab)!;

  return (
    <div>
      {/* تب‌ها */}
      <div
        role="tablist"
        aria-label="وضعیت کارها"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {TABS.map((t) => {
          const selected = t.id === tab;
          return (
            <button
              key={t.id}
              id={`tab-${t.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls="jobs-panel"
              onClick={() => setTab(t.id)}
              className={[
                "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                selected
                  ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "border-foreground/10 bg-card text-foreground/70 hover:border-primary/40 hover:text-primary",
              ].join(" ")}
            >
              {t.label}
              <span
                className={`min-w-5 rounded-full px-1.5 text-xs ${
                  selected ? "bg-white/20" : "bg-foreground/[0.06]"
                }`}
              >
                {formatNumber(counts[t.id])}
              </span>
            </button>
          );
        })}
      </div>

      {/* لیست */}
      <div
        id="jobs-panel"
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        className="mt-5"
      >
        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-foreground/15 bg-card px-6 py-14 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground/[0.05] text-foreground/40">
              <Inbox size={26} />
            </span>
            <p className="text-sm text-foreground/60">{active.empty}</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {visible.map((job) => (
              <li key={job.id}>
                <JobCard
                  job={job}
                  onAction={handleAction}
                  busy={pendingJobId === job.id}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
