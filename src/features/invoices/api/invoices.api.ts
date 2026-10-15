import { apiClient } from "@/src/lib/api/client";
import type { CreateInvoiceInput, Invoice } from "../types/invoice.types";

const authHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
});

export const providerInvoicesApi = {
  async getForRequest(serviceRequestId: string, accessToken: string) {
    const { data } = await apiClient<Invoice>(
      `/provider/service-requests/${serviceRequestId}/invoice`,
      { method: "GET", headers: authHeaders(accessToken) },
    );
    return data;
  },

  async create(
    serviceRequestId: string,
    input: CreateInvoiceInput,
    accessToken: string,
  ) {
    const { data } = await apiClient<Invoice>(
      `/provider/service-requests/${serviceRequestId}/invoice`,
      {
        method: "POST",
        data: input,
        headers: authHeaders(accessToken),
      },
    );
    return data;
  },

  async send(invoiceId: string, accessToken: string) {
    const { data } = await apiClient<{ invoice: Invoice }>(
      `/provider/invoices/${invoiceId}/send`,
      { method: "POST", headers: authHeaders(accessToken) },
    );
    return data.invoice;
  },
};

export const customerInvoicesApi = {
  async listMine(accessToken: string) {
    const { data } = await apiClient<{ items: Invoice[] }>("/invoices/mine", {
      method: "GET",
      headers: authHeaders(accessToken),
    });
    return data.items;
  },
};
