import { Container } from "@/src/components/shared/container";

export function MissionSection() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <span className="text-xs font-medium text-primary">داستان ما</span>
          <h2 className="mt-3 text-2xl font-bold leading-snug tracking-tight text-foreground sm:text-3xl">
            از یک مشکل ساده شروع شد
          </h2>
        </div>

        <div className="space-y-5 text-sm leading-8 text-foreground/70 sm:text-base sm:leading-8">
          <p>
            همه‌چیز از یک تجربه‌ی ساده شروع شد: پیدا کردن یک لوله‌کش قابل اعتماد در نیمه‌شب،
            کاری بود که باید نباید این‌قدر سخت باشد. تماس‌های بی‌پاسخ، قیمت‌های نامشخص و
            نگرانی از کیفیت کار، چیزی بود که تقریباً همه‌ی ما تجربه‌اش کرده‌ایم.
          </p>
          <p>
            هلپر با همین انگیزه شکل گرفت: ساختن پلی مطمئن بین کسانی که به یک متخصص نیاز دارند
            و کسانی که آن تخصص را دارند. هر متخصص روی پلتفرم، پیش از فعالیت از نظر هویت و
            سابقه بررسی می‌شود، و هر قیمتی پیش از پذیرش کار برای مشتری شفاف است.
          </p>
          <p>
            امروز هلپر ده‌ها هزار مشتری و هزاران متخصص را در حوزه‌هایی از تعمیرات ساختمان تا
            حقوق، آموزش و طراحی به هم متصل کرده است؛ ولی هدف همان روز اول باقی مانده: خیال
            مشتری و متخصص را از یکدیگر راحت کنیم.
          </p>
        </div>
      </Container>
    </section>
  );
}