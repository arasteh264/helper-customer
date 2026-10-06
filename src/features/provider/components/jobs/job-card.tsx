import { useState } from "react";
import { CalendarClock, MapPin, Phone, Wallet } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

import { StatusBadge } from "@/src/components/shared/status-badge";
import { Job } from "../../types/types";
import { JOB_STATUS } from "../../utils/job-status";
import {
  formatDateTime,
  formatMoney,
  toEnglishDigits,
} from "@/src/utils/format";

export type JobAction = "accept" | "reject" | "start" | "complete";

interface JobCardProps {
  job: Job;
  onAction: (
    id: string,
    action: JobAction,
    proposedPriceToman?: number,
  ) => void;
  busy?: boolean;
}

export function JobCard({ job, onAction, busy = false }: JobCardProps) {
  const [priceInput, setPriceInput] = useState("");
  const proposedPriceToman = Number(
    toEnglishDigits(priceInput).replace(/\D/g, ""),
  );
  const status = JOB_STATUS[job.status];
  const paymentStatusLabel = job.paymentStatus
    ? {
        PENDING: "در انتظار پرداخت",
        PAID: "پرداخت‌شده",
        FAILED: "پرداخت ناموفق",
        REFUNDED: "بازپرداخت‌شده",
      }[job.paymentStatus]
    : null;
  const paymentConfirmed =
    job.paymentStatus === "PAID" ||
    job.customerConfirmed ||
    ["in_progress", "awaiting_confirmation", "completed"].includes(job.status);

  const showPhone = !!job.customerPhone && paymentConfirmed;

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
          {job.paymentStatus && (
            <p className="mt-2 text-xs text-foreground/60">
              وضعیت پرداخت: {paymentStatusLabel}
            </p>
          )}
          {job.customerConfirmedAt || job.customerConfirmed ? (
            <p className="mt-1 text-xs font-medium text-green-700">
              انجام کار توسط مشتری تأیید شده است.
            </p>
          ) : null}
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
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-end">
              <label className="grid gap-1 text-xs text-foreground/60">
                مبلغ قطعی (تومان)
                <Input
                  inputMode="numeric"
                  dir="ltr"
                  value={priceInput}
                  onChange={(event) =>
                    setPriceInput(
                      toEnglishDigits(event.target.value).replace(/\D/g, ""),
                    )
                  }
                  className="h-10 w-full min-w-36 rounded-lg px-3 text-sm"
                  aria-label="مبلغ پیشنهادی قطعی به تومان"
                />
              </label>
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
                disabled={busy || proposedPriceToman <= 0}
                onClick={() => onAction(job.id, "accept", proposedPriceToman)}
              >
                {busy ? "در حال ثبت…" : "ثبت قیمت و پذیرش"}
              </Button>
            </div>
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
