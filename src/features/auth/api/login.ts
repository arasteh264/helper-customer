import { apiClient } from "@/src/lib/api/client";
import type { LoginInput, LoginResponse } from "../types/auth.types";

export async function login(input: LoginInput): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", input);
  return data;
}