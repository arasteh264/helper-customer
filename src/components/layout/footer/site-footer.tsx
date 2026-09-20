import Link from "next/link";
import { Clock3, Mail, Phone, Send, ShieldCheck } from "lucide-react";

import { Container } from "@/src/components/shared/container";
import { BackToTop } from "./back-to-top";
import { contactInfo, footerColumns, socials } from "./footer-data";

function SocialIcon({ id }: { id: (typeof socials)[number]["id"] }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (id === "telegram") return <Send size={18} aria-hidden />;

  if (id === "instagram") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <path d="M17.5 6.5v.01" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 11v5M8 8v.01M12 16v-5M12 13a2.5 2.5 0 0 1 5 0v3" />
    </svg>
  );
}

const contactItems = [
  {
    icon: Phone,
    label: "پشتیبانی تلفنی",
    value: contactInfo.phone,
    href: contactInfo.phoneHref,
  },
  {
    icon: Mail,
    label: "ایمیل",
    value: contactInfo.email,
    href: `mailto:${contactInfo.email}`,
  },
  {
    icon: Clock3,
    label: "ساعت پاسخ‌گویی",
    value: contactInfo.hours,
    href: undefined,
  },
];

export function SiteFooter() {
  const year = new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(
    new Date(),
  );

  return (
    <footer className="relative mt-8 border-t border-foreground/10 bg-foreground/[0.025]">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />

      <Container className="pb-8 pt-12 sm:pt-16">
        <ul className="grid gap-3 sm:grid-cols-3">
          {contactItems.map(({ icon: Icon, label, value, href }) => {
            const content = (
              <>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon size={20} />
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

            const cls =
              "flex items-center gap-3 rounded-2xl border border-foreground/10 bg-card p-4";

            return (
              <li key={label}>
                {href ? (
                  <a
                    href={href}
                    className={`${cls} transition-colors hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
                  >
                    {content}
                  </a>
                ) : (
                  <div className={cls}>{content}</div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="هلپر، صفحه‌ی اصلی"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground shadow-lg shadow-primary/25">
                H
              </span>
              <span className="text-xl font-bold text-foreground">Helper</span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-7 text-foreground/60">
              هلپر شما را به متخصصان تأییدشده در هر زمینه‌ای وصل می‌کند؛ از
              تعمیرات و نظافت تا مشاوره، تدریس و طراحی. سریع، شفاف و مطمئن.
            </p>

            <ul className="mt-6 flex items-center gap-2">
              {socials.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    title={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/10 bg-card text-foreground/60 transition-all hover:border-primary/40 hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:hover:-translate-y-0.5"
                  >
                    <SocialIcon id={s.id} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav
            aria-label="پیوندهای فوتر"
            className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-8 lg:pr-8"
          >
            {footerColumns.map((col, index) => (
              <div
                key={col.title}
                className={
                  index === footerColumns.length - 1
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
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-2xl border border-foreground/10 bg-card p-5 sm:flex-row sm:items-center">
          <p className="flex items-start gap-2.5 text-sm leading-7 text-foreground/60">
            <ShieldCheck size={20} className="mt-1 shrink-0 text-primary" />
            پرداخت‌ها از طریق درگاه امن انجام می‌شود و اطلاعات شما نزد ما محفوظ
            است.
          </p>

          <div className="flex shrink-0 items-center gap-3">
            {["نماد اعتماد", "ساماندهی"].map((label) => (
              <div
                key={label}
                className="flex h-16 w-16 items-center justify-center rounded-xl border border-dashed border-foreground/20 text-center text-[10px] leading-4 text-foreground/40"
              >
                {label}
              </div>
            ))}
          </div>
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
