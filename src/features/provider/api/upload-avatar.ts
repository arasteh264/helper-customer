// features/profile/api/upload-avatar.ts
import { apiClient } from "@/src/lib/api/client";

export async function uploadAvatar(file: File): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);

  await apiClient.post("/providers/profile/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function deleteAvatar(): Promise<void> {
  await apiClient.delete("/providers/profile/avatar");
}