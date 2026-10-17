"use client";

import { useEffect, useState } from "react";
import { CircleDollarSign, Loader2, Plus, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/src/components/ui/button";
import { formatMoney, formatWithCommas, toEnglishDigits } from "@/src/utils/format";
import {
  requestApi,
  type ServicePriceAdjustment,
} from "@/src/features/request/api/request.api";
import { normalizeError } from "@/src/lib/api/error";

type DraftItem = {
  description: string;
  quantity: number;
  unitPriceToman: number;
};

const statusLabels = {
  PENDING_SUPPORT_REVIEW: "در انتظار بررسی پشتیبانی",
  PENDING: "تأیید پشتیبانی؛ در انتظار پاسخ مشتری",
  APPROVED: "تأیید شده؛ در انتظار پرداخت",
  REJECTED: "پیشنهاد رد شد؛ مبلغ قبلی پابرجاست",
  PAID: "پرداخت شد و مبلغ نهایی اصلاح شد",
} satisfies Record<ServicePriceAdjustment["status"], string>;

export function ProviderPriceAdjustment({
  requestId,
  accessToken,
}: {
  requestId: string;
  accessToken: string;
}) {
  const [adjustments, setAdjustments] = useState<ServicePriceAdjustment[]>([]);
  const [items, setItems] = useState<DraftItem[]>([
    { description: "", quantity: 1, unitPriceToman: 0 },
  ]);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    requestApi
      .listPriceAdjustments(requestId, accessToken)
      .then((result) => {
        if (mounted) {
          setAdjustments(result);
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

  const hasActiveAdjustment = adjustments.some(
    ({ status }) =>
      status === "PENDING_SUPPORT_REVIEW" ||
      status === "PENDING" ||
      status === "APPROVED",
  );
  const amountToman = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPriceToman,
    0,
  );

  const submit = async () => {
    setBusy(true);
    try {
      const adjustment = await requestApi.createPriceAdjustment(
        requestId,
        {
          reason: reason.trim(),
          items: items.map(({ description, quantity, unitPriceToman }) => ({
            description: description.trim(),
            quantity,
            unitPriceToman,
          })),
        },
        accessToken,
      );
      setAdjustments((previous) => [adjustment, ...previous]);
      setReason("");
      setItems([{ description: "", quantity: 1, unitPriceToman: 0 }]);
      toast.success("درخواست افزایش مبلغ برای بررسی پشتیبانی ارسال شد");
    } catch (cause) {
      toast.error(normalizeError(cause).message || "ثبت درخواست انجام نشد");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-4 space-y-3 rounded-xl border border-amber-500/25 bg-amber-500/[0.035] p-3 sm:p-4">
      <div className="flex items-start gap-2">
        <CircleDollarSign
          size={19}
          className="mt-0.5 shrink-0 text-amber-700"
          aria-hidden="true"
        />
        <div>
          <h3 className="text-sm font-bold">اصلاح مبلغ با تأیید مشتری</h3>
          <p className="mt-1 text-xs leading-6 text-foreground/60">
            اگر حین کار مورد اضافه‌ای پیش آمد، دلیل و هزینه‌ها را ثبت کنید.
            مبلغ قبلی تا زمان پرداخت مشتری تغییر نمی‌کند.
          </p>
        </div>
      </div>

      {loading ? (
        <p className="flex items-center gap-2 text-xs text-foreground/55">
          <Loader2 size={14} className="animate-spin" /> در حال دریافت وضعیت…
        </p>
      ) : error ? (
        <p className="text-xs text-destructive" role="alert">{error}</p>
      ) : null}

      {adjustments.map((adjustment) => (
        <article
          key={adjustment.id}
          className="rounded-lg border border-foreground/10 bg-background p-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold">{statusLabels[adjustment.status]}</p>
            <p className="text-xs font-bold text-primary">
              +{formatMoney(adjustment.amountToman)}
            </p>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-xs leading-6 text-foreground/65">
            {adjustment.reason}
          </p>
          {adjustment.reviewNote ? (
            <p className="mt-2 rounded-md bg-foreground/[0.04] px-2.5 py-2 text-xs leading-5 text-foreground/60">
              توضیح پشتیبانی: {adjustment.reviewNote}
            </p>
          ) : null}
          <ul className="mt-2 space-y-1 border-t border-foreground/10 pt-2">
            {adjustment.items.map((item, index) => (
              <li key={`${item.description}-${index}`} className="flex justify-between gap-3 text-xs">
                <span>{item.description} × {item.quantity}</span>
                <span className="shrink-0">{formatMoney(item.amountToman)}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}

      {!loading && !hasActiveAdjustment ? (
        <div className="space-y-3 border-t border-foreground/10 pt-3">
          <label className="grid gap-1.5 text-xs font-medium">
            دلیل افزایش مبلغ (حداقل ۱۰ نویسه)
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              minLength={10}
              maxLength={2000}
              rows={3}
              className="w-full rounded-lg border border-foreground/15 bg-background p-3 text-sm leading-6"
              placeholder="مثلاً پس از بازکردن دستگاه، قطعه‌ی آسیب‌دیده‌ی دیگری مشخص شد."
            />
          </label>
          <div className="space-y-2">
            <h4 className="text-xs font-semibold">هزینه‌های اضافه</h4>
            {items.map((item, index) => (
              <div
                key={index}
                className="grid gap-2 rounded-lg border border-foreground/10 bg-background p-2 sm:grid-cols-[minmax(0,1fr)_90px_minmax(0,1fr)_40px]"
              >
                <input
                  value={item.description}
                  maxLength={200}
                  onChange={(event) =>
                    setItems((current) =>
                      current.map((row, rowIndex) =>
                        rowIndex === index
                          ? { ...row, description: event.target.value }
                          : row,
                      ),
                    )
                  }
                  className="h-10 min-w-0 rounded-lg border border-foreground/15 bg-background px-3 text-sm"
                  aria-label={`شرح هزینه ${index + 1}`}
                  placeholder="شرح هزینه"
                />
                <input
                  type="number"
                  min={1}
                  max={10000}
                  value={item.quantity}
                  onChange={(event) =>
                    setItems((current) =>
                      current.map((row, rowIndex) =>
                        rowIndex === index
                          ? { ...row, quantity: Number(event.target.value) }
                          : row,
                      ),
                    )
                  }
                  className="h-10 min-w-0 rounded-lg border border-foreground/15 bg-background px-2 text-sm"
                  aria-label={`تعداد هزینه ${index + 1}`}
                />
                <input
                  inputMode="numeric"
                  value={formatWithCommas(String(item.unitPriceToman || ""))}
                  onChange={(event) =>
                    setItems((current) =>
                      current.map((row, rowIndex) =>
                        rowIndex === index
                          ? {
                              ...row,
                              unitPriceToman: Number(
                                toEnglishDigits(event.target.value).replace(
                                  /\D/g,
                                  "",
                                ),
                              ),
                            }
                          : row,
                      ),
                    )
                  }
                  className="h-10 min-w-0 rounded-lg border border-foreground/15 bg-background px-3 text-sm"
                  aria-label={`قیمت واحد هزینه ${index + 1}`}
                  placeholder="قیمت واحد (تومان)"
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="h-10 w-10"
                  aria-label={`حذف هزینه ${index + 1}`}
                  disabled={items.length === 1}
                  onClick={() =>
                    setItems((current) =>
                      current.filter((_, rowIndex) => rowIndex !== index),
                    )
                  }
                >
                  <Trash2 size={15} />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
            <Button
              type="button"
              variant="outline"
              disabled={items.length >= 50}
              onClick={() =>
                setItems((current) => [
                  ...current,
                  { description: "", quantity: 1, unitPriceToman: 0 },
                ])
              }
            >
              <Plus size={15} /> افزودن هزینه
            </Button>
            <span className="text-sm font-bold">
              مابه‌التفاوت: {formatMoney(amountToman)}
            </span>
          </div>
          <p className="text-[11px] leading-5 text-foreground/50">
            مشتری جزئیات را بررسی می‌کند و در صورت تأیید فقط مابه‌التفاوت را
            پرداخت می‌کند. مبلغ نهایی بعد از تأیید درگاه اصلاح می‌شود.
          </p>
          <Button
            type="button"
            disabled={
              busy ||
              reason.trim().length < 10 ||
              amountToman <= 0 ||
              !Number.isSafeInteger(amountToman) ||
              items.some(
                (item) =>
                  !item.description.trim() ||
                  !Number.isInteger(item.quantity) ||
                  item.quantity < 1 ||
                  !Number.isInteger(item.unitPriceToman) ||
                  item.unitPriceToman < 0,
              )
            }
            onClick={() => void submit()}
          >
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            ارسال برای تأیید مشتری
          </Button>
        </div>
      ) : null}
    </section>
  );
}
