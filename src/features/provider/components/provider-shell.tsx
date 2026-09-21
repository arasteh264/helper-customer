"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Briefcase,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  UserRound,
  Wallet,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const NAV: NavItem[] = [
  { label: "نمای کلی", href: "/provider", icon: LayoutDashboard },
  { label: "کارها", href: "/provider/jobs", icon: Briefcase },
  { label: "پنل مالی", href: "/provider/finance", icon: Wallet },
  { label: "پروفایل", href: "/provider/profile", icon: UserRound },
];

interface ProviderShellProps {
  provider: { id: string; name: string; headline: string; avatar?: string };
  children: ReactNode;
}

function isActive(pathname: string, href: string) {
  return href === "/provider"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

function Avatar({ name, avatar, size = 40 }: { name: string; avatar?: string; size?: number }) {
  return avatar ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={avatar}
      alt=""
      width={size}
      height={size}
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

export function ProviderShell({ provider, children }: ProviderShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-foreground/[0.025] lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col border-e border-foreground/10 bg-card lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-foreground/10 px-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-base font-bold text-primary-foreground">
            H
          </span>
          <div className="leading-tight">
            <p className="text-base font-bold text-foreground">Helper</p>
            <p className="text-[11px] text-foreground/50">پنل متخصص</p>
          </div>
        </div>

        <nav aria-label="منوی پنل" className="flex-1 space-y-1 p-4">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={[
                  "flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  active
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground",
                ].join(" ")}
              >
                <Icon size={19} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3 border-t border-foreground/10 p-4">
          <Link
            href={`/specialists/${provider.id}`}
            className="flex items-center justify-between rounded-xl px-3 py-2 text-xs text-foreground/60 transition-colors hover:bg-foreground/5 hover:text-primary"
          >
            مشاهده‌ی پروفایل عمومی
            <ExternalLink size={14} />
          </Link>

          <div className="flex items-center gap-3 rounded-xl bg-foreground/[0.04] p-3">
            <Avatar name={provider.name} avatar={provider.avatar} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {provider.name}
              </p>
              <p className="truncate text-xs text-foreground/50">
                {provider.headline}
              </p>
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
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              H
            </span>
            <span className="text-sm font-semibold text-foreground">
              پنل متخصص
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/specialists/${provider.id}`}
              aria-label="مشاهده‌ی پروفایل عمومی"
              className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/60 hover:bg-foreground/5"
            >
              <ExternalLink size={18} />
            </Link>
            <Avatar name={provider.name} avatar={provider.avatar} size={34} />
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
        <ul className="grid grid-cols-4">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
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
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}