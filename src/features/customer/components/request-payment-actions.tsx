"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2, Loader2, RefreshCw } from "lucide-react";

import { SectionCard } from "@/src/components/shared/section-card";
import { StatusBadge } from "@/src/components/shared/status-badge";
import { formatMoney } from "@/src/utils/format";
import { formatDateTime } from "@/src/utils/format";
import { ApiErrorCode, normalizeError } from "@/src/lib/api/error";
import {
  requestApi,
  type ServiceRequestPayment,
} from "@/src/features/request/api/request.api";
import type {
  DisputeReason,
  RequestStatus,
  ServiceRequestDispute,
} from "../types/customer.types";

const PAYMENT_STATUS: Record<
  ServiceRequestPayment["status"],
  { label: string; tone: "success" | "warning" | "danger" | "neutral" }
> = {
  PENDING: { label: "در انتظار پرداخت", tone: "warning" },
  PAID: { label: "پرداخت‌شده", tone: "success" },
  FAILED: { label: "پرداخت ناموفق", tone: "danger" },
  REFUNDED: { label: "مبلغ بازپرداخت‌شده", tone: "neutral" },
};

export function RequestPaymentActions({
  requestId,
  requestStatus,
  amountToman,
  walletBalance,
  initialPayment,
  initialDispute,
  accessToken,
}: {
  requestId: string;
  requestStatus: RequestStatus;
  amountToman?: number;
  walletBalance?: number;
  initialPayment: ServiceRequestPayment | null;
  initialDispute: ServiceRequestDispute | null;
  accessToken: string;
}) {
  const router = useRouter();
  const [payment, setPayment] = useState(initialPayment);
  const [busy, setBusy] = useState(false);
  const [disputeFormOpen, setDisputeFormOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState<DisputeReason>(
    initialDispute?.reason ?? "WORK_NOT_COMPLETED",
  );
  const [disputeDescription, setDisputeDescription] = useState(
    initialDispute?.description ?? "",
  );
  const [dispute, setDispute] = useState(initialDispute);
  const [disputeMessages, setDisputeMessages] = useState(
    initialDispute?.messages ?? [],
  );
  const [followUp, setFollowUp] = useState("");
  const isDisputed = requestStatus === "disputed";
  const hasDisputeCase = dispute !== null;
  useEffect(() => {
    if (!isDisputed) return;
    const interval = window.setInterval(() => router.refresh(), 20_000);
    return () => window.clearInterval(interval);
  }, [isDisputed, router]);
  const walletShortfall =
    amountToman != null && walletBalance != null
      ? Math.max(0, amountToman - walletBalance)
      : null;

  const continueToWallet = (requiredAmountToman: number) => {
    const returnTo = `/customer/requests/${requestId}`;
    try {
      window.sessionStorage.setItem("helper-wallet-return-to", returnTo);
    } catch {
      // The return link is also included in the URL for storage-restricted browsers.
    }
    const query = new URLSearchParams({
      returnTo,
      requiredToman: String(Math.max(10_000, requiredAmountToman)),
    });
    router.push(`/customer/wallet?${query.toString()}`);
  };

  const refreshPayment = async () => {
    setBusy(true);
    try {
      const currentPayment = await requestApi.getPaymentStatus(
        requestId,
        accessToken,
      );
      setPayment(currentPayment);
      router.refresh();
    } catch {
      toast.error("دریافت وضعیت پرداخت از سرور انجام نشد.");
    } finally {
      setBusy(false);
    }
  };

  const startCheckout = async () => {
    setBusy(true);
    try {
      const { paymentUrl } = await requestApi.checkout(requestId, accessToken);
      window.location.assign(paymentUrl);
    } catch {
      toast.error("شروع پرداخت انجام نشد. دوباره تلاش کنید.");
      setBusy(false);
    }
  };

  const payFromWallet = async () => {
    if (walletShortfall != null && walletShortfall > 0) {
      continueToWallet(walletShortfall);
      return;
    }

    setBusy(true);
    try {
      await requestApi.payFromWallet(requestId, accessToken);
      toast.success("پرداخت از کیف پول انجام شد.");
      router.refresh();
    } catch (error) {
      const normalized = normalizeError(error);
      if (normalized.code === ApiErrorCode.INSUFFICIENT_WALLET_BALANCE) {
        continueToWallet(amountToman ?? 10_000);
      } else {
        toast.error(normalized.message || "پرداخت از کیف پول انجام نشد.");
      }
    } finally {
      setBusy(false);
    }
  };

  const confirmCompletion = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await requestApi.confirmCompletion(requestId, accessToken);
      toast.success("اتمام کار تأیید شد.");
      router.refresh();
    } catch {
      toast.error("ثبت پاسخ شما انجام نشد. دوباره تلاش کنید.");
    } finally {
      setBusy(false);
    }
  };

  const confirmDisputedCompletion = async () => {
    if (busy) return;
    const confirmed = window.confirm(
      "با تأیید، اختلاف بسته می‌شود و مبلغ طبق روال به متخصص پرداخت خواهد شد. ادامه می‌دهید؟",
    );
    if (!confirmed) return;

    setBusy(true);
    try {
      await requestApi.confirmDisputedCompletion(requestId, accessToken);
      toast.success("اختلاف پس گرفته شد و انجام کار تأیید شد.");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "تأیید انجام کار و بستن اختلاف انجام نشد.",
      );
    } finally {
      setBusy(false);
    }
  };

  const saveDispute = async () => {
    if (busy) return;
    if (disputeDescription.trim().length < 10) {
      toast.error("شرح اختلاف را حداقل در ۱۰ نویسه وارد کنید.");
      return;
    }
    setBusy(true);
    try {
      await requestApi.dispute(
        requestId,
        accessToken,
        { reason: disputeReason, description: disputeDescription.trim() },
        isDisputed,
      );
      setDispute((current) => ({
        ...current,
        reason: disputeReason,
        description: disputeDescription.trim(),
        updatedAt: new Date().toISOString(),
        messages: disputeMessages,
        resolved: false,
        resolution: null,
        resolutionNote: null,
      }));
      toast.success(
        isDisputed
          ? "شرح اختلاف به‌روزرسانی شد."
          : "اختلاف برای بررسی ثبت شد.",
      );
      setDisputeFormOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "ثبت تغییرات اختلاف انجام نشد.",
      );
    } finally {
      setBusy(false);
    }
  };

  const submitFollowUp = async () => {
    if (busy) return;
    if (followUp.trim().length < 2) {
      toast.error("پیام پیگیری را وارد کنید.");
      return;
    }
    setBusy(true);
    try {
      const { data: message } = await requestApi.addDisputeMessage(
        requestId,
        accessToken,
        followUp.trim(),
      );
      setDisputeMessages((current) => [
        ...current,
        {
          id: message.id,
          body: message.body,
          createdAt: message.createdAt,
          authorId: message.author.id,
          authorName: message.author.name,
          authorRole: message.author.role,
        },
      ]);
      setDispute((current) =>
        current
          ? {
              ...current,
              updatedAt: message.createdAt,
              messages: [
                ...current.messages,
                {
                  id: message.id,
                  body: message.body,
                  createdAt: message.createdAt,
                  authorId: message.author.id,
                  authorName: message.author.name,
                  authorRole: message.author.role,
                },
              ],
            }
          : current,
      );
      setFollowUp("");
      toast.success("پیام پیگیری ارسال شد.");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "ارسال پیام انجام نشد.",
      );
    } finally {
      setBusy(false);
    }
  };

  const showPayment = requestStatus === "awaiting_payment" || payment !== null;
  const showCompletion =
    requestStatus === "awaiting_confirmation" && !isDisputed;
  if (!showPayment && !showCompletion && !hasDisputeCase) return null;

  return (
    <>
      {showPayment ? (
        <SectionCard
          title="وضعیت پرداخت"
          description="مبلغ قطعی اعلام‌شده از طرف متخصص به تومان نمایش داده شده است."
        >
          <div className="flex flex-col gap-4 rounded-xl border border-foreground/10 bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-foreground/55">مبلغ قطعی (تومان)</p>
              <p className="mt-1 text-xl font-semibold text-foreground">
                {amountToman != null
                  ? formatMoney(amountToman)
                  : "مبلغ ثبت نشده"}
              </p>
              {payment ? (
                <div className="mt-2 flex items-center gap-2">
                  <StatusBadge tone={PAYMENT_STATUS[payment.status].tone}>
                    {PAYMENT_STATUS[payment.status].label}
                  </StatusBadge>
                  <button
                    type="button"
                    onClick={refreshPayment}
                    disabled={busy}
                    aria-label="به‌روزرسانی وضعیت پرداخت"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-foreground/55 hover:bg-foreground/5 hover:text-foreground disabled:opacity-50"
                  >
                    <RefreshCw
                      size={15}
                      className={busy ? "animate-spin" : ""}
                    />
                  </button>
                </div>
              ) : (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-foreground/55">
                  <AlertCircle size={14} /> هنوز وضعیت پرداختی از سرور دریافت
                  نشده است.
                </p>
              )}
            </div>
            {requestStatus === "awaiting_payment" &&
            payment?.status !== "PAID" &&
            payment?.status !== "REFUNDED" ? (
              <div className="grid w-full gap-3 sm:w-auto sm:min-w-64">
                {payment?.status !== "PENDING" && (
                  <div className="rounded-lg bg-foreground/[0.04] px-3 py-2 text-xs text-foreground/60">
                    موجودی کیف پول:{" "}
                    {walletBalance == null
                      ? "در دسترس نیست"
                      : formatMoney(walletBalance)}
                    {walletShortfall != null && walletShortfall > 0 ? (
                      <span className="mt-1 block text-amber-800">
                        برای پرداخت {formatMoney(walletShortfall)} شارژ لازم
                        است.
                      </span>
                    ) : null}
                  </div>
                )}
                {payment?.status !== "PENDING" && (
                  <button
                    type="button"
                    onClick={payFromWallet}
                    disabled={busy || amountToman == null || amountToman <= 0}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {busy ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : null}
                    {walletShortfall != null && walletShortfall > 0
                      ? "شارژ کیف پول برای پرداخت"
                      : "پرداخت با کیف پول"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={startCheckout}
                  disabled={busy || amountToman == null || amountToman <= 0}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-foreground/15 px-5 text-sm font-medium text-foreground/75 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busy ? <Loader2 size={16} className="animate-spin" /> : null}
                  {payment?.status === "PENDING"
                    ? "ادامه پرداخت درگاه"
                    : "پرداخت مستقیم بانکی"}
                </button>
              </div>
            ) : null}
          </div>
        </SectionCard>
      ) : null}

      {showCompletion ? (
        <SectionCard
          title="تأیید انجام کار"
          description="پس از بررسی کار، آن را تأیید کنید یا برای ثبت اختلاف اقدام کنید."
        >
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={confirmCompletion}
              disabled={busy}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              {busy ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <CheckCircle2 size={16} />
              )}
              تأیید اتمام کار
            </button>
            <button
              type="button"
              onClick={() => setDisputeFormOpen((open) => !open)}
              disabled={busy}
              className="h-11 rounded-lg border border-destructive/30 px-4 text-sm font-medium text-destructive disabled:opacity-50"
            >
              ثبت اختلاف
            </button>
          </div>
          {disputeFormOpen ? (
            <div className="mt-5 space-y-4 rounded-xl border border-destructive/20 bg-background p-4">
              <label className="block space-y-2 text-sm font-medium">
                دلیل اختلاف
                <select
                  value={disputeReason}
                  onChange={(event) =>
                    setDisputeReason(event.target.value as DisputeReason)
                  }
                  className="h-11 w-full rounded-lg border border-foreground/15 bg-background px-3 font-normal"
                >
                  <option value="WORK_NOT_COMPLETED">کار انجام نشده یا ناقص است</option>
                  <option value="WORK_QUALITY">کیفیت انجام کار مورد قبول نیست</option>
                  <option value="PRICE_DISAGREEMENT">اختلاف بر سر مبلغ یا هزینه</option>
                  <option value="PROVIDER_NO_SHOW">متخصص برای انجام کار حاضر نشد</option>
                  <option value="OTHER">سایر موارد</option>
                </select>
              </label>
              <label className="block space-y-2 text-sm font-medium">
                شرح اختلاف
                <textarea
                  value={disputeDescription}
                  onChange={(event) => setDisputeDescription(event.target.value)}
                  minLength={10}
                  maxLength={2000}
                  rows={4}
                  className="w-full rounded-lg border border-foreground/15 bg-background p-3 font-normal leading-6"
                  placeholder="جزئیات اختلاف را برای بررسی بهتر توضیح دهید."
                />
              </label>
              <button
                type="button"
                onClick={saveDispute}
                disabled={busy || disputeDescription.trim().length < 10}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50"
              >
                {busy ? <Loader2 size={16} className="animate-spin" /> : null}
                ثبت اختلاف
              </button>
            </div>
          ) : null}
        </SectionCard>
      ) : null}

      {hasDisputeCase ? (
        <SectionCard
          title={dispute?.resolved ? "نتیجه‌ی رسیدگی به اختلاف" : "پیگیری اختلاف"}
          description={
            dispute?.resolved
              ? "پرونده بسته شده است؛ شرح، پیام‌ها و نتیجه‌ی ثبت‌شده را مشاهده کنید."
              : "می‌توانید شرح اولیه را ویرایش کنید و پیام تکمیلی برای تیم رسیدگی یا متخصص بفرستید."
          }
        >
          <div className="space-y-4">
            {dispute?.resolved ? (
              <p className="rounded-lg bg-foreground/[0.04] p-3 text-sm leading-6">
                نتیجه:{" "}
                {dispute.resolution === "PROVIDER"
                  ? "به نفع متخصص"
                  : dispute.resolution === "BUYER"
                    ? "به نفع مشتری"
                    : "ثبت نشده"}
                {dispute.resolutionNote ? ` — ${dispute.resolutionNote}` : ""}
              </p>
            ) : null}
            {!dispute?.resolved ? (
              <>
                {isDisputed ? (
                  <div className="rounded-lg border border-primary/20 bg-primary/[0.04] p-3">
                    <p className="text-sm leading-6">
                      اگر با متخصص به توافق رسیده‌اید، می‌توانید اختلاف را پس
                      بگیرید و انجام کار را تأیید کنید. با این کار پرونده بسته
                      و مبلغ طبق روال برای متخصص تسویه می‌شود.
                    </p>
                    <button
                      type="button"
                      onClick={confirmDisputedCompletion}
                      disabled={busy}
                      className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50"
                    >
                      {busy ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <CheckCircle2 size={16} />
                      )}
                      پس گرفتن اختلاف و تأیید کار
                    </button>
                  </div>
                ) : null}
                <label className="block space-y-2 text-sm font-medium">
                  دلیل اختلاف
                  <select
                    value={disputeReason}
                    onChange={(event) =>
                      setDisputeReason(event.target.value as DisputeReason)
                    }
                    className="h-11 w-full rounded-lg border border-foreground/15 bg-background px-3 font-normal"
                    disabled={
                      dispute?.reason === "CUSTOMER_NON_PAYMENT" || !isDisputed
                    }
                  >
                    {dispute?.reason === "CUSTOMER_NON_PAYMENT" ? (
                      <option value="CUSTOMER_NON_PAYMENT">
                        اختلاف پرداخت ثبت‌شده از طرف متخصص
                      </option>
                    ) : null}
                    <option value="WORK_NOT_COMPLETED">
                      کار انجام نشده یا ناقص است
                    </option>
                    <option value="WORK_QUALITY">
                      کیفیت انجام کار مورد قبول نیست
                    </option>
                    <option value="PRICE_DISAGREEMENT">
                      اختلاف بر سر مبلغ یا هزینه
                    </option>
                    <option value="PROVIDER_NO_SHOW">
                      متخصص برای انجام کار حاضر نشد
                    </option>
                    <option value="OTHER">سایر موارد</option>
                  </select>
                </label>
                {dispute?.reason === "CUSTOMER_NON_PAYMENT" ? (
                  <p className="text-xs leading-6 text-foreground/55">
                    این پرونده از طرف متخصص درباره‌ی پرداخت ثبت شده است.
                  </p>
                ) : null}
                <label className="block space-y-2 text-sm font-medium">
                  شرح اختلاف
                  <textarea
                    value={disputeDescription}
                    onChange={(event) =>
                      setDisputeDescription(event.target.value)
                    }
                    minLength={10}
                    maxLength={2000}
                    rows={4}
                    className="w-full rounded-lg border border-foreground/15 bg-background p-3 font-normal leading-6"
                    readOnly={!isDisputed}
                  />
                </label>
                {isDisputed ? (
                  <button
                    type="button"
                    onClick={saveDispute}
                    disabled={busy || disputeDescription.trim().length < 10}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-foreground/15 px-4 text-sm font-medium disabled:opacity-50"
                  >
                    {busy ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : null}
                    ذخیره‌ی تغییرات
                  </button>
                ) : null}
              </>
            ) : null}

            {disputeMessages.length ? (
              <ol className="space-y-3 border-t border-foreground/10 pt-4">
                {disputeMessages.map((message) => (
                  <li
                    key={message.id}
                    className="rounded-lg bg-foreground/[0.04] p-3"
                  >
                    <div className="flex flex-wrap justify-between gap-2 text-xs text-foreground/55">
                      <span>
                        {message.authorRole === "PROVIDER"
                          ? "پاسخ متخصص"
                          : message.authorRole === "ADMIN"
                            ? "پاسخ پشتیبانی"
                            : "پیام شما"}
                      </span>
                      <time dateTime={message.createdAt}>
                        {formatDateTime(message.createdAt)}
                      </time>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                      {message.body}
                    </p>
                  </li>
                ))}
              </ol>
            ) : null}
            {!dispute?.resolved ? (
              <>
                <label className="block space-y-2 text-sm font-medium">
                  پیام پیگیری
                  <textarea
                    value={followUp}
                    onChange={(event) => setFollowUp(event.target.value)}
                    maxLength={2000}
                    rows={3}
                    className="w-full rounded-lg border border-foreground/15 bg-background p-3 font-normal leading-6"
                    placeholder="مدرک یا توضیح تکمیلی را اینجا بنویسید."
                  />
                </label>
                <button
                  type="button"
                  onClick={submitFollowUp}
                  disabled={busy || followUp.trim().length < 2}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50"
                >
                  {busy ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : null}
                  ارسال پیگیری
                </button>
              </>
            ) : null}
          </div>
        </SectionCard>
      ) : null}
    </>
  );
}
