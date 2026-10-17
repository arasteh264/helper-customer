"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/src/components/ui/button";
import { ApiError } from "@/src/lib/api/error";
import { requestApi } from "@/src/features/request/api/request.api";

export function RepeatRequestButton({
  requestId,
  accessToken,
}: {
  requestId: string;
  accessToken: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const repeatRequest = async () => {
    setLoading(true);
    try {
      const result = await requestApi.repeatCancelledRequest(
        requestId,
        accessToken,
      );
      toast.success(result.message);
      router.push(`/customer/requests/${encodeURIComponent(result.id)}`);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "ثبت دوباره‌ی درخواست انجام نشد؛ دوباره تلاش کنید.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button type="button" onClick={repeatRequest} disabled={loading}>
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <RotateCcw size={16} />
      )}
      ثبت دوباره‌ی درخواست مشابه
    </Button>
  );
}
