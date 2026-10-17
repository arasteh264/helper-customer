"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { PasswordStrength } from "../PasswordStrength";
import type { SpecialistRegisterValues } from "../../schemas/specialist-register.schema";
import { FieldError, ICON_CLS, SectionTitle } from "./shared";
import { LegalModal } from "../legal-modal";

export function PasswordSection() {
  const [show, setShow] = useState(false);
  const [legalType, setLegalType] = useState<"terms" | "privacy" | null>(null);
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<SpecialistRegisterValues>();
  const password = watch("password");

  return (
    <>
      <SectionTitle index={3} title="رمز عبور" />

      <div className="space-y-2">
        <Label htmlFor="password">رمز عبور</Label>
        <div className="relative">
          <Lock size={18} className={ICON_CLS} />
          <Input
            id="password"
            type={show ? "text" : "password"}
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
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"}
            aria-pressed={show}
            className="absolute left-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-foreground/40 transition-colors hover:bg-foreground/5 hover:text-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <PasswordStrength password={password ?? ""} />

        {errors.password ? (
          <FieldError id="password-hint" message={errors.password.message} />
        ) : (
          <p id="password-hint" className="text-xs text-foreground/50">
            ترکیبی از حروف انگلیسی و عدد، حداقل ۸ کاراکتر
          </p>
        )}
      </div>

      <div className="space-y-3 rounded-2xl border border-primary/15 bg-primary/[0.035] p-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            پیش از شروع همکاری با هلپا۲۴
          </h3>
          <ul className="mt-2 space-y-1.5 text-xs leading-6 text-foreground/65">
            <li>قیمت و محدوده‌ی کار را در پیشنهاد خود شفاف اعلام کنید.</li>
            <li>شروع کار پس از انتخاب شما توسط مشتری و هماهنگی انجام می‌شود.</li>
            <li>اطلاعات و نشانی مشتری را محرمانه نگه دارید.</li>
          </ul>
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 border-t border-primary/10 pt-3 text-sm leading-6 text-foreground/75">
          <input
            type="checkbox"
            aria-invalid={!!errors.terms}
            aria-describedby={errors.terms ? "terms-error" : undefined}
            className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-foreground/25 accent-primary"
            {...register("terms")}
          />
          <span>
            <button
              type="button"
              onClick={() => setLegalType("terms")}
              className="font-medium text-primary hover:underline"
            >
              شرایط همکاری متخصصان هلپا۲۴
            </button>{" "}
            و{" "}
            <button
              type="button"
              onClick={() => setLegalType("privacy")}
              className="font-medium text-primary hover:underline"
            >
              حریم خصوصی
            </button>{" "}
            را خوانده‌ام و می‌پذیرم.
          </span>
        </label>
        <FieldError id="terms-error" message={errors.terms?.message} />
      </div>

      <LegalModal
        open={legalType !== null}
        onClose={() => setLegalType(null)}
        type={legalType ?? "terms"}
      />
    </>
  );
}
