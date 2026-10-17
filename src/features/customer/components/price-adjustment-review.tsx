"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CircleDollarSign, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/src/components/ui/button";
import { formatDateTime, formatMoney } from "@/src/utils/format";
import { normalizeError } from "@/src/lib/api/error";
import {
  requestApi,
  type ServicePriceAdjustment,
} from "@/src/features/request/api/request.api";

const statusLabels = {
  PENDING: "در انتظار پاسخ شما",
  APPROVED: "تأیید شده؛ در انتظار پرداخت",
  REJECTED: "رد شده؛ مبلغ قبلی حفظ شده است",
  PAID: "پرداخت و مبلغ نهایی ثبت شده است",
} satisfies Record<ServicePriceAdjustment["status"], string>;

export function PriceAdjustmentReview({
  requestId,
  accessToken,
}: {
  requestId: string;
  accessToken: string;
}) {
  const router = useRouter();
  const [items, setItems] = useState<ServicePriceAdjustment[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    requestApi
      .listPriceAdjustments(requestId, accessToken)
      .then((result) => {
        if (mounted) {
          setItems(result);
          setError("");
        }
      })
      .catch((cause: unknown) => {
        if (mounted) setError(normalizeError(cause).message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [requestId, accessToken]);

  const approve = async (adjustmentId: string) => {
    setBusyId(adjustmentId);
    try {
      const { paymentUrl } = await requestApi.approvePriceAdjustment(
        adjustmentId,
        accessToken,
      );
      window.location.assign(paymentUrl);
    } catch (cause) {
      toast.error(
        normalizeError(cause).message || "شروع پرداخت مابه‌التفاوت انجام نشد",
      );
      setBusyId(null);
    }
  };

  const reject = async (adjustmentId: string) => {
    setBusyId(adjustmentId);
    try {
      await requestApi.rejectPriceAdjustment(adjustmentId, accessToken);
      setItems((current) =>
        current.map((item) =>
          item.id === adjustmentId ? { ...item, status: "REJECTED" } : item,
        ),
      );
      toast.success("پیشنهاد رد شد؛ مبلغ قبلی تغییری نکرد");
      router.refresh();
    } catch (cause) {
      toast.error(normalizeError(cause).message || "ثبت پاسخ انجام نشد");
    } finally {
      setBusyId(null);
    }
  };

  if (loading || (!error && items.length === 0)) return null;

  return (
    <section className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.035] p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-800">
          <CircleDollarSign size={20} aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-bold">درخواست‌های اصلاح مبلغ</h2>
          <p className="mt-1 text-xs leading-6 text-foreground/60">
            با تأیید، فقط مابه‌التفاوت به درگاه پرداخت می‌شود. مبلغ نهایی پس از
            تأیید پرداخت به‌روزرسانی خواهد شد؛ در صورت رد، مبلغ قبلی باقی می‌ماند.
          </p>
        </div>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-destructive" role="alert">
          دریافت اصلاح مبلغ انجام نشد: {error}
        </p>
      ) : null}

      <ul className="mt-4 space-y-3">
        {items.map((adjustment) => (
          <li
            key={adjustment.id}
            className="rounded-xl border border-foreground/10 bg-background p-3 sm:p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-bold">
                  {statusLabels[adjustment.status]}
                </p>
                <time
                  dateTime={adjustment.createdAt}
                  className="mt-1 block text-[11px] text-foreground/45"
                >
                  {formatDateTime(adjustment.createdAt)}
                </time>
              </div>
              <span className="rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-900">
                +{formatMoney(adjustment.amountToman)}
              </span>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-foreground/75">
              {adjustment.reason}
            </p>
            <ul className="mt-3 divide-y divide-foreground/10 rounded-lg border border-foreground/10">
              {adjustment.items.map((item, index) => (
                <li
                  key={`${item.description}-${index}`}
                  className="flex flex-wrap justify-between gap-2 p-2.5 text-xs"
                >
                  <span>{item.description} · تعداد {item.quantity}</span>
                  <span className="font-medium">
                    {formatMoney(item.amountToman)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 grid gap-2 rounded-lg bg-foreground/[0.025] p-3 text-xs sm:grid-cols-2">
              <p>مبلغ قبلی: {formatMoney(adjustment.previousTotalToman)}</p>
              <p className="font-bold text-primary">
                مبلغ نهایی پس از پرداخت: {formatMoney(adjustment.newTotalToman)}
              </p>
            </div>

            {adjustment.status === "PENDING" ? (
              <div className="mt-3 flex flex-col gap-2 min-[420px]:flex-row">
                <Button
                  type="button"
                  className="min-h-11 flex-1"
                  disabled={busyId === adjustment.id}
                  onClick={() => void approve(adjustment.id)}
                >
                  {busyId === adjustment.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Check size={16} />
                  )}
                  تأیید و پرداخت مابه‌التفاوت
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-11"
                  disabled={busyId === adjustment.id}
                  onClick={() => void reject(adjustment.id)}
                >
                  <X size={16} /> رد پیشنهاد
                </Button>
              </div>
            ) : adjustment.status === "APPROVED" ? (
              <Button
                type="button"
                className="mt-3 min-h-11 w-full"
                disabled={busyId === adjustment.id}
                onClick={() => void approve(adjustment.id)}
              >
                {busyId === adjustment.id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CircleDollarSign size={16} />
                )}
                ادامه پرداخت مابه‌التفاوت
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
