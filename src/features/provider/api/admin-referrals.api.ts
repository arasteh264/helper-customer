import { apiClient } from "@/src/lib/api/client";
import type { ProviderReferralRewardType } from "../types/provider.types";

export interface AdminProviderReferral {
  id: string;
  referralCode: string;
  referrer: {
    providerProfileId: string;
    name: string;
    email: string;
  };
  referred: {
    providerProfileId: string;
    name: string;
    email: string;
    verificationStatus: "PENDING" | "APPROVED" | "REJECTED";
    isVerified: boolean;
  };
  rewardType: ProviderReferralRewardType | null;
  rewardedAt: string | null;
  createdAt: string;
}

const headers = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
});

export const adminReferralsApi = {
  async list(accessToken: string) {
    const { data } = await apiClient<AdminProviderReferral[]>(
      "/admin/providers/referrals",
      { method: "GET", headers: headers(accessToken) },
    );
    return data;
  },

  async grantReward(
    referralId: string,
    rewardType: ProviderReferralRewardType,
    accessToken: string,
  ) {
    const { data } = await apiClient(
      `/admin/providers/referrals/${encodeURIComponent(referralId)}/reward`,
      {
        method: "POST",
        data: { rewardType },
        headers: headers(accessToken),
      },
    );
    return data;
  },
};
