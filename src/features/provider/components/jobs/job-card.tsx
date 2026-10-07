import { useState } from "react";
import { CalendarClock, MapPin, Phone, Send, Wallet } from "lucide-react";

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
  onDisputeMessage: (id: string, body: string) => Promise<boolean>;
  onRaiseNonPaymentDispute: (id: string, description: string) => Promise<boolean>;
  busy?: boolean;
}

const DISPUTE_REASON_LABELS: Record<string, string> = {
  WORK_NOT_COMPLETED: "کار انجام نشده یا ناقص است",
  WORK_QUALITY: "کیفیت انجام کار مورد قبول نیست",
  PRICE_DISAGREEMENT: "اختلاف بر سر مبلغ یا هزینه",
  PROVIDER_NO_SHOW: "متخصص برای انجام کار حاضر نشد",
  CUSTOMER_NON_PAYMENT: "اختلاف درباره‌ی پرداخت مشتری",
  OTHER: "سایر موارد",
};

export function JobCard({
  job,
  onAction,
  onDisputeMessage,
  onRaiseNonPaymentDispute,
  busy = false,
}: JobCardProps) {
  const [priceInput, setPriceInput] = useState("");
  const [disputeReply, setDisputeReply] = useState("");
  const [nonPaymentDescription, setNonPaymentDescription] = useState("");
  const [showNonPaymentForm, setShowNonPaymentForm] = useState(false);
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
          {job.status === "awaiting_payment" && (
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => setShowNonPaymentForm((open) => !open)}
            >
              گزارش اختلاف پرداخت
            </Button>
          )}
        </div>
      </div>
      {showNonPaymentForm ? (
        <div className="mt-4 space-y-3 rounded-lg border border-destructive/20 p-3">
          <p className="text-sm font-medium">دلیل: مشتری هزینه‌ی توافق‌شده را پرداخت نکرده است</p>
          <label className="block space-y-2 text-sm">
            شرح و جزئیات
            <textarea
              value={nonPaymentDescription}
              onChange={(event) => setNonPaymentDescription(event.target.value)}
              minLength={10}
              maxLength={2000}
              rows={3}
              className="w-full rounded-lg border border-foreground/15 bg-background p-3 leading-6"
              placeholder="زمان و جزئیات پیگیری پرداخت را بنویسید."
            />
          </label>
          <Button
            type="button"
            disabled={busy || nonPaymentDescription.trim().length < 10}
            onClick={() => {
              void onRaiseNonPaymentDispute(
                job.id,
                nonPaymentDescription.trim(),
              ).then((submitted) => {
                if (submitted) {
                  setNonPaymentDescription("");
                  setShowNonPaymentForm(false);
                }
              });
            }}
          >
            ثبت برای بررسی ادمین
          </Button>
        </div>
      ) : null}
      {job.disputeReason ? (
        <div className="mt-4 space-y-3 border-t border-foreground/10 pt-4">
          {job.disputeResolved ? (
            <p className="rounded-lg bg-foreground/[0.04] p-3 text-sm leading-6">
              نتیجه:{" "}
              {job.disputeResolution === "PROVIDER"
                ? "به نفع متخصص"
                : job.disputeResolution === "BUYER"
                  ? "به نفع مشتری"
                  : "ثبت نشده"}
              {job.disputeResolutionNote ? ` — ${job.disputeResolutionNote}` : ""}
            </p>
          ) : null}
          <div className="rounded-lg border border-destructive/20 bg-destructive/[0.03] p-3 text-sm">
            <p className="font-medium">
              دلیل اختلاف:{" "}
              {job.disputeReason
                ? DISPUTE_REASON_LABELS[job.disputeReason] ?? job.disputeReason
                : "ثبت نشده"}
            </p>
            <p className="mt-1 whitespace-pre-wrap text-foreground/70">
              {job.disputeDescription ?? "شرحی ثبت نشده است."}
            </p>
          </div>
          {job.disputeMessages?.map((message) => (
            <div key={message.id} className="rounded-lg bg-foreground/[0.04] p-3">
              <p className="text-xs text-foreground/55">
                {message.authorRole === "PROVIDER" ? "پاسخ شما" : message.authorName}
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-6">{message.body}</p>
            </div>
          ))}
          {job.status === "disputed" ? (
            <>
              <label className="block space-y-2 text-sm font-medium">
                پاسخ یا توضیح تکمیلی
                <textarea
                  value={disputeReply}
                  onChange={(event) => setDisputeReply(event.target.value)}
                  maxLength={2000}
                  rows={3}
                  className="w-full rounded-lg border border-foreground/15 bg-background p-3 font-normal leading-6"
                  placeholder="توضیحات خود را برای مشتری و تیم رسیدگی بنویسید."
                />
              </label>
              <Button
                type="button"
                variant="outline"
                disabled={busy || disputeReply.trim().length < 2}
                onClick={() => {
                  void onDisputeMessage(job.id, disputeReply.trim()).then(
                    (sent) => {
                      if (sent) setDisputeReply("");
                    },
                  );
                }}
              >
                <Send size={15} />
                ارسال پاسخ
              </Button>
            </>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
