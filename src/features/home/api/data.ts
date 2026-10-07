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
    title: "درخواستتان را ثبت کنید",
    description: "نوع خدمت، نشانی و زمان موردنظرتان را مشخص کنید.",
  },
  {
    icon: Users,
    title: "پروفایل‌ها را بررسی کنید",
    description: "تخصص، محدوده‌ی فعالیت، امتیاز و نظرهای ثبت‌شده را ببینید.",
  },
  {
    icon: WalletCards,
    title: "قیمت را پیش از پرداخت ببینید",
    description:
      "قیمت پیشنهادی را در درخواست بررسی کنید و سپس روش پرداخت را انتخاب کنید.",
  },
  {
    icon: CalendarCheck,
    title: "کار را بررسی و پیگیری کنید",
    description:
      "پس از انجام کار، آن را تأیید کنید یا از مسیر درخواست اختلاف را پیگیری کنید.",
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
