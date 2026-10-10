export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  emailVerified?: boolean;
  avatar?: string;
  memberSince: string;
  walletBalance?: number;
  activeRequests?: number;
  completedJobs?: number;
  addressesCount?: number;
  recentActiveRequests?: ServiceRequest[];
}

export type RequestStatus =
  | "awaiting_admin_review"
  | "awaiting_offers"
  | "awaiting_payment"
  | "offers_received"
  | "in_progress"
  | "awaiting_confirmation"
  | "completed"
  | "disputed"
  | "cancelled";

export type DisputeReason =
  | "WORK_NOT_COMPLETED"
  | "WORK_QUALITY"
  | "PRICE_DISAGREEMENT"
  | "PROVIDER_NO_SHOW"
  | "CUSTOMER_NON_PAYMENT"
  | "OTHER";

export interface ServiceRequestDispute {
  reason: DisputeReason | null;
  description: string | null;
  updatedAt: string | null;
  resolved: boolean;
  resolution: "PROVIDER" | "BUYER" | null;
  resolutionNote: string | null;
  messages: {
    id: string;
    body: string;
    createdAt: string;
    authorId: string;
    authorName: string;
    authorRole: string;
  }[];
}

export interface RequestSpecialist {
  id: string;
  name: string;
  field: string;
  rating: number;
  avatarUrl?: string | null;
  phone?: string;
}

export interface ServiceRequest {
  id: string;
  code: string;
  title: string;
  category: string;
  description: string;
  addressLabel: string;
  latitude?: number;
  longitude?: number;
  images?: string[];
  createdAt: string;
  scheduledAt?: string;
  status: RequestStatus;
  adminReviewNote?: string | null;
  offersCount: number;
  budget?: { min: number; max: number };
  price?: number;
  priceToman?: number;
  proposedPriceToman?: number;
  finalPriceToman?: number;
  specialist?: RequestSpecialist;
  reviewed: boolean;
  review?: {
    id: string;
    rating: number;
    text: string | null;
    createdAt: string;
  } | null;
  customerConfirmationDeadline?: string | null;
  wasPaid?: boolean;
  dispute?: ServiceRequestDispute | null;
}

export type AddressType = "home" | "work" | "other";

export interface Address {
  id: string;
  title: string;
  type: AddressType;
  receiverName: string;
  receiverPhone: string;
  city: string;
  fullAddress: string;
  plaque: string;
  unit?: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
}

/* ───────── علاقه‌مندی‌ها ───────── */

export interface FavoriteSpecialist {
  id: string;
  name: string;
  field: string;
  city: string;
  rating: number;
  reviews: number;
  startingPrice: number;
  image?: string;
}

export type PaymentType = "topup" | "payment" | "refund";
export type PaymentStatus = "completed" | "pending" | "failed";

export interface WalletPayment {
  id: string;
  date: string;
  description: string;
  type: PaymentType;
  amount: number;
  status: PaymentStatus;
}

export type NotificationTopic =
  | "requestUpdates"
  | "newOffers"
  | "paymentAlerts"
  | "promotions";

export type NotificationChannel = "sms" | "email";

export type NotificationPrefs = Record<
  NotificationTopic,
  Record<NotificationChannel, boolean>
>;

export interface Session {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}
