"use client";

import { useState } from "react";
import { FileText, LoaderCircle, Plus, Printer, Send, Trash2 } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { ApiError } from "@/src/lib/api/error";
import { formatMoney, formatWithCommas, toEnglishDigits } from "@/src/utils/format";
import { providerInvoicesApi } from "../api/invoices.api";
import type { Invoice } from "../types/invoice.types";
import { printInvoice } from "../utils/print-invoice";

interface DraftItem {
  description: string;
  quantity: number;
  unitPriceToman: number;
}

export function InvoiceEditor({
  serviceRequestId,
  accessToken,
}: {
  serviceRequestId: string;
  accessToken: string;
}) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [items, setItems] = useState<DraftItem[]>([
    { description: "", quantity: 1, unitPriceToman: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [invoiceDoesNotExist, setInvoiceDoesNotExist] = useState(false);

  async function loadInvoice() {
    setLoading(true);
    setError("");
    try {
      const existing = await providerInvoicesApi.getForRequest(
        serviceRequestId,
        accessToken,
      );
      setInvoice(existing);
      setInvoiceDoesNotExist(false);
      setItems(existing.items.map(({ description, quantity, unitPriceToman }) => ({
        description,
        quantity,
        unitPriceToman,
      })));
    } catch (caught) {
      if (!(caught instanceof ApiError) || caught.status !== 404) {
        setError(caught instanceof ApiError ? caught.message : "دریافت فاکتور انجام نشد.");
      } else {
        setInvoiceDoesNotExist(true);
      }
    } finally {
      setLoading(false);
      setLoaded(true);
    }
  }

  async function createInvoice() {
    setLoading(true);
    setError("");
    try {
      const created = await providerInvoicesApi.create(
        serviceRequestId,
        { items },
        accessToken,
      );
      setInvoice(created);
      setInvoiceDoesNotExist(false);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "ساخت فاکتور انجام نشد.");
    } finally {
      setLoading(false);
    }
  }

  async function sendInvoice() {
    if (!invoice) return;
    setLoading(true);
    setError("");
    try {
      setInvoice(await providerInvoicesApi.send(invoice.id, accessToken));
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "ارسال فاکتور انجام نشد.");
    } finally {
      setLoading(false);
    }
  }

  function print() {
    if (!invoice) return;
    try {
      printInvoice(invoice);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "بازکردن نسخه‌ی چاپی انجام نشد.");
    }
  }

  return (
    <section className="mt-4 rounded-xl border border-primary/20 bg-primary/[0.035] p-3 sm:p-4">
      {!loaded ? (
        <Button type="button" variant="outline" disabled={loading} onClick={() => void loadInvoice()}>
          {loading ? <LoaderCircle className="animate-spin" size={16} /> : <FileText size={16} />}
          صدور فاکتور
        </Button>
      ) : null}

      {error ? (
        <div className="mt-3 space-y-2" role="alert">
          <p className="text-sm leading-6 text-destructive">{error}</p>
          {invoice ? null : (
            <Button type="button" variant="outline" size="sm" onClick={() => void loadInvoice()}>
              تلاش دوباره
            </Button>
          )}
        </div>
      ) : null}

      {loaded && !invoice && invoiceDoesNotExist ? (
        <div className="space-y-3">
          <h4 className="font-semibold">ساخت فاکتور</h4>
              <p className="text-xs leading-5 text-foreground/60">
                مبلغ‌ها بر اساس تومان ثبت می‌شوند. پیش‌نویس را بررسی کنید و سپس برای مشتری بفرستید.
          </p>
          {items.map((item, index) => (
            <div key={index} className="grid gap-2 rounded-lg border border-foreground/10 bg-background p-2 sm:grid-cols-[minmax(0,1.5fr)_90px_minmax(0,1fr)_44px]">
              <label className="grid gap-1 text-xs text-foreground/65">
                شرح ردیف
                <input
                  value={item.description}
                  maxLength={200}
                  onChange={(event) => setItems((rows) => rows.map((row, i) => i === index ? { ...row, description: event.target.value } : row))}
                  className="h-10 min-w-0 rounded-lg border border-foreground/15 bg-background px-3 text-sm text-foreground"
                  aria-label={`شرح ردیف ${index + 1}`}
                />
              </label>
              <label className="grid gap-1 text-xs text-foreground/65">
                تعداد
                <input
                  type="number"
                  min={1}
                  max={10000}
                  value={item.quantity}
                  onChange={(event) => setItems((rows) => rows.map((row, i) => i === index ? { ...row, quantity: Number(event.target.value) } : row))}
                  className="h-10 min-w-0 rounded-lg border border-foreground/15 bg-background px-2 text-sm"
                  aria-label={`تعداد ردیف ${index + 1}`}
                />
              </label>
              <label className="grid gap-1 text-xs text-foreground/65">
                قیمت واحد (تومان)
                <input
                  inputMode="numeric"
                  max={1_000_000_000}
                  value={formatWithCommas(String(item.unitPriceToman || ""))}
                  onChange={(event) => setItems((rows) => rows.map((row, i) => i === index ? { ...row, unitPriceToman: Number(toEnglishDigits(event.target.value).replace(/\D/g, "")) } : row))}
                  className="h-10 min-w-0 rounded-lg border border-foreground/15 bg-background px-3 text-sm"
                  aria-label={`قیمت واحد ردیف ${index + 1}`}
                />
              </label>
              <Button type="button" variant="ghost" className="h-10 w-11 self-end" aria-label={`حذف ردیف ${index + 1}`} disabled={items.length === 1} onClick={() => setItems((rows) => rows.filter((_, i) => i !== index))}>
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button type="button" variant="outline" disabled={items.length >= 100} onClick={() => setItems((rows) => [...rows, { description: "", quantity: 1, unitPriceToman: 0 }])}>
              <Plus size={16} /> افزودن ردیف
            </Button>
            <p className="text-sm font-semibold">جمع تقریبی: {formatMoney(items.reduce((sum, item) => sum + item.quantity * item.unitPriceToman, 0))}</p>
          </div>
          <Button
            type="button"
            disabled={loading || items.some((item) => !item.description.trim() || !Number.isInteger(item.quantity) || item.quantity < 1 || !Number.isInteger(item.unitPriceToman) || item.unitPriceToman < 0)}
            onClick={() => void createInvoice()}
          >
            {loading ? <LoaderCircle size={16} className="animate-spin" /> : <FileText size={16} />}
            ثبت پیش‌نویس فاکتور
          </Button>
        </div>
      ) : null}

      {invoice ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className="font-semibold">فاکتور {invoice.status === "SENT" ? "ارسال‌شده" : "پیش‌نویس"}</h4>
              <p className="mt-1 text-xs text-foreground/60">{invoice.items.length} ردیف · مجموع {formatMoney(invoice.totalToman)}</p>
            </div>
            <Button type="button" variant="outline" disabled={loading} onClick={print}>
              <Printer size={16} /> چاپ / ذخیره PDF
            </Button>
          </div>
          <ul className="divide-y divide-foreground/10 rounded-lg border border-foreground/10 bg-background">
            {invoice.items.map((item, index) => (
              <li key={`${item.description}-${index}`} className="flex flex-wrap justify-between gap-2 p-3 text-sm">
                <span>{item.description} <span className="text-foreground/55">× {item.quantity}</span></span>
                <span className="font-medium">{formatMoney(item.amountToman)}</span>
              </li>
            ))}
          </ul>
          {invoice.status === "DRAFT" ? (
            <Button type="button" disabled={loading} onClick={() => void sendInvoice()}>
              {loading ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={16} />}
              ارسال فاکتور برای مشتری
            </Button>
          ) : (
            <p className="text-xs leading-5 text-emerald-700" role="status">
              فاکتور در اعلان‌های مشتری در دسترس قرار گرفته است.
            </p>
          )}
        </div>
      ) : null}
    </section>
  );
}
