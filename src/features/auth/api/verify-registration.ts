import { apiClient } from "@/src/lib/api/client";
import {
  API_ERROR_MESSAGES,
  ApiError,
  ApiErrorCode,
  normalizeError,
} from "@/src/lib/api/error";

export async function verifyRegistration(phone: string, code: string) {
  try {
    const { data } = await apiClient.post("/users/verify-otp", { phone, code });
    return data;
  } catch (err) {
    const apiError = normalizeError(err);

    if (apiError.code === ApiErrorCode.UNAUTHORIZED) {
      throw new ApiError(
        ApiErrorCode.INVALID_OTP,
        API_ERROR_MESSAGES[ApiErrorCode.INVALID_OTP],
        apiError.status,
      );
    }
    throw apiError;
  }
}