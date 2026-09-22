"use client";

import { CalendarClock, Clock, Coins, Zap } from "lucide-react";

import type { NewRequestDraft, Urgency } from "../types/request.types";
import { URGENCY_HINT, URGENCY_LABEL } from "../utils/estimate";
import { toEnglishDigits } from "@/src/utils/format";

const URGENCY_ICONS: Record<Urgency, typeof Zap> = {
  asap: Zap,
  this_week: CalendarClock,
  scheduled: Clock,
};

export function ScheduleStep({
  draft,
  onChange,
}: {
  draft: NewRequestDraft;
  onChange: (patch: Partial<NewRequestDraft>) => void;
}) {
  return (
    <div className="space-y-8">
      {/* فوریت */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">چه زمانی به این کار نیاز دارید؟</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {(Object.keys(URGENCY_LABEL) as Urgency[]).map((u) => {
            const Icon = URGENCY_ICONS[u];
            const selected = draft.urgency === u;
            return (
              <li key={u}>
                <button
                  type="button"
                  onClick={() => onChange({ urgency: u })}
                  aria-pressed={selected}
                  className={[
                    "flex w-full flex-col items-start gap-2 rounded-2xl border p-4 text-start transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    selected
                      ? "border-primary bg-primary/[0.05]"
                      : "border-foreground/10 bg-card hover:border-primary/30",
                  ].join(" ")}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      selected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                    }`}
                  >
                    <Icon size={17} />
                  </span>
                  <span className="text-sm font-semibold text-foreground">{URGENCY_LABEL[u]}</span>
                  <span className="text-xs leading-5 text-foreground/55">{URGENCY_HINT[u]}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {draft.urgency === "scheduled" && (
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="space-y-1.5">
              <label htmlFor="req-date" className="text-xs text-foreground/55">تاریخ</label>
              <input
                id="req-date"
                type="date"
                dir="ltr"
                value={draft.scheduledAt?.slice(0, 10) ?? ""}
                onChange={(e) => {
                  const time = draft.scheduledAt?.slice(11, 16) ?? "10:00";
                  onChange({ scheduledAt: `${e.target.value}T${time}` });
                }}
                className="h-11 rounded-xl border border-foreground/15 bg-background px-3.5 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="req-time" className="text-xs text-foreground/55">ساعت</label>
              <input
                id="req-time"
                type="time"
                dir="ltr"
                value={draft.scheduledAt?.slice(11, 16) ?? ""}
                onChange={(e) => {
                  const date = draft.scheduledAt?.slice(0, 10) ?? new Date().toISOString().slice(0, 10);
                  onChange({ scheduledAt: `${date}T${e.target.value}` });
                }}
                className="h-11 rounded-xl border border-foreground/15 bg-background px-3.5 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
              />
            </div>
          </div>
        )}
      </div>

      {/* بودجه */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">بودجه‌ی تقریبی دارید؟</h2>
        <p className="mt-1 text-sm text-foreground/55">
          این اختیاری است، اما به متخصصان کمک می‌کند پیشنهاد دقیق‌تری بدهند.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => onChange({ hasBudget: false, budgetMin: undefined, budgetMax: undefined })}
            className={[
              "flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              !draft.hasBudget
                ? "border-primary bg-primary/[0.05] text-primary"
                : "border-foreground/15 text-foreground/65 hover:border-primary/40",
            ].join(" ")}
          >
            بگذارید متخصصان قیمت بدهند
          </button>
          <button
            type="button"
            onClick={() => onChange({ hasBudget: true })}
            className={[
              "flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              draft.hasBudget
                ? "border-primary bg-primary/[0.05] text-primary"
                : "border-foreground/15 text-foreground/65 hover:border-primary/40",
            ].join(" ")}
          >
            بودجه‌ی تقریبی دارم
          </button>
        </div>

        {draft.hasBudget && (
          <div className="mt-4 flex items-center gap-3">
            <div className="relative flex-1">
              <Coins size={16} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-foreground/35" />
              <input
                type="text"
                inputMode="numeric"
                dir="ltr"
                placeholder="حداقل"
                value={draft.budgetMin ?? ""}
                onChange={(e) =>
                  onChange({ budgetMin: Number(toEnglishDigits(e.target.value).replace(/\D/g, "")) || undefined })
                }
                className="h-11 w-full rounded-xl border border-foreground/15 bg-background ps-9 pe-3 text-start text-sm outline-none transition-colors focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
              />
            </div>
            <span className="text-foreground/40">تا</span>
            <div className="relative flex-1">
              <Coins size={16} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-foreground/35" />
              <input
                type="text"
                inputMode="numeric"
                dir="ltr"
                placeholder="حداکثر"
                value={draft.budgetMax ?? ""}
                onChange={(e) =>
                  onChange({ budgetMax: Number(toEnglishDigits(e.target.value).replace(/\D/g, "")) || undefined })
                }
                className="h-11 w-full rounded-xl border border-foreground/15 bg-background ps-9 pe-3 text-start text-sm outline-none transition-colors focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
              />
            </div>
            <span className="shrink-0 text-sm text-foreground/50">تومان</span>
          </div>
        )}
      </div>
    </div>
  );
}