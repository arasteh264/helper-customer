
import { apiClient } from "@/src/lib/api/client";
import { normalizeError } from "@/src/lib/api/error";

export async function requestOtp(phone: string): Promise<void> {
  try {
    await apiClient.post("/auth/otp/request", { phone });
  } catch (err) {
    throw normalizeError(err);
  }
}