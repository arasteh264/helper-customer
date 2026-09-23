"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

import { Container } from "@/src/components/shared/container";
import { ButtonLink } from "@/src/components/shared/button-link";
import { Logo } from "../logo";
import { MobileMenu } from "./mobile-menu";
import { ServicesMenu } from "./services-menu";
import { isActivePath, navLinks, type HeaderUser } from "./nav-data";

interface SiteHeaderProps {
  user?: HeaderUser | null;
}

export function SiteHeader({ user = null }: SiteHeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-300",
        scrolled
          ? "border-foreground/10 bg-background/85 shadow-sm shadow-foreground/[0.04]"
          : "border-transparent bg-background/60",
      ].join(" ")}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:right-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        پرش به محتوای اصلی
      </a>

      <Container className="flex h-16 items-center justify-between gap-4 lg:h-[72px]">
        <div className="flex items-center gap-6 xl:gap-10">
          <Logo />

          <nav
            aria-label="منوی اصلی"
            className="hidden items-center gap-1 lg:flex"
          >
            <ServicesMenu active={pathname.startsWith("/services")} />

            {navLinks.map((link) => {
              const active = isActivePath(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    active
                      ? "text-primary"
                      : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground",
                  ].join(" ")}
                >
                  {link.label}
                  {active && (
                    <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 lg:flex">
            {user ? (
              <>
                <ButtonLink href="/customer" variant="outline">
                  مشاهده پروفایل
                </ButtonLink>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-foreground/15 px-4 text-sm font-medium text-foreground/80 transition-colors hover:border-destructive/40 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <LogOut size={16} />
                  خروج
                </button>
              </>
            ) : (
              <>
                <ButtonLink href="/login" variant="ghost">
                  ورود
                </ButtonLink>
                <ButtonLink href="/register">ثبت‌نام</ButtonLink>
              </>
            )}
          </div>

          <MobileMenu user={user} />
        </div>
      </Container>
    </header>
  );
}
