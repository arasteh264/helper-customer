"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { BadgeCheck, Loader2 } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
;

import { SectionCard } from "@/src/components/shared/section-card";
import { Customer } from "../../types/customer.types";
import { customerProfileSchema, CustomerProfileValues } from "../../schemas/customer-profile.schema";
import { customerApi } from "../../api/customer.api";

export function CustomerInfoForm({ customer }: { customer: Customer }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CustomerProfileValues>({
    resolver: zodResolver(customerProfileSchema),
    mode: "onTouched",
    defaultValues: { name: customer.name, email: customer.email },
  });

  const onSubmit = async (values: CustomerProfileValues) => {
    try {
      await customerApi.updateProfile(values);
      toast.success("اطلاعات با موفقیت ذخیره شد");
    } catch {
      toast.error("ذخیره‌ی تغییرات انجام نشد. دوباره تلاش کنید.");
    }
  };

  return (
    <SectionCard title="اطلاعات حساب" description="نام و راه‌های ارتباطی خود را به‌روز نگه دارید.">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">نام و نام خانوادگی</Label>
            <Input
              id="name"
              autoComplete="name"
              error={!!errors.name}
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">ایمیل</Label>
            <Input
              id="email"
              type="email"
              dir="rtl"
              className="text-start"
              autoComplete="email"
              error={!!errors.email}
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="phone">شماره موبایل</Label>
            <div className="relative">
              <Input id="phone" value={customer.phone} disabled dir="rtl" className="pe-28 text-start tracking-wider" readOnly />
              <span className="absolute end-3 top-1/2 flex -translate-y-1/2 items-center gap-1 text-xs font-medium text-green-700">
                <BadgeCheck size={15} />
                تأییدشده
              </span>
            </div>
            <p className="text-xs text-foreground/50">
              برای تغییر شماره‌ی تأییدشده با پشتیبانی تماس بگیرید.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || !isDirty} className="gap-1.5">
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            ذخیره‌ی تغییرات
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}