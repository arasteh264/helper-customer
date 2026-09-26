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
  Briefcase,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Pencil,
  ShieldCheck,
  Smartphone,
  User,
} from "lucide-react";

// import { categories } from "@/src/features/home/data";
// import { PasswordStrength } from "@/src/components/shared/password-strength";
// import {
//   specialistRegisterSchema,
//   type SpecialistRegisterValues,
// } from "../schemas/specialist-register.schema";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { specialistRegisterSchema, SpecialistRegisterValues } from "../schemas/specialist-register.schema";
import { categories } from "../../home/api/data";
import { OtpInput, toEnglishDigits } from "./OtpInput";
import { PasswordStrength } from "./PasswordStrength";
// import { OtpInput, toEnglishDigits } from "./otp-input";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 120;

const toPersianDigits = (value: string | number) =>
  String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

const formatTime = (total: number) => {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return toPersianDigits(
    `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  );
};

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-xs text-destructive">
      {message}
    </p>
  );
}

type Step = "details" | "verify";

export function SpecialistRegisterForm() {
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
    setValue,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SpecialistRegisterValues>({
    resolver: zodResolver(specialistRegisterSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      mobile: "",
      email: "",
      categoryId: "",
      city: "",
      password: "",
      terms: false,
    },
  });

  const password = watch("password");
  const categoryId = watch("categoryId");

  /* ───────── تایمر ارسال مجدد ───────── */
  useEffect(() => {
    if (step !== "verify" || secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [step, secondsLeft]);

  /* ───────── مرحله ۱: ثبت اطلاعات ───────── */
  const onSubmit = async (values: SpecialistRegisterValues) => {
    setServerError(null);

    try {
      // TODO: آدرس API خودتان را جایگزین کنید
      const res = await fetch("/api/provider/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: values.fullName,
          mobile: values.mobile,
          email: values.email || undefined,
          categoryId: values.categoryId,
          city: values.city,
          password: values.password,
        }),
      });

      if (res.status === 409) {
        setError("mobile", {
          message: "با این شماره قبلاً ثبت‌نام شده است. وارد شوید.",
        });
        return;
      }

      if (!res.ok) throw new Error();

      setOtp("");
      setSecondsLeft(RESEND_SECONDS);
      setStep("verify");
      toast.success("کد تأیید به شماره شما پیامک شد");
    } catch {
      setServerError("ثبت‌نام انجام نشد. لطفاً دوباره تلاش کنید.");
    }
  };

  /* ───────── مرحله ۲: تأیید شماره ───────── */
  const verifyCode = async (code: string) => {
    if (verifying) return;
    setServerError(null);
    setVerifying(true);

    const { mobile, password } = getValues();

    try {
      // TODO: آدرس API خودتان را جایگزین کنید
      const res = await fetch("/api/provider/register/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, code }),
      });

      if (!res.ok) {
        setServerError("کد وارد شده اشتباه یا منقضی شده است");
        setOtp("");
        return;
      }

      // ورود خودکار بعد از تأیید موفق
      const result = await signIn("credentials", {
        identifier: mobile,
        password,
        redirect: false,
      });

      toast.success("حساب متخصص شما ساخته شد. خوش آمدید!");
      // بعد از ثبت‌نام، مستقیم به تکمیل پروفایل هدایت می‌شود، نه صفحه‌ی اصلی
      router.push(result?.error ? "/login" : "/provider/profile");
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
      // TODO: آدرس API خودتان را جایگزین کنید
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: getValues("mobile") }),
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

  /* ───────── UI ───────── */
  return (
    <div className="w-full max-w-md">
      <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-card shadow-xl shadow-foreground/[0.06]">
        {/* سربرگ */}
        <div className="border-b border-foreground/5 bg-gradient-to-b from-primary/[0.06] to-transparent px-6 py-7 text-center sm:px-8">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            {step === "details" ? (
              <Briefcase size={22} />
            ) : (
              <MessageSquare size={22} />
            )}
          </span>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            {step === "details"
              ? "ثبت‌نام به‌عنوان متخصص"
              : "شماره خود را تأیید کنید"}
          </h1>
          <p className="mt-1.5 text-sm leading-6 text-foreground/60">
            {step === "details" ? (
              "چند دقیقه‌ای حساب بسازید و شروع به دریافت کار کنید"
            ) : (
              <>
                کد {toPersianDigits(OTP_LENGTH)} رقمی به شماره{" "}
                <span dir="ltr" className="font-medium text-foreground">
                  {toPersianDigits(getValues("mobile"))}
                </span>{" "}
                ارسال شد
              </>
            )}
          </p>
        </div>

        {/* بدنه */}
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

          {/* ───── مرحله ۱: اطلاعات ───── */}
          {step === "details" && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
              noValidate
            >
              {/* نام و نام خانوادگی */}
              <div className="space-y-2">
                <Label htmlFor="fullName">نام و نام خانوادگی</Label>
                <div className="relative">
                  <User
                    size={18}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground/35"
                  />
                  <Input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    autoFocus
                    placeholder="مثلاً علی رضایی"
                    error={!!errors.fullName}
                    aria-invalid={!!errors.fullName}
                    aria-describedby={
                      errors.fullName ? "fullName-error" : undefined
                    }
                    className="pr-10"
                    {...register("fullName")}
                  />
                </div>
                <FieldError
                  id="fullName-error"
                  message={errors.fullName?.message}
                />
              </div>

              {/* موبایل */}
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
                    dir="ltr"
                    maxLength={11}
                    placeholder="09123456789"
                    error={!!errors.mobile}
                    aria-invalid={!!errors.mobile}
                    aria-describedby={errors.mobile ? "mobile-error" : undefined}
                    className="pr-10 text-left tracking-wider"
                    {...register("mobile", { setValueAs: toEnglishDigits })}
                  />
                </div>
                <FieldError id="mobile-error" message={errors.mobile?.message} />
              </div>

              {/* دسته‌ی کاری اصلی */}
              <div className="space-y-2">
                <Label htmlFor="categoryId">دسته‌ی کاری اصلی شما</Label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => {
                    const selected = categoryId === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setValue("categoryId", c.id, { shouldValidate: true })}
                        aria-pressed={selected}
                        className={[
                          "rounded-full border px-3 py-1.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                          selected
                            ? "border-primary bg-primary/10 font-medium text-primary"
                            : "border-foreground/15 text-foreground/65 hover:border-primary/40",
                        ].join(" ")}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
                <FieldError id="categoryId-error" message={errors.categoryId?.message} />
              </div>

              {/* شهر */}
              <div className="space-y-2">
                <Label htmlFor="city">شهر فعالیت</Label>
                <div className="relative">
                  <MapPin
                    size={18}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground/35"
                  />
                  <Input
                    id="city"
                    type="text"
                    autoComplete="address-level2"
                    placeholder="مثلاً تهران"
                    error={!!errors.city}
                    aria-invalid={!!errors.city}
                    aria-describedby={errors.city ? "city-error" : undefined}
                    className="pr-10"
                    {...register("city")}
                  />
                </div>
                <FieldError id="city-error" message={errors.city?.message} />
              </div>

              {/* ایمیل (اختیاری) */}
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

              {/* رمز عبور */}
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

                <PasswordStrength password={password ?? ""} />

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

              {/* قوانین */}
              <div className="space-y-2">
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
              </div>

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

          {/* ───── مرحله ۲: تأیید شماره ───── */}
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

        {/* پاورقی */}
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

      <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-foreground/45">
        <ShieldCheck size={14} />
        اطلاعات شما محفوظ می‌ماند و با کسی به اشتراک گذاشته نمی‌شود
      </p>
    </div>
  );
}