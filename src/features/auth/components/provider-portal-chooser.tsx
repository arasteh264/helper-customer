"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import { BriefcaseBusiness, UserRound } from "lucide-react";

import type { PortalMode } from "../utils/portal-mode";

export function ProviderPortalChooser({
  open,
  onChoose,
}: {
  open: boolean;
  onChoose: (mode: PortalMode) => void;
}) {
  const customerButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) customerButtonRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const keepFocusInDialog = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab") return;

    const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>(
      "button:not([disabled])",
    );
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/55 p-4 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="portal-choice-title"
        aria-describedby="portal-choice-description"
        onKeyDown={keepFocusInDialog}
        className="w-full max-w-lg rounded-3xl border border-foreground/10 bg-card p-6 shadow-2xl sm:p-8"
      >
        <div className="text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BriefcaseBusiness size={23} />
          </span>
          <h2
            id="portal-choice-title"
            className="mt-4 text-xl font-bold text-foreground"
          >
            چطور وارد هلپا24 می‌شوید؟
          </h2>
          <p
            id="portal-choice-description"
            className="mt-2 text-sm leading-6 text-foreground/60"
          >
            می‌توانید درخواست خدمت ثبت کنید یا وارد پنل کاری متخصص شوید. این
            انتخاب نقش حساب شما را تغییر نمی‌دهد.
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            ref={customerButtonRef}
            type="button"
            onClick={() => onChoose("CUSTOMER")}
            className="group rounded-2xl border border-primary/20 bg-primary/[0.04] p-4 text-right transition-colors hover:border-primary/50 hover:bg-primary/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <UserRound size={21} className="text-primary" />
            <span className="mt-3 block font-semibold text-foreground">
              ورود به‌عنوان مشتری
            </span>
            <span className="mt-1 block text-xs leading-5 text-foreground/55">
              ثبت درخواست خدمت و پیگیری سفارش‌ها
            </span>
          </button>
          <button
            type="button"
            onClick={() => onChoose("PROVIDER")}
            className="rounded-2xl border border-foreground/10 p-4 text-right transition-colors hover:border-primary/40 hover:bg-foreground/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <BriefcaseBusiness size={21} className="text-foreground/65" />
            <span className="mt-3 block font-semibold text-foreground">
              ورود به‌عنوان متخصص
            </span>
            <span className="mt-1 block text-xs leading-5 text-foreground/55">
              مدیریت درخواست‌ها و پنل تخصصی
            </span>
          </button>
        </div>
      </section>
    </div>
  );
}
