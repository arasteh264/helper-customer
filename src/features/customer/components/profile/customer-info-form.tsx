import { SectionCard } from "@/src/components/shared/section-card";
import type { Customer } from "../../types/customer.types";

export function CustomerInfoForm({ customer }: { customer: Customer }) {
  return (
    <SectionCard title="اطلاعات حساب" description="اطلاعات فعلی حساب شما.">
      <dl className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <dt className="text-xs text-foreground/55">نام و نام خانوادگی</dt>
          <dd className="text-sm font-medium text-foreground">
            {customer.name}
          </dd>
        </div>
        <div className="space-y-1">
          <dt className="text-xs text-foreground/55">ایمیل</dt>
          <dd className="text-sm font-medium text-foreground" dir="ltr">
            {customer.email}
          </dd>
        </div>
        <div className="space-y-1 sm:col-span-2">
          <dt className="text-xs text-foreground/55">شماره موبایل</dt>
          <dd className="text-sm font-medium text-foreground" dir="ltr">
            {customer.phone}
          </dd>
        </div>
      </dl>
      <p className="mt-4 text-xs leading-6 text-foreground/50" role="status">
        ویرایش اطلاعات حساب تا زمان پشتیبانی API در دسترس نیست.
      </p>
    </SectionCard>
  );
}
