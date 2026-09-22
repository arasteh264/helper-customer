import Link from "next/link";
import { BadgeCheck, Pencil } from "lucide-react";

import type { Customer } from "../types/customer.types";
import { formatDate } from "@/src/utils/format";

export function ProfileSummaryCard({ customer }: { customer: Customer }) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-2xl border border-foreground/10 bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        {customer.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={customer.avatar}
            alt=""
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
            {customer.fullName.charAt(0)}
          </span>
        )}

        <div>
          <h1 className="text-lg font-bold text-foreground sm:text-xl">
            {customer.fullName}
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-foreground/55">
            عضو هلپر از {formatDate(customer.memberSince)}
            {customer.emailVerified && (
              <span className="inline-flex items-center gap-1 text-xs text-green-700">
                <BadgeCheck size={14} />
                حساب تأییدشده
              </span>
            )}
          </p>
        </div>
      </div>

      <Link
        href="/customer/profile"
        className="inline-flex items-center gap-1.5 rounded-xl border border-foreground/15 px-4 py-2 text-sm font-medium text-foreground/75 transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Pencil size={15} />
        ویرایش پروفایل
      </Link>
    </div>
  );
}