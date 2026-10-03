import { apiClient } from "@/src/lib/api/client";
import type {
  UserNotificationPreferences,
  UserNotificationsPage,
} from "../types/notification-preferences.types";

export const notificationQueryKeys = {
  preferences: (role: string) =>
    ["notifications", role, "preferences"] as const,
  list: (role: string) => ["notifications", role, "list"] as const,
  unreadCount: (role: string) =>
    ["notifications", role, "unread-count"] as const,
};

const authHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
});

type PreferencesResponse =
  | UserNotificationPreferences
  | { data: UserNotificationPreferences };

function unwrap(data: PreferencesResponse) {
  return "data" in data ? data.data : data;
}

export const notificationPreferencesApi = {
  async get(accessToken: string): Promise<UserNotificationPreferences> {
    const { data } = await apiClient<PreferencesResponse>(
      "/users/me/notification-preferences",
      { method: "GET", headers: authHeaders(accessToken) },
    );
    return unwrap(data);
  },

  async update(
    preferences: UserNotificationPreferences,
    accessToken: string,
  ): Promise<UserNotificationPreferences> {
    const { data } = await apiClient<PreferencesResponse>(
      "/users/me/notification-preferences",
      {
        method: "PUT",
        headers: authHeaders(accessToken),
        data: preferences,
      },
    );
    return unwrap(data);
  },

  async list(
    accessToken: string,
    options: { cursor?: string; limit?: number; signal?: AbortSignal } = {},
  ): Promise<UserNotificationsPage> {
    const params = new URLSearchParams();
    if (options.cursor) params.set("cursor", options.cursor);
    if (options.limit) params.set("limit", String(options.limit));
    const query = params.size ? `?${params.toString()}` : "";
    const { data } = await apiClient<UserNotificationsPage>(
      `/users/me/notifications${query}`,
      {
        method: "GET",
        headers: authHeaders(accessToken),
        signal: options.signal,
      },
    );
    return data;
  },

  async getUnreadCount(accessToken: string): Promise<number> {
    const { data } = await apiClient<{ count: number }>(
      "/users/me/notifications/unread-count",
      { method: "GET", headers: authHeaders(accessToken) },
    );
    return data.count;
  },

  async markRead(notificationId: string, accessToken: string) {
    const { data } = await apiClient<{ id: string; read: boolean }>(
      `/users/me/notifications/${encodeURIComponent(notificationId)}/read`,
      { method: "POST", headers: authHeaders(accessToken) },
    );
    return data;
  },

  async markAllRead(accessToken: string) {
    const { data } = await apiClient<{ updatedCount: number }>(
      "/users/me/notifications/read-all",
      { method: "POST", headers: authHeaders(accessToken) },
    );
    return data;
  },
};
