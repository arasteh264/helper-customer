import { apiClient } from "@/src/lib/api/client";
import type {
  NewRequestDraft,
  RequestChatHistoryResponse,
  RequestChatMessage,
} from "../types/request.types";
import type { Specialty, SpecialtyGroup } from "../types/specialty.types";
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

export type ServiceRequestPaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

export interface ServiceRequestPayment {
  status: ServiceRequestPaymentStatus;
  amountToman?: number;
  amount?: number;
  paidAt?: string | null;
}

export type ServiceRequestGroup = "active" | "completed" | "cancelled";

export interface ServiceRequestPage {
  items: ServiceRequest[];
  total: number;
  page: number;
  pageSize: number;
  counts: Record<ServiceRequestGroup, number>;
}

const authHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
});

export const requestApi = {
  async getMyRequestsPage(
    accessToken: string,
    options: {
      page: number;
      pageSize: number;
      group: ServiceRequestGroup;
    },
  ): Promise<ServiceRequestPage> {
    const params = new URLSearchParams({
      page: String(options.page),
      pageSize: String(options.pageSize),
      group: options.group,
    });
    const { data } = await apiClient<
      ServiceRequestPage | { data: ServiceRequestPage }
    >(`/service-requests/mine?${params}`, {
      method: "GET",
      headers: authHeaders(accessToken),
    });
    return "data" in data ? data.data : data;
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

  async getPaymentStatus(requestId: string, accessToken: string) {
    const { data } = await apiClient<
      ServiceRequestPayment | { data: ServiceRequestPayment }
    >(`/payments/service-requests/${requestId}`, {
      method: "GET",
      headers: authHeaders(accessToken),
    });
    return "data" in data ? data.data : data;
  },

  async verifyPaymentStatus(requestId: string, accessToken: string) {
    const { data } = await apiClient<
      ServiceRequestPayment | { data: ServiceRequestPayment }
    >(`/payments/service-requests/${requestId}/verify`, {
      method: "POST",
      headers: authHeaders(accessToken),
    });
    return "data" in data ? data.data : data;
  },

  async checkout(requestId: string, accessToken: string) {
    const { data } = await apiClient<
      { paymentUrl: string } | { data: { paymentUrl: string } }
    >(`/payments/service-requests/${requestId}/checkout`, {
      method: "POST",
      headers: authHeaders(accessToken),
    });
    return "data" in data ? data.data : data;
  },

  async payFromWallet(requestId: string, accessToken: string) {
    const { data } = await apiClient<{
      status: "PAID";
      requestId: string;
      amountToman: number;
      walletBalanceToman: number;
    }>(`/payments/service-requests/${requestId}/wallet`, {
      method: "POST",
      headers: authHeaders(accessToken),
    });
    return data;
  },

  confirmCompletion(requestId: string, accessToken: string) {
    return apiClient(
      `/payments/service-requests/${requestId}/confirm-completion`,
      {
        method: "POST",
        headers: authHeaders(accessToken),
      },
    );
  },

  dispute(requestId: string, accessToken: string) {
    return apiClient(`/payments/service-requests/${requestId}/dispute`, {
      method: "POST",
      headers: authHeaders(accessToken),
    });
  },

  async getCategories(accessToken?: string) {
    const { data } = await apiClient<
      ServiceCategory[] | { data?: ServiceCategory[] }
    >("/service-requests/categories", {
      method: "GET",
      headers: accessToken ? authHeaders(accessToken) : undefined,
    });
    return Array.isArray(data) ? data : (data.data ?? []);
  },

  async getSpecialtyGroups(accessToken?: string): Promise<SpecialtyGroup[]> {
    const { data } = await apiClient<{ data?: SpecialtyGroup[] }>(
      "/specialties/groups",
      {
        method: "GET",
        headers: accessToken ? authHeaders(accessToken) : undefined,
      },
    );
    return data.data ?? [];
  },

  async getSpecialtyGroupSpecialties(
    groupId: string,
    accessToken?: string,
  ): Promise<Specialty[]> {
    const { data } = await apiClient<{ data?: Specialty[] }>(
      `/specialties/groups/${groupId}/specialties`,
      {
        method: "GET",
        headers: accessToken ? authHeaders(accessToken) : undefined,
      },
    );
    return data.data ?? [];
  },

  async getGroupedSpecialties(): Promise<SpecialtyGroup[]> {
    return this.getSpecialtyGroups();
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
        specialtyId: draft.categoryId,
        address: draft.address,
        latitude: draft.latitude,
        longitude: draft.longitude,
        cityWide: !!draft.cityWide,
        serviceRadiusKm: draft.serviceRadiusKm ?? 10,
        prefersOutOfArea: !!draft.prefersOutOfArea,
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

  async getChatMessages(
    requestId: string,
    accessToken: string,
    signal?: AbortSignal,
  ) {
    const { data } = await apiClient<RequestChatHistoryResponse>(
      `/service-requests/${requestId}/chat/messages`,
      {
        method: "GET",
        headers: authHeaders(accessToken),
        signal,
      },
    );
    return data;
  },

  async sendChatMessage(
    requestId: string,
    body: string,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<RequestChatMessage> {
    const { data } = await apiClient<RequestChatMessage>(
      `/service-requests/${requestId}/chat/messages`,
      {
        method: "POST",
        headers: authHeaders(accessToken),
        data: { body },
        signal,
      },
    );
    return data;
  },
};
