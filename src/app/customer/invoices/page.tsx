import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/src/auth";
import { PageHeader } from "@/src/components/shared/page-header";
import { SectionCard } from "@/src/components/shared/section-card";
import { CustomerInvoiceList } from "@/src/features/invoices/components/customer-invoice-list";
import { customerInvoicesApi } from "@/src/features/invoices/api/invoices.api";
import type { Invoice } from "@/src/features/invoices/types/invoice.types";

export const metadata: Metadata = { title: "فاکتورهای من | پنل مشتری" };

export default async function CustomerInvoicesPage() {
  const session = await auth();
  if (!session?.accessToken) redirect("/login");

  let invoices: Invoice[] = [];
  let loadError = false;
  try {
    invoices = await customerInvoicesApi.listMine(session.accessToken);
  } catch (error) {
    console.error("Failed to load customer invoices.", error);
    invoices = [];
    loadError = true;
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="فاکتورهای من"
        description="فاکتورهای ارسال‌شده توسط متخصصان را ببینید و نسخه‌ی PDF تهیه کنید."
      />
      {loadError ? (
        <SectionCard title="دریافت فاکتورها انجام نشد">
          <p className="text-sm leading-6 text-foreground/65">
            اتصال را بررسی کنید و صفحه را دوباره بارگذاری کنید.
          </p>
        </SectionCard>
      ) : (
        <CustomerInvoiceList invoices={invoices} />
      )}
    </div>
  );
}
