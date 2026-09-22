import { CalendarClock, Coins, MapPin, Sparkles } from "lucide-react";

import type { Address } from "@/src/features/customer/types/customer.types";
import { repairCategories } from "../api/mock-data";
import type { NewRequestDraft } from "../types/request.types";
import { URGENCY_LABEL } from "../utils/estimate";
import { estimatePriceRange } from "../utils/estimate";
import { formatDateTime, formatMoney } from "@/src/utils/format";

export function ReviewStep({
  draft,
  addresses,
}: {
  draft: NewRequestDraft;
  addresses: Address[];
}) {
  const category = repairCategories.find((c) => c.id === draft.categoryId);
  const address = addresses.find((a) => a.id === draft.addressId);
  const estimate = category ? estimatePriceRange(category, draft.urgency) : null;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground">بررسی نهایی</h2>
        <p className="mt-1 text-sm text-foreground/55">
          قبل از ثبت، یک‌بار اطلاعات را مرور کنید.
        </p>
      </div>

      <dl className="divide-y divide-foreground/10 rounded-2xl border border-foreground/10 bg-card px-4 sm:px-5">
        <div className="flex items-start justify-between gap-4 py-4">
          <dt className="shrink-0 text-sm text-foreground/50">نوع کار</dt>
          <dd className="text-sm font-medium text-foreground">{category?.label ?? "—"}</dd>
        </div>
        <div className="flex items-start justify-between gap-4 py-4">
          <dt className="shrink-0 text-sm text-foreground/50">عنوان</dt>
          <dd className="text-sm font-medium text-foreground">{draft.title || "—"}</dd>
        </div>
        <div className="flex items-start justify-between gap-4 py-4">
          <dt className="flex shrink-0 items-center gap-1.5 text-sm text-foreground/50">
            <MapPin size={15} />
            آدرس
          </dt>
          <dd className="max-w-[60%] text-end text-sm font-medium text-foreground">
            {address ? `${address.title} — ${address.fullAddress}` : "—"}
          </dd>
        </div>
        <div className="flex items-start justify-between gap-4 py-4">
          <dt className="flex shrink-0 items-center gap-1.5 text-sm text-foreground/50">
            <CalendarClock size={15} />
            زمان
          </dt>
          <dd className="text-sm font-medium text-foreground">
            {draft.urgency === "scheduled" && draft.scheduledAt
              ? formatDateTime(draft.scheduledAt)
              : URGENCY_LABEL[draft.urgency]}
          </dd>
        </div>
        <div className="flex items-start justify-between gap-4 py-4">
          <dt className="flex shrink-0 items-center gap-1.5 text-sm text-foreground/50">
            <Coins size={15} />
            بودجه
          </dt>
          <dd className="text-sm font-medium text-foreground">
            {draft.hasBudget && draft.budgetMin && draft.budgetMax
              ? `${formatMoney(draft.budgetMin)} تا ${formatMoney(draft.budgetMax)}`
              : "پیشنهاد متخصصان"}
          </dd>
        </div>
      </dl>

      {estimate && (
        <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/[0.05] p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Sparkles size={17} />
          </span>
          <div>
            <p className="text-sm font-medium text-foreground">
              برآورد قیمت این نوع کار: {formatMoney(estimate.min)} تا {formatMoney(estimate.max)}
            </p>
            <p className="mt-1 text-xs leading-5 text-foreground/55">
              این فقط یک برآورد کلی است؛ قیمت نهایی را متخصص بعد از بررسی کار اعلام می‌کند.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}