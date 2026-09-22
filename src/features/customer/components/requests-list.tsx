"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarClock, Inbox, MapPin, Star } from "lucide-react";

import type { RequestStatus, ServiceRequest } from "../types/customer.types";
import { REQUEST_STATUS } from "../utils/status-maps";
import { formatDateTime, formatMoney, formatNumber } from "@/src/utils/format";
import { StatusBadge } from "@/src/components/shared/status-badge";

type Tab = "active" | "completed" | "cancelled";

const TABS: { id: Tab; label: string; statuses: RequestStatus[]; empty: string }[] = [
  {
    id: "active",
    label: "فعال",
    statuses: ["awaiting_offers", "offers_received", "in_progress"],
    empty: "درخواست فعالی ندارید.",
  },
  {
    id: "completed",
    label: "تکمیل‌شده",
    statuses: ["completed"],
    empty: "هنوز درخواست تکمیل‌شده‌ای ندارید.",
  },
  {
    id: "cancelled",
    label: "لغوشده",
    statuses: ["cancelled"],
    empty: "درخواست لغوشده‌ای وجود ندارد.",
  },
];

export function RequestsList({
  requests,
  initialTab = "active",
}: {
  requests: ServiceRequest[];
  initialTab?: Tab;
}) {
  const [tab, setTab] = useState<Tab>(initialTab);

  const counts = useMemo(() => {
    const map = {} as Record<Tab, number>;
    TABS.forEach((t) => {
      map[t.id] = requests.filter((r) => t.statuses.includes(r.status)).length;
    });
    return map;
  }, [requests]);

  const visible = useMemo(() => {
    const statuses = TABS.find((t) => t.id === tab)!.statuses;
    return requests
      .filter((r) => statuses.includes(r.status))
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [requests, tab]);

  const active = TABS.find((t) => t.id === tab)!;

  return (
    <div>
      <div
        role="tablist"
        aria-label="وضعیت درخواست‌ها"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {TABS.map((t) => {
          const selected = t.id === tab;
          return (
            <button
              key={t.id}
              id={`req-tab-${t.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls="requests-panel"
              onClick={() => setTab(t.id)}
              className={[
                "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                selected
                  ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "border-foreground/10 bg-card text-foreground/70 hover:border-primary/40 hover:text-primary",
              ].join(" ")}
            >
              {t.label}
              <span
                className={`min-w-5 rounded-full px-1.5 text-xs ${
                  selected ? "bg-white/20" : "bg-foreground/[0.06]"
                }`}
              >
                {formatNumber(counts[t.id])}
              </span>
            </button>
          );
        })}
      </div>

      <div id="requests-panel" role="tabpanel" aria-labelledby={`req-tab-${tab}`} className="mt-5">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-foreground/15 bg-card px-6 py-14 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground/[0.05] text-foreground/40">
              <Inbox size={26} />
            </span>
            <p className="text-sm text-foreground/60">{active.empty}</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {visible.map((r) => {
              const status = REQUEST_STATUS[r.status];
              return (
                <li key={r.id}>
                  <Link
                    href={`/customer/requests/${r.id}`}
                    className="block rounded-2xl border border-foreground/10 bg-card p-4 transition-colors hover:border-primary/30 hover:shadow-md hover:shadow-foreground/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-foreground/45">{r.code}</p>
                        <h3 className="mt-0.5 text-base font-semibold text-foreground">
                          {r.title}
                        </h3>
                      </div>
                      <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                    </div>

                    <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-foreground/55">
                      <div className="flex items-center gap-1.5">
                        <CalendarClock size={13} />
                        <dd>{formatDateTime(r.scheduledAt ?? r.createdAt)}</dd>
                      </div>
                      <div className="flex min-w-0 items-center gap-1.5">
                        <MapPin size={13} className="shrink-0" />
                        <dd className="truncate">{r.addressLabel}</dd>
                      </div>
                    </dl>

                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-foreground/10 pt-3.5">
                      {r.specialist ? (
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {r.specialist.name.charAt(0)}
                          </span>
                          <div className="text-xs">
                            <p className="font-medium text-foreground">{r.specialist.name}</p>
                            <p className="flex items-center gap-1 text-foreground/50">
                              <Star size={11} className="fill-amber-500 text-amber-500" />
                              {r.specialist.rating}
                            </p>
                          </div>
                        </div>
                      ) : r.status === "offers_received" ? (
                        <p className="text-xs font-medium text-amber-700">
                          {formatNumber(r.offersCount)} پیشنهاد در انتظار بررسی
                        </p>
                      ) : (
                        <p className="text-xs text-foreground/45">هنوز متخصصی انتخاب نشده</p>
                      )}

                      {r.price !== undefined && (
                        <p className="text-sm font-semibold text-foreground">
                          {formatMoney(r.price)}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}