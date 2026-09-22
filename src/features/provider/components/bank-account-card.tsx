import { BadgeCheck, Landmark, LifeBuoy } from "lucide-react";


import { maskSheba } from "../utils/format";

import { BankAccount } from "../types/types";
import { SectionCard } from "@/src/components/shared/section-card";
import { StatusBadge } from "@/src/components/shared/status-badge";

export function BankAccountCard({ bank }: { bank: BankAccount }) {
  return (
    <SectionCard title="حساب بانکی" description="مقصد واریز برداشت‌های شما">
      <div className="flex items-center gap-3 rounded-xl border border-foreground/10 bg-background p-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Landmark size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-foreground">{bank.bankName}</p>
            {bank.verified && (
              <StatusBadge tone="success">
                <BadgeCheck size={13} />
                تأییدشده
              </StatusBadge>
            )}
          </div>
          <p className="mt-0.5 text-xs text-foreground/55">{bank.holder}</p>
          <p dir="ltr" className="mt-1 truncate text-start text-xs tracking-wide text-foreground/70">
            {maskSheba(bank.sheba)}
          </p>
        </div>
      </div>

      <p className="mt-4 flex items-start gap-2 text-xs leading-6 text-foreground/50">
        <LifeBuoy size={16} className="mt-0.5 shrink-0" />
        برای امنیت بیشتر، تغییر شماره‌ی شبا فقط از طریق پشتیبانی انجام می‌شود.
      </p>
    </SectionCard>
  );
}