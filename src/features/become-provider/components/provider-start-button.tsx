"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { ButtonLink } from "@/src/components/shared/button-link";
import { normalizeError } from "@/src/lib/api/error";
import { providerApi } from "@/src/features/provider/api/provider.api";

export function ProviderStartButton({
  authenticated,
  className = "",
}: {
  authenticated: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  if (!authenticated) {
    return (
      <ButtonLink
        href="/register?role=specialist"
        variant="light"
        size="lg"
        className={className}
      >
        شروع ثبت‌نام
        <ArrowLeft size={18} aria-hidden="true" />
      </ButtonLink>
    );
  }

  const startProviderProfile = async () => {
    if (busy) return;
    setBusy(true);

    try {
      const session = await getSession();
      if (!session?.accessToken) {
        toast.error("نشست شما منقضی شده است. دوباره وارد شوید.");
        router.push("/login?callbackUrl=%2Fbecome-provider");
        return;
      }

      await providerApi.createProfile(undefined, session.accessToken);
      toast.success("پروفایل متخصص برای همین حساب ساخته شد.");
      router.push("/provider/profile");
      router.refresh();
    } catch (error) {
      toast.error(
        normalizeError(error).message ||
          "ساخت پروفایل متخصص انجام نشد. دوباره تلاش کنید.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={startProviderProfile}
      disabled={busy}
      className={[
        "inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-primary transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary disabled:cursor-not-allowed disabled:opacity-70 sm:text-base",
        className,
      ].join(" ")}
    >
      {busy ? <Loader2 size={18} className="animate-spin" /> : null}
      ساخت پروفایل متخصص با همین حساب
      {!busy ? <ArrowLeft size={18} aria-hidden="true" /> : null}
    </button>
  );
}
