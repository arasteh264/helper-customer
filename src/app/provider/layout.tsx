import type { ReactNode } from "react";

import { PanelShell } from "@/src/components/layout/panel-shell";

import { provider } from "@/src/features/provider/types/data";
import { providerNav } from "@/src/features/provider/components/provider-nav-data";

export default function ProviderLayout({ children }: { children: ReactNode }) {
  return (
    <PanelShell
      subtitle="پنل ارائه‌دهنده"
      nav={providerNav}
      user={{ name: provider.fullName, subtitle: provider.headline, avatar: provider.avatar }}
    >
      {children}
    </PanelShell>
  );
}