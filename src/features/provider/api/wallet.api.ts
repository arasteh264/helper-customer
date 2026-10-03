import { apiClient } from "@/src/lib/api/client";

export interface WalletDashboardResponse {
  id: string;
  balance: number;
  totalEarned: number;
  totalWithdrawn: number;
  pendingPayouts: number;
  commissionRate: number;
  grossIncomeToman?: number;
  netIncomeToman?: number;
  commissionToman?: number;
  grossIncome?: number;
  netIncome?: number;
  commission?: number;
  grossEarningsToman?: number;
  netEarningsToman?: number;
  totalCommissionToman?: number;
  grossEarnings?: number;
  netEarnings?: number;
  commissionAmount?: number;
  minWithdrawal: number;
  monthly: { label: string; amount: number }[];
}

export interface WalletTransactionResponse {
  id: string;
  type:
    | "EARNING"
    | "COMMISSION"
    | "PAYOUT_REQUEST"
    | "PAYOUT_REFUND"
    | "ADJUSTMENT";
  amount: number;
  description: string | null;
  createdAt: string;
  payoutStatus: "PENDING" | "PAID" | "REJECTED" | "CANCELLED" | null;
}

export interface ProviderBankAccountResponse {
  holderName: string;
  sheba: string;
  bankName: string | null;
  updatedAt: string;
}

export interface ProviderPayoutResponse {
  id: string;
  amountToman?: number;
  amount?: number;
  status: "PENDING" | "PAID" | "REJECTED" | "CANCELLED";
  createdAt: string;
  paidAt?: string | null;
}

const headers = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
});

export const walletApi = {
  async getSummary(accessToken: string) {
    const { data } = await apiClient<WalletDashboardResponse>(
      "/providers/wallet",
      {
        method: "GET",
        headers: headers(accessToken),
      },
    );
    return data;
  },

  async getTransactions(accessToken: string) {
    const pageSize = 100;
    const getPage = async (page: number) => {
      const { data } = await apiClient<{
        items: WalletTransactionResponse[];
        total: number;
      }>(`/providers/wallet/transactions?page=${page}&pageSize=${pageSize}`, {
        method: "GET",
        headers: headers(accessToken),
      });
      return data;
    };

    const firstPage = await getPage(1);
    const pageCount = Math.ceil(firstPage.total / pageSize);
    const allItems = [...firstPage.items];
    for (
      let firstPageInBatch = 2;
      firstPageInBatch <= pageCount;
      firstPageInBatch += 5
    ) {
      const batch = await Promise.all(
        Array.from(
          { length: Math.min(5, pageCount - firstPageInBatch + 1) },
          (_, index) => getPage(firstPageInBatch + index),
        ),
      );
      allItems.push(...batch.flatMap((page) => page.items));
    }

    return { items: allItems, total: firstPage.total };
  },

  async getPayouts(accessToken: string) {
    const { data } = await apiClient<
      | ProviderPayoutResponse[]
      | { items: ProviderPayoutResponse[] }
      | { data: ProviderPayoutResponse[] }
    >("/providers/wallet/payouts", {
      method: "GET",
      headers: headers(accessToken),
    });
    return Array.isArray(data)
      ? data
      : "items" in data
        ? data.items
        : data.data;
  },

  async getBankAccount(accessToken: string) {
    const { data } = await apiClient<ProviderBankAccountResponse>(
      "/providers/wallet/bank-account",
      { method: "GET", headers: headers(accessToken) },
    );
    return data;
  },

  requestWithdrawal(accessToken: string, amount: number) {
    return apiClient("/providers/wallet/payouts", {
      method: "POST",
      data: { amount },
      headers: headers(accessToken),
    });
  },
};
