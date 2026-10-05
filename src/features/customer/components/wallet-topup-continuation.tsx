"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, CircleAlert } from "lucide-react";
import { formatMoney } from "@/src/utils/format";

const RETURN_TO_KEY = "helper-wallet-return-to";

function safeRequestPath(value?: string) {
  if (!value) return null;

  try {
    const url = new URL(value, window.location.origin);
    if (
      url.origin !== window.location.origin ||
      !/^\/customer\/requests\/[\w-]+$/.test(url.pathname)
    ) {
      return null;
    }
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

export function WalletTopupContinuation({
  topupStatus,
  returnTo,
  requiredAmountToman,
}: {
  topupStatus: "needed" | "success" | "failed" | "pending";
  returnTo?: string;
  requiredAmountToman: number;
}) {
  const [destination, setDestination] = useState<string | null>(null);

  useEffect(() => {
    const supplied = safeRequestPath(returnTo);
    if (supplied) window.sessionStorage.setItem(RETURN_TO_KEY, supplied);

    const stored = window.sessionStorage.getItem(RETURN_TO_KEY);
    const safeStored = safeRequestPath(stored ?? undefined);
    if (!safeStored) {
      window.sessionStorage.removeItem(RETURN_TO_KEY);
      setDestination(null);
      return;
    }
    setDestination(safeStored);
  }, [returnTo]);

  if (!destination) return null;

  const label =
    topupStatus === "success"
      ? "بازگشت و پرداخت از کیف پول"
      : "بازگشت به درخواست";

  return (
    <div className="mt-4 flex flex-col gap-3 rounded-lg border border-primary/15 bg-primary/[0.04] p-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="flex items-start gap-2 text-xs leading-5 text-foreground/65">
        <CircleAlert size={15} className="mt-0.5 shrink-0 text-primary" />
        {topupStatus === "success"
          ? "شارژ ثبت شد؛ برای نهایی‌کردن پرداخت به درخواست برگردید."
          : requiredAmountToman > 0
            ? `برای پرداخت ${formatMoney(requiredAmountToman)} به درخواست برگردید.`
            : "بعد از بررسی وضعیت شارژ می‌توانید به درخواست برگردید."}
      </p>
      <Link
        href={destination}
        onClick={() => window.sessionStorage.removeItem(RETURN_TO_KEY)}
        className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground"
      >
        {label}
        <ArrowRight size={15} className="rotate-180" />
      </Link>
    </div>
  );
}
