"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2, Loader2, RefreshCw } from "lucide-react";

import { SectionCard } from "@/src/components/shared/section-card";
import { StatusBadge } from "@/src/components/shared/status-badge";
import { formatMoney } from "@/src/utils/format";
import {
  requestApi,
  type ServiceRequestPayment,
} from "@/src/features/request/api/request.api";
import type { RequestStatus } from "../types/customer.types";

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
  initialPayment,
  accessToken,
}: {
  requestId: string;
  requestStatus: RequestStatus;
  amountToman?: number;
  initialPayment: ServiceRequestPayment | null;
  accessToken: string;
}) {
  const router = useRouter();
  const [payment, setPayment] = useState(initialPayment);
  const [busy, setBusy] = useState(false);

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

  const submitCompletionAction = async (action: "confirm" | "dispute") => {
    if (busy) return;
    setBusy(true);
    try {
      if (action === "confirm") {
        await requestApi.confirmCompletion(requestId, accessToken);
        toast.success("اتمام کار تأیید شد.");
      } else {
        await requestApi.dispute(requestId, accessToken);
        toast.success("درخواست بررسی اختلاف ثبت شد.");
      }
      router.refresh();
    } catch {
      toast.error("ثبت پاسخ شما انجام نشد. دوباره تلاش کنید.");
    } finally {
      setBusy(false);
    }
  };

  const showPayment = requestStatus === "awaiting_payment" || payment !== null;
  const showCompletion = requestStatus === "awaiting_confirmation";
  if (!showPayment && !showCompletion && requestStatus !== "disputed")
    return null;

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
              <button
                type="button"
                onClick={startCheckout}
                disabled={busy || amountToman == null || amountToman <= 0}
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? <Loader2 size={16} className="animate-spin" /> : null}
                رفتن به درگاه پرداخت
              </button>
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
              onClick={() => submitCompletionAction("confirm")}
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
              onClick={() => submitCompletionAction("dispute")}
              disabled={busy}
              className="h-11 rounded-lg border border-destructive/30 px-4 text-sm font-medium text-destructive disabled:opacity-50"
            >
              ثبت اختلاف
            </button>
          </div>
        </SectionCard>
      ) : null}

      {requestStatus === "disputed" ? (
        <SectionCard title="بررسی اختلاف">
          <p className="text-sm leading-7 text-foreground/65">
            اختلاف شما ثبت شده و وضعیت آن از طریق backend پیگیری می‌شود.
          </p>
        </SectionCard>
      ) : null}
    </>
  );
}
