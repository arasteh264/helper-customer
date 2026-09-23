"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { SectionCard } from "@/src/components/shared/section-card";
import { changePasswordSchema, ChangePasswordValues } from "../../schemas/change-password.schema";
import { customerApi } from "../../api/customer.api";
import { ApiError, ApiErrorCode } from "@/src/lib/api/error";

function PasswordField({
  id,
  label,
  error,
  register,
}: {
  id: keyof ChangePasswordValues;
  label: string;
  error?: string;
  register: ReturnType<typeof useForm<ChangePasswordValues>>["register"];
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          dir="rtl"
          className="pe-10 text-start"
          autoComplete={id === "currentPassword" ? "current-password" : "new-password"}
          error={!!error}
          aria-invalid={!!error}
          {...register(id)}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "پنهان کردن رمز" : "نمایش رمز"}
          className="absolute end-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-foreground/40 transition-colors hover:bg-foreground/5 hover:text-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function ChangePasswordForm() {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async ({ confirmPassword, ...payload }: ChangePasswordValues) => {
    try {
      await customerApi.changePassword(payload);
      toast.success("رمز عبور شما تغییر کرد");
      reset();
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError("currentPassword", { message: "رمز عبور فعلی اشتباه است" });
          return;
        }
        if (err.status === 400) {
          toast.error(err.message || "رمز جدید معتبر نیست یا با رمز فعلی یکسان است");
          return;
        }
      }
      toast.error("تغییر رمز عبور انجام نشد. دوباره تلاش کنید.");
    }
  };

  return (
    <SectionCard title="تغییر رمز عبور" description="برای امنیت بیشتر، رمز قوی و منحصربه‌فرد انتخاب کنید.">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-md space-y-5">
        <PasswordField id="currentPassword" label="رمز عبور فعلی" error={errors.currentPassword?.message} register={register} />
        <PasswordField id="newPassword" label="رمز عبور جدید" error={errors.newPassword?.message} register={register} />
        <PasswordField id="confirmPassword" label="تکرار رمز عبور جدید" error={errors.confirmPassword?.message} register={register} />

        <Button type="submit" disabled={isSubmitting} className="gap-1.5">
          {isSubmitting && <Loader2 size={16} className="animate-spin" />}
          تغییر رمز عبور
        </Button>
      </form>
    </SectionCard>
  );
}