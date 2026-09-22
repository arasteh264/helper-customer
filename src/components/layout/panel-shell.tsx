"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { ExternalLink, LogOut, type LucideIcon } from "lucide-react";
import { IconKey, ICONS } from "@/src/features/provider/lib/icons";

export interface PanelNavItem {
  label: string;
  href: string;
  icon: IconKey;
  /** فقط وقتی مسیر دقیقاً برابر باشد فعال شود (برای صفحه‌ی «نمای کلی») */
  exact?: boolean;
  /** در نوار پایین موبایل نمایش داده شود (حداکثر ۵ مورد) */
  mobile?: boolean;
}

interface PanelShellProps {
  /** مثلاً «پنل مشتری» */
  subtitle: string;
  nav: PanelNavItem[];
  user: { name: string; subtitle?: string; avatar?: string };
  /** لینک اختیاری بالای کارت کاربر، مثلاً «مشاهده‌ی پروفایل عمومی» */
  extraLink?: { label: string; href: string };
  children: ReactNode;
}

function isActive(pathname: string, item: PanelNavItem) {
  return item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function Avatar({ name, src, size = 40 }: { name: string; src?: string; size?: number }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className="shrink-0 rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  ) : (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary"
      style={{ width: size, height: size }}
    >
      {name.charAt(0)}
    </span>
  );
}

export function PanelShell({ subtitle, nav, user, extraLink, children }: PanelShellProps) {
  const pathname = usePathname();
  const mobileNav = nav.filter((i) => i.mobile).slice(0, 5);

  return (
    <div className="min-h-screen bg-foreground/[0.025] lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col border-e border-foreground/10 bg-card lg:flex">
        <Link
          href="/"
          className="flex h-16 items-center gap-2.5 border-b border-foreground/10 px-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-base font-bold text-primary-foreground">
            H
          </span>
          <div className="leading-tight">
            <p className="text-base font-bold text-foreground">Helper</p>
            <p className="text-[11px] text-foreground/50">{subtitle}</p>
          </div>
        </Link>

        <nav aria-label="منوی پنل" className="flex-1 space-y-1 overflow-y-auto p-4">
          {nav.map((item) => {
            const active = isActive(pathname, item);
            const Icon = ICONS[item.icon];
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  active
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground",
                ].join(" ")}
              >
                <Icon size={19} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3 border-t border-foreground/10 p-4">
          {extraLink && (
            <Link
              href={extraLink.href}
              className="flex items-center justify-between rounded-xl px-3 py-2 text-xs text-foreground/60 transition-colors hover:bg-foreground/5 hover:text-primary"
            >
              {extraLink.label}
              <ExternalLink size={14} />
            </Link>
          )}

          <div className="flex items-center gap-3 rounded-xl bg-foreground/[0.04] p-3">
            <Avatar name={user.name} src={user.avatar} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
              {user.subtitle && (
                <p className="truncate text-xs text-foreground/50">{user.subtitle}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              aria-label="خروج از حساب"
              title="خروج"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground/50 transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-foreground/10 bg-background/85 px-4 backdrop-blur-xl lg:hidden">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              H
            </span>
            <span className="text-sm font-semibold text-foreground">{subtitle}</span>
          </Link>
          <div className="flex items-center gap-2">
            {extraLink && (
              <Link
                href={extraLink.href}
                aria-label={extraLink.label}
                className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/60 hover:bg-foreground/5"
              >
                <ExternalLink size={18} />
              </Link>
            )}
            <Avatar name={user.name} src={user.avatar} size={34} />
          </div>
        </header>

        <main
          id="main-content"
          className="mx-auto w-full max-w-5xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12 lg:pt-8"
        >
          {children}
        </main>
      </div>

      <nav
        aria-label="منوی پنل"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-foreground/10 bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
      >
        <ul
          className="grid"
          style={{ gridTemplateColumns: `repeat(${mobileNav.length}, minmax(0, 1fr))` }}
        >
          {mobileNav.map((item) => {
            const active = isActive(pathname, item);
            const Icon = ICONS[item.icon];
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
                    active ? "text-primary" : "text-foreground/55",
                  ].join(" ")}
                >
                  <span
                    className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${
                      active ? "bg-primary/10" : ""
                    }`}
                  >
                    <Icon size={20} />
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}