import Link from "next/link";
import { AlertTriangle, ArrowLeft, Info } from "lucide-react";

import type { PendingAction } from "../utils/pending-actions.tsx";

const ICONS = { warning: AlertTriangle, info: Info } as const;

export function PendingActionsList({ actions }: { actions: PendingAction[] }) {
  if (actions.length === 0) return null;

  return (
    <ul className="space-y-3">
      {actions.map((action) => {
        const Icon = ICONS[action.tone as keyof typeof ICONS] ?? Info;
        return (
          <li key={action.id}>
            <Link
              href={action.href}
              className="group flex items-center gap-4 rounded-2xl border border-amber-500/25 bg-amber-500/[0.06] p-4 transition-colors hover:border-amber-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700">
                <Icon size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">
                  {action.title}
                </p>
                <p className="mt-0.5 text-xs leading-6 text-foreground/60">
                  {action.description}
                </p>
              </div>
              <span className="hidden shrink-0 items-center gap-1 text-sm font-medium text-primary group-hover:underline sm:inline-flex">
                {action.cta}
                <ArrowLeft size={15} className="rtl:rotate-180" />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
