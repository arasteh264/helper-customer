import { Suspense, type ReactNode } from "react";
import { redirect } from "next/navigation";

import { PanelShell } from "@/src/components/layout/panel-shell";
import { PageLoadingSkeleton } from "@/src/components/shared/page-loading-skeleton";
import { customerNav } from "@/src/features/customer/components/customer-nav-data";
import { getCustomer } from "@/src/features/customer/api/get-customer";
import { auth } from "@/src/auth";
import { providerApi } from "@/src/features/provider/api/provider.api";
import { providerNav } from "@/src/features/provider/components/provider-nav-data";

type CustomerLayoutProps = {
  children: ReactNode;
};

export default async function CustomerLayout({
  children,
}: CustomerLayoutProps) {
  const session = await auth();
  if (!session?.accessToken) redirect("/login");

  const isProvider = session.user.role?.toUpperCase() === "PROVIDER";

  return (
    <Suspense
      fallback={
        <PanelShell
          subtitle={isProvider ? "خرید خدمات با حساب متخصص" : "پنل مشتری"}
          nav={isProvider ? providerNav : customerNav}
          notificationRole={isProvider ? "PROVIDER" : "CUSTOMER"}
          contentWidth={isProvider ? "wide" : "default"}
        >
          <PageLoadingSkeleton variant="panel" />
        </PanelShell>
      }
    >
      {isProvider ? (
        <ProviderBuyerPanel accessToken={session.accessToken}>
          {children}
        </ProviderBuyerPanel>
      ) : (
        <CustomerPanel>{children}</CustomerPanel>
      )}
    </Suspense>
  );
}

async function ProviderBuyerPanel({
  accessToken,
  children,
}: CustomerLayoutProps & { accessToken: string }) {
  const provider = await providerApi.getProfile(accessToken);

  return (
    <PanelShell
      subtitle="خرید خدمات با حساب متخصص"
      nav={providerNav}
      notificationRole="PROVIDER"
      contentWidth="wide"
      user={{
        name: provider.user.name,
        subtitle: provider.user.phone,
        avatar: provider.avatarUrl,
      }}
      extraLink={{ label: "درخواست خدمات جدید", href: "/request" }}
    >
      {children}
    </PanelShell>
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
