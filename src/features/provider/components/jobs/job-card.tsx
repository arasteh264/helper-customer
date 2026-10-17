import { useState } from "react";
import { CalendarClock, MapPin, Phone, Send, Wallet } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

import { StatusBadge } from "@/src/components/shared/status-badge";
import { QuoteItemSupplyMode, type Job, type QuoteItem } from "../../types/types";
import { JOB_STATUS } from "../../utils/job-status";
import {
  formatDateTime,
  formatMoney,
  formatNumber,
  formatWithCommas,
  toEnglishDigits,
} from "@/src/utils/format";
import { InvoiceEditor } from "@/src/features/invoices/components/invoice-editor";
import { ProviderPriceAdjustment } from "./provider-price-adjustment";
import { formatDate } from "@/src/utils/format";

export type JobAction =
  | "quote"
  | "reject"
  | "start"
  | "complete"
  | "cancel-request";

interface JobCardProps {
  job: Job;
  onAction: (
    id: string,
    action: JobAction,
    proposedPriceToman?: number,
    quoteNote?: string,
    estimatedHours?: number,
    declineReason?: string,
    declineNote?: string,
    items?: QuoteItem[],
    workReport?: {
      summary: string;
      materials: string[];
      warrantyDays?: number;
      warrantyNote?: string;
    },
    cancellationReason?: string,
    cancellationNote?: string,
  ) => void;
  onDisputeMessage: (id: string, body: string) => Promise<boolean>;
  onRaiseNonPaymentDispute: (id: string, description: string) => Promise<boolean>;
  commissionRate: number | null;
  accessToken: string;
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

const CANCELLATION_REASON_LABELS: Record<string, string> = {
  PROJECT_NOT_FOUND: "پروژه یا محل کار وجود ندارد",
  CUSTOMER_UNAVAILABLE: "مشتری در دسترس نیست",
  ACCESS_ISSUE: "مشکل دسترسی به محل",
  SCOPE_MISMATCH: "شرح کار با درخواست متفاوت است",
  SAFETY_CONCERN: "نگرانی ایمنی",
  OTHER: "سایر",
};

export function JobCard({
  job,
  onAction,
  onDisputeMessage,
  onRaiseNonPaymentDispute,
  commissionRate,
  accessToken,
  busy = false,
}: JobCardProps) {
  const [priceInput, setPriceInput] = useState("");
  const [quoteNote, setQuoteNote] = useState(job.quoteNote ?? "");
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>(job.quoteItems ?? []);
  const [hoursInput, setHoursInput] = useState(
    job.estimatedHours?.toString() ?? "",
  );
  const [disputeReply, setDisputeReply] = useState("");
  const [nonPaymentDescription, setNonPaymentDescription] = useState("");
  const [showNonPaymentForm, setShowNonPaymentForm] = useState(false);
  const [showDeclineForm, setShowDeclineForm] = useState(false);
  const [declineReason, setDeclineReason] = useState("NOT_MY_SPECIALTY");
  const [declineNote, setDeclineNote] = useState("");
  const [completionSummary, setCompletionSummary] = useState("");
  const [completionMaterials, setCompletionMaterials] = useState("");
  const [warrantyDays, setWarrantyDays] = useState("0");
  const [warrantyNote, setWarrantyNote] = useState("");
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [showCancellationForm, setShowCancellationForm] = useState(false);
  const [cancellationStep, setCancellationStep] = useState<1 | 2 | 3>(1);
  const [cancellationReason, setCancellationReason] = useState("PROJECT_NOT_FOUND");
  const [cancellationNote, setCancellationNote] = useState("");
  const hasPendingCancellation =
    job.cancellationRequest?.status === "PENDING";
  const estimatedHours = Number(toEnglishDigits(hoursInput).replace(",", "."));
  const proposedPriceToman =
    job.pricingMode === "HOURLY" && job.hourlyRateToman
      ? Math.round(job.hourlyRateToman * estimatedHours)
      : Number(toEnglishDigits(priceInput).replace(/\D/g, ""));
  const platformCommission =
    commissionRate == null
      ? null
      : Math.round((proposedPriceToman * commissionRate) / 100);
  const providerNet =
    platformCommission == null
      ? null
      : proposedPriceToman - platformCommission;
  const separatelyChargedItems = quoteItems.reduce(
    (sum, item) =>
      sum +
      (item.supplyMode === "PROVIDER_SEPARATE" ? item.amountToman : 0),
    0,
  );
  const totalQuoteToman = proposedPriceToman + separatelyChargedItems;
  const hasInvalidItems = quoteItems.some(
    (item) =>
      !item.name.trim() ||
      (item.supplyMode === "PROVIDER_SEPARATE" && item.amountToman <= 0),
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
          {job.workReport ? (
            <div className="mt-3 rounded-lg border border-primary/15 bg-primary/[0.04] p-3 text-xs leading-6">
              <p className="font-semibold text-foreground">گزارش پایان کار ثبت‌شده</p>
              <p className="mt-1 whitespace-pre-wrap text-foreground/70">{job.workReport.summary}</p>
              {job.workReport.warrantyDays ? (
                <p className="mt-1 text-emerald-700">
                  ضمانت {formatNumber(job.workReport.warrantyDays)} روزه
                  {job.workReport.warrantyExpiresAt
                    ? ` تا ${formatDate(job.workReport.warrantyExpiresAt)}`
                    : ""}
                </p>
              ) : (
                <p className="mt-1 text-foreground/55">برای این کار ضمانتی ثبت نشده است.</p>
              )}
              {job.workReport.warrantyNote ? <p>{job.workReport.warrantyNote}</p> : null}
              {job.workReport.materials.length ? <p className="mt-1">اقلام مصرفی: {job.workReport.materials.join("، ")}</p> : null}
            </div>
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

        <div className="w-full">
          {job.status === "new" && (
            <div className="grid w-full gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-end">
              {job.quoteSubmitted ? (
                <p className="sm:col-span-3 text-xs leading-5 text-foreground/60">
                  پیشنهاد ثبت‌شده:{" "}
                  <span className="font-semibold text-foreground">
                    {formatMoney(job.quoteTotalPriceToman ?? job.proposedPriceToman ?? job.price)}
                  </span>
                  {" · "}منتظر انتخاب مشتری
                </p>
              ) : null}
              {job.pricingMode === "HOURLY" ? (
                <label className="grid gap-1 text-xs text-foreground/60">
                  ساعت تخمینی
                  <Input
                    inputMode="decimal"
                    dir="ltr"
                    value={hoursInput}
                    onChange={(event) =>
                      setHoursInput(
                        toEnglishDigits(event.target.value).replace(/[^\d.]/g, ""),
                      )
                    }
                    className="h-10 w-full min-w-36 rounded-lg px-3 text-sm"
                    aria-label="ساعت تخمینی انجام کار"
                  />
                  {job.hourlyRateToman ? (
                    <span className="text-xs">
                      مبلغ کل تخمینی:{" "}
                      {estimatedHours > 0
                        ? formatMoney(proposedPriceToman)
                        : "ساعت را وارد کنید"}
                    </span>
                  ) : null}
                </label>
              ) : (
                <label className="grid gap-1 text-xs text-foreground/60 sm:w-48">
                  مبلغ پیشنهادی (تومان)
                  <Input
                    inputMode="numeric"
                    dir="ltr"
                    value={formatWithCommas(priceInput)}
                    onChange={(event) =>
                      setPriceInput(
                        toEnglishDigits(event.target.value).replace(/\D/g, ""),
                      )
                    }
                    className="h-10 w-full min-w-36 rounded-lg px-3 text-sm"
                    aria-label="مبلغ پیشنهادی به تومان"
                  />
                  {proposedPriceToman > 0 ? (
                    <span className="text-[11px] leading-5 text-foreground/55">
                      مبلغ پیشنهادی شما: {formatMoney(proposedPriceToman)}
                    </span>
                  ) : null}
                </label>
              )}
              {job.status === "new" && job.allowsQuoteItems ? (
                <fieldset className="grid gap-3 rounded-xl border border-foreground/10 p-3 sm:col-span-3">
                      <legend className="px-1 text-xs font-semibold text-foreground">
                        قطعات و مواد موردنیاز (اختیاری)
                      </legend>
                      <p className="text-[11px] leading-5 text-foreground/55">
                        اجرت جدا محاسبه می‌شود؛ فقط اقلامی که متخصص جداگانه تهیه می‌کند به مبلغ پرداختی اضافه می‌شوند.
                      </p>
                      {quoteItems.map((item, index) => (
                        <div
                          key={index}
                          className="grid gap-2 rounded-lg bg-muted/30 p-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"
                        >
                          <Input
                            value={item.name}
                            maxLength={100}
                            onChange={(event) =>
                              setQuoteItems((current) =>
                                current.map((entry, itemIndex) =>
                                  itemIndex === index
                                    ? { ...entry, name: event.target.value }
                                    : entry,
                                ),
                              )
                            }
                            placeholder="نام قلم"
                            aria-label={`نام قلم ${index + 1}`}
                            className="h-9"
                          />
                          <select
                            value={item.supplyMode}
                            onChange={(event) => {
                              const supplyMode = event.target.value as QuoteItemSupplyMode;
                              setQuoteItems((current) =>
                                current.map((entry, itemIndex) =>
                                  itemIndex === index
                                    ? {
                                        ...entry,
                                        supplyMode,
                                        amountToman:
                                          supplyMode === "CUSTOMER"
                                            ? 0
                                            : entry.amountToman,
                                      }
                                    : entry,
                                ),
                              );
                            }}
                            aria-label={`مسئول تأمین قلم ${index + 1}`}
                            className="h-9 rounded-md border border-foreground/15 bg-background px-2 text-xs"
                          >
                            <option value="CUSTOMER">مشتری تهیه می‌کند</option>
                            <option value="PROVIDER_SEPARATE">متخصص تهیه می‌کند؛ هزینه جدا</option>
                            <option value="PROVIDER_INCLUDED">متخصص تهیه می‌کند؛ داخل اجرت</option>
                          </select>
                          {item.supplyMode !== "CUSTOMER" ? (
                            <Input
                              inputMode="numeric"
                              dir="ltr"
                              value={item.amountToman ? formatWithCommas(String(item.amountToman)) : ""}
                              onChange={(event) => {
                                const amountToman = Number(
                                  toEnglishDigits(event.target.value).replace(/\D/g, ""),
                                );
                                setQuoteItems((current) =>
                                  current.map((entry, itemIndex) =>
                                    itemIndex === index
                                      ? { ...entry, amountToman }
                                      : entry,
                                  ),
                                );
                              }}
                              placeholder={
                                item.supplyMode === "PROVIDER_INCLUDED"
                                  ? "مبلغ تخمینی (اختیاری)"
                                  : "هزینه به تومان"
                              }
                              aria-label={`هزینه قلم ${index + 1}`}
                              className="h-9"
                            />
                          ) : (
                            <span className="flex items-center text-xs text-foreground/50">
                              بدون هزینه‌ی جدا
                            </span>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setQuoteItems((current) =>
                                current.filter((_, itemIndex) => itemIndex !== index),
                              )
                            }
                            aria-label={`حذف قلم ${index + 1}`}
                          >
                            حذف
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-fit"
                        disabled={quoteItems.length >= 20}
                        onClick={() =>
                          setQuoteItems((current) => [
                            ...current,
                            {
                              name: "",
                              amountToman: 0,
                              supplyMode: "CUSTOMER",
                            },
                          ])
                        }
                      >
                        افزودن قلم
                      </Button>
                      {proposedPriceToman > 0 ? (
                        <p className="text-xs font-semibold text-foreground">
                          اجرت: {formatMoney(proposedPriceToman)} · مبلغ قابل پرداخت: {formatMoney(totalQuoteToman)}
                        </p>
                      ) : null}
                </fieldset>
              ) : null}
              {proposedPriceToman > 0 ? (
                <div className="flex flex-wrap gap-x-4 gap-y-1 rounded-lg bg-primary/[0.04] px-3 py-2 text-xs sm:col-span-3">
                  {commissionRate == null ||
                  platformCommission == null ||
                  providerNet == null ? (
                    <span className="text-amber-800">
                      نرخ کمیسیون برای محاسبه‌ی سهم خالص در دسترس نیست.
                    </span>
                  ) : (
                    <>
                      <span className="text-foreground/60">
                        کارمزد هلپا۲۴ ({formatNumber(commissionRate)}٪): {formatMoney(platformCommission)}
                      </span>
                      <span className="font-semibold text-foreground">
                        دریافتی پس از کارمزد:{" "}
                        {formatMoney(providerNet + separatelyChargedItems)}
                      </span>
                    </>
                  )}
                </div>
              ) : null}
              <label className="grid min-w-0 gap-1.5 text-xs text-foreground/65 sm:col-span-3">
                <span className="font-semibold text-foreground">
                  شرح خدمات و هزینه
                </span>
                <span className="text-[11px] leading-5 text-foreground/50">
                  مشخص کنید این مبلغ شامل چه کارهایی است و هزینه‌ی بازدید یا
                  قطعات چگونه محاسبه می‌شود.
                </span>
                <textarea
                  value={quoteNote}
                  onChange={(event) => setQuoteNote(event.target.value)}
                  maxLength={1000}
                  rows={4}
                  className="min-h-28 w-full resize-y rounded-xl border border-foreground/15 bg-background px-3.5 py-3 text-sm leading-7 text-foreground outline-none transition-colors placeholder:text-foreground/40 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                  aria-label="توضیحات پیشنهاد قیمت"
                  placeholder="مثلاً: این مبلغ شامل عیب‌یابی و اجرت تعمیر است. هزینه‌ی قطعه در صورت نیاز جداگانه و پس از هماهنگی اعلام می‌شود. زمان تقریبی انجام کار حدود یک ساعت است."
                />
                <span className="text-end text-[11px] text-foreground/45">
                  {new Intl.NumberFormat("fa-IR").format(quoteNote.length)} از
                  ۱۰۰۰ نویسه
                </span>
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={busy}
                onClick={() => setShowDeclineForm((shown) => !shown)}
                className="w-fit"
              >
                رد درخواست
              </Button>
              <Button
                type="button"
                disabled={
                  busy ||
                  commissionRate == null ||
                  proposedPriceToman <= 0 ||
                  quoteNote.trim().length < 5 ||
                  hasInvalidItems ||
                  (job.pricingMode === "HOURLY" && estimatedHours <= 0)
                }
                onClick={() =>
                  onAction(
                    job.id,
                    "quote",
                    proposedPriceToman,
                    quoteNote,
                    job.pricingMode === "HOURLY" ? estimatedHours : undefined,
                    undefined,
                    undefined,
                    quoteItems,
                  )
                }
                className="w-full sm:w-auto"
              >
                {busy
                  ? "در حال ثبت…"
                  : job.quoteSubmitted
                    ? "ویرایش پیشنهاد"
                    : "ارسال پیشنهاد قیمت"}
              </Button>
            </div>
          )}
          {job.status === "accepted" && (
            <div className="flex flex-wrap gap-2">
              {!hasPendingCancellation ? (
                <Button
                  type="button"
                  disabled={busy}
                  onClick={() => onAction(job.id, "start")}
                >
                  {busy ? "در حال ثبت…" : "شروع کار"}
                </Button>
              ) : null}
              <Button
                type="button"
                variant="outline"
                disabled={busy || hasPendingCancellation}
                onClick={() => {
                  setCancellationStep(1);
                  setShowCancellationForm((shown) => !shown);
                }}
              >
                درخواست لغو کار
              </Button>
            </div>
          )}
          {job.status === "in_progress" && (
            <div className="flex flex-wrap gap-2">
              {!hasPendingCancellation ? (
                <Button
                  type="button"
                  disabled={busy}
                  variant={showCompletionForm ? "outline" : "primary"}
                  onClick={() => setShowCompletionForm((shown) => !shown)}
                >
                  {showCompletionForm ? "بستن گزارش پایان کار" : "ثبت گزارش و تکمیل کار"}
                </Button>
              ) : null}
              <Button
                type="button"
                variant="outline"
                disabled={busy || hasPendingCancellation}
                onClick={() => {
                  setCancellationStep(1);
                  setShowCancellationForm((shown) => !shown);
                }}
              >
                درخواست لغو کار
              </Button>
            </div>
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
        {hasPendingCancellation ? (
          <div className="mt-4 rounded-xl border border-amber-500/25 bg-amber-500/[0.06] p-3 text-sm leading-6 text-amber-950">
            درخواست لغو شما در انتظار بررسی پشتیبانی است. تا اعلام نتیجه، شروع یا
            تکمیل این کار غیرفعال است.
          </div>
        ) : null}
        {job.cancellationRequest?.status === "REJECTED" ? (
          <p className="mt-3 rounded-lg border border-rose-500/20 bg-rose-500/[0.04] px-3 py-2 text-xs leading-6 text-foreground/70">
            درخواست لغو قبلی رد شده است
            {job.cancellationRequest.decisionNote
              ? `: ${job.cancellationRequest.decisionNote}`
              : "؛ در صورت لزوم می‌توانید درخواست تازه‌ای ثبت کنید."}
          </p>
        ) : null}
        {job.cancellationRequest?.status === "APPROVED" ? (
          <p className="mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] px-3 py-2 text-xs leading-6 text-foreground/70">
            پشتیبانی درخواست لغو این کار را تأیید کرده است.
          </p>
        ) : null}
        {showCancellationForm &&
        ["accepted", "in_progress"].includes(job.status) &&
        !hasPendingCancellation ? (
          <form
            className="mt-4 space-y-4 rounded-xl border border-rose-500/20 bg-rose-500/[0.035] p-3 sm:p-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (cancellationStep !== 3) return;
              onAction(
                job.id,
                "cancel-request",
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                cancellationReason,
                cancellationNote,
              );
            }}
          >
            <div>
              <p className="text-sm font-semibold">درخواست لغو کار</p>
              <p className="mt-1 text-xs leading-6 text-foreground/65">
                درخواست شما برای بررسی به پشتیبانی ارسال می‌شود و لغو نهایی پس از اعلام نتیجه انجام خواهد شد.
              </p>
            </div>
            <ol
              aria-label="مراحل ثبت درخواست لغو"
              className="grid grid-cols-3 gap-2 text-center text-[11px] sm:text-xs"
            >
              {["دلیل لغو", "توضیحات", "بازبینی"].map((label, index) => {
                const step = index + 1;
                const currentOrComplete = step <= cancellationStep;
                return (
                  <li
                    key={label}
                    aria-current={step === cancellationStep ? "step" : undefined}
                    className={`rounded-lg px-2 py-2 ${
                      currentOrComplete
                        ? "bg-rose-600/10 font-semibold text-rose-800"
                        : "bg-foreground/[0.04] text-foreground/45"
                    }`}
                  >
                    {step}. {label}
                  </li>
                );
              })}
            </ol>
            {cancellationStep === 1 ? (
              <label className="grid gap-1.5 text-sm font-medium">
                دلیل درخواست لغو
                <select
                  className="h-11 rounded-lg border border-input bg-background px-3 text-sm"
                  value={cancellationReason}
                  onChange={(event) => setCancellationReason(event.target.value)}
                >
                  {Object.entries(CANCELLATION_REASON_LABELS).map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ),
                  )}
                </select>
              </label>
            ) : null}
            {cancellationStep === 2 ? (
              <label className="grid gap-1.5 text-sm font-medium">
                توضیحات {cancellationReason === "OTHER" ? "(الزامی)" : "(اختیاری)"}
                <textarea
                  className="min-h-24 rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  maxLength={500}
                  required={cancellationReason === "OTHER"}
                  value={cancellationNote}
                  onChange={(event) => setCancellationNote(event.target.value)}
                  placeholder="شرح کوتاهی از شرایط پیش‌آمده بنویسید."
                />
              </label>
            ) : null}
            {cancellationStep === 3 ? (
              <div className="space-y-2 rounded-lg border border-foreground/10 bg-background/70 p-3 text-sm">
                <p className="font-semibold">بازبینی درخواست</p>
                <p className="text-foreground/70">
                  <span className="text-foreground/50">دلیل: </span>
                  {CANCELLATION_REASON_LABELS[cancellationReason] ?? cancellationReason}
                </p>
                {cancellationNote.trim() ? (
                  <p className="whitespace-pre-wrap leading-6 text-foreground/70">
                    <span className="text-foreground/50">توضیحات: </span>
                    {cancellationNote.trim()}
                  </p>
                ) : null}
                <p className="text-xs leading-5 text-foreground/55">
                  پس از ارسال، تا اعلام نتیجه‌ی پشتیبانی امکان شروع یا تکمیل این کار وجود ندارد.
                </p>
              </div>
            ) : null}
            <div className="flex flex-wrap gap-2">
              {cancellationStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  disabled={busy}
                  onClick={() =>
                    setCancellationStep(cancellationStep === 3 ? 2 : 1)
                  }
                >
                  مرحله‌ی قبل
                </Button>
              ) : null}
              {cancellationStep < 3 ? (
                <Button
                  type="button"
                  disabled={
                    busy ||
                    (cancellationStep === 2 &&
                      cancellationReason === "OTHER" &&
                      cancellationNote.trim().length < 5)
                  }
                  onClick={() =>
                    setCancellationStep(cancellationStep === 1 ? 2 : 3)
                  }
                >
                  ادامه
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={busy}
                >
                  {busy ? "در حال ثبت…" : "ارسال درخواست برای پشتیبانی"}
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                disabled={busy}
                onClick={() => {
                  setShowCancellationForm(false);
                  setCancellationStep(1);
                }}
              >
                انصراف
              </Button>
            </div>
          </form>
        ) : null}
        {showCompletionForm &&
        job.status === "in_progress" &&
        !hasPendingCancellation ? (
          <form
            className="mt-4 space-y-3 rounded-xl border border-primary/20 bg-primary/[0.035] p-3 sm:p-4"
            onSubmit={(event) => {
              event.preventDefault();
              onAction(
                job.id,
                "complete",
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                {
                  summary: completionSummary.trim(),
                  materials: completionMaterials
                    .split(/\r?\n/)
                    .map((item) => item.trim())
                    .filter(Boolean),
                  warrantyDays: Number(warrantyDays),
                  warrantyNote: warrantyNote.trim() || undefined,
                },
              );
            }}
          >
            <div>
              <h4 className="font-semibold">گزارش پایان کار</h4>
              <p className="mt-1 text-xs leading-5 text-foreground/55">
                مشتری این گزارش و ضمانت را در پرونده‌ی درخواست می‌بیند و سپس انجام کار را تأیید می‌کند.
              </p>
            </div>
            <label className="grid gap-1.5 text-sm font-medium">
              شرح کار انجام‌شده
              <textarea
                required
                minLength={10}
                maxLength={5000}
                rows={4}
                value={completionSummary}
                onChange={(event) => setCompletionSummary(event.target.value)}
                placeholder="کارهای انجام‌شده، نتیجه و نکته‌هایی که مشتری باید بداند را بنویسید."
                className="w-full rounded-lg border border-foreground/15 bg-background p-3 text-sm font-normal leading-6"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              قطعات یا اقلام مصرف‌شده (اختیاری؛ هر مورد در یک خط)
              <textarea
                rows={2}
                maxLength={10000}
                value={completionMaterials}
                onChange={(event) => setCompletionMaterials(event.target.value)}
                className="w-full rounded-lg border border-foreground/15 bg-background p-3 text-sm font-normal leading-6"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1.5 text-sm font-medium">
                مدت ضمانت (روز؛ صفر یعنی بدون ضمانت)
                <input
                  type="number"
                  min={0}
                  max={3650}
                  value={warrantyDays}
                  onChange={(event) => setWarrantyDays(event.target.value)}
                  className="h-11 rounded-lg border border-foreground/15 bg-background px-3 text-sm font-normal"
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium">
                شرایط یا توضیح ضمانت (اختیاری)
                <input
                  maxLength={1000}
                  value={warrantyNote}
                  onChange={(event) => setWarrantyNote(event.target.value)}
                  className="h-11 min-w-0 rounded-lg border border-foreground/15 bg-background px-3 text-sm font-normal"
                />
              </label>
            </div>
            <Button
              type="submit"
              disabled={
                busy ||
                completionSummary.trim().length < 10 ||
                !Number.isInteger(Number(warrantyDays)) ||
                Number(warrantyDays) < 0 ||
                Number(warrantyDays) > 3650 ||
                completionMaterials.split(/\r?\n/).filter((item) => item.trim()).length > 50
              }
              className="w-full sm:w-auto"
            >
              {busy ? "در حال ثبت…" : "ارسال گزارش برای تأیید مشتری"}
            </Button>
          </form>
        ) : null}
      </div>
      {showDeclineForm && job.status === "new" ? (
        <div className="mt-2 flex flex-wrap items-end gap-2 rounded-lg bg-foreground/[0.03] p-2">
          <label className="grid min-w-44 gap-1 text-xs">
            علت رد
            <select
              value={declineReason}
              onChange={(event) => setDeclineReason(event.target.value)}
              className="h-9 rounded-lg border border-foreground/15 bg-background px-2 text-xs"
              disabled={busy}
            >
              <option value="NOT_MY_SPECIALTY">خارج از تخصص من است</option>
              <option value="OUT_OF_SERVICE_AREA">خارج از محدوده‌ی خدمت‌رسانی من است</option>
              <option value="SCHEDULE_UNAVAILABLE">در زمان درخواستی امکان انجام ندارم</option>
              <option value="REQUEST_DETAILS_INSUFFICIENT">جزئیات درخواست کافی نیست</option>
              <option value="PRICE_OR_BUDGET">شرایط یا بودجه‌ی درخواست مناسب نیست</option>
              <option value="OTHER">سایر</option>
            </select>
          </label>
          {declineReason === "OTHER" ? (
            <label className="grid min-w-48 flex-1 gap-1 text-xs">
              توضیح
              <textarea
                value={declineNote}
                onChange={(event) => setDeclineNote(event.target.value)}
                minLength={5}
                maxLength={500}
                rows={1}
                className="min-h-9 w-full resize-y rounded-lg border border-foreground/15 bg-background px-2 py-1.5 text-xs leading-5"
                placeholder="علت را کوتاه بنویسید"
                disabled={busy}
              />
            </label>
          ) : null}
          <div className="ms-auto flex gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() => setShowDeclineForm(false)}
            >
              انصراف
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={busy || (declineReason === "OTHER" && declineNote.trim().length < 5)}
              onClick={() =>
                onAction(
                  job.id,
                  "reject",
                  undefined,
                  undefined,
                  undefined,
                  declineReason,
                  declineReason === "OTHER" ? declineNote.trim() : undefined,
                )
              }
            >
              تأیید رد درخواست
            </Button>
          </div>
        </div>
      ) : null}
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
      {["accepted", "awaiting_payment", "in_progress", "awaiting_confirmation", "completed"].includes(job.status) ? (
        <InvoiceEditor serviceRequestId={job.id} accessToken={accessToken} />
      ) : null}
      {job.status === "in_progress" ? (
        <ProviderPriceAdjustment
          requestId={job.id}
          accessToken={accessToken}
        />
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
