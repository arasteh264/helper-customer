import Link from "next/link";
import { CheckCircle2, ChevronLeft, Circle } from "lucide-react";
import type { CompletionItem } from "../lib/completion";

interface Props {
  percent: number;
  items: CompletionItem[];
}

const RADIUS = 30;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ProfileCompletionCard({ percent, items }: Props) {
  const remaining = items.filter((i) => !i.done);
  const complete = percent === 100;
  const fa = new Intl.NumberFormat("fa-IR");

  return (
    <section
      aria-label="تکمیل پروفایل"
      className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.08] via-card to-card p-5 sm:p-6"
    >
      <div className="flex items-center gap-4">
        {/* حلقه‌ی پیشرفت */}
        <div className="relative h-[72px] w-[72px] shrink-0">
          <svg
            viewBox="0 0 72 72"
            className="h-full w-full -rotate-90"
            aria-hidden
          >
            <circle
              cx="36"
              cy="36"
              r={RADIUS}
              fill="none"
              strokeWidth="7"
              className="stroke-foreground/10"
            />
            <circle
              cx="36"
              cy="36"
              r={RADIUS}
              fill="none"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - percent / 100)}
              className="stroke-primary transition-all duration-700"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">
            {fa.format(percent)}٪
          </span>
        </div>

        <div className="min-w-0">
          <h2 className="text-base font-semibold text-foreground sm:text-lg">
            {complete ? "پروفایل شما کامل است 🎉" : "پروفایل خود را کامل کنید"}
          </h2>
          <p className="mt-1 text-sm leading-6 text-foreground/60">
            {complete
              ? "پروفایل کامل، اعتماد مشتریان و شانس دریافت کار را بیشتر می‌کند."
              : "پروفایل کامل‌تر، بیشتر دیده می‌شود و کار بیشتری می‌گیرد."}
          </p>
        </div>
      </div>

      {!complete && (
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {remaining.slice(0, 4).map((item) => (
            <li key={item.id}>
              <Link
                href={`/provider/profile#${item.anchor}`}
                className="group flex items-center gap-2.5 rounded-xl border border-foreground/10 bg-background/70 px-3.5 py-3 text-sm text-foreground/80 transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Circle size={16} className="shrink-0 text-foreground/30" />
                <span className="flex-1">{item.label}</span>
                <span className="text-xs text-foreground/40">
                  +{fa.format(item.weight)}٪
                </span>
                <ChevronLeft
                  size={16}
                  className="text-foreground/30 ltr:rotate-180"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {complete && (
        <p className="mt-4 flex items-center gap-2 text-sm text-green-700">
          <CheckCircle2 size={18} />
          همه‌ی موارد تکمیل شده‌اند
        </p>
      )}
    </section>
  );
}
