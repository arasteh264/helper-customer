import { getSession } from "next-auth/react";

export async function getPostAuthRedirectPath(): Promise<string> {
  const session = await getSession();
  const role = session?.user?.role?.toUpperCase();

  if (role === "PROVIDER") return "/provider";
  if (role === "CUSTOMER") return "/customer";

  return "/";
}
