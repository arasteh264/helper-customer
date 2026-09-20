import Link from "next/link";
import {
  ShieldCheck,
  Clock3,
  Headset,
  BadgeCheck,
  Star,
  CheckCircle2,
  ArrowRight,
  Wrench,
  Sparkles,
  Zap,
  Droplets,
  Truck,
} from "lucide-react";

const features = [
  { icon: ShieldCheck, text: "متخصصان احراز هویت‌شده" },
  { icon: Clock3, text: "رزرو سریع، در کمتر از دو دقیقه" },
  { icon: Headset, text: "پشتیبانی و ضمانت کیفیت خدمات" },
];

const services = [
  { icon: Wrench, label: "تعمیرات" },
  { icon: Sparkles, label: "نظافت" },
  { icon: Zap, label: "برق‌کاری" },
  { icon: Droplets, label: "لوله‌کشی" },
  { icon: Truck, label: "اسباب‌کشی" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="relative order-2 hidden overflow-hidden bg-gradient-to-br from-primary to-primary-hover px-12 py-10 lg:flex lg:w-1/2 lg:flex-col lg:justify-between xl:w-2/5">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary-foreground/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-primary-foreground/10 blur-3xl" />

        <div className="relative flex items-center gap-3 text-primary-foreground">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground text-lg font-bold text-primary shadow-lg">
            H
          </span>
          <span className="text-xl font-semibold">Helper</span>
        </div>

        <div className="relative">
          <h2 className="text-3xl font-semibold leading-snug text-primary-foreground xl:text-4xl xl:leading-snug">
            متخصصان مورد تأیید，
            <br />
            برای هر نیاز شما
          </h2>
          <p className="mt-3 max-w-sm leading-7 text-primary-foreground/80">
            از تعمیرات خانه تا نظافت و خدمات فنی؛ هزاران متخصص آماده‌ی کمک
            هستند.
          </p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {services.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-1.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1.5 text-xs text-primary-foreground backdrop-blur-sm"
              >
                <Icon size={14} />
                {label}
              </li>
            ))}
          </ul>

          <div className="relative mt-10 max-w-sm">
            <div className="rounded-2xl bg-background p-4 text-foreground shadow-2xl shadow-black/20">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                    ر
                  </span>
                  <span className="absolute -bottom-0.5 -left-0.5 flex h-3.5 w-3.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-60 motion-safe:animate-ping" />
                    <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-background bg-green-500" />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-semibold">
                      رضا محمدی
                    </p>
                    <BadgeCheck size={16} className="shrink-0 text-primary" />
                  </div>
                  <p className="text-xs text-foreground/60">
                    لوله‌کش ساختمان
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-600">
                  <Star size={12} className="fill-current" />
                  ۴.۹
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl bg-foreground/5 px-3 py-2.5 text-xs">
                <span className="text-foreground/60">نزدیک‌ترین زمان</span>
                <span className="font-medium">امروز، ساعت ۱۶:۰۰</span>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-4 flex items-center gap-2 rounded-xl bg-background px-3 py-2 text-xs font-medium text-foreground shadow-xl shadow-black/20">
              <CheckCircle2 size={16} className="text-green-600" />
              رزرو شما تأیید شد
            </div>
          </div>
        </div>

        <div className="relative mt-16">
          <ul className="space-y-3">
            {features.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-3 text-primary-foreground/90"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-foreground/10">
                  <Icon size={16} />
                </span>
                <span className="text-sm">{text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center gap-6 border-t border-primary-foreground/15 pt-6">
            <div>
              <p className="text-lg font-semibold text-primary-foreground">
                ۱۲,۰۰۰+
              </p>
              <p className="text-xs text-primary-foreground/70">کاربر فعال</p>
            </div>
            <div className="h-8 w-px bg-primary-foreground/15" />
            <div>
              <p className="flex items-center gap-1 text-lg font-semibold text-primary-foreground">
                ۴.۸ / ۵
                <Star size={14} className="fill-current" />
              </p>
              <p className="text-xs text-primary-foreground/70">
                رضایت مشتریان
              </p>
            </div>
          </div>
        </div>
      </aside>

      <main className="relative order-1 flex flex-1 flex-col bg-background">
        <header className="flex items-center justify-between px-6 pt-6 sm:px-10">
          <div className="flex items-center gap-2 lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              H
            </span>
            <span className="text-lg font-semibold text-primary">Helper</span>
          </div>

          <Link
            href="/"
            className="mr-auto flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-foreground/60 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:mr-0"
          >
            <ArrowRight size={16} />
            بازگشت به صفحه اصلی
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-sm">
            <div className="mb-6 flex items-center gap-2 rounded-xl bg-primary/5 px-4 py-3 text-xs text-foreground/70 lg:hidden">
              <ShieldCheck size={16} className="shrink-0 text-primary" />
              متخصصان تأییدشده، رزرو در کمتر از دو دقیقه
            </div>

            {children}
          </div>
        </div>

        <footer className="px-6 pb-6 text-center text-xs text-foreground/50 sm:px-10">
          اطلاعات شما امن است و هرگز با دیگران به اشتراک گذاشته نمی‌شود.
        </footer>
      </main>
    </div>
  );
}