import { LoginInput } from "@/src/app/(auth)/reset-password/page";
import { apiClient } from "@/src/lib/api/client";


export async function login(input: LoginInput) {
  const { data } = await apiClient.post("/auth/login", input);

  return data;
}