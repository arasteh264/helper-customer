"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  Pencil,
  ShieldCheck,
  Smartphone,
  User,
  UserPlus,
} from "lucide-react";

import {
  registerSchema,
  type RegisterFormValues,
} from "../schemas/register.schema";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { OtpInput, toEnglishDigits } from "./OtpInput";
import { isAxiosError } from "axios";
import { register as registerUser } from "@/src/features/auth/api/register";
const OTP_LENGTH = 6;
const RESEND_SECONDS = 120;

const toPersianDigits = (value: string | number) =>
  String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

const formatTime = (total: number) => {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return toPersianDigits(
    `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`,
  );
};

function getStrength(pw: string) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) score++;
  return score;
}

const STRENGTH_META = [
  { label: "", bar: "" },
  { label: "ضعیف", bar: "bg-destructive" },
  { label: "متوسط", bar: "bg-amber-500" },
  { label: "خوب", bar: "bg-lime-500" },
  { label: "قوی", bar: "bg-green-600" },
];

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-xs text-destructive">
      {message}
    </p>
  );
}

type Step = "details" | "verify";

export function RegisterForm() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("details");
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
    },
  });

  const password = watch("password");
  const strength = getStrength(password ?? "");

  useEffect(() => {
    if (step !== "verify" || secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [step, secondsLeft]);

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);

    try {
      await registerUser({
        name: values.name,
        phone: values.phone,
        email: values.email,
        password: values.password,
      });

      setOtp("");
      setSecondsLeft(RESEND_SECONDS);
      setStep("verify");
      toast.success("کد تأیید به شماره شما پیامک شد");
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 409) {
        setError("phone", {
          message: "با این شماره قبلاً ثبت‌نام شده است. وارد شوید.",
        });
        return;
      }
      setServerError("ثبت‌نام انجام نشد. لطفاً دوباره تلاش کنید.");
    }
  };

  const verifyCode = async (code: string) => {
    if (verifying) return;
    setServerError(null);
    setVerifying(true);

    const { phone, password } = getValues();

    try {
      const res = await fetch("/api/auth/register/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });

      if (!res.ok) {
        setServerError("کد وارد شده اشتباه یا منقضی شده است");
        setOtp("");
        return;
      }

      const result = await signIn("credentials", {
        identifier: phone,
        password,
        redirect: false,
      });

      toast.success("حساب شما ساخته شد. خوش آمدید!");
      router.push(result?.error ? "/login" : "/");
    } catch {
      setServerError("خطایی رخ داد. لطفاً دوباره تلاش کنید.");
      setOtp("");
    } finally {
      setVerifying(false);
    }
  };

  const resendCode = async () => {
    if (secondsLeft > 0 || verifying) return;
    setServerError(null);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: getValues("phone") }),
      });
      if (!res.ok) throw new Error();
      setOtp("");
      setSecondsLeft(RESEND_SECONDS);
      toast.success("کد جدید ارسال شد");
    } catch {
      setServerError("ارسال کد با مشکل مواجه شد. لطفاً دوباره تلاش کنید.");
    }
  };

  const backToDetails = () => {
    setStep("details");
    setServerError(null);
    setOtp("");
  };

  return (
    <div className="w-full max-w-md">
      <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-card shadow-xl shadow-foreground/[0.06]">
        <div className="border-b border-foreground/5 bg-gradient-to-b from-primary/[0.06] to-transparent px-6 py-7 text-center sm:px-8">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            {step === "details" ? (
              <UserPlus size={22} />
            ) : (
              <MessageSquare size={22} />
            )}
          </span>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            {step === "details"
              ? "ایجاد حساب کاربری"
              : "شماره خود را تأیید کنید"}
          </h1>
          <p className="mt-1.5 text-sm leading-6 text-foreground/60">
            {step === "details" ? (
              "در چند ثانیه ثبت‌نام کنید و اولین رزرو خود را انجام دهید"
            ) : (
              <>
                کد {toPersianDigits(OTP_LENGTH)} رقمی به شماره{" "}
                <span dir="ltr" className="font-medium text-foreground">
                  {toPersianDigits(getValues("phone"))}
                </span>{" "}
                ارسال شد
              </>
            )}
          </p>
        </div>

        <div className="px-6 py-6 sm:px-8">
          {serverError && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2.5 rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span className="leading-6">{serverError}</span>
            </div>
          )}

          {step === "details" && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
              noValidate
            >
              <div className="space-y-2">
                <Label htmlFor="name">نام و نام خانوادگی</Label>
                <div className="relative">
                  <User
                    size={18}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground/35"
                  />
                  <Input
                    id="name"
                    type="text"
                    autoComplete="name"
                    autoFocus
                    placeholder="مثلاً سارا احمدی"
                    error={!!errors.name}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className="pr-10"
                    {...register("name")}
                  />
                </div>
                <FieldError id="name-error" message={errors.name?.message} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">شماره موبایل</Label>
                <div className="relative">
                  <Smartphone
                    size={18}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground/35"
                  />
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    dir="ltr"
                    maxLength={11}
                    placeholder="09123456789"
                    error={!!errors.phone}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                    className="pr-10 text-left tracking-wider"
                    {...register("phone", { setValueAs: toEnglishDigits })}
                  />
                </div>
                <FieldError id="phone-error" message={errors.phone?.message} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  ایمیل{" "}
                  <span className="text-xs font-normal text-foreground/45">
                    (اختیاری)
                  </span>
                </Label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground/35"
                  />
                  <Input
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    dir="ltr"
                    placeholder="you@example.com"
                    error={!!errors.email}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className="pr-10 text-left placeholder:text-right"
                    {...register("email")}
                  />
                </div>
                <FieldError id="email-error" message={errors.email?.message} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">رمز عبور</Label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground/35"
                  />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    dir="ltr"
                    placeholder="حداقل ۸ کاراکتر"
                    error={!!errors.password}
                    aria-invalid={!!errors.password}
                    aria-describedby="password-hint"
                    className="pr-10 pl-11 text-left placeholder:text-right"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute left-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-foreground/40 transition-colors hover:bg-foreground/5 hover:text-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label={
                      showPassword ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"
                    }
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {password ? (
                  <div className="flex items-center gap-3" aria-live="polite">
                    <div className="flex flex-1 gap-1.5">
                      {[1, 2, 3, 4].map((level) => (
                        <span
                          key={level}
                          className={[
                            "h-1.5 flex-1 rounded-full transition-colors",
                            level <= strength
                              ? STRENGTH_META[strength].bar
                              : "bg-foreground/10",
                          ].join(" ")}
                        />
                      ))}
                    </div>
                    <span className="w-10 text-xs text-foreground/60">
                      {STRENGTH_META[strength].label}
                    </span>
                  </div>
                ) : null}

                {errors.password ? (
                  <FieldError
                    id="password-hint"
                    message={errors.password.message}
                  />
                ) : (
                  <p id="password-hint" className="text-xs text-foreground/50">
                    ترکیبی از حروف انگلیسی و عدد، حداقل ۸ کاراکتر
                  </p>
                )}
              </div>

              {/* <div className="space-y-2">
                <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-6 text-foreground/70">
                  <input
                    type="checkbox"
                    aria-invalid={!!errors.terms}
                    className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-foreground/25 accent-primary"
                    {...register("terms")}
                  />
                  <span>
                    <Link
                      href="/terms"
                      target="_blank"
                      className="font-medium text-primary hover:underline"
                    >
                      قوانین و مقررات
                    </Link>{" "}
                    و{" "}
                    <Link
                      href="/privacy"
                      target="_blank"
                      className="font-medium text-primary hover:underline"
                    >
                      حریم خصوصی
                    </Link>{" "}
                    را می‌پذیرم
                  </span>
                </label>
                <FieldError id="terms-error" message={errors.terms?.message} />
              </div> */}

              <Button
                type="submit"
                size="lg"
                className="w-full gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    در حال ثبت‌نام…
                  </>
                ) : (
                  "ثبت‌نام و دریافت کد تأیید"
                )}
              </Button>
            </form>
          )}

          {step === "verify" && (
            <div className="space-y-6">
              <OtpInput
                value={otp}
                onChange={(v) => {
                  setServerError(null);
                  setOtp(v);
                }}
                onComplete={verifyCode}
                length={OTP_LENGTH}
                disabled={verifying}
                error={!!serverError}
                autoFocus
              />

              {verifying && (
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
                  onClick={backToDetails}
                  disabled={verifying}
                  className="flex items-center gap-1.5 rounded text-foreground/60 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Pencil size={14} />
                  ویرایش اطلاعات
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
                    onClick={resendCode}
                    disabled={verifying}
                    className="rounded font-medium text-primary transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    ارسال مجدد کد
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-foreground/5 bg-foreground/[0.02] px-6 py-4 text-center text-sm text-foreground/60 sm:px-8">
          حساب کاربری دارید؟{" "}
          <Link
            href="/login"
            className="rounded font-medium text-primary transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            وارد شوید
          </Link>
        </div>
      </div>
    </div>
  );
}
