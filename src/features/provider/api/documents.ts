import { apiClient } from "@/src/lib/api/client";

export interface VerificationDocResponse {
  type: string;
  status: "verified" | "pending" | "rejected";
  note?: string;
  url?: string;
}

const authHeaders = (accessToken?: string) =>
  accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;

export async function getVerificationDocuments(
  accessToken?: string,
): Promise<VerificationDocResponse[]> {
  const { data } = await apiClient.get<VerificationDocResponse[]>(
    "/providers/profile/documents",
    { headers: authHeaders(accessToken) },
  );
  return data;
}

export async function uploadVerificationDocument(
  type: string,
  file: File,
  accessToken?: string,
): Promise<VerificationDocResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  const { data } = await apiClient.post<VerificationDocResponse>(
    "/providers/profile/documents",
    formData,
    {
      headers: {
        "Content-Type": undefined,
        ...(authHeaders(accessToken) ?? {}),
      },
    },
  );
  return data;
}