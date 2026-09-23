"use client";

import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/src/components/ui/button";
import { Modal } from "@/src/components/shared/modal";
import { customerApi } from "../../api/customer.api";

const CONFIRM_TEXT = "حذف حساب";

export function DeleteAccountSection() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await customerApi.deleteAccount();
      toast.success("حساب شما با موفقیت حذف شد");
      window.location.href = "/"; // یا مسیر لاگ‌اوت/صفحه‌ی اصلی پروژه‌تون
    } catch {
      toast.error("حذف حساب انجام نشد. دوباره تلاش کنید.");
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-destructive/25 bg-destructive/[0.04] p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
          <AlertTriangle size={19} />
        </span>
        <div>
          <h2 className="text-base font-semibold text-foreground">حذف حساب کاربری</h2>
          <p className="mt-1 text-sm leading-6 text-foreground/60">
            با حذف حساب، تمام درخواست‌ها، آدرس‌ها و موجودی کیف پول شما برای همیشه پاک می‌شود. این کار قابل بازگشت نیست.
          </p>
        </div>
      </div>

      <Button type="button" variant="outline" onClick={() => setOpen(true)} className="mt-4 border-destructive/30 text-destructive hover:bg-destructive/5">
        حذف حساب کاربری
      </Button>

      <Modal
        open={open}
        onClose={() => {
          if (loading) return;
          setOpen(false);
          setValue("");
        }}
        title="حذف حساب کاربری"
        description="این کار قابل بازگشت نیست و تمام اطلاعات شما پاک می‌شود."
        size="sm"
      >
        <p className="text-sm text-foreground/70">
          برای تأیید، عبارت زیر را تایپ کنید:{" "}
          <span className="font-semibold text-foreground">{CONFIRM_TEXT}</span>
        </p>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={loading}
          className="mt-3 h-11 w-full rounded-xl border border-foreground/15 bg-background px-3.5 text-sm outline-none focus:border-destructive/50 focus:ring-4 focus:ring-destructive/10"
        />
        <div className="mt-5 flex gap-3">
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading} className="flex-1">
            انصراف
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={value !== CONFIRM_TEXT || loading}
            className="flex-1 gap-1.5 bg-destructive text-white hover:bg-destructive/90"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            حذف همیشگی
          </Button>
        </div>
      </Modal>
    </div>
  );
}