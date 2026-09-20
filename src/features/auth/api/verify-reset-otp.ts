import { apiClient } from "@/src/lib/api/client";
import type { VerifyResetOtpInput, VerifyResetOtpResponse } from "../types/auth.types";

export async function verifyResetOtp(
  input: VerifyResetOtpInput
): Promise<VerifyResetOtpResponse> {
  const { data } = await apiClient.post<VerifyResetOtpResponse>(
    "/auth/password/verify-otp",
    input
  );
  return data;
}