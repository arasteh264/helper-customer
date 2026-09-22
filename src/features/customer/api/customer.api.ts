import { apiClient } from "@/src/lib/api/client";
import type { AddressValues } from "../schemas/address.schema";
import type { ChangePasswordValues } from "../schemas/change-password.schema";
import type { CustomerProfileValues } from "../schemas/customer-profile.schema";
import type { ReviewValues } from "../schemas/review.schema";
import type { NotificationPrefs } from "../types/customer.types";

// TODO: آدرس‌های API واقعی پروژه را اینجا جایگزین کنید

export const customerApi = {
  updateProfile: (values: CustomerProfileValues) =>
    apiClient("/api/customer/profile", { method: "PATCH" }),

  changePassword: (values: ChangePasswordValues) =>
    apiClient("/api/customer/password", { method: "PATCH" }),

  createAddress: async (values: AddressValues) => {
    const { data } = await apiClient<{ id: string }>(
      "/api/customer/addresses",
      {
        method: "POST",
        data: values,
      },
    );
    return data;
  },

  updateAddress: (id: string, values: AddressValues) =>
    apiClient(`/api/customer/addresses/${id}`, { method: "PATCH" }),

  deleteAddress: (id: string) =>
    apiClient(`/api/customer/addresses/${id}`, { method: "DELETE" }),

  cancelRequest: (id: string, reason?: string) =>
    apiClient(`/api/customer/requests/${id}/cancel`, { method: "POST" }),

  acceptOffer: (requestId: string, offerId: string) =>
    apiClient(`/api/customer/requests/${requestId}/offers/${offerId}/accept`, {
      method: "POST",
    }),

  submitReview: (requestId: string, values: ReviewValues) =>
    apiClient(`/api/customer/requests/${requestId}/review`, { method: "POST" }),

  removeFavorite: (specialistId: string) =>
    apiClient(`/api/customer/favorites/${specialistId}`, { method: "DELETE" }),

  topUpWallet: (amount: number) =>
    apiClient<{ paymentUrl: string }>("/api/customer/wallet/topup", {
      method: "POST",
    }),

  updateNotificationPrefs: (prefs: NotificationPrefs) =>
    apiClient("/api/customer/notifications", { method: "PUT" }),

  revokeSession: (id: string) =>
    apiClient(`/api/customer/sessions/${id}`, { method: "DELETE" }),
};
