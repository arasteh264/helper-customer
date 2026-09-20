"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LockKeyhole,
  ShieldCheck,
  TimerOff,
} from "lucide-react";

import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../schemas/reset-password.schema";
import { PasswordStrength } from "./PasswordStrength";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";

interface ResetPasswordFormProps {
  token?: string;
}

type View = "form" | "success" | "invalid";

function CardHeader({
    icon,
    title,
    description,
    tone = "primary",
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    tone?: "primary" | "success" | "danger";
  }) {
  return (
    <div className="border-b border-foreground/5 bg-gradient-to-b from-primary/[0.06] to-transparent px-6 py-7 text-center sm:px-8">
      <span
        className={[
          "mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg",
          tone === "primary" &&
            "bg-primary text-primary-foreground shadow-primary/25",
          tone === "success" && "bg-green-600 text-white shadow-green-600/25",
          tone === "danger" &&
            "bg-destructive text-white shadow-destructive/25",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {icon}
      </span>
      <h1 className="text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="mt-1.5 text-sm leading-6 text-foreground/60">
        {description}
      </p>
    </div>
  );
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [view, setView] = useState<View>(token ? "form" : "invalid");
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onTouched",
    defaultValues: { password: "" },
  });

  const password = watch("password");

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setServerError(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: values.password }),
      });

      if (res.status === 400 || res.status === 401 || res.status === 410) {
        setView("invalid");
        return;
      }

      if (!res.ok) throw new Error();

      setView("success");
    } catch {
      setServerError("تغییر رمز عبور انجام نشد. لطفاً دوباره تلاش کنید.");
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-card shadow-xl shadow-foreground/[0.06]">
        {view === "invalid" && (
          <>
            <CardHeader
              tone="danger"
              icon={<TimerOff size={22} />}
              title="لینک بازیابی معتبر نیست"
              description="این لینک منقضی شده یا قبلاً استفاده شده است. دوباره درخواست بازیابی بدهید."
            />
            <div className="px-6 py-6 sm:px-8">
              <Button size="lg" className="w-full" >
                <Link href="/forgot-password">درخواست کد جدید</Link>
              </Button>
            </div>
          </>
        )}

        {/* ───── موفقیت ───── */}
        {view === "success" && (
          <>
            <CardHeader
              tone="success"
              icon={<CheckCircle2 size={22} />}
              title="رمز عبور تغییر کرد"
              description="حالا می‌توانید با رمز عبور جدید وارد حساب خود شوید"
            />
            <div className="px-6 py-6 sm:px-8">
              <Button size="lg" className="w-full" >
                <Link href="/login">ورود به حساب</Link>
              </Button>
            </div>
          </>
        )}

        {/* ───── فرم رمز جدید ───── */}
        {view === "form" && (
          <>
            <CardHeader
              icon={<LockKeyhole size={22} />}
              title="تعیین رمز عبور جدید"
              description="یک رمز عبور قوی انتخاب کنید که قبلاً استفاده نکرده‌اید"
            />

            <div className="px-6 py-6 sm:px-8">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
                noValidate
              >
                {serverError && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                  >
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    <span className="leading-6">{serverError}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">رمز عبور جدید</Label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground/35"
                    />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      autoFocus
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
                    <p
                      id="password-hint"
                      className="text-xs text-destructive"
                    >
                      {errors.password.message}
                    </p>
                  ) : (
                    <p
                      id="password-hint"
                      className="text-xs text-foreground/50"
                    >
                      ترکیبی از حروف انگلیسی و عدد، حداقل ۸ کاراکتر
                    </p>
                  )}
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
                      در حال ذخیره…
                    </>
                  ) : (
                    "ذخیره رمز عبور"
                  )}
                </Button>
              </form>
            </div>
          </>
        )}
      </div>

      {view === "form" && (
        <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-foreground/45">
          <ShieldCheck size={14} />
          بعد از تغییر رمز، رمز قبلی دیگر معتبر نخواهد بود
        </p>
      )}
    </div>
  );
}