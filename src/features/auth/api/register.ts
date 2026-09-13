import { RegisterInput } from "@/src/app/(auth)/reset-password/page";
import { apiClient } from "@/src/lib/api/client";


export async function register(input: RegisterInput) {
  const { data } = await apiClient.post("/auth/register", input);

  return data;
}