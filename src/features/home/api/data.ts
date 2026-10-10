import {
  BadgeCheck,
  CalendarCheck,
  ClipboardCheck,
  FileText,
  Users,
  WalletCards,
} from "lucide-react";
import type { Feature, Step } from "../types/types";

export const steps: Step[] = [
  {
    icon: FileText,
    title: "درخواستت را ثبت کن",
    description: "نوع خدمت، نشانی و زمان مناسب را در چند قدم ثبت کن.",
  },
  {
    icon: Users,
    title: "پیشنهاد متخصص‌ها را بگیر",
    description: "متخصص‌های مرتبط، قیمت و توضیح پیشنهادشان را می‌فرستند.",
  },
  {
    icon: WalletCards,
    title: "مقایسه کن و انتخاب کن",
    description:
      "قیمت، امتیاز و نظرها را کنار هم ببین و متخصص دلخواهت را انتخاب کن.",
  },
  {
    icon: CalendarCheck,
    title: "هماهنگ شو و پیگیری کن",
    description:
      "گفت‌وگو را شروع کن و وضعیت درخواست و پرداخت را در حساب خودت ببین.",
  },
];

export const features: Feature[] = [
  {
    icon: BadgeCheck,
    title: "پروفایل تأییدشده را تشخیص دهید",
    description:
      "نشان تأیید در پروفایل متخصصانی دیده می‌شود که وضعیتشان در هلپر تأیید شده است.",
  },
  {
    icon: WalletCards,
    title: "قیمت را پیش از پرداخت بررسی کنید",
    description:
      "مبلغ پیشنهادی متخصص در درخواست نمایش داده می‌شود تا قبل از پرداخت آن را ببینید.",
  },
  {
    icon: ClipboardCheck,
    title: "وضعیت درخواست را دنبال کنید",
    description:
      "جزئیات درخواست و وضعیت پرداخت در حساب کاربری شما در دسترس است.",
  },
  {
    icon: FileText,
    title: "مسیر اختلاف روشن است",
    description:
      "دلیل اختلاف را ثبت کنید، پیام‌های پیگیری را ببینید و نتیجه‌ی بررسی را در همان درخواست دنبال کنید.",
  },
];
