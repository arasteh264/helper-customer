import { cache } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/src/auth";
import { ApiError } from "@/src/lib/api/error"; 
import { customerApi } from "./customer.api";

export const getCustomer = cache(async () => {
  const session = await auth();
  if (!session?.accessToken) redirect("/login");

  try {
    return await customerApi.getProfile(session.accessToken);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect("/login?expired=1");
    }
    throw error;
  }
});