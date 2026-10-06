import type { Metadata } from "next";

import { Container } from "@/src/components/shared/container";

export const metadata: Metadata = {
  title: "حریم خصوصی | هلپر",
  description:
    "حریم خصوصی کاربران، متخصصان و اطلاعات شخصی در هلپر چگونه حفظ می‌شود را بخوانید.",
};

const sections = [
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
  {
    title: "بروز رسانی سیاست",
    body:
      "این سیاست به‌صورت دوره‌ای بازبینی می‌شود و در صورت تغییر، نسخه جدید در پلتفرم منتشر می‌شود. ادامه استفاده از خدمات پس از انتشار نسخه جدید، به‌معنای پذیرش آن نسخه است.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="py-10 sm:py-14">
      <Container className="max-w-4xl">
        <div className="rounded-[28px] border border-foreground/10 bg-card p-6 shadow-[0_24px_60px_-35px_rgba(16,44,33,0.32)] sm:p-8">
          <div className="mb-8 flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M12 3.5 5.5 6v4.5c0 4.5 2.9 8.6 6.5 10.5 3.6-1.9 6.5-6 6.5-10.5V6L12 3.5Z" />
                <path d="M9.75 12.25 11.25 13.75 14.5 10.5" />
              </svg>
            </span>
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-primary/80">HELPER</p>
              <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">حریم خصوصی</h1>
            </div>
          </div>

          <p className="mb-8 text-sm leading-8 text-foreground/70">
            رعایت حریم خصوصی کاربران و متخصصان برای هلپر اهمیت زیادی دارد و ما تلاش می‌کنیم در چارچوب قانون، اطلاعات شما را به‌صورت امن و شفاف مدیریت کنیم.
          </p>

          <div className="space-y-5">
            {sections.map((item) => (
              <section key={item.title} className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-5">
                <h2 className="text-lg font-bold text-foreground">{item.title}</h2>
                <p className="mt-3 text-sm leading-8 text-foreground/70">{item.body}</p>
              </section>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-primary/15 bg-primary/5 p-5 text-sm leading-8 text-foreground/75">
            اگر درباره نحوه ذخیره، حذف یا استفاده از داده‌هایتان سوالی دارید، با تیم پشتیبانی در تماس باشید تا راهنمایی لازم را دریافت کنید.
          </div>
        </div>
      </Container>
    </main>
  );
}
