import { apiClient } from "@/src/lib/api/client";
import type { AddressValues } from "../schemas/address.schema";
import type { ChangePasswordValues } from "../schemas/change-password.schema";
import type { CustomerProfileValues } from "../schemas/customer-profile.schema";
import type { ReviewValues } from "../schemas/review.schema";
import type {
  Customer,
  NotificationPrefs,
  Session,
} from "../types/customer.types";

export const customerApi = {
  getProfile: async (accessToken?: string) => {
    const { data } = await apiClient<Customer>("/users/me", {
      method: "GET",
      headers: accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : undefined,
    });
    return data;
  },

  updateProfile: (values: CustomerProfileValues) =>
    apiClient("/customer/profile", { method: "PATCH", data: values }),

  changePassword: (
    values: Pick<ChangePasswordValues, "currentPassword" | "newPassword">,
  ) => apiClient("/customer/password", { method: "PATCH", data: values }),

  deleteAccount: () => apiClient("/customer/account", { method: "DELETE" }),

  createAddress: async (values: AddressValues) => {
    const { data } = await apiClient<{ id: string }>("/customer/addresses", {
      method: "POST",
      data: values,
    });
    return data;
  },

  updateAddress: (id: string, values: AddressValues) =>
    apiClient(`/customer/addresses/${id}`, { method: "PATCH", data: values }),

  deleteAddress: (id: string) =>
    apiClient(`/customer/addresses/${id}`, { method: "DELETE" }),

  cancelRequest: (id: string, reason?: string) =>
    apiClient(`/api/customer/requests/${id}/cancel`, {
      method: "POST",
      data: { reason },
    }),

  acceptOffer: (requestId: string, offerId: string) =>
    apiClient(`/api/customer/requests/${requestId}/offers/${offerId}/accept`, {
      method: "POST",
    }),

  submitReview: (requestId: string, values: ReviewValues) =>
    apiClient(`/api/customer/requests/${requestId}/review`, {
      method: "POST",
      data: values,
    }),

  removeFavorite: (specialistId: string) =>
    apiClient(`/api/customer/favorites/${specialistId}`, { method: "DELETE" }),

  topUpWallet: (amount: number) =>
    apiClient<{ paymentUrl: string }>("/api/customer/wallet/topup", {
      method: "POST",
      data: { amount },
    }),

  // getNotificationPrefs: async (accessToken?: string) => {
  //   const { data } = await apiClient<NotificationPrefs>(
  //     "/api/customer/notifications",
  //     {
  //       method: "GET",
  //       headers: accessToken
  //         ? { Authorization: `Bearer ${accessToken}` }
  //         : undefined,
  //     },
  //   );
  //   return data;
  // },

  updateNotificationPrefs: (prefs: NotificationPrefs) =>
    apiClient("/api/customer/notifications", { method: "PUT", data: prefs }),

  // getSessions: async (accessToken?: string) => {
  //   const { data } = await apiClient<Session[]>("/api/customer/sessions", {
  //     method: "GET",
  //     headers: accessToken
  //       ? { Authorization: `Bearer ${accessToken}` }
  //       : undefined,
  //   });
  //   return data;
  // },

  revokeSession: (id: string) =>
    apiClient(`/api/customer/sessions/${id}`, { method: "DELETE" }),
};
