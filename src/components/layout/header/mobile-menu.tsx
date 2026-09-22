"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  ChevronDown,
  ChevronLeft,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  X,
} from "lucide-react";

import { ButtonLink } from "@/src/components/shared/button-link";
import { Logo } from "../logo";
import {
  isActivePath,
  navLinks,
  serviceMenuItems,
  type HeaderUser,
} from "./nav-data";
import { ICONS } from "@/src/features/provider/lib/icons";

const FOCUSABLE = "a[href], button:not([disabled]), input, summary";

export function MobileMenu({ user }: { user?: HeaderUser | null }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => e.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

      const items = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!items || items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const trigger = triggerRef.current;

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
  }, [open]);

  const drawer = (
    <div
      className={`fixed inset-0 z-[60] transition-[visibility] duration-300 lg:hidden ${
        open ? "visible" : "invisible"
      }`}
      aria-hidden={!open}
    >
      <div
        onClick={() => setOpen(false)}
        className={`absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        ref={panelRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="منوی اصلی"
        className={`absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col bg-background shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-foreground/10 px-5">
          <Logo />
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="بستن منو"
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <form
            action="/search"
            method="get"
            role="search"
            className="relative"
          >
            <label htmlFor="mobile-search" className="sr-only">
              جستجوی خدمت یا متخصص
            </label>
            <Search
              size={18}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/40"
              aria-hidden
            />
            <input
              id="mobile-search"
              name="q"
              type="search"
              placeholder="چه متخصصی نیاز دارید؟"
              className="h-12 w-full rounded-xl border border-foreground/10 bg-foreground/[0.03] pr-11 pl-4 text-sm outline-none transition-colors placeholder:text-foreground/40 focus:border-primary/40 focus:bg-background focus:ring-4 focus:ring-primary/10"
            />
          </form>

          <nav aria-label="منوی موبایل" className="mt-5">
            <ul className="space-y-1">
              <li>
                <details className="group rounded-xl">
                  <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-3 py-3.5 text-base font-medium text-foreground transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary [&::-webkit-details-marker]:hidden">
                    خدمات
                    <ChevronDown
                      size={18}
                      className="text-foreground/40 transition-transform group-open:rotate-180"
                    />
                  </summary>

                  <ul className="mt-1 grid grid-cols-1 gap-1 pb-2 pr-2">
                    {serviceMenuItems.map((item) => {
                      const Icon = ICONS[item.icon];
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          >
                            <span
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.tint}`}
                            >
                              <Icon size={18} />
                            </span>
                            <span className="text-sm text-foreground/80">
                              {item.label}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                    <li>
                      <Link
                        href="/services"
                        className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-primary"
                      >
                        مشاهده‌ی همه‌ی خدمات
                        <ChevronLeft size={16} />
                      </Link>
                    </li>
                  </ul>
                </details>
              </li>

              {navLinks.map((link) => {
                const active = isActivePath(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={[
                        "flex items-center justify-between rounded-xl px-3 py-3.5 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-foreground/5",
                      ].join(" ")}
                    >
                      {link.label}
                      <ChevronLeft size={18} className="text-foreground/30" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="shrink-0 space-y-3 border-t border-foreground/10 bg-foreground/[0.02] p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          {user ? (
            <>
              <div className="flex items-center gap-3 rounded-xl border border-foreground/10 bg-card p-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">
                  {user.name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {user.name}
                  </p>
                  <p className="text-xs text-foreground/50">حساب کاربری</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <ButtonLink href="/dashboard" size="lg" className="gap-1.5">
                  <LayoutDashboard size={18} />
                  پنل کاربری
                </ButtonLink>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="inline-flex h-12 items-center justify-center gap-1.5 rounded-xl border border-foreground/15 text-sm font-medium text-foreground/80 transition-colors hover:border-destructive/40 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <LogOut size={18} />
                  خروج
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <ButtonLink href="/login" variant="outline" size="lg">
                  ورود
                </ButtonLink>
                <ButtonLink href="/register" size="lg">
                  ثبت‌نام
                </ButtonLink>
              </div>
              <Link
                href="/register?role=specialist"
                className="block text-center text-sm text-foreground/60 transition-colors hover:text-primary"
              >
                متخصص هستید؟{" "}
                <span className="font-medium text-primary">همکاری با هلپر</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="باز کردن منو"
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-foreground/10 bg-card text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
      >
        <Menu size={22} />
      </button>

      {mounted ? createPortal(drawer, document.body) : null}
    </>
  );
}
