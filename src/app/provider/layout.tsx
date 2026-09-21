import type { ReactNode } from "react";



import { ProviderShell } from "@/src/features/provider/components/provider-shell";
import { provider } from "@/src/features/provider/types/data";

export default function ProviderLayout({ children }: { children: ReactNode }) {
  return (
    <ProviderShell
      provider={{
        id: provider.id,
        name: provider.fullName,
        headline: provider.headline,
        avatar: provider.avatar,
      }}
    >
      {children}
    </ProviderShell>
  );
}