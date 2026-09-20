import { apiClient } from "@/src/lib/api/client";
import type { RequestLoginOtpInput, RequestOtpResponse } from "../types/auth.types";

export async function requestLoginOtp(
  input: RequestLoginOtpInput
): Promise<RequestOtpResponse> {
  const { data } = await apiClient.post<RequestOtpResponse>(
    "/auth/otp/request",
    input
  );
  debugger
  return data;
}