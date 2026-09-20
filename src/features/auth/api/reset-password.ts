import { apiClient } from "@/src/lib/api/client";
import type { ResetPasswordInput, ResetPasswordResponse } from "../types/auth.types";

export async function resetPassword(
  input: ResetPasswordInput
): Promise<ResetPasswordResponse> {
  const { data } = await apiClient.post<ResetPasswordResponse>(
    "/auth/password/reset",
    input
  );
  return data;
}