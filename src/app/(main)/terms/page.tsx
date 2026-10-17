import type { Metadata } from "next";

import { Container } from "@/src/components/shared/container";
import { specialistTerms } from "@/src/features/auth/data/specialist-terms";

export const metadata: Metadata = {
  title: "قوانین و مقررات | هلپا۲۴",
  description:
    "با قوانین و مقررات استفاده از خدمات هلپا۲۴ آشنا شوید و شرایط همکاری، پرداخت، مسئولیت‌ها و خدمات را ببینید.",
};

const terms = [
  {
    title: "تعریف خدمات و مسئولیت‌ها",
    body:
      "هلپا۲۴ بستر ثبت درخواست، دریافت و مقایسه‌ی پیشنهاد متخصصان و پیگیری هماهنگی‌ها را فراهم می‌کند. متخصص مسئول ارائه‌ی خدمت در حدود مهارت و توافق خود است و مشتری نیز پیش از انتخاب، پیشنهاد و شرایط انجام کار را بررسی می‌کند.",
  },
  {
    title: "ثبت سفارش و هماهنگی",
    body:
      "کاربر موظف است اطلاعات دقیق درخواست، زمان، محل و شرایط انجام خدمات را به‌صورت شفاف ثبت کند. در صورت تغییر یا لغو درخواست، نسبت به شرایط و زمان‌بندی اعلام‌شده توسط سیستم یا متخصص، اقدام می‌شود.",
  },
  {
    title: "پرداخت و هزینه‌ها",
    body:
      "مبلغ پیشنهادی متخصص و شرایط پرداخت باید پیش از شروع کار برای مشتری روشن باشد. کارمزدها یا هزینه‌های قابل‌اعمال هلپا۲۴ از مسیرهای رسمی پلتفرم اعلام می‌شوند. طرفین باید رسیدها و توافق‌های مالی را نگه دارند و از معرفی پرداخت خارج از پلتفرم به‌عنوان پرداخت ثبت‌شده در هلپا۲۴ خودداری کنند.",
  },
  {
    title: "حق‌کپی و محتوای منتشرشده",
    body:
      "هرگونه محتوای منتشرشده در پلتفرم، از جمله متن، تصویر، پروفایل، اطلاعات خدمات و رزومه‌ها، متعلق به صاحب آن محتوا بوده و استفاده غیرمجاز از آن ممنوع است. هلپا۲۴ در برابر هرگونه سوءاستفاده، اقدام قانونی مناسب را انجام می‌دهد.",
  },
  {
    title: "مسئولیت‌های متخصص و مشتری",
    body:
      "متخصص موظف است در زمان و کیفیت توافق‌شده، خدمات را ارائه کند و مشتری نیز موظف است اطلاعات لازم برای اجرای درست کار را به‌صورت کامل و دقیق در اختیار متخصص قرار دهد. هر دو طرف باید در چارچوب قوانین و اخلاق حرفه‌ای عمل کنند.",
  },
  {
    title: "تغییرات و بروز رسانی",
    body:
      "هلپا۲۴ می‌تواند این قوانین را در هر زمان و به‌صورت مقتضی به‌روزرسانی کند. ادامه استفاده از خدمات پس از اعمال تغییرات، تعهد به پذیرش نسخه جدید قوانین تلقی می‌شود.",
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
            استفاده از خدمات هلپا۲۴ مستلزم پذیرش این قوانین و مقررات است. لطفاً قبل از ثبت‌نام، سفارش‌گذاری، همکاری یا بارگذاری محتوا، این صفحه را با دقت بخوانید.
          </p>

          <div className="space-y-5">
            {terms.map((item) => (
              <section key={item.title} className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-5">
                <h2 className="text-lg font-bold text-foreground">{item.title}</h2>
                <p className="mt-3 text-sm leading-8 text-foreground/70">{item.body}</p>
              </section>
            ))}
          </div>

          <section
            id="specialist-cooperation"
            className="mt-8 scroll-mt-24 border-t border-foreground/10 pt-8"
          >
            <h2 className="text-xl font-bold text-foreground sm:text-2xl">
              شرایط همکاری متخصصان هلپا۲۴
            </h2>
            <p className="mt-2 text-sm leading-7 text-foreground/60">
              این بخش هنگام ثبت‌نام متخصص نمایش داده می‌شود و پذیرش آن برای
              ارسال فرم ثبت‌نام الزامی است.
            </p>
            <div className="mt-5 space-y-4">
              {specialistTerms.map((item) => (
                <section
                  key={item.title}
                  className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-5"
                >
                  <h3 className="text-base font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-8 text-foreground/70">
                    {item.body}
                  </p>
                </section>
              ))}
            </div>
          </section>

          <div className="mt-8 rounded-2xl border border-primary/15 bg-primary/5 p-5 text-sm leading-8 text-foreground/75">
            در صورت بروز اختلاف، قوانین جمهوری اسلامی ایران و مقررات مرتبط با خدمات آنلاین و تجارت الکترونیکی حاکم خواهد بود. برای دریافت اطلاعات بیشتر، با پشتیبانی هلپا۲۴ در تماس باشید.
          </div>
        </div>
      </Container>
    </main>
  );
}
