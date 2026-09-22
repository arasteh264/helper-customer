"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  /** عرض حداکثر پنجره */
  size?: "sm" | "md" | "lg";
}

const SIZES = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-xl" };

/**
 * پنجره‌ی مودال بر پایه‌ی <dialog> بومی:
 * فوکوس‌ترپ، Escape و آیکن دسترسی‌پذیری را خود مرورگر مدیریت می‌کند.
 * محتوا فقط وقتی باز است mount می‌شود، پس فرم‌های داخلش هر بار تازه شروع می‌کنند.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        // کلیک روی پس‌زمینه‌ی تیره
        if (e.target === e.currentTarget) onClose();
      }}
      aria-labelledby={titleId}
      className={`m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] ${SIZES[size]} overflow-y-auto rounded-2xl border border-foreground/10 bg-card p-0 text-foreground shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm`}
    >
      {open && (
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id={titleId} className="text-lg font-semibold">
                {title}
              </h2>
              {description && (
                <p className="mt-1 text-sm leading-6 text-foreground/55">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="بستن"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-foreground/50 hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-5">{children}</div>
        </div>
      )}
    </dialog>
  );
}