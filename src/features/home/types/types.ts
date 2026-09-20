import type { LucideIcon } from "lucide-react";

export interface Category {
  id: string;
  label: string;
  /** تعداد متخصصان، به‌صورت عدد (نمایش فارسی در کامپوننت انجام می‌شود) */
  count: number;
  icon: LucideIcon;
  /** کلاس‌های کامل Tailwind برای رنگ آیکن */
  tint: string;
  href: string;
}

export interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface Specialist {
  id: string;
  name: string;
  field: string;
  rating: number;
  reviews: number;
  jobs: number;
  city: string;
  startingPrice: number;
  verified: boolean;
  /** اختیاری: مسیر عکس پروفایل. اگر نباشد، حرف اول نام نمایش داده می‌شود */
  image?: string;
}

export interface Testimonial {
  name: string;
  city: string;
  service: string;
  text: string;
  rating: number;
}

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}