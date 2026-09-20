import { apiClient } from "@/src/lib/api/client";
import type { VerifyLoginOtpInput, VerifyLoginOtpResponse } from "../types/auth.types";

export async function verifyLoginOtp(
  input: VerifyLoginOtpInput
): Promise<VerifyLoginOtpResponse> {
  const { data } = await apiClient.post<VerifyLoginOtpResponse>(
    "/auth/login/verify-otp",
    input
  );
  return data;
}