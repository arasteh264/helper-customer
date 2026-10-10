import Link from "next/link";
import { HandHelping } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="هلپر، صفحه‌ی اصلی"
      className={`inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${className}`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-cyan-700 text-primary-foreground shadow-lg shadow-primary/25">
        <HandHelping size={20} strokeWidth={2.4} aria-hidden="true" />
      </span>
      <span className="text-lg font-bold tracking-tight text-foreground">
        Helper
      </span>
    </Link>
  );
}