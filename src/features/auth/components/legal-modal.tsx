"use client";

import Link from "next/link";

import { Modal } from "@/src/components/shared/modal";
import { specialistTerms } from "../data/specialist-terms";

const privacy = [
  {
    title: "جمع‌آوری اطلاعات",
    body:
      "هلپر برای ارائه خدمات، ممکن است اطلاعاتی مثل نام، شماره تماس، آدرس، ایمیل، موقعیت جغرافیایی، اطلاعات حساب و سابقه تعامل‌ها را جمع‌آوری کند. این اطلاعات فقط برای ارائه سرویس، پیگیری درخواست، امنیت و تحلیل عملکرد پلتفرم استفاده می‌شود.",
  },
  {
    title: "استفاده از اطلاعات",
    body:
      "اطلاعات شما برای هماهنگی خدمات، ارتباط با متخصص، بهبود تجربه کاربری، تسهیل پرداخت، پیگیری سفارش، پیشنهادهای مرتبط و حفظ امنیت سیستم استفاده می‌شود. ما بدون رضایت شما اطلاعات شخصی را برای اهداف غیرمرتبط با خدمات پلتفرم به‌صورت عمومی منتشر نمی‌کنیم.",
  },
  {
    title: "اشتراک‌گذاری اطلاعات",
    body:
      "در صورت نیاز برای اجرای خدمات، برخی داده‌ها ممکن است فقط با متخصص یا طرف‌های وابسته‌ای که برای انجام خدمات موظف به رعایت حریم خصوصی هستند، به اشتراک گذاشته شوند. در صورت الزام قانونی یا درخواست رسمی قضایی، می‌توانیم اطلاعات لازم را در چارچوب قوانین ارائه کنیم.",
  },
  {
    title: "امنیت اطلاعات",
    body:
      "هلپر تلاش می‌کند با استفاده از ابزارهای مناسب، اطلاعات کاربران را در برابر دسترسی غیرمجاز، سرقت، سوءاستفاده یا افشای نادرست محافظت کند. با این حال، هیچ سیستم دیجیتالی به‌صورت کامل غیرقابل‌نفوذ نیست و استفاده از سرویس‌ها به‌صورت مسئولانه و با رعایت نکات ایمنی بر عهده کاربران است.",
  },
  {
    title: "حق دسترسی و کنترل داده‌ها",
    body:
      "کاربران می‌توانند در صورت نیاز، نسبت به بررسی، اصلاح یا حذف اطلاعات شخصی خود اقدام کنند. در صورت بروز هرگونه سوال یا درخواست درباره داده‌های شخصی، با پشتیبانی هلپر تماس بگیرید.",
  },
];

export function LegalModal({
  open,
  onClose,
  type,
}: {
  open: boolean;
  onClose: () => void;
  type: "terms" | "privacy";
}) {
  const items = type === "terms" ? specialistTerms : privacy;
  const pageHref =
    type === "terms" ? "/terms#specialist-cooperation" : "/privacy";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={type === "terms" ? "قوانین و مقررات" : "حریم خصوصی"}
      description={
        type === "terms"
          ? "شرایط همکاری متخصصان با هلپر درباره‌ی پیشنهاد قیمت، انجام خدمت، پرداخت و حریم خصوصی."
          : "با نحوه جمع‌آوری، استفاده و حفاظت از داده‌های شخصی آشنا شوید."
      }
      size="lg"
    >
      <div className="space-y-5">
        {items.map((item) => (
          <section
            key={item.title}
            className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-4"
          >
            <h3 className="text-base font-bold text-foreground">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-7 text-foreground/70">
              {item.body}
            </p>
          </section>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <Link
          href={pageHref}
          className="inline-flex items-center rounded-xl bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          مشاهده نسخه کامل صفحه
        </Link>
      </div>
    </Modal>
  );
}
