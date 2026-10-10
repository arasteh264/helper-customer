"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Coins, Zap } from "lucide-react";

import type { NewRequestDraft, Urgency } from "../types/request.types";
import { URGENCY_HINT, URGENCY_LABEL } from "../utils/estimate";
import { toEnglishDigits } from "@/src/utils/format";
import { Input } from "@/src/components/ui/input";

const persianPartsFormatter = new Intl.DateTimeFormat(
  "en-US-u-ca-persian-nu-latn",
  { year: "numeric", month: "numeric", day: "numeric" },
);
const persianMonthFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  year: "numeric",
  month: "long",
});
const persianNumber = new Intl.NumberFormat("fa-IR");
const WEEK_DAYS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

function partsOf(date: Date) {
  const parts = Object.fromEntries(
    persianPartsFormatter
      .formatToParts(date)
      .map(({ type, value }) => [type, Number(value)]),
  );
  return {
    year: parts.year ?? 0,
    month: parts.month ?? 0,
    day: parts.day ?? 0,
  };
}

function startOfPersianMonth(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
  const current = partsOf(start);
  while (true) {
    const previous = new Date(start);
    previous.setDate(previous.getDate() - 1);
    const previousParts = partsOf(previous);
    if (
      previousParts.year !== current.year ||
      previousParts.month !== current.month
    ) {
      return start;
    }
    start.setTime(previous.getTime());
  }
}

function localDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function selectedLocalDate(value?: string) {
  if (!value) return null;
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day, 12);
}

function PersianDateTimePicker({
  value,
  onChange,
}: {
  value?: string;
  onChange: (value: string) => void;
}) {
  const selectedDate = selectedLocalDate(value);
  const [visibleMonth, setVisibleMonth] = useState(() =>
    startOfPersianMonth(selectedDate ?? new Date()),
  );
  const days = useMemo(() => {
    const firstDay = startOfPersianMonth(visibleMonth);
    const offset = (firstDay.getDay() + 1) % 7;
    const gridStart = new Date(firstDay);
    gridStart.setDate(gridStart.getDate() - offset);
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + index);
      return date;
    });
  }, [visibleMonth]);
  const selectedTime = value?.slice(11, 16) ?? "";
  const timeOptions = Array.from({ length: 32 }, (_, index) => {
    const totalMinutes = 7 * 60 + index * 30;
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  }).filter((time) => time <= "22:30");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const visibleMonthParts = partsOf(visibleMonth);
  const shiftMonth = (offset: number) => {
    const next = new Date(visibleMonth);
    next.setDate(15);
    next.setMonth(next.getMonth() + offset);
    setVisibleMonth(startOfPersianMonth(next));
  };

  return (
    <div className="mt-4 grid gap-4 rounded-2xl border border-foreground/10 bg-background p-4 sm:grid-cols-[minmax(0,1fr)_11rem]">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            aria-label="ماه قبل"
            onClick={() => shiftMonth(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-foreground/10 hover:bg-foreground/[0.04]"
          >
            <ChevronRight size={18} />
          </button>
          <p className="font-semibold text-foreground">
            {persianMonthFormatter.format(visibleMonth)}
          </p>
          <button
            type="button"
            aria-label="ماه بعد"
            onClick={() => shiftMonth(1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-foreground/10 hover:bg-foreground/[0.04]"
          >
            <ChevronLeft size={18} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {WEEK_DAYS.map((day) => (
            <span
              key={day}
              className="py-1.5 text-xs font-medium text-foreground/45"
            >
              {day}
            </span>
          ))}
          {days.map((date) => {
            const parts = partsOf(date);
            const sameMonth =
              parts.year === visibleMonthParts.year &&
              parts.month === visibleMonthParts.month;
            const selected =
              selectedDate !== null &&
              localDateValue(selectedDate) === localDateValue(date);
            const disabled = date < today;
            return (
              <button
                key={localDateValue(date)}
                type="button"
                disabled={disabled}
                aria-pressed={selected}
                onClick={() => {
                  const dateValue = localDateValue(date);
                  const time = selectedTime || "10:00";
                  onChange(`${dateValue}T${time}`);
                }}
                className={[
                  "mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-25",
                  selected
                    ? "bg-primary font-semibold text-primary-foreground"
                    : sameMonth
                      ? "text-foreground hover:bg-primary/10"
                      : "text-foreground/30 hover:bg-primary/10",
                ].join(" ")}
              >
                {persianNumber.format(parts.day)}
              </button>
            );
          })}
        </div>
      </div>
      <div className="space-y-2 border-t border-foreground/10 pt-4 sm:border-s sm:border-t-0 sm:pt-0 sm:ps-4">
        <label
          htmlFor="req-time"
          className="flex items-center gap-2 text-sm font-semibold text-foreground"
        >
          <Clock size={16} className="text-primary" />
          ساعت حضور
        </label>
        <select
          id="req-time"
          value={selectedTime}
          disabled={!selectedDate}
          onChange={(event) => {
            if (!selectedDate) return;
            onChange(`${localDateValue(selectedDate)}T${event.target.value}`);
          }}
          className="h-11 w-full rounded-xl border border-foreground/15 bg-card px-3 text-sm outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 disabled:opacity-50"
        >
          <option value="" disabled>
            انتخاب ساعت
          </option>
          {timeOptions.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
        <p className="text-xs leading-5 text-foreground/50">
          ساعت‌ها به وقت محلی و در بازه‌های نیم‌ساعته هستند.
        </p>
      </div>
    </div>
  );
}

const URGENCY_ICONS: Record<Urgency, typeof Zap> = {
  asap: Zap,
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
        <h2 className="text-lg font-semibold text-foreground">
          چه زمانی به این کار نیاز دارید؟
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {(Object.keys(URGENCY_LABEL) as Urgency[]).map((u) => {
            const Icon = URGENCY_ICONS[u];
            const selected = draft.urgency === u;
            return (
              <li key={u}>
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      urgency: u,
                      scheduledAt:
                        u === "scheduled" ? draft.scheduledAt : undefined,
                    })
                  }
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
                      selected
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    <Icon size={17} />
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {URGENCY_LABEL[u]}
                  </span>
                  <span className="text-xs leading-5 text-foreground/55">
                    {URGENCY_HINT[u]}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {draft.urgency === "scheduled" && (
          <PersianDateTimePicker
            value={draft.scheduledAt}
            onChange={(scheduledAt) => onChange({ scheduledAt })}
          />
        )}
      </div>

      {/* بودجه */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          بودجه‌ی تقریبی دارید؟
        </h2>
        <p className="mt-1 text-sm text-foreground/55">
          این اختیاری است، اما به متخصصان کمک می‌کند پیشنهاد دقیق‌تری بدهند.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() =>
              onChange({
                hasBudget: false,
                budgetMin: undefined,
                budgetMax: undefined,
              })
            }
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
              <Coins
                size={16}
                className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-foreground/35"
              />
              <input
                type="text"
                inputMode="numeric"
                dir="ltr"
                placeholder="حداقل"
                value={draft.budgetMin ?? ""}
                onChange={(e) =>
                  onChange({
                    budgetMin:
                      Number(
                        toEnglishDigits(e.target.value).replace(/\D/g, ""),
                      ) || undefined,
                  })
                }
                className="h-11 rounded-xl ps-9 pe-3 text-start text-sm"
              />
            </div>
            <span className="text-foreground/40">تا</span>
            <div className="relative flex-1">
              <Coins
                size={16}
                className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-foreground/35"
              />
              <Input
                type="text"
                inputMode="numeric"
                dir="ltr"
                placeholder="حداکثر"
                value={draft.budgetMax ?? ""}
                onChange={(e) =>
                  onChange({
                    budgetMax:
                      Number(
                        toEnglishDigits(e.target.value).replace(/\D/g, ""),
                      ) || undefined,
                  })
                }
                className="h-11 rounded-xl ps-9 pe-3 text-start text-sm"
              />
            </div>
            <span className="shrink-0 text-sm text-foreground/50">تومان</span>
          </div>
        )}
      </div>
    </div>
  );
}
