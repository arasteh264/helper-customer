import { apiClient } from "@/src/lib/api/client";
import type { ForgotPasswordInput, ForgotPasswordResponse } from "../types/auth.types";

export async function forgotPassword(
  input: ForgotPasswordInput
): Promise<ForgotPasswordResponse> {
  const { data } = await apiClient.post<ForgotPasswordResponse>(
    "/auth/password/forgot",
    input
  );
  return data;
}