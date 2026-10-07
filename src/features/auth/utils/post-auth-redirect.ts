import { getSession } from "next-auth/react";

export async function getPostAuthRedirectPath(): Promise<string> {
  const session = await getSession();
  const role = session?.user?.role?.toUpperCase();
  const callbackUrl =
    typeof window === "undefined"
      ? null
      : new URLSearchParams(window.location.search).get("callbackUrl");

  if (callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//")) {
    return callbackUrl;
  }

  if (role === "PROVIDER") return "/provider";

  return "/";
}
