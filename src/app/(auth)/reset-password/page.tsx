export interface LoginInput {
  identifier: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export interface RequestLoginOtpInput {
  phone: string;
}

export interface VerifyLoginOtpInput {
  phone: string;
  otp: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface VerifyResetOtpInput {
  email: string;
  otp: string;
}

export interface ResetPasswordInput {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}