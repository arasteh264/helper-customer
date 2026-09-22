import type { BadgeTone } from "@/src/components/shared/status-badge";
import type {
  AddressType,
  NotificationChannel,
  NotificationTopic,
  PaymentStatus,
  PaymentType,
  RequestStatus,
} from "../types/customer.types";

export const REQUEST_STATUS: Record<RequestStatus, { label: string; tone: BadgeTone }> = {
  awaiting_offers: { label: "منتظر پیشنهاد", tone: "info" },
  offers_received: { label: "پیشنهاد دریافت شد", tone: "warning" },
  in_progress: { label: "در حال انجام", tone: "warning" },
  completed: { label: "تکمیل‌شده", tone: "success" },
  cancelled: { label: "لغوشده", tone: "neutral" },
};

/** مراحل نمایش‌داده‌شده در نوار پیشرفت هر درخواست */
export const REQUEST_STEPS = ["ثبت درخواست", "دریافت پیشنهاد", "انجام کار", "تکمیل"];

/** شماره‌ی مرحله‌ی فعلی (۰ تا ۳) */
export function getRequestStep(status: RequestStatus): number {
  switch (status) {
    case "awaiting_offers":
      return 0;
    case "offers_received":
      return 1;
    case "in_progress":
      return 2;
    case "completed":
      return 3;
    default:
      return 0;
  }
}

export const ADDRESS_TYPE: Record<AddressType, string> = {
  home: "منزل",
  work: "محل کار",
  other: "سایر",
};

export const PAYMENT_TYPE: Record<PaymentType, string> = {
  topup: "شارژ کیف پول",
  payment: "پرداخت",
  refund: "بازگشت وجه",
};

export const PAYMENT_STATUS: Record<PaymentStatus, { label: string; tone: BadgeTone }> = {
  completed: { label: "موفق", tone: "success" },
  pending: { label: "در انتظار", tone: "warning" },
  failed: { label: "ناموفق", tone: "danger" },
};

export const NOTIFICATION_TOPICS: {
  id: NotificationTopic;
  label: string;
  description: string;
}[] = [
  { id: "requestUpdates", label: "وضعیت درخواست‌ها", description: "پذیرش، شروع و تکمیل کار" },
  { id: "newOffers", label: "پیشنهادهای جدید", description: "وقتی متخصصی برای درخواست شما پیشنهاد می‌دهد" },
  { id: "paymentAlerts", label: "پرداخت و کیف پول", description: "رسید پرداخت، شارژ و بازگشت وجه" },
  { id: "promotions", label: "تخفیف‌ها و اخبار", description: "کدهای تخفیف و پیشنهادهای ویژه" },
];

export const NOTIFICATION_CHANNELS: { id: NotificationChannel; label: string }[] = [
  { id: "sms", label: "پیامک" },
  { id: "email", label: "ایمیل" },
];