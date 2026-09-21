"use client";

import { useState } from "react";
import { toast } from "sonner";

/** سوییچ سریع «آماده‌ی دریافت کار» */
export function AvailabilityToggle({ initial = true }: { initial?: boolean }) {
  const [on, setOn] = useState(initial);

  const toggle = () => {
    const next = !on;
    setOn(next);
    // TODO: وضعیت را به API ارسال کنید
    toast.success(next ? "حالا درخواست‌های جدید دریافت می‌کنید" : "دریافت درخواست جدید متوقف شد");
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-foreground/10 bg-card p-4">
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span
            className={`h-2.5 w-2.5 rounded-full ${on ? "bg-green-500" : "bg-foreground/25"}`}
          />
          {on ? "آماده‌ی دریافت کار" : "در حال استراحت"}
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
        onClick={toggle}
        dir="ltr"
        className={[
          "relative h-7 w-12 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          on ? "bg-primary" : "bg-foreground/20",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all",
            on ? "left-[1.5rem]" : "left-0.5",
          ].join(" ")}
        />
      </button>
    </div>
  );
}