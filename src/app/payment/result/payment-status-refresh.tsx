"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

export function PaymentStatusRefresh() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => router.refresh())}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-foreground/15 px-5 text-sm font-medium text-foreground/75 transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-60"
    >
      {isPending ? <LoaderCircle size={16} className="animate-spin" /> : null}
      بررسی دوباره‌ی وضعیت
    </button>
  );
}
