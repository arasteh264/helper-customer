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
  "w-full resize-y rounded-lg border bg-background px-3.5 py-3 text-sm leading-7 outline-none transition-colors placeholder:text-foreground/40 focus:border-primary/50 focus:ring-4 focus:ring-primary/10";

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

      await providerApi.updateProfile({ bio: values.bio }, session.accessToken);

      reset(values);
      toast.success("تغییرات با موفقیت ذخیره شد");
    } catch {
      toast.error("ذخیره‌ی تغییرات انجام نشد. دوباره تلاش کنید.");
    }
  };

  const err = (name: keyof ProviderProfileValues) =>
    errors[name]?.message as string | undefined;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <SectionCard
        id="basic"
        title="اطلاعات پروفایل"
        description="اطلاعاتی که مشتری پیش از انتخاب متخصص می‌بیند."
      >
        <div className="grid gap-5">
          <div className="flex flex-col gap-4 rounded-xl border border-foreground/10 bg-background p-4">
            <AvatarUploader
              name={provider.user.name}
              initialUrl={provider.avatarUrl ?? undefined}
            />
            <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2">
              <div className="min-w-0 rounded-lg bg-card px-3 py-2.5">
                <p className="text-xs text-foreground/50">نام و نام خانوادگی</p>
                <p className="mt-1 truncate text-sm font-medium text-foreground">
                  {provider.user.name}
                </p>
              </div>
              <div className="min-w-0 rounded-lg bg-card px-3 py-2.5">
                <p className="text-xs text-foreground/50">شماره تأییدشده</p>
                <p
                  className="mt-1 text-start text-sm font-medium text-foreground"
                  dir="ltr"
                >
                  {provider.user.phone}
                </p>
              </div>
              <div className="min-w-0 rounded-lg bg-card px-3 py-2.5 sm:col-span-2">
                <p className="text-xs text-foreground/50">ایمیل</p>
                <p
                  className="mt-1 truncate text-start text-sm font-medium text-foreground"
                  dir="ltr"
                >
                  {provider.user.email}
                </p>
              </div>
            </div>
          </div>

          <p className="-mt-2 text-xs leading-5 text-foreground/45">
            نام و راه‌های تماس از حساب کاربری شما نمایش داده می‌شوند.
          </p>

          <div
            id="bio"
            className="scroll-mt-24 border-t border-foreground/10 pt-5"
          >
            <Field
              id="bio-input"
              label="معرفی حرفه‌ای"
              hint="سابقه، مهارت‌ها و شیوه‌ی کارتان را کوتاه و روشن بنویسید."
              error={err("bio")}
            >
              <textarea
                id="bio-input"
                rows={5}
                placeholder="مثلاً: ۹ سال سابقه در نصب و تعمیر تأسیسات دارم و پیش از شروع کار، هزینه را شفاف اعلام می‌کنم."
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
          </div>
        </div>
      </SectionCard>

      {isDirty && (
        <div
          role="region"
          aria-label="ذخیره‌ی تغییرات"
          className="sticky bottom-24 z-20 mt-4 flex items-center justify-between gap-3 rounded-xl border border-primary/25 bg-card/95 p-3 shadow-lg shadow-foreground/10 backdrop-blur lg:bottom-6"
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
            <Button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="gap-1.5"
            >
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
