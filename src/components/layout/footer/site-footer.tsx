import Link from "next/link";
import { HandHelping } from "lucide-react";
import { ClipboardList, FileText, Mail, ShieldCheck } from "lucide-react";

import { Container } from "@/src/components/shared/container";
import type { ServiceMenuItem } from "../header/nav-data";
import { BackToTop } from "./back-to-top";
import {
  contactInfo,
  footerColumns,
  type FooterColumn,
} from "./footer-data";

const contactItems = [
  {
    icon: Mail,
    label: "ایمیل پشتیبانی",
    value: contactInfo.email,
    href: `mailto:${contactInfo.email}`,
    external: true,
  },
  {
    icon: ClipboardList,
    label: "پیگیری درخواست",
    value: "وضعیت و جزئیات درخواست‌ها",
    href: "/customer/requests",
    external: false,
  },
  {
    icon: FileText,
    label: "قوانین و شرایط",
    value: "پرداخت و مسئولیت‌ها",
    href: "/terms",
    external: false,
  },
];

export function SiteFooter({
  serviceItems,
}: {
  serviceItems: ServiceMenuItem[];
}) {
  const columns: FooterColumn[] = footerColumns.map((column) =>
    column.title === "خدمات پرطرفدار"
      ? {
          ...column,
          links: [
            ...serviceItems.slice(0, 5).map(({ label, href }) => ({
              label,
              href,
            })),
            { label: "همه‌ی خدمات", href: "/services", highlight: true },
          ],
        }
      : column,
  );
  const year = new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(
    new Date(),
  );

  return (
    <footer className="relative mt-8 border-t border-foreground/10 bg-foreground/[0.025]">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />

      <Container className="pb-8 pt-12 sm:pt-16">
        <ul className="grid gap-3 sm:grid-cols-3">
          {contactItems.map(
            ({ icon: Icon, label, value, href, external }) => {
              const content = (
                <>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-foreground/50">
                      {label}
                    </span>
                    <span className="block truncate text-sm font-semibold text-foreground">
                      {value}
                    </span>
                  </span>
                </>
              );

              const className =
                "flex items-center gap-3 rounded-2xl border border-foreground/10 bg-card p-4 transition-colors hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

              return (
                <li key={label}>
                  {external ? (
                    <a href={href} className={className}>
                      {content}
                    </a>
                  ) : (
                    <Link href={href} className={className}>
                      {content}
                    </Link>
                  )}
                </li>
              );
            },
          )}
        </ul>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="هلپر، صفحه‌ی اصلی"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-cyan-700 text-primary-foreground shadow-lg shadow-primary/25">
                <HandHelping size={21} strokeWidth={2.4} aria-hidden="true" />
              </span>
              <span className="text-xl font-bold text-foreground">Helper</span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-7 text-foreground/60">
              در هلپر درخواست خدمات ثبت کنید، پروفایل متخصصان را ببینید و
              جزئیات درخواست و پرداخت را از حساب خود پیگیری کنید.
            </p>
          </div>

          <nav
            aria-label="پیوندهای فوتر"
            className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-8 lg:pr-8"
          >
            {columns.map((col, index) => (
              <div
                key={col.title}
                className={
                  index === columns.length - 1
                    ? "col-span-2 sm:col-span-1"
                    : ""
                }
              >
                <h3 className="text-sm font-semibold text-foreground">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      {link.href.startsWith("mailto:") ? (
                        <a
                          href={link.href}
                          className={[
                            "inline-block rounded text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                            link.highlight
                              ? "font-medium text-primary hover:underline"
                              : "text-foreground/60 hover:text-primary",
                          ].join(" ")}
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className={[
                            "inline-block rounded text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                            link.highlight
                              ? "font-medium text-primary hover:underline"
                              : "text-foreground/60 hover:text-primary",
                          ].join(" ")}
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-2xl border border-foreground/10 bg-card p-5 sm:flex-row sm:items-center">
          <p className="flex items-start gap-2.5 text-sm leading-7 text-foreground/60">
            <ShieldCheck size={20} className="mt-1 shrink-0 text-primary" />
            پرداخت‌های انجام‌شده در پلتفرم در سابقه‌ی کیف پول یا درخواست ثبت
            می‌شوند. روش‌ها و شرایط را پیش از پرداخت بررسی کنید.
          </p>
          <Link
            href="/terms"
            className="shrink-0 text-sm font-semibold text-primary hover:underline"
          >
            دیدن قوانین پرداخت
          </Link>
        </div>

        <div className="mt-8 flex flex-col-reverse items-center justify-between gap-4 border-t border-foreground/10 pt-6 sm:flex-row">
          <p className="text-center text-xs leading-6 text-foreground/50 sm:text-right">
            © {year} هلپر. تمامی حقوق محفوظ است.
          </p>
          <BackToTop />
        </div>
      </Container>
    </footer>
  );
}
