"use client";

import { useEffect, useState } from "react";
import {
  Check,
  CircleDollarSign,
  Clock3,
  Loader2,
  Plus,
  Send,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/src/components/ui/button";
import {
  formatMoney,
  formatWithCommas,
  toEnglishDigits,
} from "@/src/utils/format";
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
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [reloadKey, setReloadKey] = useState(0);

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
  }, [requestId, accessToken, reloadKey]);

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
  const invalidItems = items.some(
    (item) =>
      !item.description.trim() ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 10_000 ||
      !Number.isInteger(item.unitPriceToman) ||
      item.unitPriceToman < 0,
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
      setStep(1);
      toast.success("درخواست افزایش مبلغ برای بررسی پشتیبانی ارسال شد");
    } catch (cause) {
      toast.error(normalizeError(cause).message || "ثبت درخواست انجام نشد");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-5 overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-500/[0.08] via-card to-card shadow-sm">
      <header className="flex items-start gap-3 border-b border-amber-500/15 px-4 py-4 sm:px-5">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-800">
          <CircleDollarSign size={22} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="font-bold">درخواست اصلاح مبلغ</h3>
          <p className="mt-1 text-xs leading-6 text-foreground/60">
            هزینه‌ی کار اضافه را با دلیل ثبت کنید. ابتدا پشتیبانی بررسی می‌کند؛
            سپس مشتری تصمیم می‌گیرد و فقط در صورت تأیید، مابه‌التفاوت را
            می‌پردازد.
          </p>
        </div>
      </header>

      <div className="space-y-4 p-4 sm:p-5">
        {loading ? (
          <p
            className="flex items-center gap-2 text-sm text-foreground/55"
            role="status"
          >
            <Loader2 size={16} className="animate-spin" /> در حال دریافت وضعیت
            درخواست…
          </p>
        ) : error ? (
          <div className="flex flex-col gap-3 rounded-xl border border-destructive/20 bg-destructive/[0.04] p-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-destructive" role="alert">
              وضعیت اصلاح مبلغ دریافت نشد؛ برای جلوگیری از ثبت تکراری، فرم تا
              زمان دریافت وضعیت غیرفعال است. {error}
            </p>
            <Button
              type="button"
              variant="outline"
              className="shrink-0"
              onClick={() => {
                setLoading(true);
                setError("");
                setReloadKey((current) => current + 1);
              }}
            >
              تلاش دوباره
            </Button>
          </div>
        ) : (
          <>
            {adjustments.map((adjustment) => (
              <article
                key={adjustment.id}
                className="rounded-2xl border border-foreground/10 bg-background p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Clock3
                      size={17}
                      className="text-amber-700"
                      aria-hidden="true"
                    />
                    <p className="text-sm font-bold">
                      {statusLabels[adjustment.status]}
                    </p>
                  </div>
                  <p className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
                    +{formatMoney(adjustment.amountToman)}
                  </p>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-foreground/70">
                  {adjustment.reason}
                </p>
                <ul className="mt-3 divide-y divide-foreground/10 rounded-xl border border-foreground/10">
                  {adjustment.items.map((item, index) => (
                    <li
                      key={`${item.description}-${index}`}
                      className="flex flex-wrap justify-between gap-2 p-3 text-xs"
                    >
                      <span>
                        {item.description} · تعداد {item.quantity}
                      </span>
                      <span className="font-medium">
                        {formatMoney(item.amountToman)}
                      </span>
                    </li>
                  ))}
                </ul>
                {adjustment.reviewNote ? (
                  <p className="mt-3 rounded-xl bg-foreground/[0.04] p-3 text-xs leading-6 text-foreground/65">
                    توضیح پشتیبانی: {adjustment.reviewNote}
                  </p>
                ) : null}
              </article>
            ))}

            {!hasActiveAdjustment ? (
              <div className="space-y-4">
                <ol
                  className="grid grid-cols-3 gap-2"
                  aria-label="مراحل درخواست اصلاح مبلغ"
                >
                  {["شرح دلیل", "ثبت هزینه‌ها", "بازبینی نهایی"].map(
                    (label, index) => {
                      const stage = (index + 1) as 1 | 2 | 3;
                      const complete = step > stage;
                      const current = step === stage;
                      return (
                        <li
                          key={label}
                          className={`flex items-center gap-2 rounded-xl border px-2 py-2.5 text-[11px] sm:px-3 sm:text-xs ${
                            current
                              ? "border-primary/35 bg-primary/[0.07] font-bold text-primary"
                              : complete
                                ? "border-emerald-500/20 bg-emerald-500/[0.05] text-emerald-800"
                                : "border-foreground/10 bg-background text-foreground/45"
                          }`}
                        >
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-background">
                            {complete ? <Check size={14} /> : index + 1}
                          </span>
                          <span className="leading-4">{label}</span>
                        </li>
                      );
                    },
                  )}
                </ol>

                <div className="rounded-2xl border border-foreground/10 bg-background p-4 sm:p-5">
                  {step === 1 ? (
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-bold">
                          چرا مبلغ باید اصلاح شود؟
                        </h4>
                        <p className="mt-1 text-xs leading-5 text-foreground/55">
                          شرایطی را که هنگام برآورد اولیه مشخص نبوده، دقیق توضیح
                          دهید.
                        </p>
                      </div>
                      <label className="grid gap-1.5 text-sm font-medium">
                        دلیل درخواست
                        <textarea
                          value={reason}
                          onChange={(event) => setReason(event.target.value)}
                          minLength={10}
                          maxLength={2000}
                          rows={4}
                          className="w-full rounded-xl border border-foreground/15 bg-background p-3 text-sm leading-7 outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                          placeholder="مثلاً بعد از بازکردن دستگاه، خرابی قطعه‌ی دیگری هم مشخص شد."
                        />
                        <span className="text-end text-[11px] font-normal text-foreground/45">
                          {reason.length} از ۲۰۰۰ نویسه
                        </span>
                      </label>
                      <div className="flex justify-end border-t border-foreground/10 pt-3">
                        <Button
                          type="button"
                          disabled={reason.trim().length < 10}
                          onClick={() => setStep(2)}
                        >
                          ادامه: ثبت هزینه‌ها
                        </Button>
                      </div>
                    </div>
                  ) : null}

                  {step === 2 ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-bold">
                          هزینه‌های اضافه را وارد کنید
                        </h4>
                        <p className="mt-1 text-xs leading-5 text-foreground/55">
                          هر قطعه یا کار اضافه را جداگانه بنویسید تا مشتری
                          بتواند شفاف بررسی کند.
                        </p>
                      </div>
                      <div className="space-y-3">
                        {items.map((item, index) => (
                          <div
                            key={index}
                            className="grid gap-3 rounded-xl border border-foreground/10 bg-foreground/[0.015] p-3 sm:grid-cols-[minmax(0,1fr)_100px_minmax(0,1fr)_40px]"
                          >
                            <label className="grid gap-1.5 text-xs font-medium">
                              شرح هزینه
                              <input
                                value={item.description}
                                maxLength={200}
                                onChange={(event) =>
                                  setItems((current) =>
                                    current.map((row, rowIndex) =>
                                      rowIndex === index
                                        ? {
                                            ...row,
                                            description: event.target.value,
                                          }
                                        : row,
                                    ),
                                  )
                                }
                                className="h-10 min-w-0 rounded-lg border border-foreground/15 bg-background px-3 text-sm"
                                aria-label={`شرح هزینه ${index + 1}`}
                                placeholder="مثلاً قطعه‌ی تعویضی"
                              />
                            </label>
                            <label className="grid gap-1.5 text-xs font-medium">
                              تعداد
                              <input
                                type="number"
                                min={1}
                                max={10000}
                                value={item.quantity}
                                onChange={(event) =>
                                  setItems((current) =>
                                    current.map((row, rowIndex) =>
                                      rowIndex === index
                                        ? {
                                            ...row,
                                            quantity: Number(
                                              event.target.value,
                                            ),
                                          }
                                        : row,
                                    ),
                                  )
                                }
                                className="h-10 min-w-0 rounded-lg border border-foreground/15 bg-background px-2 text-sm"
                                aria-label={`تعداد هزینه ${index + 1}`}
                              />
                            </label>
                            <label className="grid gap-1.5 text-xs font-medium">
                              قیمت هر واحد (تومان)
                              <input
                                inputMode="numeric"
                                value={formatWithCommas(
                                  String(item.unitPriceToman || ""),
                                )}
                                onChange={(event) =>
                                  setItems((current) =>
                                    current.map((row, rowIndex) =>
                                      rowIndex === index
                                        ? {
                                            ...row,
                                            unitPriceToman: Number(
                                              toEnglishDigits(
                                                event.target.value,
                                              ).replace(/\D/g, ""),
                                            ),
                                          }
                                        : row,
                                    ),
                                  )
                                }
                                className="h-10 min-w-0 rounded-lg border border-foreground/15 bg-background px-3 text-sm"
                                aria-label={`قیمت واحد هزینه ${index + 1}`}
                                placeholder="۰"
                              />
                            </label>
                            <Button
                              type="button"
                              variant="ghost"
                              className="mt-5 h-10 w-10 text-destructive"
                              aria-label={`حذف هزینه ${index + 1}`}
                              disabled={items.length === 1}
                              onClick={() =>
                                setItems((current) =>
                                  current.filter(
                                    (_, rowIndex) => rowIndex !== index,
                                  ),
                                )
                              }
                            >
                              <Trash2 size={15} />
                            </Button>
                            <p className="text-xs text-foreground/55 sm:col-span-4">
                              جمع این ردیف:{" "}
                              <span className="font-semibold text-foreground">
                                {formatMoney(
                                  item.quantity * item.unitPriceToman,
                                )}
                              </span>
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          disabled={items.length >= 50}
                          onClick={() =>
                            setItems((current) => [
                              ...current,
                              {
                                description: "",
                                quantity: 1,
                                unitPriceToman: 0,
                              },
                            ])
                          }
                        >
                          <Plus size={15} /> افزودن ردیف هزینه
                        </Button>
                        <span className="text-sm font-bold">
                          جمع مابه‌التفاوت: {formatMoney(amountToman)}
                        </span>
                      </div>
                      {invalidItems || amountToman <= 0 ? (
                        <p className="text-xs text-destructive" role="status">
                          شرح، تعداد معتبر و قیمت هر ردیف را کامل کنید؛ جمع
                          هزینه باید بیشتر از صفر باشد.
                        </p>
                      ) : null}
                      <div className="flex justify-between border-t border-foreground/10 pt-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep(1)}
                        >
                          بازگشت
                        </Button>
                        <Button
                          type="button"
                          disabled={
                            invalidItems ||
                            amountToman <= 0 ||
                            !Number.isSafeInteger(amountToman)
                          }
                          onClick={() => setStep(3)}
                        >
                          ادامه: بازبینی
                        </Button>
                      </div>
                    </div>
                  ) : null}

                  {step === 3 ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-bold">
                          پیش از ارسال، درخواست را بررسی کنید
                        </h4>
                        <p className="mt-1 text-xs leading-5 text-foreground/55">
                          پس از ارسال، درخواست ابتدا برای بررسی پشتیبانی می‌رود؛
                          هنوز مبلغی از مشتری دریافت نمی‌شود.
                        </p>
                      </div>
                      <div className="space-y-3 rounded-xl bg-foreground/[0.035] p-4">
                        <div>
                          <p className="text-[11px] text-foreground/50">دلیل</p>
                          <p className="mt-1 whitespace-pre-wrap text-sm leading-6">
                            {reason.trim()}
                          </p>
                        </div>
                        <ul className="divide-y divide-foreground/10 rounded-lg border border-foreground/10 bg-background">
                          {items.map((item, index) => (
                            <li
                              key={`${item.description}-${index}`}
                              className="flex flex-wrap justify-between gap-2 p-3 text-xs"
                            >
                              <span>
                                {item.description} · تعداد {item.quantity}
                              </span>
                              <span className="font-medium">
                                {formatMoney(
                                  item.quantity * item.unitPriceToman,
                                )}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <div className="flex items-center justify-between border-t border-foreground/10 pt-3 text-sm">
                          <span>مابه‌التفاوت پیشنهادی</span>
                          <strong className="text-base text-primary">
                            {formatMoney(amountToman)}
                          </strong>
                        </div>
                      </div>
                      <div className="flex flex-col-reverse justify-between gap-2 border-t border-foreground/10 pt-3 sm:flex-row">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep(2)}
                        >
                          ویرایش هزینه‌ها
                        </Button>
                        <Button
                          type="button"
                          disabled={
                            busy || invalidItems || reason.trim().length < 10
                          }
                          onClick={() => void submit()}
                        >
                          {busy ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Send size={16} />
                          )}
                          {busy
                            ? "در حال ارسال به پشتیبانی…"
                            : "ارسال برای بررسی پشتیبانی"}
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <p className="rounded-xl border border-primary/15 bg-primary/[0.04] p-3 text-sm leading-6 text-foreground/70">
                تا تعیین تکلیف این درخواست، امکان ثبت اصلاح مبلغ تازه وجود
                ندارد.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
