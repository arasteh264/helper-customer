import { apiClient } from "@/src/lib/api/client";
import type { NewRequestDraft } from "../types/request.types";
import type { ServiceRequest } from "@/src/features/customer/types/customer.types";

export interface ServiceCategory {
  id: string;
  name: string;
  providerCount: number;
}

export interface ProviderMatch {
  id: string;
  name: string;
  rating: number;
  verified: boolean;
  avatarUrl: string | null;
  skills: string[];
  distanceKm: number | null;
}

const authHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
});

export const requestApi = {
  async getMyRequests(accessToken: string) {
    const { data } = await apiClient<ServiceRequest[]>(
      "/service-requests/mine",
      {
        method: "GET",
        headers: authHeaders(accessToken),
      },
    );
    return data;
  },

  async getMyRequest(id: string, accessToken: string) {
    const { data } = await apiClient<ServiceRequest>(
      `/service-requests/${id}`,
      {
        method: "GET",
        headers: authHeaders(accessToken),
      },
    );
    return data;
  },

  async getCategories(accessToken: string) {
    const { data } = await apiClient<ServiceCategory[]>(
      "/service-requests/categories",
      { method: "GET", headers: authHeaders(accessToken) },
    );
    return data;
  },

  async getMatches(requestId: string, accessToken: string) {
    const { data } = await apiClient<ProviderMatch[]>(
      `/service-requests/${requestId}/matches`,
      { method: "GET", headers: authHeaders(accessToken) },
    );
    return data;
  },

  inviteProvider(
    requestId: string,
    providerProfileId: string,
    accessToken: string,
  ) {
    return apiClient(`/service-requests/${requestId}/invitations`, {
      method: "POST",
      headers: authHeaders(accessToken),
      data: { providerProfileId },
    });
  },

  async submit(draft: NewRequestDraft, accessToken: string) {
    const { data } = await apiClient<{ id: string }>("/service-requests", {
      method: "POST",
      headers: authHeaders(accessToken),
      data: {
        title: draft.title,
        description: draft.description,
        skillName: draft.categoryId,
        address: draft.address,
        latitude: draft.latitude,
        longitude: draft.longitude,
        preferredTime:
          draft.urgency === "asap"
            ? "URGENT"
            : draft.urgency === "this_week"
              ? "THIS_WEEK"
              : "FLEXIBLE",
        scheduledAt: draft.scheduledAt
          ? new Date(draft.scheduledAt).toISOString()
          : undefined,
        budgetMin: draft.hasBudget ? draft.budgetMin : undefined,
        budgetMax: draft.hasBudget ? draft.budgetMax : undefined,
      },
    });
    return data;
  },

  async uploadPhoto(requestId: string, file: File, accessToken: string) {
    const form = new FormData();
    form.append("file", file);
    const { data } = await apiClient<{ id: string; url: string }>(
      `/service-requests/${requestId}/images`,
      {
        method: "POST",
        data: form,
        headers: { ...authHeaders(accessToken), "Content-Type": undefined },
      },
    );
    return data;
  },
};
