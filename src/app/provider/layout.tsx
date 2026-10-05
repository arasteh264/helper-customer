import { Suspense, type ReactNode } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/src/auth";
import { PanelShell } from "@/src/components/layout/panel-shell";
import { PageLoadingSkeleton } from "@/src/components/shared/page-loading-skeleton";
import { providerApi } from "@/src/features/provider/api/provider.api";
import { providerNav } from "@/src/features/provider/components/provider-nav-data";

type ProviderLayoutProps = {
  children: ReactNode;
};

export default async function ProviderLayout({
  children,
}: ProviderLayoutProps) {
  const session = await auth();
  if (!session?.accessToken) redirect("/login");

  return (
    <Suspense
      fallback={
        <PanelShell
          subtitle="پنل ارائه‌دهنده"
          nav={providerNav}
          notificationRole="PROVIDER"
          contentWidth="wide"
        >
          <PageLoadingSkeleton variant="panel" />
        </PanelShell>
      }
    >
      <ProviderPanel accessToken={session.accessToken}>
        {children}
      </ProviderPanel>
    </Suspense>
  );
}

async function ProviderPanel({
  accessToken,
  children,
}: ProviderLayoutProps & { accessToken: string }) {
  const provider = await providerApi.getProfile(accessToken);

  return (
    <PanelShell
      subtitle="پنل ارائه‌دهنده"
      nav={providerNav}
      notificationRole="PROVIDER"
      contentWidth="wide"
      user={{
        name: provider.user.name,
        subtitle: provider.user.phone,
        avatar: provider.avatarUrl,
      }}
    >
      {children}
    </PanelShell>
  );
}
