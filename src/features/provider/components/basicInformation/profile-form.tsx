"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { getSession } from "next-auth/react";
import { BadgeCheck, Loader2, RotateCcw, Save } from "lucide-react";
import type { ReactNode } from "react";

import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { SectionCard } from "@/src/components/shared/section-card";

import {
  providerProfileSchema,
  type ProviderProfileValues,
} from "../../schemas/provider-profile.schema";
import { providerApi } from "../../api/provider.api";
import type { ProviderProfile } from "../../types/provider.types";

import { AvatarUploader } from "./avatar-uploader";

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
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

export function ProfileForm({ provider }: { provider: ProviderProfile }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProviderProfileValues>({
    resolver: zodResolver(providerProfileSchema),
    mode: "onTouched",
    defaultValues: {
      bio: provider.bio ?? "",
    },
  });

  const bioLength = watch("bio")?.length ?? 0;

  const onSubmit = async (values: ProviderProfileValues) => {
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        toast.error("جلسه کاربری شما منقضی شده است");
        return;
      }

      await providerApi.updateProfile(
        { bio: values.bio },
        session.accessToken,
      );

      reset(values);
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
        <AvatarUploader
          name={provider.user.name}
          initialUrl={provider.avatarUrl ?? undefined}
        />

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field id="name" label="نام و نام خانوادگی">
            <Input id="name" value={provider.user.name} disabled readOnly />
          </Field>

          <Field id="email" label="ایمیل">
            <Input
              id="email"
              value={provider.user.email}
              disabled
              readOnly
              dir="ltr"
              className="text-start"
            />
          </Field>

          <div className="sm:col-span-2">
            <Field id="phone" label="شماره موبایل">
              <div className="relative">
                <Input
                  id="phone"
                  value={provider.user.phone}
                  disabled
                  dir="rtl"
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

      <SectionCard
        id="bio"
        title="درباره‌ی شما"
        description="خودتان، تجربه‌تان و روش کارتان را معرفی کنید."
      >
        <Field id="bio-input" label="معرفی" error={err("bio")}>
          <textarea
            id="bio-input"
            rows={5}
            placeholder="مثلاً: ۹ سال سابقه در رفع نشتی و نصب تأسیسات دارم…"
            aria-invalid={!!errors.bio}
            className={`${textareaCls} ${
              errors.bio ? "border-destructive/50" : "border-foreground/15"
            }`}
            {...register("bio")}
          />
        </Field>
        <p
          className={`mt-2 text-end text-xs ${
            bioLength > 600 ? "text-destructive" : "text-foreground/45"
          }`}
        >
          {new Intl.NumberFormat("fa-IR").format(bioLength)} / ۶۰۰
        </p>
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