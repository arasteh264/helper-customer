import { apiClient } from "@/src/lib/api/client";
import type { AddressValues } from "../schemas/address.schema";
import type { ChangePasswordValues } from "../schemas/change-password.schema";
import type { CustomerProfileValues } from "../schemas/customer-profile.schema";
import type { ReviewValues } from "../schemas/review.schema";
import type {
  Customer,
  NotificationPrefs,
  ServiceRequest,
  Address,
  WalletPayment,
} from "../types/customer.types";

export interface BackendUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
  avatar?: string;
  emailVerified?: boolean;
  walletBalance?: number;
}

export interface BackendCustomerProfile {
  id: string;
  userId: string;
  name: string;
  memberSince: string;
  walletBalance: number;
  activeRequests: number;
  completedJobs: number;
  addressesCount: number;
  recentActiveRequests: ServiceRequest[];
}

export interface CustomerWalletSummary {
  balance: number;
  totalSpent: number;
  transactions: WalletPayment[];
}

const authHeaders = (accessToken?: string) =>
  accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;

export const customerApi = {
  getProfile: async (accessToken?: string): Promise<Customer> => {
    const headers = authHeaders(accessToken);

    const [{ data: user }, { data: profile }] = await Promise.all([
      apiClient<BackendUser>("/users/me", { method: "GET", headers }),
      apiClient<BackendCustomerProfile>("/customer/profile", {
        method: "GET",
        headers,
      }),
    ]);

    return {
      id: user.id,
      name: profile.name || user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      emailVerified: user.emailVerified,
      memberSince: profile.memberSince ?? user.createdAt,
      walletBalance: profile.walletBalance ?? user.walletBalance ?? 0,
      activeRequests: profile.activeRequests,
      completedJobs: profile.completedJobs,
      addressesCount: profile.addressesCount,
      recentActiveRequests: profile.recentActiveRequests ?? [],
    };
  },

  getWallet: async (accessToken: string): Promise<CustomerWalletSummary> => {
    const { data } = await apiClient<CustomerWalletSummary>(
      "/customer/wallet",
      {
        method: "GET",
        headers: authHeaders(accessToken),
      },
    );
    return data;
  },

  updateProfile: (values: CustomerProfileValues) =>
    apiClient("/customer/profile", { method: "PATCH", data: values }),

  changePassword: (
    values: Pick<ChangePasswordValues, "currentPassword" | "newPassword">,
    accessToken?: string,
  ) =>
    apiClient("/customer/password", {
      method: "PATCH",
      data: values,
      headers: authHeaders(accessToken),
    }),

  deleteAccount: () => apiClient("/customer/account", { method: "DELETE" }),

  getAddresses: async (accessToken: string): Promise<Address[]> => {
    const { data } = await apiClient<Address[] | { data: Address[] }>(
      "/customer/addresses",
      {
        method: "GET",
        headers: authHeaders(accessToken),
      },
    );
    const addresses = Array.isArray(data) ? data : data.data;
    if (!Array.isArray(addresses)) {
      throw new Error("پاسخ دریافت آدرس‌ها از سرور معتبر نیست.");
    }
    return addresses;
  },

  createAddress: async (values: AddressValues, accessToken: string) => {
    const { data } = await apiClient<{ id: string }>("/customer/addresses", {
      method: "POST",
      headers: authHeaders(accessToken),
      data: values,
    });
    return data;
  },

  updateAddress: (id: string, values: AddressValues, accessToken: string) =>
    apiClient(`/customer/addresses/${id}`, {
      method: "PATCH",
      headers: authHeaders(accessToken),
      data: values,
    }),

  deleteAddress: (id: string, accessToken: string) =>
    apiClient(`/customer/addresses/${id}`, {
      method: "DELETE",
      headers: authHeaders(accessToken),
    }),

  cancelRequest: (id: string, reason?: string) =>
    apiClient(`/api/customer/requests/${id}/cancel`, {
      method: "POST",
      data: { reason },
    }),

  acceptOffer: (requestId: string, offerId: string) =>
    apiClient(`/api/customer/requests/${requestId}/offers/${offerId}/accept`, {
      method: "POST",
    }),

  submitReview: (
    requestId: string,
    values: ReviewValues,
    accessToken: string,
  ) =>
    apiClient(`/service-requests/${requestId}/review`, {
      method: "POST",
      data: values,
      headers: authHeaders(accessToken),
    }),

  removeFavorite: (specialistId: string) =>
    apiClient(`/api/customer/favorites/${specialistId}`, { method: "DELETE" }),

  topUpWallet: (amountToman: number, accessToken: string) =>
    apiClient<{ paymentUrl: string; topupId: string }>(
      "/customer/wallet/topup",
      {
        method: "POST",
        headers: authHeaders(accessToken),
        data: { amountToman },
      },
    ),

  // getNotificationPrefs: async (accessToken?: string) => {
  //   const { data } = await apiClient<NotificationPrefs>(
  //     "/api/customer/notifications",
  //     { method: "GET", headers: authHeaders(accessToken) },
  //   );
  //   return data;
  // },

  updateNotificationPrefs: (prefs: NotificationPrefs) =>
    apiClient("/api/customer/notifications", { method: "PUT", data: prefs }),

  // getSessions: async (accessToken?: string) => {
  //   const { data } = await apiClient<Session[]>("/api/customer/sessions", {
  //     method: "GET",
  //     headers: authHeaders(accessToken),
  //   });
  //   return data;
  // },

  revokeSession: (id: string) =>
    apiClient(`/api/customer/sessions/${id}`, { method: "DELETE" }),
};
