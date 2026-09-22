import Link from "next/link";
import { CalendarClock, ChevronLeft, MapPin } from "lucide-react";

import type { ServiceRequest } from "../types/customer.types";
import { REQUEST_STATUS } from "../utils/status-maps";
import { formatDateTime } from "@/src/utils/format";
import { SectionCard } from "@/src/components/shared/section-card";
import { StatusBadge } from "@/src/components/shared/status-badge";

export function ActiveRequestsCard({ requests }: { requests: ServiceRequest[] }) {
  const active = requests
    .filter((r) => r.status !== "completed" && r.status !== "cancelled")
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 4);

  return (
    <SectionCard
      title="درخواست‌های فعال"
      description="درخواست‌هایی که در جریان‌اند"
      action={
        <Link
          href="/customer/requests"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          همه‌ی درخواست‌ها
          <ChevronLeft size={16} className="rtl:rotate-180" />
        </Link>
      }
    >
      {active.length === 0 ? (
        <p className="rounded-xl bg-foreground/[0.03] px-4 py-8 text-center text-sm text-foreground/55">
          درخواست فعالی ندارید. برای شروع، یک درخواست جدید ثبت کنید.
        </p>
      ) : (
        <ul className="space-y-3">
          {active.map((r) => {
            const status = REQUEST_STATUS[r.status];
            return (
              <li key={r.id}>
                <Link
                  href={`/customer/requests/${r.id}`}
                  className="block rounded-xl border border-foreground/10 bg-background p-4 transition-colors hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold text-foreground">{r.title}</h3>
                    <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                  </div>
                  <dl className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-foreground/55">
                    <div className="flex items-center gap-1.5">
                      <CalendarClock size={13} />
                      <dd>{formatDateTime(r.scheduledAt ?? r.createdAt)}</dd>
                    </div>
                    <div className="flex min-w-0 items-center gap-1.5">
                      <MapPin size={13} className="shrink-0" />
                      <dd className="truncate">{r.addressLabel}</dd>
                    </div>
                  </dl>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </SectionCard>
  );
}