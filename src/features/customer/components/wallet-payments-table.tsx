"use client";

import { useState } from "react";

import type { WalletPayment } from "../types/customer.types";
import { PAYMENT_STATUS, PAYMENT_TYPE } from "../utils/status-maps";
import { formatDateTime, formatMoney } from "@/src/utils/format";
import { SectionCard } from "@/src/components/shared/section-card";
import { StatusBadge } from "@/src/components/shared/status-badge";

const PAGE_SIZE = 6;

function Amount({ p }: { p: WalletPayment }) {
  const positive = p.amount > 0;
  const muted = p.status !== "completed";
  const color = muted ? "text-foreground/45" : positive ? "text-green-700" : "text-foreground";

  return (
    <span
      dir="ltr"
      className={`whitespace-nowrap text-sm font-semibold ${color} ${p.status === "failed" ? "line-through" : ""}`}
    >
      {positive ? "+" : "−"} {formatMoney(p.amount)}
    </span>
  );
}

export function WalletPaymentsTable({ payments }: { payments: WalletPayment[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const sorted = [...payments].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const shown = sorted.slice(0, visible);

  return (
    <SectionCard title="تراکنش‌های کیف پول" description="تاریخچه‌ی شارژ، پرداخت و بازگشت وجه">
      {shown.length === 0 ? (
        <p className="rounded-xl bg-foreground/[0.03] px-4 py-10 text-center text-sm text-foreground/55">
          تراکنشی برای نمایش وجود ندارد.
        </p>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-foreground/10 text-xs text-foreground/50">
                  <th scope="col" className="pb-3 pe-4 text-start font-medium">تاریخ</th>
                  <th scope="col" className="pb-3 pe-4 text-start font-medium">شرح</th>
                  <th scope="col" className="pb-3 pe-4 text-start font-medium">نوع</th>
                  <th scope="col" className="pb-3 pe-4 text-start font-medium">وضعیت</th>
                  <th scope="col" className="pb-3 text-end font-medium">مبلغ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/[0.07]">
                {shown.map((p) => {
                  const st = PAYMENT_STATUS[p.status];
                  return (
                    <tr key={p.id}>
                      <td className="whitespace-nowrap py-3.5 pe-4 text-foreground/60">
                        {formatDateTime(p.date)}
                      </td>
                      <td className="py-3.5 pe-4 text-foreground">{p.description}</td>
                      <td className="py-3.5 pe-4 text-foreground/60">{PAYMENT_TYPE[p.type]}</td>
                      <td className="py-3.5 pe-4">
                        <StatusBadge tone={st.tone}>{st.label}</StatusBadge>
                      </td>
                      <td className="py-3.5 text-end">
                        <Amount p={p} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <ul className="space-y-3 md:hidden">
            {shown.map((p) => {
              const st = PAYMENT_STATUS[p.status];
              return (
                <li key={p.id} className="rounded-xl border border-foreground/10 bg-background p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm leading-6 text-foreground">{p.description}</p>
                    <Amount p={p} />
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2 text-xs text-foreground/50">
                    <span>{formatDateTime(p.date)}</span>
                    <StatusBadge tone={st.tone}>{st.label}</StatusBadge>
                  </div>
                </li>
              );
            })}
          </ul>

          {sorted.length > visible && (
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="rounded-xl border border-foreground/15 px-5 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                نمایش تراکنش‌های بیشتر
              </button>
            </div>
          )}
        </>
      )}
    </SectionCard>
  );
}