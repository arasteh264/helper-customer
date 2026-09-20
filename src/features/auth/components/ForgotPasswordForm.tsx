"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  KeyRound,
  Loader2,
  MessageSquare,
  Pencil,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { OtpInput, toEnglishDigits } from "./OtpInput";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 120;
const MOBILE_REGEX = /^09\d{9}$/;

const toPersianDigits = (value: string | number) =>
  String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

const formatTime = (total: number) => {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return toPersianDigits(
    `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  );
};

type Step = "mobile" | "code";

export function ForgotPasswordForm() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (step !== "code" || secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [step, secondsLeft]);

  const sendCode = async () => {
    setError(null);

    const normalized = toEnglishDigits(mobile).trim();
    if (!MOBILE_REGEX.test(normalized)) {
      setError("شماره موبایل را به‌صورت صحیح وارد کنید (مثال: ۰۹۱۲۳۴۵۶۷۸۹)");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: normalized }),
      });

      if (res.status === 429) {
        setError("تعداد درخواست‌ها زیاد است. چند دقیقه بعد دوباره تلاش کنید.");
        return;
      }
      if (!res.ok) throw new Error();

      setMobile(normalized);
      setOtp("");
      setSecondsLeft(RESEND_SECONDS);
      setStep("code");
      toast.success("کد بازیابی ارسال شد");
    } catch {
      setError("ارسال کد با مشکل مواجه شد. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (code: string) => {
    if (loading) return;
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, code }),
      });

      if (!res.ok) {
        setError("کد وارد شده اشتباه یا منقضی شده است");
        setOtp("");
        setLoading(false);
        return;
      }

      const { resetToken } = (await res.json()) as { resetToken: string };
      router.push(`/reset-password?token=${encodeURIComponent(resetToken)}`);
    } catch {
      setError("خطایی رخ داد. لطفاً دوباره تلاش کنید.");
      setOtp("");
      setLoading(false);
    }
  };

  const editMobile = () => {
    setStep("mobile");
    setError(null);
    setOtp("");
  };

  return (
    <div className="w-full max-w-md">
      <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-card shadow-xl shadow-foreground/[0.06]">
        <div className="border-b border-foreground/5 bg-gradient-to-b from-primary/[0.06] to-transparent px-6 py-7 text-center sm:px-8">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            {step === "mobile" ? (
              <KeyRound size={22} />
            ) : (
              <MessageSquare size={22} />
            )}
          </span>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            {step === "mobile" ? "فراموشی رمز عبور" : "کد بازیابی را وارد کنید"}
          </h1>
          <p className="mt-1.5 text-sm leading-6 text-foreground/60">
            {step === "mobile" ? (
              "شماره موبایل حساب خود را وارد کنید تا کد بازیابی برایتان پیامک شود"
            ) : (
              <>
                کد {toPersianDigits(OTP_LENGTH)} رقمی به شماره{" "}
                <span dir="ltr" className="font-medium text-foreground">
                  {toPersianDigits(mobile)}
                </span>{" "}
                ارسال شد
              </>
            )}
          </p>
        </div>

        <div className="px-6 py-6 sm:px-8">
          {error && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2.5 rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span className="leading-6">{error}</span>
            </div>
          )}

          {step === "mobile" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendCode();
              }}
              className="space-y-5"
              noValidate
            >
              <div className="space-y-2">
                <Label htmlFor="mobile">شماره موبایل</Label>
                <div className="relative">
                  <Smartphone
                    size={18}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground/35"
                  />
                  <Input
                    id="mobile"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    autoFocus
                    dir="ltr"
                    maxLength={11}
                    placeholder="09123456789"
                    value={mobile}
                    onChange={(e) => {
                      setError(null);
                      setMobile(toEnglishDigits(e.target.value));
                    }}
                    error={!!error}
                    className="pr-10 text-left tracking-wider"
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full gap-2"
                disabled={loading || mobile.length < 11}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    در حال ارسال…
                  </>
                ) : (
                  "ارسال کد بازیابی"
                )}
              </Button>
            </form>
          )}

          {step === "code" && (
            <div className="space-y-6">
              <OtpInput
                value={otp}
                onChange={(v) => {
                  setError(null);
                  setOtp(v);
                }}
                onComplete={verifyCode}
                length={OTP_LENGTH}
                disabled={loading}
                error={!!error}
                autoFocus
              />

              {loading && (
                <p
                  className="flex items-center justify-center gap-2 text-sm text-foreground/60"
                  aria-live="polite"
                >
                  <Loader2 className="animate-spin" size={16} />
                  در حال بررسی کد…
                </p>
              )}

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={editMobile}
                  disabled={loading}
                  className="flex items-center gap-1.5 rounded text-foreground/60 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Pencil size={14} />
                  ویرایش شماره
                </button>

                {secondsLeft > 0 ? (
                  <span className="text-foreground/50">
                    ارسال مجدد تا{" "}
                    <span className="font-medium tabular-nums text-foreground/70">
                      {formatTime(secondsLeft)}
                    </span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={sendCode}
                    disabled={loading}
                    className="rounded font-medium text-primary transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    ارسال مجدد کد
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-foreground/5 bg-foreground/[0.02] px-6 py-4 text-center text-sm sm:px-8">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded text-foreground/60 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ArrowRight size={14} />
            بازگشت به ورود
          </Link>
        </div>
      </div>

      <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-foreground/45">
        <ShieldCheck size={14} />
        کد بازیابی را به هیچ‌کس ندهید
      </p>
    </div>
  );
}