"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { toast } from "sonner";

import { getPostAuthRedirectPath } from "../utils/post-auth-redirect";
import { setPortalMode, type PortalMode } from "../utils/portal-mode";

export function usePostAuthNavigation() {
  const router = useRouter();
  const [portalChooserOpen, setPortalChooserOpen] = useState(false);

  const continueAfterLogin = async () => {
    const session = await getSession();
    if (!session) {
      toast.error("ورود انجام شد اما نشست کاربری دریافت نشد؛ دوباره تلاش کنید.");
      return;
    }

    if (session.user.role?.toUpperCase() === "PROVIDER") {
      setPortalChooserOpen(true);
      return;
    }

    router.push(await getPostAuthRedirectPath());
    router.refresh();
  };

  const choosePortal = async (mode: PortalMode) => {
    setPortalMode(mode);
    setPortalChooserOpen(false);
    router.push(await getPostAuthRedirectPath(mode));
    router.refresh();
  };

  return { portalChooserOpen, continueAfterLogin, choosePortal };
}
