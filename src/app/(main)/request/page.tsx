import type { Metadata } from "next";

import { addresses } from "@/src/features/customer/api/mock-data";
import { RequestWizard } from "@/src/features/request/components/request-wizard";
import { Container } from "@/src/components/shared/container";

export const metadata: Metadata = { title: "ثبت درخواست تعمیرات | هلپر" };

export default function NewRequestPage() {
  // TODO: کاربر واردشده را از سشن بگیرید؛ اگر مهمان است به صفحه‌ی ورود هدایت کنید
  // TODO: آدرس‌های واقعی کاربر را از API بگیرید
  return (
    <div className="min-h-screen bg-foreground/[0.02] py-8 sm:py-12">
      <Container>
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            ثبت درخواست تعمیرات
          </h1>
          <p className="mt-2 text-sm leading-7 text-foreground/60">
            مشکل‌تان را توضیح دهید تا نزدیک‌ترین متخصصان تأییدشده برایتان پیشنهاد بدهند.
          </p>
        </div>

        <RequestWizard initialAddresses={addresses} />
      </Container>
    </div>
  );
}