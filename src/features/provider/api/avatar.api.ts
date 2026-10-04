import { apiClient } from "@/src/lib/api/client";

const AVATAR_URL = "/providers/profile/avatar";

const authHeaders = (accessToken?: string) =>
  accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

export const avatarApi = {
  upload: (file: File, accessToken?: string) => {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient(AVATAR_URL, {
      method: "POST",
      data: formData,
      headers: authHeaders(accessToken),
    });
  },

  remove: (accessToken?: string) =>
    apiClient(AVATAR_URL, {
      method: "DELETE",
      headers: authHeaders(accessToken),
    }),
};
