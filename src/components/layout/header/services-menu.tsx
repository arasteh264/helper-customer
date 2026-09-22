"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ChevronDown } from "lucide-react";

import { ButtonLink } from "@/src/components/shared/button-link";
import { serviceMenuItems } from "./nav-data";
import { ICONS } from "@/src/features/provider/lib/icons";

export function ServicesMenu({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const openWithHover = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeWithHover = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    closeTimer.current = window.setTimeout(() => setOpen(false), 120);
  };

  return (
    <div
      ref={rootRef}
      className="relative"
      onPointerEnter={openWithHover}
      onPointerLeave={closeWithHover}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="services-menu"
        className={[
          "relative flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          active || open
            ? "text-primary"
            : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground",
        ].join(" ")}
      >
        خدمات
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
        {active && (
          <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary" />
        )}
      </button>

      <div
        id="services-menu"
        className={[
          "absolute right-0 top-full z-50 w-[46rem] max-w-[calc(100vw-2rem)] pt-3 transition-all duration-200",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible pointer-events-none -translate-y-2 opacity-0",
        ].join(" ")}
      >
        <div className="flex overflow-hidden rounded-2xl border border-foreground/10 bg-card shadow-2xl shadow-foreground/[0.12]">
          <div className="flex-1 p-3">
            <ul className="grid grid-cols-2 gap-1">
              {serviceMenuItems.slice(0, 10).map((item) => {
                const Icon = ICONS[item.icon];
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-foreground/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.tint}`}
                      >
                        <Icon size={20} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                          {item.label}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-foreground/50">
                          {item.description}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-2 border-t border-foreground/5 px-3 pt-3">
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                مشاهده‌ی همه‌ی خدمات
                <ArrowLeft size={16} />
              </Link>
            </div>
          </div>

          <aside className="relative hidden w-56 shrink-0 flex-col justify-between overflow-hidden bg-gradient-to-br from-primary to-primary-hover p-5 text-primary-foreground xl:flex">
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-white/10 blur-2xl"
            />
            <div className="relative">
              <p className="text-base font-bold leading-7">
                کارتان در لیست نیست؟
              </p>
              <p className="mt-2 text-xs leading-6 text-primary-foreground/80">
                هر کاری بخواهید ثبت کنید تا متخصصش را برایتان پیدا کنیم.
              </p>
            </div>
            <ButtonLink
              href="/request"
              variant="light"
              className="relative mt-6 w-full"
            >
              ثبت درخواست
            </ButtonLink>
          </aside>
        </div>
      </div>
    </div>
  );
}
