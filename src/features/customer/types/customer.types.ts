

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  emailVerified?: boolean;
  avatar?: string;
  memberSince: string; 
  walletBalance?: number; 
  activeRequests?:number;
  completedJobs?:number;
  addressesCount?:number;
  recentActiveRequests?:ServiceRequest[]
}


export type RequestStatus =
  | "awaiting_offers" 
  | "offers_received" 
  | "in_progress"
  | "completed"
  | "cancelled";

export interface RequestSpecialist {
  id: string;
  name: string;
  field: string;
  rating: number;
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
  offersCount: number;
  budget?: { min: number; max: number };
  price?: number;
  specialist?: RequestSpecialist;
  reviewed: boolean;
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
