import {
  FileText,
  MapPinned,
  MessageCircle,
  WalletCards,
} from "lucide-react";

import { Container } from "@/src/components/shared/container";
import { SectionHeading } from "@/src/components/shared/section-heading";

const providerTools = [
  {
    icon: MapPinned,
    title: "درخواست‌های مناسب را پیدا کنید",
    description:
      "تخصص و محدوده‌ی فعالیتتان را ثبت کنید تا درخواست‌های مرتبط را در پنل ببینید.",
  },
  {
    icon: MessageCircle,
    title: "جزئیات را با مشتری هماهنگ کنید",
    description:
      "گفتگوی هر درخواست، پیشنهاد قیمت و وضعیت انجام کار را یک‌جا پیگیری کنید.",
  },
  {
    icon: FileText,
    title: "هزینه‌ها را مرتب ارائه دهید",
    description:
      "شرح خدمات و مبلغ را شفاف ثبت کنید و فاکتور قابل‌ارائه برای مشتری آماده کنید.",
  },
  {
    icon: WalletCards,
    title: "درآمد را مدیریت کنید",
    description:
      "تراکنش‌ها، موجودی و درخواست‌های برداشت را از پنل مالی دنبال کنید.",
  },
];

export function EarningsShowcase() {
  return (
    <section className="py-12 sm:py-20">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="ابزارهای پنل متخصص"
          title="از پیدا کردن کار تا پیگیری درآمد"
          description="برای مدیریت روزمره‌ی همکاری، لازم نیست بین چند ابزار جابه‌جا شوید؛ درخواست‌ها، گفتگوها و امور مالی در پنل متخصص در دسترس‌اند."
        />

        <ul className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
          {providerTools.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="rounded-2xl border border-foreground/10 bg-card p-4 sm:p-5"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon size={21} aria-hidden="true" />
              </span>
              <h3 className="mt-3 text-sm font-semibold text-foreground">
                {title}
              </h3>
              <p className="mt-2 text-xs leading-6 text-foreground/60 sm:text-sm">
                {description}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
