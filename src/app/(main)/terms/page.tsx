import type { Metadata } from "next";

import { Container } from "@/src/components/shared/container";

export const metadata: Metadata = {
  title: "قوانین و مقررات | هلپر",
  description:
    "با قوانین و مقررات استفاده از خدمات هلپر آشنا شوید و شرایط همکاری، پرداخت، مسئولیت‌ها و خدمات را ببینید.",
};

const terms = [
  {
    title: "تعریف خدمات و مسئولیت‌ها",
    body:
      "هلپر تنها واسطه‌ای برای معرفی متخصصان، سرویس‌دهندگان و کاربران است و مسئولیتی در قبال کیفیت، نتیجه یا زمان انجام خدمات ندارد مگر آن‌که صراحتاً در قرارداد یا پیام‌های رسمی‌ آن، به‌صورت مشخص اعلام شده باشد.",
  },
  {
    title: "ثبت سفارش و هماهنگی",
    body:
      "کاربر موظف است اطلاعات دقیق درخواست، زمان، محل و شرایط انجام خدمات را به‌صورت شفاف ثبت کند. در صورت تغییر یا لغو درخواست، نسبت به شرایط و زمان‌بندی اعلام‌شده توسط سیستم یا متخصص، اقدام می‌شود.",
  },
  {
    title: "پرداخت و هزینه‌ها",
    body:
      "هزینه خدمات، بر اساس نوع خدمت، نرخ متخصص، زمان و شرایط اعلام‌شده در پنل درخواست محاسبه می‌شود. پرداخت فقط از مسیرهای رسمی درون پلتفرم انجام می‌شود و هر نوع پرداخت خارج از سیستم، به‌صورت غیرقانونی و مسئولیت‌پذیر تلقی می‌شود.",
  },
  {
    title: "حق‌کپی و محتوای منتشرشده",
    body:
      "هرگونه محتوای منتشرشده در پلتفرم، از جمله متن، تصویر، پروفایل، اطلاعات خدمات و رزومه‌ها، متعلق به صاحب آن محتوا بوده و استفاده غیرمجاز از آن ممنوع است. هلپر در برابر هرگونه سوءاستفاده، اقدام قانونی مناسب را انجام می‌دهد.",
  },
  {
    title: "مسئولیت‌های متخصص و مشتری",
    body:
      "متخصص موظف است در زمان و کیفیت توافق‌شده، خدمات را ارائه کند و مشتری نیز موظف است اطلاعات لازم برای اجرای درست کار را به‌صورت کامل و دقیق در اختیار متخصص قرار دهد. هر دو طرف باید در چارچوب قوانین و اخلاق حرفه‌ای عمل کنند.",
  },
  {
    title: "تغییرات و بروز رسانی",
    body:
      "هلپر می‌تواند این قوانین را در هر زمان و به‌صورت مقتضی به‌روزرسانی کند. ادامه استفاده از خدمات پس از اعمال تغییرات، تعهد به پذیرش نسخه جدید قوانین تلقی می‌شود.",
  },
];

export default function TermsPage() {
  return (
    <main className="py-10 sm:py-14">
      <Container className="max-w-4xl">
        <div className="rounded-[28px] border border-foreground/10 bg-card p-6 shadow-[0_24px_60px_-35px_rgba(16,44,33,0.32)] sm:p-8">
          <div className="mb-8 flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M8 2.75h6.5L18.25 6.5v13.75A1.75 1.75 0 0 1 16.5 22H8A1.75 1.75 0 0 1 6.25 20.25V4.5A1.75 1.75 0 0 1 8 2.75Z" />
                <path d="M14.5 2.75V6.5h3.75" />
                <path d="M9 11.5h6M9 15.5h6" />
              </svg>
            </span>
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-primary/80">HELPER</p>
              <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">قوانین و مقررات</h1>
            </div>
          </div>

          <p className="mb-8 text-sm leading-8 text-foreground/70">
            استفاده از خدمات هلپر مستلزم پذیرش این قوانین و مقررات است. لطفاً قبل از ثبت‌نام، سفارش‌گذاری، همکاری یا بارگذاری محتوا، این صفحه را با دقت بخوانید.
          </p>

          <div className="space-y-5">
            {terms.map((item) => (
              <section key={item.title} className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-5">
                <h2 className="text-lg font-bold text-foreground">{item.title}</h2>
                <p className="mt-3 text-sm leading-8 text-foreground/70">{item.body}</p>
              </section>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-primary/15 bg-primary/5 p-5 text-sm leading-8 text-foreground/75">
            در صورت بروز اختلاف، قوانین جمهوری اسلامی ایران و مقررات مرتبط با خدمات آنلاین و تجارت الکترونیکی حاکم خواهد بود. برای دریافت اطلاعات بیشتر، با پشتیبانی هلپر در تماس باشید.
          </div>
        </div>
      </Container>
    </main>
  );
}
