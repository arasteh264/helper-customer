import { getSession } from "next-auth/react";
import type { PortalMode } from "./portal-mode";

export async function getPostAuthRedirectPath(
  portalMode?: PortalMode,
): Promise<string> {
  const session = await getSession();
  const role = session?.user?.role?.toUpperCase();
  const callbackUrl =
    typeof window === "undefined"
      ? null
      : new URLSearchParams(window.location.search).get("callbackUrl");

  const isLocalCallback = Boolean(
    callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//"),
  );
  const isProviderCallback =
    Boolean(isLocalCallback) &&
    callbackUrl !== null &&
    (callbackUrl === "/provider" || callbackUrl.startsWith("/provider/"));

  if (portalMode === "CUSTOMER") {
    return isLocalCallback && !isProviderCallback && callbackUrl
      ? callbackUrl
      : "/customer";
  }
  if (portalMode === "PROVIDER") {
    return isProviderCallback && callbackUrl ? callbackUrl : "/provider";
  }

  if (isLocalCallback && callbackUrl) {
    return callbackUrl;
  }

  if (role === "PROVIDER") return "/provider";

  return "/";
}
