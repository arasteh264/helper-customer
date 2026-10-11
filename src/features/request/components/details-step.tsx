"use client";

import { FileText, Lightbulb } from "lucide-react";

import { repairCategories } from "../api/mock-data";
import type { NewRequestDraft } from "../types/request.types";
import { RequestPhotoUploader } from "./request-photo-uploader";

export function DetailsStep({
  draft,
  onChange,
  categoryName,
}: {
  draft: NewRequestDraft;
  onChange: (patch: Partial<NewRequestDraft>) => void;
  categoryName: string;
}) {
  const category = repairCategories.find((c) => c.label === categoryName);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          مشکل را برایمان توضیح دهید
        </h2>
        <p className="mt-1 text-sm text-foreground/55">
          هر چه دقیق‌تر بنویسید، پیشنهادهای دقیق‌تری از متخصصان می‌گیرید.
        </p>
      </div>

      {category && category.commonIssues.length > 0 && (
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs text-foreground/50">
            <Lightbulb size={14} className="text-primary" />
            مشکل‌های رایج در «{categoryName}» — با یک کلیک عنوان را پر کنید
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
        <label
          htmlFor="req-title"
          className="text-sm font-medium text-foreground"
        >
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

      <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-background transition-colors focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10">
        <div className="flex items-start gap-3 px-4 pt-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileText size={18} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <label
              htmlFor="req-description"
              className="block text-sm font-semibold text-foreground"
            >
              شرح درخواست برای متخصص
              <span className="ms-1 text-destructive" aria-hidden="true">
                *
              </span>
            </label>
            <p
              id="req-description-hint"
              className="mt-1 text-xs leading-6 text-foreground/55"
            >
              هرچه درباره‌ی کار بداند، بهتر می‌تواند قیمت و زمان مناسب پیشنهاد
              بدهد.
            </p>
          </div>
        </div>

        <div className="mx-4 mt-3 rounded-xl bg-secondary/45 px-3.5 py-3">
          <p className="text-xs font-semibold text-foreground/75">
            برای توضیح بهتر، این موارد را بنویس:
          </p>
          <ul className="mt-2 grid gap-x-4 gap-y-1.5 text-xs leading-5 text-foreground/60 sm:grid-cols-3">
            <li className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
              دقیقاً چه کاری لازم داری؟
            </li>
            <li className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
              مشکل یا شرایطش چیست؟
            </li>
            <li className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
              چه زمانی شروع شده؟
            </li>
          </ul>
        </div>

        <textarea
          id="req-description"
          rows={6}
          minLength={20}
          maxLength={1000}
          value={draft.description}
          onChange={(e) => onChange({ description: e.target.value })}
          aria-describedby="req-description-hint req-description-count"
          placeholder="مثلاً: از دیروز زیر سینک آشپزخانه آب نشت می‌کند. اطراف لوله خیس است و هنوز تعمیرکاری آن را بررسی نکرده. لطفاً برای بازدید و اعلام هزینه هماهنگ کنید."
          className="min-h-40 w-full resize-y bg-transparent px-4 py-3 text-sm leading-7 text-foreground outline-none placeholder:text-foreground/40"
        />

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-foreground/[0.07] px-4 py-2.5">
          <p className="text-xs text-foreground/45">
            حداقل ۲۰ نویسه؛ اطلاعاتی مثل رمز یا اطلاعات بانکی ننویس.
          </p>
          <p
            id="req-description-count"
            aria-live="polite"
            className={[
              "text-xs tabular-nums",
              draft.description.trim().length > 0 &&
              draft.description.trim().length < 20
                ? "font-medium text-amber-700 dark:text-amber-300"
                : "text-foreground/45",
            ].join(" ")}
          >
            {new Intl.NumberFormat("fa-IR").format(draft.description.length)} از
            ۱۰۰۰
          </p>
        </div>
      </div>

      <RequestPhotoUploader
        photos={draft.photos}
        files={draft.photoFiles}
        onChange={(photos) => onChange({ photos })}
        onFilesChange={(photoFiles) => onChange({ photoFiles })}
      />
    </div>
  );
}
