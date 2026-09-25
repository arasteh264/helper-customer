"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { providerApi } from "../../api/provider.api";

interface AvailabilityToggleProps {
  initial?: boolean;
  accessToken: string;
}

export function AvailabilityToggle({
  initial = true,
  accessToken,
}: AvailabilityToggleProps) {
  const [on, setOn] = useState(initial);
  const [saving, setSaving] = useState(false);

  const toggle = async () => {
    const next = !on;

    setSaving(true);

    try {
      await providerApi.updateProfile(
        {
          isAvailable: next,
        },
        accessToken,
      );

      setOn(next);

      toast.success(
        next
          ? "حالا درخواست‌های جدید دریافت می‌کنید"
          : "دریافت درخواست جدید متوقف شد",
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "تغییر وضعیت انجام نشد. دوباره تلاش کنید.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-foreground/10 bg-card p-4">
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              on
                ? "bg-green-500"
                : "bg-foreground/25"
            }`}
          />

          {on
            ? "آماده‌ی دریافت کار"
            : "در حال استراحت"}
        </p>

        <p className="mt-1 text-xs leading-5 text-foreground/55">
          {on
            ? "مشتریان می‌توانند برایتان درخواست ثبت کنند."
            : "تا فعال نکنید درخواست جدیدی نمی‌گیرید."}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label="آماده‌ی دریافت کار"
        disabled={saving}
        onClick={toggle}
        dir="ltr"
        className={[
          "relative h-7 w-12 shrink-0 rounded-full transition-colors",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-primary focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-60",
          on
            ? "bg-primary"
            : "bg-foreground/20",
        ].join(" ")}
      >
        {saving ? (
          <Loader2
            size={14}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin text-white"
          />
        ) : (
          <span
            className={[
              "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all",
              on
                ? "left-[1.5rem]"
                : "left-0.5",
            ].join(" ")}
          />
        )}
      </button>
    </div>
  );
}