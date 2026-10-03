import { useQuery } from "@tanstack/react-query";

import { requestApi } from "../api/request.api";
import type { Specialty, SpecialtyGroup } from "../types/specialty.types";

export function useSpecialtyGroups(accessToken: string) {
  return useQuery<SpecialtyGroup[]>({
    queryKey: ["specialty-groups"],
    queryFn: () => requestApi.getSpecialtyGroups(accessToken),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useSpecialtyGroupSpecialties(
  groupId: string | null,
  accessToken: string,
) {
  return useQuery<Specialty[]>({
    queryKey: ["specialty-group-specialties", groupId],
    queryFn: () =>
      requestApi.getSpecialtyGroupSpecialties(groupId!, accessToken),
    enabled: !!groupId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useGroupedSpecialties(accessToken: string) {
  return useSpecialtyGroups(accessToken);
}
