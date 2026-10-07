"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  BriefcaseBusiness,
  CircleAlert,
  CircleCheck,
  Inbox,
  Loader2,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { ApiError } from "@/src/lib/api/error";
import { providerJobsApi } from "../../api/jobs.api";

import { formatNumber } from "../../utils/format";
import { JobCard, type JobAction } from "./job-card";
import { Job, JobStatus } from "../../types/types";

type JobFilter = "new" | "active" | "attention" | "completed" | "archive";

const TABS: {
  id: JobFilter;
  label: string;
  statuses: JobStatus[];
  empty: string;
}[] = [
  {
    id: "new",
    label: "درخواست‌های جدید",
    statuses: ["new"],
    empty: "درخواست جدیدی ندارید.",
  },
  {
    id: "active",
    label: "کارهای جاری",
    statuses: [
      "accepted",
      "awaiting_payment",
      "in_progress",
      "awaiting_confirmation",
    ],
    empty: "کار جاری‌ای برای پیگیری ندارید.",
  },
  {
    id: "attention",
    label: "نیازمند پیگیری",
    statuses: ["disputed"],
    empty: "موردی برای پیگیری فوری ندارید.",
  },
  {
    id: "completed",
    label: "تکمیل‌شده",
    statuses: ["completed"],
    empty: "هنوز کاری را تکمیل نکرده‌اید.",
  },
  {
    id: "archive",
    label: "بایگانی",
    statuses: ["declined", "cancelled"],
    empty: "درخواستی در بایگانی ندارید.",
  },
];

const SUCCESS_MESSAGE: Record<JobAction, string> = {
  accept: "قیمت ثبت و کار پذیرفته شد",
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
  const [tab, setTab] = useState<JobFilter>("new");
  const [query, setQuery] = useState("");
  const [pendingJobId, setPendingJobId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const knownJobIds = useRef(new Set(initialJobs.map((job) => job.id)));
  const pollErrorNotified = useRef(false);

  useEffect(() => {
    let active = true;
    let loading = false;

    const refresh = async () => {
      if (!active || loading || document.visibilityState !== "visible") return;
      loading = true;
      try {
        const latestJobs = await providerJobsApi.list(accessToken);
        if (!active) return;
        pollErrorNotified.current = false;
        const newJobs = latestJobs.filter(
          (job) => job.status === "new" && !knownJobIds.current.has(job.id),
        );
        latestJobs.forEach((job) => knownJobIds.current.add(job.id));
        setJobs(latestJobs);
        if (newJobs.length > 0) {
          toast.info(
            newJobs.length === 1
              ? "درخواست کاری جدیدی برای شما ثبت شد."
              : `${formatNumber(newJobs.length)} درخواست کاری جدید برای شما ثبت شد.`,
          );
        }
      } catch (error) {
        console.error("[JobsBoard] Failed to refresh jobs", error);
        if (!pollErrorNotified.current) {
          toast.error("دریافت درخواست‌های جدید ممکن نشد.");
          pollErrorNotified.current = true;
        }
      } finally {
        loading = false;
      }
    };

    const interval = window.setInterval(() => void refresh(), 20_000);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      active = false;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [accessToken]);

  const counts = useMemo(() => {
    const map = {} as Record<JobFilter, number>;
    TABS.forEach((item) => {
      map[item.id] = jobs.filter((job) =>
        item.statuses.includes(job.status),
      ).length;
    });
    return map;
  }, [jobs]);

  const overview = useMemo(
    () => ({
      new: jobs.filter((job) => job.status === "new").length,
      active: jobs.filter((job) =>
        [
          "accepted",
          "awaiting_payment",
          "in_progress",
          "awaiting_confirmation",
        ].includes(job.status),
      ).length,
      attention: jobs.filter((job) => job.status === "disputed").length,
      completed: jobs.filter((job) => job.status === "completed").length,
    }),
    [jobs],
  );

  const visible = useMemo(
    () =>
      jobs
        .filter((job) =>
          TABS.find((item) => item.id === tab)?.statuses.includes(job.status),
        )
        .filter((job) =>
          query.trim()
            ? `${job.title} ${job.service} ${job.customerName}`
                .toLocaleLowerCase("fa-IR")
                .includes(query.trim().toLocaleLowerCase("fa-IR"))
            : true,
        )
        .sort((a, b) => +new Date(a.scheduledAt) - +new Date(b.scheduledAt)),
    [jobs, query, tab],
  );

  const refreshJobs = async () => {
    setRefreshing(true);
    try {
      const latestJobs = await providerJobsApi.list(accessToken);
      latestJobs.forEach((job) => knownJobIds.current.add(job.id));
      setJobs(latestJobs);
    } catch {
      toast.error("به‌روزرسانی درخواست‌ها انجام نشد.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleAction = async (
    id: string,
    action: JobAction,
    proposedPriceToman?: number,
  ) => {
    if (action === "reject" && !window.confirm("این درخواست رد شود؟")) return;

    setPendingJobId(id);
    try {
      if (action === "accept") {
        if (!proposedPriceToman) return;
        await providerJobsApi.accept(id, proposedPriceToman, accessToken);
      } else if (action === "reject") {
        await providerJobsApi.decline(id, accessToken);
      } else {
        await providerJobsApi[action](id, accessToken);
      }
      const refreshedJobs = await providerJobsApi.list(accessToken);
      refreshedJobs.forEach((job) => knownJobIds.current.add(job.id));
      setJobs(refreshedJobs);
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

  const handleDisputeMessage = async (id: string, body: string) => {
    if (pendingJobId) return false;
    setPendingJobId(id);
    try {
      await providerJobsApi.addDisputeMessage(id, body, accessToken);
      const refreshedJobs = await providerJobsApi.list(accessToken);
      refreshedJobs.forEach((job) => knownJobIds.current.add(job.id));
      setJobs(refreshedJobs);
      toast.success("پاسخ شما به اختلاف ثبت شد.");
      return true;
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "ارسال پاسخ اختلاف انجام نشد.",
      );
      return false;
    } finally {
      setPendingJobId(null);
    }
  };

  const handleNonPaymentDispute = async (id: string, description: string) => {
    if (pendingJobId) return false;
    setPendingJobId(id);
    try {
      await providerJobsApi.raiseNonPaymentDispute(id, description, accessToken);
      const refreshedJobs = await providerJobsApi.list(accessToken);
      refreshedJobs.forEach((job) => knownJobIds.current.add(job.id));
      setJobs(refreshedJobs);
      setTab("attention");
      toast.success("اختلاف پرداخت برای بررسی ثبت شد.");
      return true;
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "ثبت اختلاف پرداخت انجام نشد.",
      );
      return false;
    } finally {
      setPendingJobId(null);
    }
  };

  const active = TABS.find((item) => item.id === tab)!;

  return (
    <div className="space-y-6">
      <section
        aria-label="خلاصه‌ی کارها"
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        <div className="rounded-xl border border-foreground/10 bg-card p-4">
          <p className="text-xs text-foreground/55">درخواست جدید</p>
          <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-foreground">
            <BriefcaseBusiness size={19} className="text-primary" />
            {formatNumber(overview.new)}
          </p>
        </div>
        <div className="rounded-xl border border-foreground/10 bg-card p-4">
          <p className="text-xs text-foreground/55">کار جاری</p>
          <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-foreground">
            <Loader2 size={19} className="text-sky-600" />
            {formatNumber(overview.active)}
          </p>
        </div>
        <div className="rounded-xl border border-foreground/10 bg-card p-4">
          <p className="text-xs text-foreground/55">نیازمند پیگیری</p>
          <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-foreground">
            <CircleAlert size={19} className="text-amber-600" />
            {formatNumber(overview.attention)}
          </p>
        </div>
        <div className="rounded-xl border border-foreground/10 bg-card p-4">
          <p className="text-xs text-foreground/55">تکمیل‌شده</p>
          <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-foreground">
            <CircleCheck size={19} className="text-emerald-600" />
            {formatNumber(overview.completed)}
          </p>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">جست‌وجوی درخواست‌ها</span>
          <Search
            size={17}
            className="pointer-events-none absolute inset-e-3.5 top-1/2 -translate-y-1/2 text-foreground/35"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="جست‌وجو در عنوان، خدمت یا نام مشتری"
            className="h-11 w-full rounded-lg border border-foreground/15 bg-card pe-10 ps-4 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
          />
        </label>
        <button
          type="button"
          onClick={() => void refreshJobs()}
          disabled={refreshing}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-foreground/15 px-4 text-sm font-medium text-foreground/70 transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-60"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          به‌روزرسانی
        </button>
      </div>

      <div
        role="tablist"
        aria-label="وضعیت کارها"
        className="flex gap-2 overflow-x-auto border-b border-foreground/10 scrollbar-none [&::-webkit-scrollbar]:hidden"
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
                "flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                selected
                  ? "border-primary text-primary"
                  : "border-transparent text-foreground/60 hover:text-foreground",
              ].join(" ")}
            >
              {t.label}
              <span
                className={`min-w-5 rounded-full px-1.5 text-xs ${selected ? "bg-primary/10 text-primary" : "bg-foreground/6 text-foreground/60"}`}
              >
                {formatNumber(counts[t.id])}
              </span>
            </button>
          );
        })}
      </div>

      <div
        id="jobs-panel"
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        className="pt-1"
      >
        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-foreground/15 bg-card px-6 py-14 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground/5 text-foreground/40">
              <Inbox size={26} />
            </span>
            <p className="text-sm text-foreground/60">
              {query.trim()
                ? "نتیجه‌ای با این جست‌وجو پیدا نشد."
                : active.empty}
            </p>
            {query.trim() && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
              >
                <X size={14} />
                پاک‌کردن جست‌وجو
              </button>
            )}
          </div>
        ) : (
          <ul className="grid gap-4 xl:grid-cols-2">
            {visible.map((job) => (
              <li key={job.id}>
                <JobCard
                  job={job}
                  onAction={handleAction}
                  onDisputeMessage={handleDisputeMessage}
                  onRaiseNonPaymentDispute={handleNonPaymentDispute}
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
