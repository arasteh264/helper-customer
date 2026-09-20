export enum ApiErrorCode {
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  DUPLICATE_EMAIL = "DUPLICATE_EMAIL",
  DUPLICATE_PHONE = "DUPLICATE_PHONE",
  INVALID_OTP = "INVALID_OTP",
  EXPIRED_OTP = "EXPIRED_OTP",
  TOO_MANY_REQUESTS = "TOO_MANY_REQUESTS",
  NETWORK_ERROR = "NETWORK_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status?: number;

  constructor(code: ApiErrorCode, message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

export const API_ERROR_MESSAGES: Record<ApiErrorCode, string> = {
  [ApiErrorCode.INVALID_CREDENTIALS]: "موبایل/ایمیل یا رمز عبور اشتباه است",
  [ApiErrorCode.USER_NOT_FOUND]: "کاربری با این مشخصات یافت نشد",
  [ApiErrorCode.DUPLICATE_EMAIL]: "این ایمیل قبلاً ثبت شده است",
  [ApiErrorCode.DUPLICATE_PHONE]: "این شماره موبایل قبلاً ثبت شده است",
  [ApiErrorCode.INVALID_OTP]: "کد تأیید نادرست است",
  [ApiErrorCode.EXPIRED_OTP]: "کد تأیید منقضی شده است",
  [ApiErrorCode.TOO_MANY_REQUESTS]: "تعداد درخواست‌ها بیش از حد مجاز است",
  [ApiErrorCode.NETWORK_ERROR]: "خطا در برقراری ارتباط با سرور",
  [ApiErrorCode.UNKNOWN_ERROR]: "خطای غیرمنتظره‌ای رخ داد",
};


function mapStatusToCode(status?: number): ApiErrorCode {
  switch (status) {
    case 401:
      return ApiErrorCode.INVALID_CREDENTIALS;
    case 404:
      return ApiErrorCode.USER_NOT_FOUND;
    case 409:
      return ApiErrorCode.DUPLICATE_EMAIL;
    case 429:
      return ApiErrorCode.TOO_MANY_REQUESTS;
    default:
      return ApiErrorCode.UNKNOWN_ERROR;
  }
}

export function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error
  ) {
    const axiosErr = error as import("axios").AxiosError<{
      code?: string;
      message?: string;
    }>;

    if (!axiosErr.response) {
      return new ApiError(ApiErrorCode.NETWORK_ERROR, "Network error");
    }

    const backendCode = axiosErr.response.data?.code as
      | ApiErrorCode
      | undefined;
    const code =
      backendCode && backendCode in ApiErrorCode
        ? backendCode
        : mapStatusToCode(axiosErr.response.status);

    return new ApiError(
      code,
      axiosErr.response.data?.message ?? "Unknown error",
      axiosErr.response.status
    );
  }

  return new ApiError(ApiErrorCode.UNKNOWN_ERROR, "Unknown error");
}