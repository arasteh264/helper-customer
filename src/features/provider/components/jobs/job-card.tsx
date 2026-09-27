import { CalendarClock, MapPin, Phone, Wallet } from "lucide-react";

import { Button } from "@/src/components/ui/button";

import { StatusBadge } from "@/src/components/shared/status-badge";
import { Job } from "../../types/types";
import { JOB_STATUS } from "../../utils/job-status";
import { formatDateTime, formatMoney } from "@/src/utils/format";

export type JobAction = "accept" | "reject" | "start" | "complete";

interface JobCardProps {
  job: Job;
  onAction: (id: string, action: JobAction) => void;
  busy?: boolean;
}

export function JobCard({ job, onAction, busy = false }: JobCardProps) {
  const status = JOB_STATUS[job.status];
  const showPhone =
    !!job.customerPhone &&
    (job.status === "accepted" || job.status === "in_progress");

  return (
    <article className="rounded-2xl border border-foreground/10 bg-card p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-foreground/50">{job.service}</p>
          <h3 className="mt-0.5 text-base font-semibold leading-7 text-foreground">
            {job.title}
          </h3>
        </div>
        <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
      </div>

      <dl className="mt-4 grid gap-3 text-sm text-foreground/65 sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.05]">
            <CalendarClock size={16} />
          </span>
          <div>
            <dt className="sr-only">زمان</dt>
            <dd>{formatDateTime(job.scheduledAt)}</dd>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.05]">
            <Wallet size={16} />
          </span>
          <div>
            <dt className="sr-only">مبلغ</dt>
            <dd className="font-medium text-foreground">
              {job.price > 0 ? formatMoney(job.price) : "—"}
            </dd>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:col-span-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.05]">
            <MapPin size={16} />
          </span>
          <div className="min-w-0">
            <dt className="sr-only">آدرس</dt>
            <dd className="truncate">{job.address}</dd>
          </div>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-foreground/10 pt-4">
        <div className="text-sm">
          <p className="font-medium text-foreground">{job.customerName}</p>
          {showPhone ? (
            <a
              href={`tel:${job.customerPhone}`}
              className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
            >
              <Phone size={13} />
              <span dir="ltr">{job.customerPhone}</span>
            </a>
          ) : (
            <p className="mt-0.5 text-xs text-foreground/45">
              شماره‌ی مشتری بعد از پذیرش کار نمایش داده می‌شود
            </p>
          )}
          {job.note && (
            <p className="mt-2 text-xs leading-6 text-foreground/55">
              توضیح مشتری: {job.note}
            </p>
          )}
          {job.images && job.images.length > 0 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {job.images.map((image, index) => (
                <a key={image} href={image} target="_blank" rel="noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={`تصویر درخواست ${index + 1}`}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {job.status === "new" && (
            <>
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => onAction(job.id, "reject")}
              >
                رد درخواست
              </Button>
              <Button
                type="button"
                disabled={busy}
                onClick={() => onAction(job.id, "accept")}
              >
                {busy ? "در حال ثبت…" : "پذیرش کار"}
              </Button>
            </>
          )}
          {job.status === "accepted" && (
            <Button
              type="button"
              disabled={busy}
              onClick={() => onAction(job.id, "start")}
            >
              {busy ? "در حال ثبت…" : "شروع کار"}
            </Button>
          )}
          {job.status === "in_progress" && (
            <Button
              type="button"
              disabled={busy}
              onClick={() => onAction(job.id, "complete")}
            >
              {busy ? "در حال ثبت…" : "تکمیل کار"}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
