import type { ReactNode } from "react";

export type BadgeTone = "success" | "warning" | "danger" | "info" | "neutral";

const TONES: Record<BadgeTone, string> = {
  success: "bg-green-600/10 text-green-700",
  warning: "bg-amber-500/15 text-amber-700",
  danger: "bg-destructive/10 text-destructive",
  info: "bg-sky-500/10 text-sky-700",
  neutral: "bg-foreground/[0.06] text-foreground/60",
};

export function StatusBadge({
  tone = "neutral",
  children,
  className = "",
}: {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}