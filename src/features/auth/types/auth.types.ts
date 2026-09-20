
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
  identifier: string;
}

export interface VerifyResetOtpInput {
  identifier: string;
  otp: string;
}

export interface ResetPasswordInput {
  identifier: string;
  otp: string;
  password: string;
  confirmPassword: string;
}


export type UserRole = "customer" | "provider" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}


export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
}

export interface RegisterResponse {
  user: AuthUser;
}

export interface RequestOtpResponse {
  expiresInSeconds: number;
}

export interface VerifyLoginOtpResponse {
  user: AuthUser;
  accessToken: string;
}

export interface ForgotPasswordResponse {
  expiresInSeconds: number;
}

export interface VerifyResetOtpResponse {
  resetToken: string;
}

export interface ResetPasswordResponse {
  success: true;
}