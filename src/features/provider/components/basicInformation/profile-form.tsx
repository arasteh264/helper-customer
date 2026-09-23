"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { BadgeCheck, Loader2, RotateCcw, Save } from "lucide-react";
import type { ReactNode } from "react";

import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";

import {
  providerProfileSchema,
  type ProviderProfileValues,
} from "../../schemas/provider-profile.schema";
import { formatMoney, toEnglishDigits } from "../../utils/format";

import { AvatarUploader } from "./avatar-uploader";
import { Provider } from "../../types/types";
import { SectionCard } from "@/src/components/shared/section-card";
import { ChipsInput } from "../ui/chips-input";

const SKILL_SUGGESTIONS = [
  "لوله‌کشی",
  "رفع نشتی",
  "نصب شیرآلات",
  "تأسیسات",
  "رفع گرفتگی",
  "نصب آبگرمکن",
];
const AREA_SUGGESTIONS = [
  "تهران - منطقه ۱",
  "تهران - منطقه ۳",
  "تهران - منطقه ۵",
  "کرج",
  "شهریار",
];

function Field({
  id,
  label,
  hint,
  error,
  optional,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {optional && (
          <span className="ms-1.5 text-xs font-normal text-foreground/45">
            (اختیاری)
          </span>
        )}
      </Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-foreground/50">{hint}</p>
      ) : null}
    </div>
  );
}

const textareaCls =
  "w-full resize-y rounded-xl border bg-background px-3.5 py-3 text-sm leading-7 outline-none transition-colors placeholder:text-foreground/40 focus:border-primary/50 focus:ring-4 focus:ring-primary/10";

export function ProfileForm({ provider }: { provider: Provider }) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProviderProfileValues>({
    resolver: zodResolver(providerProfileSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: provider.fullName,
      headline: provider.headline,
      city: provider.city,
      experienceYears: String(provider.experienceYears),
      bio: provider.bio,
      skills: provider.skills,
      serviceAreas: provider.serviceAreas,
      startingPrice: String(provider.startingPrice),
      email: provider.email,
    },
  });

  const bioLength = watch("bio")?.length ?? 0;
  const price = Number(watch("startingPrice"));

  const onSubmit = async (values: ProviderProfileValues) => {
    try {
      // TODO: آدرس API خودتان را جایگزین کنید
      const res = await fetch("/api/provider/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          experienceYears: Number(values.experienceYears),
          startingPrice: Number(values.startingPrice),
        }),
      });
      if (!res.ok) throw new Error();

      reset(values); // بعد از ذخیره، فرم دوباره «تمیز» حساب می‌شود
      toast.success("تغییرات با موفقیت ذخیره شد");
    } catch {
      toast.error("ذخیره‌ی تغییرات انجام نشد. دوباره تلاش کنید.");
    }
  };

  const err = (name: keyof ProviderProfileValues) =>
    errors[name]?.message as string | undefined;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <SectionCard
        id="basic"
        title="اطلاعات پایه"
        description="این اطلاعات در پروفایل عمومی شما دیده می‌شود."
      >
        <AvatarUploader name={provider.fullName} initialUrl={provider.avatar} />

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field
            id="fullName"
            label="نام و نام خانوادگی"
            error={err("fullName")}
          >
            <Input
              id="fullName"
              autoComplete="name"
              error={!!errors.fullName}
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
              {...register("fullName")}
            />
          </Field>

          <Field
            id="headline"
            label="عنوان تخصصی"
            hint="مثلاً: لوله‌کش ساختمان، وکیل پایه یک دادگستری"
            error={err("headline")}
          >
            <Input
              id="headline"
              error={!!errors.headline}
              aria-invalid={!!errors.headline}
              aria-describedby={errors.headline ? "headline-error" : undefined}
              {...register("headline")}
            />
          </Field>

          <Field id="city" label="شهر" error={err("city")}>
            <Input
              id="city"
              error={!!errors.city}
              aria-invalid={!!errors.city}
              aria-describedby={errors.city ? "city-error" : undefined}
              {...register("city")}
            />
          </Field>

          <Field
            id="experienceYears"
            label="سابقه‌ی کار (سال)"
            error={err("experienceYears")}
          >
            <Input
              id="experienceYears"
              inputMode="numeric"
              dir="ltr"
              maxLength={2}
              className="text-start"
              error={!!errors.experienceYears}
              aria-invalid={!!errors.experienceYears}
              aria-describedby={
                errors.experienceYears ? "experienceYears-error" : undefined
              }
              {...register("experienceYears", { setValueAs: toEnglishDigits })}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard
        id="bio"
        title="درباره‌ی شما"
        description="خودتان، تجربه‌تان و روش کارتان را معرفی کنید. مشتریان قبل از انتخاب این متن را می‌خوانند."
      >
        <Field id="bio-input" label="معرفی" error={err("bio")}>
          <textarea
            id="bio-input"
            rows={5}
            placeholder="مثلاً: ۹ سال سابقه در رفع نشتی و نصب تأسیسات دارم و کارم را با ضمانت تحویل می‌دهم…"
            aria-invalid={!!errors.bio}
            aria-describedby={errors.bio ? "bio-input-error" : "bio-count"}
            className={`${textareaCls} ${
              errors.bio ? "border-destructive/50" : "border-foreground/15"
            }`}
            {...register("bio")}
          />
        </Field>
        <p
          id="bio-count"
          className={`mt-2 text-end text-xs ${
            bioLength > 600 ? "text-destructive" : "text-foreground/45"
          }`}
        >
          {new Intl.NumberFormat("fa-IR").format(bioLength)} / ۶۰۰
        </p>
      </SectionCard>

      <SectionCard
        id="skills"
        title="تخصص‌ها و محدوده‌ی خدمت"
        description="با Enter یا ویرگول اضافه کنید. تخصص‌ها به جستجوی شما کمک می‌کنند."
      >
        <div className="space-y-6">
          <Field id="skills-input" label="تخصص‌ها" error={err("skills")}>
            <Controller
              control={control}
              name="skills"
              render={({ field }) => (
                <ChipsInput
                  id="skills-input"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="مثلاً رفع نشتی"
                  suggestions={SKILL_SUGGESTIONS}
                  invalid={!!errors.skills}
                />
              )}
            />
          </Field>

          <Field
            id="serviceAreas"
            label="محدوده‌های خدمت‌رسانی"
            error={err("serviceAreas")}
          >
            <Controller
              control={control}
              name="serviceAreas"
              render={({ field }) => (
                <ChipsInput
                  id="serviceAreas"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="مثلاً تهران - منطقه ۳"
                  suggestions={AREA_SUGGESTIONS}
                  invalid={!!errors.serviceAreas}
                />
              )}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard
        id="pricing"
        title="قیمت و راه‌های ارتباطی"
        description="قیمت شروع در کارت شما به مشتریان نشان داده می‌شود."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="startingPrice"
            label="قیمت شروع (تومان)"
            hint={
              price > 0
                ? `نمایش برای مشتری: از ${formatMoney(price)}`
                : undefined
            }
            error={err("startingPrice")}
          >
            <Input
              id="startingPrice"
              inputMode="numeric"
              dir="ltr"
              className="text-start"
              placeholder="350000"
              error={!!errors.startingPrice}
              aria-invalid={!!errors.startingPrice}
              aria-describedby={
                errors.startingPrice ? "startingPrice-error" : undefined
              }
              {...register("startingPrice", { setValueAs: toEnglishDigits })}
            />
          </Field>

          <Field id="email" label="ایمیل" optional error={err("email")}>
            <Input
              id="email"
              type="email"
              dir="ltr"
              className="text-start"
              autoComplete="email"
              placeholder="you@example.com"
              error={!!errors.email}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
          </Field>

          <div className="sm:col-span-2">
            <Field
              id="phone"
              label="شماره موبایل"
              hint="برای تغییر شماره‌ی تأییدشده با پشتیبانی تماس بگیرید."
            >
              <div className="relative">
                <Input
                  id="phone"
                  value={provider.phone}
                  disabled
                  dir="ltr"
                  className="pe-28 text-start tracking-wider"
                  readOnly
                />
                <span className="absolute end-3 top-1/2 flex -translate-y-1/2 items-center gap-1 text-xs font-medium text-green-700">
                  <BadgeCheck size={15} />
                  تأییدشده
                </span>
              </div>
            </Field>
          </div>
        </div>
      </SectionCard>

      {isDirty && (
        <div
          role="region"
          aria-label="ذخیره‌ی تغییرات"
          className="sticky bottom-24 z-20 flex items-center justify-between gap-3 rounded-2xl border border-primary/25 bg-card/95 p-3 shadow-xl shadow-foreground/10 backdrop-blur lg:bottom-6"
        >
          <p className="ps-2 text-sm text-foreground/70">
            تغییرات ذخیره‌نشده دارید
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isSubmitting}
              className="gap-1.5"
            >
              <RotateCcw size={16} />
              انصراف
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-1.5">
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              ذخیره
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
