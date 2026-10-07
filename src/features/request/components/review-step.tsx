import { CalendarClock, Coins, MapPin, MapPinned } from "lucide-react";

import type { NewRequestDraft } from "../types/request.types";
import { URGENCY_LABEL } from "../utils/estimate";
import { formatDateTime, formatMoney } from "@/src/utils/format";

export function ReviewStep({
  draft,
  categoryName,
}: {
  draft: NewRequestDraft;
  categoryName: string;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          مرور و ثبت درخواست
        </h2>
        <p className="mt-1 text-sm text-foreground/55">
          درخواست پس از ثبت برای متخصصان همین حوزه ارسال می‌شود.
        </p>
      </div>

      <dl className="divide-y divide-foreground/10 rounded-2xl border border-foreground/10 bg-card px-4 sm:px-5">
        <div className="flex items-start justify-between gap-4 py-4">
          <dt className="shrink-0 text-sm text-foreground/50">تخصص</dt>
          <dd className="text-end text-sm font-medium text-foreground">
            {categoryName || "—"}
          </dd>
        </div>
        <div className="flex items-start justify-between gap-4 py-4">
          <dt className="shrink-0 text-sm text-foreground/50">عنوان</dt>
          <dd className="text-end text-sm font-medium text-foreground">
            {draft.title || "—"}
          </dd>
        </div>
        <div className="flex items-start justify-between gap-4 py-4">
          <dt className="flex shrink-0 items-center gap-1.5 text-sm text-foreground/50">
            <MapPin size={15} /> نشانی
          </dt>
          <dd className="max-w-[65%] text-end text-sm font-medium leading-6 text-foreground">
            {draft.address || "—"}
            <span className="mt-1 block text-xs font-normal text-foreground/60">
              پلاک {draft.plaque || "—"}
              {draft.unit.trim() ? ` · واحد ${draft.unit}` : ""}
            </span>
            {(draft.latitude !== undefined && draft.longitude !== undefined) && (
              <span className="mt-1 flex items-center justify-end gap-1 text-xs font-normal text-primary">
                <MapPinned size={13} /> موقعیت دقیق هم پیوست شده است
              </span>
            )}
          </dd>
        </div>
        <div className="flex items-start justify-between gap-4 py-4">
          <dt className="flex shrink-0 items-center gap-1.5 text-sm text-foreground/50">
            <CalendarClock size={15} /> زمان
          </dt>
          <dd className="text-end text-sm font-medium text-foreground">
            {draft.urgency === "scheduled" && draft.scheduledAt
              ? formatDateTime(draft.scheduledAt)
              : URGENCY_LABEL[draft.urgency]}
          </dd>
        </div>
        <div className="flex items-start justify-between gap-4 py-4">
          <dt className="flex shrink-0 items-center gap-1.5 text-sm text-foreground/50">
            <Coins size={15} /> بودجه
          </dt>
          <dd className="text-end text-sm font-medium text-foreground">
            {draft.hasBudget &&
            draft.budgetMin !== undefined &&
            draft.budgetMax !== undefined
              ? `${formatMoney(draft.budgetMin)} تا ${formatMoney(draft.budgetMax)}`
              : "دریافت قیمت از متخصصان"}
          </dd>
        </div>
      </dl>

      <div className="rounded-xl border border-primary/15 bg-primary/[0.04] p-4 text-sm leading-6 text-foreground/65">
        پس از پذیرش درخواست توسط یک متخصص تأییدشده، اطلاعات تماس و وضعیت هماهنگی
        در صفحه‌ی پیگیری نمایش داده می‌شود.
      </div>
    </div>
  );
}
