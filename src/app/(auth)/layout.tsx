import Link from "next/link";
import {
  ShieldCheck,
  Clock3,
  Headset,
  Star,
  ArrowRight,
  HandHelping,
} from "lucide-react";
import SpecialistsScene from "./specialists-scene";


const features = [
  { icon: ShieldCheck, text: "متخصصان احراز هویت‌شده" },
  { icon: Clock3, text: "رزرو سریع، در کمتر از دو دقیقه" },
  { icon: Headset, text: "پشتیبانی و ضمانت کیفیت خدمات" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-shell flex min-h-screen flex-col bg-background lg:flex-row">
      <aside className="auth-float relative order-2 hidden overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_36%),linear-gradient(135deg,#0b9b89_0%,#087c70_52%,#124d4b_100%)] px-12 py-10 lg:flex lg:w-1/2 lg:flex-col lg:justify-between xl:w-[42%]">
        <div
          aria-hidden
          className="auth-glow pointer-events-none absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#f9d5a5]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-[#f3e5cb]/20 blur-3xl" />

        <div className="relative flex items-center gap-3 text-primary-foreground">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary shadow-lg shadow-black/10">
            <HandHelping size={21} strokeWidth={2.4} aria-hidden="true" />
          </span>
          <span className="text-xl font-semibold">Helper</span>
        </div>

        <div className="relative">
          <h2 className="text-3xl font-semibold leading-snug text-primary-foreground xl:text-4xl xl:leading-snug">
            متخصصان مورد تأیید،
            <br />
            برای هر نیاز شما
          </h2>
          <p className="mt-3 max-w-sm leading-7 text-primary-foreground/80">
            از تعمیرات خانه تا نظافت و خدمات فنی؛ هزاران متخصص آماده‌ی کمک
            هستند.
          </p>

          <div className="mt-8 max-w-md rounded-[1.75rem] border border-white/10 bg-white/5 p-2 shadow-[0_24px_60px_-30px_rgba(9,31,24,0.75)] backdrop-blur-sm">
            <SpecialistsScene />
          </div>
        </div>

        <div className="relative mt-10">
          <ul className="space-y-3">
            {features.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-3 text-primary-foreground/90"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fffaf3]/10">
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
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-cyan-700 text-primary-foreground">
              <HandHelping size={17} strokeWidth={2.4} aria-hidden="true" />
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
            <div className="mb-6 flex items-center gap-2 rounded-2xl border border-primary/15 bg-primary/[0.05] px-4 py-3 text-xs text-foreground/75 shadow-sm lg:hidden">
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