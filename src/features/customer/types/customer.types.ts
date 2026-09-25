export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  emailVerified?: boolean;
  avatar?: string;
  memberSince: string; // ISO
  walletBalance?: number; // تومان
}

/* ───────── درخواست‌ها ───────── */

export type RequestStatus =
  | "awaiting_offers" // ثبت شده، منتظر پیشنهاد متخصصان
  | "offers_received" // پیشنهاد آمده، منتظر انتخاب مشتری
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
  code: string; // مثل R-2048
  title: string;
  category: string;
  description: string;
  addressLabel: string;
  createdAt: string; // ISO
  scheduledAt?: string; // ISO
  status: RequestStatus;
  offersCount: number;
  budget?: { min: number; max: number };
  /** قیمت نهایی توافق‌شده */
  price?: number;
  specialist?: RequestSpecialist;
  reviewed: boolean;
}

/* ───────── آدرس‌ها ───────── */

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

/* ───────── کیف پول ───────── */

export type PaymentType = "topup" | "payment" | "refund";
export type PaymentStatus = "completed" | "pending" | "failed";

export interface WalletPayment {
  id: string;
  date: string; // ISO
  description: string;
  type: PaymentType;
  /** مثبت = افزایش موجودی، منفی = کاهش */
  amount: number;
  status: PaymentStatus;
}

/* ───────── تنظیمات ───────── */

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
  lastActive: string; // ISO
  current: boolean;
}