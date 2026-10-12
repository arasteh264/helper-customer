import { Suspense, type ReactNode } from "react";
import { redirect } from "next/navigation";

import { PanelShell } from "@/src/components/layout/panel-shell";
import { PageLoadingSkeleton } from "@/src/components/shared/page-loading-skeleton";
import { customerNav } from "@/src/features/customer/components/customer-nav-data";
import { getCustomer } from "@/src/features/customer/api/get-customer";
import { auth } from "@/src/auth";

type CustomerLayoutProps = {
  children: ReactNode;
};

export default async function CustomerLayout({
  children,
}: CustomerLayoutProps) {
  const session = await auth();
  if (!session?.accessToken) redirect("/login");

  return (
    <Suspense
      fallback={
        <PanelShell
          subtitle="پنل مشتری"
          nav={customerNav}
          notificationRole="CUSTOMER"
        >
          <PageLoadingSkeleton variant="panel" />
        </PanelShell>
      }
    >
      <CustomerPanel>{children}</CustomerPanel>
    </Suspense>
  );
}

async function CustomerPanel({ children }: CustomerLayoutProps) {
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
