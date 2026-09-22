"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Loader2, Save } from "lucide-react";

import { Button } from "@/src/components/ui/button";


import { DaySchedule } from "../types/types";
import { SectionCard } from "@/src/components/shared/section-card";


const timeCls =
  "h-10 w-28 rounded-lg border border-foreground/15 bg-background px-2 text-center text-sm outline-none transition-colors focus:border-primary/50 focus:ring-4 focus:ring-primary/10 disabled:opacity-40";

export function AvailabilityEditor({ initial }: { initial: DaySchedule[] }) {
  const [days, setDays] = useState(initial);
  const [saving, setSaving] = useState(false);

  const update = (id: string, patch: Partial<DaySchedule>) =>
    setDays((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));

  const invalid = (d: DaySchedule) => d.enabled && d.from >= d.to;
  const hasError = days.some(invalid);

  const applyToAll = () => {
    const first = days.find((d) => d.enabled);
    if (!first) return;
    setDays((prev) =>
      prev.map((d) => (d.enabled ? { ...d, from: first.from, to: first.to } : d))
    );
    toast.success("ساعت اولین روز فعال به بقیه‌ی روزهای فعال اعمال شد");
  };

  const save = async () => {
    if (hasError) return;
    setSaving(true);
    try {
      // TODO: آدرس API خودتان را جایگزین کنید
      const res = await fetch("/api/provider/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(days),
      });
      if (!res.ok) throw new Error();
      toast.success("ساعات کاری ذخیره شد");
    } catch {
      toast.error("ذخیره انجام نشد. دوباره تلاش کنید.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionCard
      id="availability"
      title="ساعات کاری"
      description="روزها و ساعت‌هایی که می‌توانید کار بگیرید را مشخص کنید."
      action={
        <button
          type="button"
          onClick={applyToAll}
          className="hidden items-center gap-1.5 text-sm font-medium text-primary hover:underline sm:inline-flex"
        >
          <Copy size={15} />
          اعمال به همه‌ی روزها
        </button>
      }
    >
      <ul className="divide-y divide-foreground/10">
        {days.map((d) => (
          <li
            key={d.id}
            className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={d.enabled}
                aria-label={`${d.label} فعال باشد`}
                onClick={() => update(d.id, { enabled: !d.enabled })}
                dir="ltr"
                className={[
                  "relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  d.enabled ? "bg-primary" : "bg-foreground/20",
                ].join(" ")}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                    d.enabled ? "left-[1.375rem]" : "left-0.5"
                  }`}
                />
              </button>
              <span
                className={`w-20 text-sm font-medium ${
                  d.enabled ? "text-foreground" : "text-foreground/40"
                }`}
              >
                {d.label}
              </span>
            </div>

            {d.enabled ? (
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2 text-sm text-foreground/60">
                  <label className="sr-only" htmlFor={`${d.id}-from`}>
                    ساعت شروع {d.label}
                  </label>
                  <input
                    id={`${d.id}-from`}
                    type="time"
                    dir="ltr"
                    value={d.from}
                    onChange={(e) => update(d.id, { from: e.target.value })}
                    className={timeCls}
                  />
                  <span>تا</span>
                  <label className="sr-only" htmlFor={`${d.id}-to`}>
                    ساعت پایان {d.label}
                  </label>
                  <input
                    id={`${d.id}-to`}
                    type="time"
                    dir="ltr"
                    value={d.to}
                    onChange={(e) => update(d.id, { to: e.target.value })}
                    className={timeCls}
                  />
                </div>
                {invalid(d) && (
                  <p className="text-xs text-destructive">
                    ساعت پایان باید بعد از شروع باشد
                  </p>
                )}
              </div>
            ) : (
              <span className="text-sm text-foreground/40">تعطیل</span>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={applyToAll}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline sm:hidden"
        >
          <Copy size={15} />
          اعمال به همه
        </button>
        <Button
          type="button"
          onClick={save}
          disabled={saving || hasError}
          className="ms-auto gap-1.5"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          ذخیره‌ی ساعات کاری
        </Button>
      </div>
    </SectionCard>
  );
}