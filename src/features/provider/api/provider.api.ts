import { apiClient } from "@/src/lib/api/client";
import {
  ProviderProfile,
  ProviderSkill,
  ProviderSpecialty,
  ProviderSpecialtyGroup,
  UpdateProviderProfileValues,
} from "../types/provider.types";

const authHeaders = (accessToken?: string) =>
  accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;

export const providerApi = {
  getProfile: async (accessToken?: string) => {
    const { data } = await apiClient<ProviderProfile>("/providers/profile", {
      method: "GET",
      headers: authHeaders(accessToken),
    });
    return data;
  },

  updateProfile: (values: UpdateProviderProfileValues, accessToken?: string) =>
    apiClient("/providers/profile", {
      method: "PATCH",
      data: values,
      headers: authHeaders(accessToken),
    }),

  getSpecialtyGroups: async (accessToken?: string) => {
    const { data } = await apiClient<{ data?: ProviderSpecialtyGroup[] }>(
      "/specialties/groups",
      {
        method: "GET",
        headers: authHeaders(accessToken),
      },
    );
    return data.data ?? [];
  },

  getSpecialtyGroupSpecialties: async (
    groupId: string,
    accessToken?: string,
  ) => {
    const { data } = await apiClient<{ data?: ProviderSpecialty[] }>(
      `/specialties/groups/${groupId}/specialties`,
      {
        method: "GET",
        headers: authHeaders(accessToken),
      },
    );
    return data.data ?? [];
  },

  updateSpecialties: async (specialtyIds: string[], accessToken?: string) =>
    apiClient("/providers/profile/specialties", {
      method: "PUT",
      data: { specialtyIds },
      headers: authHeaders(accessToken),
    }),

  addSkill: async (skillName: string, accessToken?: string) => {
    const { data } = await apiClient<ProviderSkill>(
      "/providers/profile/skills",
      {
        method: "POST",
        data: { skillName },
        headers: authHeaders(accessToken),
      },
    );
    return data;
  },

  removeSkill: (skillId: string, accessToken?: string) =>
    apiClient(`/providers/profile/skills/${skillId}`, {
      method: "DELETE",
      headers: authHeaders(accessToken),
    }),

  uploadAvatar: (file: File, accessToken?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient("/providers/profile/avatar", {
      method: "POST",
      data: formData,
      headers: authHeaders(accessToken),
    });
  },

  removeAvatar: (accessToken?: string) =>
    apiClient("/providers/profile/avatar", {
      method: "DELETE",
      headers: authHeaders(accessToken),
    }),
};
