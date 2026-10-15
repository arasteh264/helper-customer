import type { BadgeTone } from "@/src/components/shared/status-badge";
import type {
  AddressType,
  NotificationChannel,
  NotificationTopic,
  PaymentStatus,
  PaymentType,
  RequestStatus,
} from "../types/customer.types";

export const REQUEST_STATUS: Record<
  RequestStatus,
  { label: string; tone: BadgeTone }
> = {
  awaiting_admin_review: {
    label: "در انتظار بررسی هلپا24",
    tone: "warning",
  },
  awaiting_offers: { label: "منتظر پیشنهاد", tone: "info" },
  awaiting_payment: { label: "در انتظار پرداخت", tone: "warning" },
  offers_received: {
    label: "متخصص پذیرفت؛ در انتظار هماهنگی",
    tone: "warning",
  },
  in_progress: { label: "در حال انجام", tone: "warning" },
  awaiting_confirmation: { label: "در انتظار تأیید شما", tone: "warning" },
  completed: { label: "تکمیل‌شده", tone: "success" },
  disputed: { label: "در حال بررسی اختلاف", tone: "danger" },
  cancelled: { label: "لغوشده", tone: "neutral" },
};

/** مراحل نمایش‌داده‌شده در نوار پیشرفت هر درخواست */
export const REQUEST_STEPS = [
  "ثبت درخواست",
  "دریافت پیشنهاد",
  "انتخاب و پرداخت",
  "انجام کار",
  "تأیید نهایی",
];

/** شماره‌ی مرحله‌ی فعلی (۰ تا ۴) */
export function getRequestStep(status: RequestStatus): number {
  switch (status) {
    case "awaiting_admin_review":
    case "awaiting_offers":
      return 1;
    case "awaiting_payment":
    case "offers_received":
      return 2;
    case "in_progress":
      return 3;
    case "awaiting_confirmation":
    case "disputed":
    case "completed":
      return 4;
    default:
      return 0;
  }
}

export function getRequestNextAction(status: RequestStatus): string {
  switch (status) {
    case "awaiting_admin_review":
      return "در حال بررسی هلپا24 هستیم؛ نتیجه را از همین صفحه پیگیری کنید.";
    case "awaiting_offers":
      return "پیشنهاد متخصصان را مقایسه کنید و گزینه‌ی مناسب را انتخاب کنید.";
    case "awaiting_payment":
      return "برای شروع کار، پرداخت درخواست را تکمیل کنید.";
    case "offers_received":
      return "برای هماهنگی زمان و جزئیات کار با متخصص در ارتباط باشید.";
    case "in_progress":
      return "روند انجام کار را از گفتگو با متخصص پیگیری کنید.";
    case "awaiting_confirmation":
      return "کار را بررسی کنید؛ سپس آن را تأیید یا اختلاف ثبت کنید.";
    case "disputed":
      return "پاسخ‌ها و نتیجه‌ی رسیدگی را در پرونده‌ی اختلاف ببینید.";
    case "completed":
      return "این درخواست تکمیل شده است.";
    case "cancelled":
      return "این درخواست لغو شده است.";
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

export const PAYMENT_STATUS: Record<
  PaymentStatus,
  { label: string; tone: BadgeTone }
> = {
  completed: { label: "موفق", tone: "success" },
  pending: { label: "در انتظار", tone: "warning" },
  failed: { label: "ناموفق", tone: "danger" },
};

export const NOTIFICATION_TOPICS: {
  id: NotificationTopic;
  label: string;
  description: string;
}[] = [
  {
    id: "requestUpdates",
    label: "وضعیت درخواست‌ها",
    description: "پذیرش، شروع و تکمیل کار",
  },
  {
    id: "newOffers",
    label: "پیشنهادهای جدید",
    description: "وقتی متخصصی برای درخواست شما پیشنهاد می‌دهد",
  },
  {
    id: "paymentAlerts",
    label: "پرداخت و کیف پول",
    description: "رسید پرداخت، شارژ و بازگشت وجه",
  },
  {
    id: "promotions",
    label: "تخفیف‌ها و اخبار",
    description: "کدهای تخفیف و پیشنهادهای ویژه",
  },
];

export const NOTIFICATION_CHANNELS: {
  id: NotificationChannel;
  label: string;
}[] = [
  { id: "sms", label: "پیامک" },
  { id: "email", label: "ایمیل" },
];
