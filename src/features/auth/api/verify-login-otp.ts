import { RequestLoginOtpInput } from "@/src/app/(auth)/reset-password/page";
import { apiClient } from "@/src/lib/api/client";


export async function requestLoginOtp(
  input: RequestLoginOtpInput
) {
  const { data } = await apiClient.post(
    "/auth/login/request-otp",
    input
  );

  return data;
}