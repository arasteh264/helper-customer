export enum ApiErrorCode {
  UNAUTHORIZED = "UNAUTHORIZED",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  DUPLICATE_EMAIL = "DUPLICATE_EMAIL",
  DUPLICATE_PHONE = "DUPLICATE_PHONE",
  CONFLICT = "CONFLICT",
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
  [ApiErrorCode.UNAUTHORIZED]: "نشست شما منقضی شده است؛ دوباره وارد شوید",
  [ApiErrorCode.INVALID_CREDENTIALS]: "موبایل/ایمیل یا رمز عبور اشتباه است",
  [ApiErrorCode.USER_NOT_FOUND]: "کاربری با این مشخصات یافت نشد",
  [ApiErrorCode.DUPLICATE_EMAIL]: "این ایمیل قبلاً ثبت شده است",
  [ApiErrorCode.DUPLICATE_PHONE]: "این شماره موبایل قبلاً ثبت شده است",
  [ApiErrorCode.CONFLICT]: "این اطلاعات قبلاً ثبت شده است",
  [ApiErrorCode.INVALID_OTP]: "کد تأیید نادرست یا منقضی شده است",
  [ApiErrorCode.EXPIRED_OTP]: "اعتبار کد شما به پایان رسید؛ کد جدید دریافت کنید",
  [ApiErrorCode.TOO_MANY_REQUESTS]: "تعداد درخواست‌ها بیش از حد مجاز است",
  [ApiErrorCode.NETWORK_ERROR]: "خطا در برقراری ارتباط با سرور",
  [ApiErrorCode.UNKNOWN_ERROR]: "خطای غیرمنتظره‌ای رخ داد",
};

function isApiErrorCode(value: unknown): value is ApiErrorCode {
  return typeof value === "string" && value in ApiErrorCode;
}

function inferConflictCode(message?: string): ApiErrorCode {
  const m = (message ?? "").toLowerCase();
  if (m.includes("phone")) return ApiErrorCode.DUPLICATE_PHONE;
  if (m.includes("email")) return ApiErrorCode.DUPLICATE_EMAIL;
  return ApiErrorCode.CONFLICT;
}

function mapStatusToCode(status?: number, message?: string): ApiErrorCode {
  switch (status) {
    case 401:
      return ApiErrorCode.UNAUTHORIZED;
    case 404:
      return ApiErrorCode.USER_NOT_FOUND;
    case 409:
      return inferConflictCode(message);
    case 429:
      return ApiErrorCode.TOO_MANY_REQUESTS;
    default:
      return ApiErrorCode.UNKNOWN_ERROR;
  }
}

export function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (typeof error === "object" && error !== null && "isAxiosError" in error) {
    const axiosErr = error as import("axios").AxiosError<{
      code?: string;
      message?: string | string[];
    }>;

    if (!axiosErr.response) {
      return new ApiError(
        ApiErrorCode.NETWORK_ERROR,
        API_ERROR_MESSAGES[ApiErrorCode.NETWORK_ERROR],
      );
    }

    const { status, data } = axiosErr.response;
    const rawMessage = Array.isArray(data?.message)
      ? data.message.join(" ")
      : data?.message;

    const code = isApiErrorCode(data?.code)
      ? data.code
      : mapStatusToCode(status, rawMessage);

    return new ApiError(code, API_ERROR_MESSAGES[code], status);
  }

  return new ApiError(
    ApiErrorCode.UNKNOWN_ERROR,
    API_ERROR_MESSAGES[ApiErrorCode.UNKNOWN_ERROR],
  );
}