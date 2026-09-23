"use client";

import { useMemo, useState } from "react";

import { formatDateTime, formatMoney } from "../../utils/format";
import { TRANSACTION_STATUS, TRANSACTION_TYPE } from "../../utils/job-status";

import { Transaction, TransactionType } from "../../types/types";
import { SectionCard } from "@/src/components/shared/section-card";
import { StatusBadge } from "@/src/components/shared/status-badge";

type Filter = "all" | "earning" | "withdrawal" | "deductions";

const FILTERS: { id: Filter; label: string; types?: TransactionType[] }[] = [
  { id: "all", label: "همه" },
  { id: "earning", label: "درآمد", types: ["earning"] },
  { id: "withdrawal", label: "برداشت", types: ["withdrawal"] },
  {
    id: "deductions",
    label: "کارمزد و بازگشت",
    types: ["commission", "refund"],
  },
];

const PAGE_SIZE = 6;

function Amount({ tx }: { tx: Transaction }) {
  const positive = tx.amount > 0;
  const muted = tx.status !== "completed";
  const color = muted
    ? "text-foreground/45"
    : positive
      ? "text-green-700"
      : "text-foreground";

  return (
    <span
      dir="ltr"
      className={`whitespace-nowrap text-sm font-semibold ${color} ${tx.status === "failed" ? "line-through" : ""}`}
    >
      {positive ? "+" : "−"} {formatMoney(tx.amount)}
    </span>
  );
}

export function TransactionsTable({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const list = useMemo(() => {
    const types = FILTERS.find((f) => f.id === filter)?.types;
    return [...transactions]
      .filter((t) => !types || types.includes(t.type))
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [transactions, filter]);

  const shown = list.slice(0, visible);

  return (
    <SectionCard
      title="تراکنش‌ها"
      description="تاریخچه‌ی درآمد، کارمزد و برداشت‌های شما"
    >
      <div className="-mx-1 mb-5 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => {
              setFilter(f.id);
              setVisible(PAGE_SIZE);
            }}
            className={[
              "shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              filter === f.id
                ? "border-primary bg-primary/10 font-medium text-primary"
                : "border-foreground/10 text-foreground/65 hover:border-primary/40",
            ].join(" ")}
          >
            {f.label}
          </button>
        ))}
      </div>

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
                  <th scope="col" className="pb-3 pe-4 text-start font-medium">
                    تاریخ
                  </th>
                  <th scope="col" className="pb-3 pe-4 text-start font-medium">
                    شرح
                  </th>
                  <th scope="col" className="pb-3 pe-4 text-start font-medium">
                    نوع
                  </th>
                  <th scope="col" className="pb-3 pe-4 text-start font-medium">
                    وضعیت
                  </th>
                  <th scope="col" className="pb-3 text-end font-medium">
                    مبلغ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/[0.07]">
                {shown.map((tx) => {
                  const st = TRANSACTION_STATUS[tx.status];
                  return (
                    <tr key={tx.id}>
                      <td className="whitespace-nowrap py-3.5 pe-4 text-foreground/60">
                        {formatDateTime(tx.date)}
                      </td>
                      <td className="py-3.5 pe-4 text-foreground">
                        {tx.description}
                      </td>
                      <td className="py-3.5 pe-4 text-foreground/60">
                        {TRANSACTION_TYPE[tx.type]}
                      </td>
                      <td className="py-3.5 pe-4">
                        <StatusBadge tone={st.tone}>{st.label}</StatusBadge>
                      </td>
                      <td className="py-3.5 text-end">
                        <Amount tx={tx} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <ul className="space-y-3 md:hidden">
            {shown.map((tx) => {
              const st = TRANSACTION_STATUS[tx.status];
              return (
                <li
                  key={tx.id}
                  className="rounded-xl border border-foreground/10 bg-background p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm leading-6 text-foreground">
                      {tx.description}
                    </p>
                    <Amount tx={tx} />
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2 text-xs text-foreground/50">
                    <span>{formatDateTime(tx.date)}</span>
                    <StatusBadge tone={st.tone}>{st.label}</StatusBadge>
                  </div>
                </li>
              );
            })}
          </ul>

          {list.length > visible && (
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
