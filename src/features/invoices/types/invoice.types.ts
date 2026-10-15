export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPriceToman: number;
  amountToman: number;
}

export interface Invoice {
  id: string;
  serviceRequestId: string;
  customerId: string;
  providerProfileId: string;
  items: InvoiceLineItem[];
  totalToman: number;
  status: "DRAFT" | "SENT";
  sentAt: string | null;
  createdAt: string;
  updatedAt: string;
  serviceRequest: { id: string; title: string };
  customer: { id: string; name: string };
  providerProfile: { user: { id: string; name: string } };
}

export interface CreateInvoiceInput {
  items: Pick<InvoiceLineItem, "description" | "quantity" | "unitPriceToman">[];
}
