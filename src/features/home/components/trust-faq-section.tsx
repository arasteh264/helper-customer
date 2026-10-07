import { ArrowLeft, ChevronDown } from "lucide-react";
import Link from "next/link";

import { Container } from "@/src/components/shared/container";
import { SectionHeading } from "@/src/components/shared/section-heading";

const questions = [
  {
    question: "چطور متخصص را بررسی و انتخاب کنم؟",
    answer:
      "پروفایل متخصص را باز کنید و تخصص‌ها، محدوده‌ی فعالیت، وضعیت تأیید، امتیاز و نظرهای ثبت‌شده را بررسی کنید. اطلاعات و تعداد نظرها به همان چیزی محدود است که در پروفایل نمایش داده می‌شود.",
  },
  {
    question: "مبلغ کار را چه زمانی می‌بینم؟",
    answer:
      "پس از ثبت درخواست و دریافت پیشنهاد متخصص، مبلغ در صفحه‌ی درخواست نمایش داده می‌شود. پیش از پرداخت، مبلغ و جزئیات پیشنهاد را بررسی کنید؛ اگر مناسب نیست، پرداخت را انجام ندهید.",
  },
  {
    question: "پرداخت را کجا انجام بدهم؟",
    answer:
      "پرداخت درخواست را از مسیرهای داخل هلپر، مانند درگاه بانکی یا کیف پول، انجام دهید. سوابق و وضعیت پرداخت در حساب کاربری ثبت می‌شود. از پرداخت خارج از پلتفرم خودداری کنید.",
  },
  {
    question: "اگر درباره‌ی انجام کار یا مبلغ اختلاف داشته باشم چه کنم؟",
    answer:
      "در صفحه‌ی همان درخواست، دلیل و شرح اختلاف را ثبت کنید و از پیام‌های پیگیری برای توضیحات تکمیلی استفاده کنید. نتیجه و پیام‌های رسیدگی نیز در همان پرونده قابل مشاهده است.",
  },
  {
    question: "نشان تأیید متخصص به چه معناست؟",
    answer:
      "این نشان وضعیت تأیید پروفایل متخصص در هلپر را مشخص می‌کند. همچنان پیشنهاد، تخصص، محدوده‌ی فعالیت و نظرهای ثبت‌شده را خودتان بررسی کنید و بر اساس نیازتان تصمیم بگیرید.",
  },
];

export function TrustFaqSection() {
  return (
    <section className="bg-[#f7f5ef] py-16 dark:bg-foreground/[0.025] sm:py-20">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="پیش از ثبت درخواست"
          title="سؤال دارید؟ شفاف جواب می‌دهیم"
          description="قیمت، پرداخت و پیگیری را پیش از شروع کار بشناسید."
        />

        <div className="mx-auto mt-9 max-w-4xl divide-y divide-foreground/10 overflow-hidden rounded-2xl border border-foreground/10 bg-card px-5 sm:px-7">
          {questions.map(({ question, answer }) => (
            <details
              key={question}
              name="homepage-trust-faq"
              className="group py-1"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-semibold leading-6 text-foreground marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:text-base [&::-webkit-details-marker]:hidden">
                {question}
                <ChevronDown
                  size={18}
                  className="shrink-0 text-primary transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="max-w-3xl pb-5 text-sm leading-7 text-foreground/65">
                {answer}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-right">
          <p className="text-sm leading-7 text-foreground/60">
            جزئیات کامل حقوق و مسئولیت‌های مشتری و متخصص را هم می‌توانید بخوانید.
          </p>
          <Link
            href="/terms"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            قوانین و مقررات
            <ArrowLeft size={16} aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
