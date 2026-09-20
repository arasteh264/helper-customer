"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  MessageSquare,
  User,
  Lock,
  ShieldCheck,
} from "lucide-react";

import { loginSchema, type LoginFormValues } from "../schemas/login.schema";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);

    const result = await signIn("credentials", {
      identifier: values.identifier,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      setServerError("موبایل/ایمیل یا رمز عبور اشتباه است");
      return;
    }

    toast.success("خوش آمدید");
    router.push("/");
  };

  return (
    <div className="w-full max-w-md">
      <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-card shadow-xl shadow-foreground/[0.06]">
        <div className="border-b border-foreground/5 bg-gradient-to-b from-primary/[0.06] to-transparent px-6 py-7 text-center sm:px-8">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground shadow-lg shadow-primary/25">
            H
          </span>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            خوش آمدید
          </h1>
          <p className="mt-1.5 text-sm text-foreground/60">
            برای ادامه وارد حساب کاربری خود شوید
          </p>
        </div>

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
              <Label htmlFor="identifier">موبایل یا ایمیل</Label>
              <div className="relative">
                <User
                  size={18}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground/35"
                />
                <Input
                  id="identifier"
                  type="text"
                  inputMode="email"
                  autoComplete="username"
                  autoFocus
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹ یا you@example.com"
                  error={!!errors.identifier}
                  aria-invalid={!!errors.identifier}
                  aria-describedby={
                    errors.identifier ? "identifier-error" : undefined
                  }
                  className="pr-10"
                  {...register("identifier")}
                />
              </div>
              {errors.identifier && (
                <p id="identifier-error" className="text-xs text-destructive">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="password">رمز عبور</Label>
                <Link
                  href="/forgot-password"
                  className="rounded text-xs text-foreground/60 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  فراموش کرده‌اید؟
                </Link>
              </div>

              <div className="relative">
                <Lock
                  size={18}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground/35"
                />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  error={!!errors.password}
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  className="pr-10 pl-11"
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

              {errors.password && (
                <p id="password-error" className="text-xs text-destructive">
                  {errors.password.message}
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
                  در حال ورود…
                </>
              ) : (
                "ورود"
              )}
            </Button>

            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-foreground/10" />
              <span className="text-xs text-foreground/40">یا</span>
              <span className="h-px flex-1 bg-foreground/10" />
            </div>

            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full gap-2"
              
            >
              <Link href="/login-otp" className="w-full flex justify-center items-center gap-1.5">
                <MessageSquare size={15} />
               <span> ورود با رمز یکبارمصرف</span>
              </Link>
            </Button>
          </form>
        </div>

        <div className="border-t border-foreground/5 bg-foreground/[0.02] px-6 py-4 text-center text-sm text-foreground/60 sm:px-8">
          حساب کاربری ندارید؟{" "}
          <Link
            href="/register"
            className="rounded font-medium text-primary transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            ثبت نام کنید
          </Link>
        </div>
      </div>

      <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-foreground/45">
        <ShieldCheck size={14} />
        ورود شما با رمزنگاری امن انجام می‌شود
      </p>
    </div>
  );
}