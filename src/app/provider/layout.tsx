import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/src/auth";
import { PanelShell } from "@/src/components/layout/panel-shell";
import { providerApi } from "@/src/features/provider/api/provider.api";
import { providerNav } from "@/src/features/provider/components/provider-nav-data";

export default async function ProviderLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  if (!session?.accessToken) redirect("/login");

  const provider = await providerApi.getProfile(session.accessToken);

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
