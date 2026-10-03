import { apiClient } from "@/src/lib/api/client";
import type { Job } from "../types/types";

const authHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
});

export const providerJobsApi = {
  async list(accessToken: string) {
    const { data } = await apiClient<Job[]>("/providers/jobs", {
      method: "GET",
      headers: authHeaders(accessToken),
    });
    return data;
  },

  accept(requestId: string, proposedPriceToman: number, accessToken: string) {
    return apiClient(`/providers/jobs/${requestId}/accept`, {
      method: "POST",
      headers: authHeaders(accessToken),
      data: { proposedPriceToman },
    });
  },

  decline(requestId: string, accessToken: string) {
    return apiClient(`/providers/jobs/${requestId}/decline`, {
      method: "POST",
      headers: authHeaders(accessToken),
    });
  },

  start(requestId: string, accessToken: string) {
    return apiClient(`/providers/jobs/${requestId}/start`, {
      method: "POST",
      headers: authHeaders(accessToken),
    });
  },

  complete(requestId: string, accessToken: string) {
    return apiClient(`/providers/jobs/${requestId}/complete`, {
      method: "POST",
      headers: authHeaders(accessToken),
    });
  },
};
