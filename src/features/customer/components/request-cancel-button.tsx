"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { customerApi } from "../api/customer.api";

export function RequestCancelButton({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const cancel = async () => {
    if (!window.confirm("این درخواست لغو شود؟ این کار قابل بازگشت نیست.")) return;
    setLoading(true);
    try {
      await customerApi.cancelRequest(requestId);
      toast.success("درخواست لغو شد");
      router.refresh();
    } catch {
      toast.error("لغو درخواست انجام نشد. دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button type="button" variant="outline" onClick={cancel} disabled={loading} className="gap-1.5">
      {loading ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
      لغو درخواست
    </Button>
  );
}