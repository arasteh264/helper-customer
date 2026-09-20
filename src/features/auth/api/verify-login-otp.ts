import { apiClient } from "@/src/lib/api/client";
import type { VerifyLoginOtpInput, VerifyLoginOtpResponse } from "../types/auth.types";

export async function verifyLoginOtp(
  input: VerifyLoginOtpInput
): Promise<VerifyLoginOtpResponse> {
  const { data } = await apiClient.post<VerifyLoginOtpResponse>(
    "/auth/otp/verify",
    input
  );
  return data;
}