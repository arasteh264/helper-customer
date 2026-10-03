import type { ReactNode } from "react";

import { PanelShell } from "@/src/components/layout/panel-shell";
import { customerNav } from "@/src/features/customer/components/customer-nav-data";
import { getCustomer } from "@/src/features/customer/api/get-customer";

export default async function CustomerLayout({
  children,
}: {
  children: ReactNode;
}) {
  const customer = await getCustomer();

  const nav = customerNav.map((item) =>
    item.href === "/customer/requests"
      ? { ...item, badge: customer.activeRequests ?? 0 }
      : item,
  );

  return (
    <PanelShell
      subtitle="پنل مشتری"
      nav={nav}
      notificationRole="CUSTOMER"
      user={{
        name: customer.name,
        subtitle: customer.phone || customer.email,
        avatar: customer.avatar,
      }}
      extraLink={{ label: "درخواست خدمات جدید", href: "/request" }}
    >
      {children}
    </PanelShell>
  );
}
