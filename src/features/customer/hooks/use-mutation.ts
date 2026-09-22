"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

type MutationResult<R> = { ok: true; data: R } | { ok: false; error: unknown };

interface Messages {
  success?: string;
  error?: string;
}

/**
 * هوک عمومی برای درخواست‌های تغییر (POST / PATCH / DELETE):
 * وضعیت loading، toast موفقیت و خطا را مدیریت می‌کند.
 */
export function useMutation<A extends unknown[], R>(
  fn: (...args: A) => Promise<R>,
  messages: Messages = {}
) {
  const [isPending, setIsPending] = useState(false);
  const { success, error } = messages;

  const run = useCallback(
    async (...args: A): Promise<MutationResult<R>> => {
      setIsPending(true);
      try {
        const data = await fn(...args);
        if (success) toast.success(success);
        return { ok: true, data };
      } catch (err) {
        toast.error(error ?? "خطایی رخ داد. لطفاً دوباره تلاش کنید.");
        return { ok: false, error: err };
      } finally {
        setIsPending(false);
      }
    },
    [fn, success, error]
  );

  return { run, isPending };
}