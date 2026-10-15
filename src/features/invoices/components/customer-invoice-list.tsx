"use client";

import { useState } from "react";
import { FileText, Printer } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { formatDate, formatMoney } from "@/src/utils/format";
import type { Invoice } from "../types/invoice.types";
import { printInvoice } from "../utils/print-invoice";

export function CustomerInvoiceList({ invoices }: { invoices: Invoice[] }) {
  const [error, setError] = useState("");

  function print(invoice: Invoice) {
    try {
      setError("");
      printInvoice(invoice);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "بازکردن نسخه‌ی چاپی انجام نشد.");
    }
  }

  if (!invoices.length) {
    return (
      <div className="rounded-2xl border border-dashed border-foreground/15 bg-card px-5 py-12 text-center">
        <FileText className="mx-auto size-8 text-foreground/35" aria-hidden="true" />
        <p className="mt-3 font-semibold">هنوز فاکتوری برای شما ارسال نشده است</p>
        <p className="mt-1 text-sm leading-6 text-foreground/55">
          پس از ارسال فاکتور توسط متخصص، آن را در همین صفحه می‌بینید.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error ? <p className="rounded-lg bg-destructive/5 p-3 text-sm text-destructive" role="alert">{error}</p> : null}
      {invoices.map((invoice) => (
        <article key={invoice.id} className="rounded-2xl border border-foreground/10 bg-card p-4 sm:p-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div className="min-w-0">
              <p className="text-xs text-foreground/50">فاکتور درخواست</p>
              <h2 className="mt-1 break-words font-semibold">{invoice.serviceRequest.title}</h2>
              <p className="mt-1 text-xs text-foreground/55">
                متخصص: {invoice.providerProfile.user.name} · {formatDate(invoice.sentAt ?? invoice.createdAt)}
              </p>
            </div>
            <Button type="button" variant="outline" className="min-h-11 w-full sm:w-auto" onClick={() => print(invoice)}>
              <Printer size={16} /> چاپ / ذخیره PDF
            </Button>
          </div>
          <ul className="mt-4 divide-y divide-foreground/10 rounded-xl border border-foreground/10">
            {invoice.items.map((item, index) => (
              <li key={`${item.description}-${index}`} className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm">
                <span className="min-w-0 break-words">{item.description} <span className="text-xs text-foreground/50">× {item.quantity}</span></span>
                <span className="shrink-0 font-medium">{formatMoney(item.amountToman)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-end text-base font-bold text-primary">
            جمع کل: {formatMoney(invoice.totalToman)}
          </p>
        </article>
      ))}
    </div>
  );
}
