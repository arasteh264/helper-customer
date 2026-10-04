import { apiClient } from "@/src/lib/api/client";
import type { RegisterInput, RegisterResponse } from "../types/auth.types";

export async function register(
  input: RegisterInput,
): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>("/users", input);
  return data;
}

export async function resendRegistrationOtp(phone: string): Promise<void> {
  await apiClient.post("/users/resend-otp", { phone });
}
