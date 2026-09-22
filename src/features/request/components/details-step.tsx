"use client";

import { Lightbulb } from "lucide-react";

import { repairCategories } from "../api/mock-data";
import type { NewRequestDraft } from "../types/request.types";
import { RequestPhotoUploader } from "./request-photo-uploader";

export function DetailsStep({
  draft,
  onChange,
}: {
  draft: NewRequestDraft;
  onChange: (patch: Partial<NewRequestDraft>) => void;
}) {
  const category = repairCategories.find((c) => c.id === draft.categoryId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">مشکل را برایمان توضیح دهید</h2>
        <p className="mt-1 text-sm text-foreground/55">
          هر چه دقیق‌تر بنویسید، پیشنهادهای دقیق‌تری از متخصصان می‌گیرید.
        </p>
      </div>

      {category && category.commonIssues.length > 0 && (
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs text-foreground/50">
            <Lightbulb size={14} className="text-primary" />
            مشکل‌های رایج در «{category.label}» — با یک کلیک عنوان را پر کنید
          </p>
          <div className="flex flex-wrap gap-2">
            {category.commonIssues.map((issue) => (
              <button
                key={issue}
                type="button"
                onClick={() => onChange({ title: issue })}
                className={[
                  "rounded-full border px-3 py-1.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  draft.title === issue
                    ? "border-primary bg-primary/10 font-medium text-primary"
                    : "border-foreground/15 text-foreground/65 hover:border-primary/40",
                ].join(" ")}
              >
                {issue}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="req-title" className="text-sm font-medium text-foreground">
          عنوان درخواست
        </label>
        <input
          id="req-title"
          value={draft.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="مثلاً: نشتی زیر سینک آشپزخانه"
          className="h-11 w-full rounded-xl border border-foreground/15 bg-background px-3.5 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="req-description" className="text-sm font-medium text-foreground">
          توضیحات کامل‌تر
        </label>
        <textarea
          id="req-description"
          rows={4}
          value={draft.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="از کِی این مشکل شروع شده؟ آیا قبلاً کسی روی آن کار کرده؟ هر جزئیاتی که فکر می‌کنید مهم است…"
          className="w-full resize-y rounded-xl border border-foreground/15 bg-background px-3.5 py-3 text-sm leading-7 outline-none transition-colors placeholder:text-foreground/40 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
        />
        <p className="text-end text-xs text-foreground/40">
          {new Intl.NumberFormat("fa-IR").format(draft.description.length)} / ۱۰۰۰
        </p>
      </div>

      <RequestPhotoUploader photos={draft.photos} onChange={(photos) => onChange({ photos })} />
    </div>
  );
}