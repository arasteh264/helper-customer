import { Briefcase, Check, MessageSquare } from "lucide-react";
import { OTP_LENGTH, type Step } from "../../hooks/use-specialist-register";
import { toPersianDigits } from "@/src/utils/format";

const STEPS = [
  { key: "details", label: "اطلاعات" },
  { key: "verify", label: "تأیید شماره" },
] as const;

function Stepper({ step }: { step: Step }) {
  return (
    <ol
      className="mx-auto mt-5 flex max-w-[260px] items-center gap-2"
      aria-label="مراحل ثبت‌نام"
    >
      {STEPS.map((it, i) => {
        const done = step === "verify" && i === 0;
        const active = step === it.key;
        return (
          <li key={it.key} className="flex flex-1 items-center gap-2 last:flex-none">
            <span className="flex items-center gap-1.5">
              <span
                className={[
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  done || active
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/10 text-foreground/50",
                ].join(" ")}
              >
                {done ? <Check size={14} /> : toPersianDigits(i + 1)}
              </span>
              <span
                className={`text-xs ${active ? "font-medium text-foreground" : "text-foreground/50"}`}
              >
                {it.label}
              </span>
            </span>
            {i === 0 && (
              <span
                className={`h-px flex-1 transition-colors ${done ? "bg-primary" : "bg-foreground/15"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function RegisterHeader({ step, phone }: { step: Step; phone: string }) {
  const isDetails = step === "details";

  return (
    <div className="border-b border-foreground/5 bg-gradient-to-b from-primary/[0.08] via-primary/[0.03] to-transparent px-6 pb-6 pt-8 text-center sm:px-8">
      <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-primary/10">
        {isDetails ? <Briefcase size={24} /> : <MessageSquare size={24} />}
      </span>
      <h1 className="text-xl font-bold tracking-tight text-foreground">
        {isDetails ? "ثبت‌نام به‌عنوان متخصص" : "شماره خود را تأیید کنید"}
      </h1>
      <p className="mt-1.5 text-sm leading-6 text-foreground/60">
        {isDetails ? (
          "چند دقیقه‌ای حساب بسازید و شروع به دریافت کار کنید"
        ) : (
          <>
            کد {toPersianDigits(OTP_LENGTH)} رقمی به شماره{" "}
            <span dir="ltr" className="font-medium text-foreground">
              {toPersianDigits(phone)}
            </span>{" "}
            ارسال شد
          </>
        )}
      </p>
      <Stepper step={step} />
    </div>
  );
}