"use client";

import { useFormContext } from "react-hook-form";
import { Mail, Smartphone, User } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import type { SpecialistRegisterValues } from "../../schemas/specialist-register.schema";
import { FieldError, ICON_CLS, SectionTitle } from "./shared";
import { toEnglishDigits } from "@/src/utils/format";

export function PersonalSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<SpecialistRegisterValues>();

  return (
    <>
      <SectionTitle index={1} title="اطلاعات شخصی" />

      <div className="space-y-2">
        <Label htmlFor="fullName">نام و نام خانوادگی</Label>
        <div className="relative">
          <User size={18} className={ICON_CLS} />
          <Input
            id="fullName"
            type="text"
            autoComplete="name"
            autoFocus
            placeholder="مثلاً علی رضایی"
            error={!!errors.fullName}
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            className="pr-10"
            {...register("fullName")}
          />
        </div>
        <FieldError id="fullName-error" message={errors.fullName?.message} />
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="mobile">شماره موبایل</Label>
          <div className="relative">
            <Smartphone size={18} className={ICON_CLS} />
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

        <div className="space-y-2">
          <Label htmlFor="email">ایمیل</Label>
          <div className="relative">
            <Mail size={18} className={ICON_CLS} />
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
      </div>
    </>
  );
}
