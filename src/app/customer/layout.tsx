import type { ReactNode } from "react";

import { PanelShell } from "@/src/components/layout/panel-shell";
import { customerNav } from "@/src/features/customer/components/customer-nav-data";
import { customer } from "@/src/features/customer/api/mock-data";

export default function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <PanelShell
      subtitle="پنل مشتری"
      nav={customerNav}
      user={{ name: customer.fullName, subtitle: customer.phone, avatar: customer.avatar }}
      extraLink={{ label: "درخواست خدمات جدید", href: "/request" }}
    >
      {children}
    </PanelShell>
  );
}