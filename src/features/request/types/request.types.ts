import type { LucideIcon } from "lucide-react";

export interface RepairCategory {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  tint: string; // کلاس کامل Tailwind برای رنگ آیکن
  commonIssues: string[];
  /** بازه‌ی قیمت تقریبی به تومان، برای نمایش برآورد */
  priceRange: { min: number; max: number };
}

export type Urgency = "asap" | "this_week" | "scheduled";

export interface NewRequestDraft {
  categoryId: string;
  title: string;
  description: string;
  /** آدرس تصاویر (در این نسخه فقط پیش‌نمایش محلی) */
  photos: string[];
  urgency: Urgency;
  scheduledAt?: string; // ISO، فقط وقتی urgency === "scheduled"
  addressId: string;
  hasBudget: boolean;
  budgetMin?: number;
  budgetMax?: number;
}

export const EMPTY_DRAFT: NewRequestDraft = {
  categoryId: "",
  title: "",
  description: "",
  photos: [],
  urgency: "this_week",
  addressId: "",
  hasBudget: false,
};

export type WizardStepId = "category" | "details" | "address" | "schedule" | "review";

/* ───────── چت ───────── */

export type ChatSender = "customer" | "specialist" | "support" | "system";

export interface ChatMessage {
  id: string;
  sender: ChatSender;
  text: string;
  time: string; // ISO
}

export interface ChatParticipant {
  id: string;
  name: string;
  role: string;
  online: boolean;
}