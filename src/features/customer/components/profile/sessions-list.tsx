"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Laptop, Loader2, Smartphone } from "lucide-react";



import { formatDateTime } from "@/src/utils/format";
import { SectionCard } from "@/src/components/shared/section-card";
import { Session } from "../../types/customer.types";
import { customerApi } from "../../api/customer.api";

export function SessionsList({ initial }: { initial: Session[] }) {
  const [sessions, setSessions] = useState(initial);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const revoke = async (id: string) => {
    setRevokingId(id);
    try {
      await customerApi.revokeSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      toast.success("نشست موردنظر خارج شد");
    } catch {
      toast.error("این کار انجام نشد. دوباره تلاش کنید.");
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <SectionCard title="دستگاه‌های متصل" description="جاهایی که با حساب شما وارد شده‌اند.">
      <ul className="divide-y divide-foreground/[0.07]">
        {sessions.map((s) => {
          const Icon = s.device.toLowerCase().includes("آیفون") || s.device.toLowerCase().includes("اندروید") ? Smartphone : Laptop;
          return (
            <li key={s.id} className="flex items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground/[0.05] text-foreground/60">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                    {s.device}
                    {s.current && (
                      <span className="rounded-full bg-green-600/10 px-2 py-0.5 text-[11px] font-medium text-green-700">
                        این دستگاه
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-foreground/50">
                    {s.location} · {formatDateTime(s.lastActive)}
                  </p>
                </div>
              </div>

              {!s.current && (
                <button
                  type="button"
                  onClick={() => revoke(s.id)}
                  disabled={revokingId === s.id}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-foreground/15 px-3 py-1.5 text-xs font-medium text-foreground/65 transition-colors hover:border-destructive/40 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {revokingId === s.id && <Loader2 size={13} className="animate-spin" />}
                  خروج
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </SectionCard>
  );
}