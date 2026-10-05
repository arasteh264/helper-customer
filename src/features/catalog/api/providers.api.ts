import { apiClient } from "@/src/lib/api/client";

export interface PublicProvider {
  id: string;
  name: string;
  bio: string | null;
  rating: number;
  reviewsCount: number;
  completedJobs: number;
  verified: boolean;
  available: boolean;
  hasServiceArea: boolean;
  distanceKm?: number | null;
  avatarUrl: string | null;
  skills: { id: string; name: string }[];
  specialties?: {
    id: string;
    name: string;
    slug?: string;
    groupId: string;
    groupName: string;
  }[];
  workingHours: {
    dayOfWeek: number;
    isActive: boolean;
    startTime: string;
    endTime: string;
  }[];
  portfolio: string[];
  reviews: {
    id: string;
    customerName: string;
    rating: number;
    text: string;
    date: string;
    service: string;
  }[];
  createdAt: string;
}

export interface PublicProviderPage {
  items: PublicProvider[];
  total: number;
  page: number;
  pageSize: number;
}

export const publicProvidersApi = {
  async list(location?: { latitude: number; longitude: number }) {
    const params = new URLSearchParams();
    if (location) {
      params.set("latitude", String(location.latitude));
      params.set("longitude", String(location.longitude));
    }
    const query = params.size ? `?${params.toString()}` : "";
    const { data } = await apiClient<PublicProvider[]>(
      `/public/providers${query}`,
      {
        method: "GET",
      },
    );
    return data;
  },

  async listPage(page: number, pageSize: number) {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });
    const { data } = await apiClient<PublicProviderPage>(
      `/public/providers?${params}`,
      { method: "GET" },
    );
    return data;
  },

  async getById(id: string) {
    const { data } = await apiClient<PublicProvider>(
      `/public/providers/${id}`,
      {
        method: "GET",
      },
    );
    return data;
  },
};
