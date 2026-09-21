import { DaySchedule, Provider, VerificationDoc } from "../types/types";


export interface CompletionItem {
  id: string;
  label: string;
  weight: number;
  done: boolean;
  anchor: string;
}

export function getProfileCompletion(
  provider: Provider,
  docs: VerificationDoc[],
  schedule: DaySchedule[]
) {
  const docVerified = (id: string) =>
    docs.find((d) => d.id === id)?.status === "verified";

  const items: CompletionItem[] = [
    { id: "avatar", label: "افزودن عکس پروفایل", weight: 10, done: !!provider.avatar, anchor: "basic" },
    { id: "bio", label: "نوشتن معرفی (حداقل ۵۰ کاراکتر)", weight: 15, done: provider.bio.trim().length >= 50, anchor: "bio" },
    { id: "skills", label: "افزودن حداقل ۳ تخصص", weight: 10, done: provider.skills.length >= 3, anchor: "skills" },
    { id: "areas", label: "تعیین محدوده‌ی خدمت‌رسانی", weight: 10, done: provider.serviceAreas.length >= 1, anchor: "skills" },
    { id: "price", label: "تعیین قیمت شروع", weight: 10, done: provider.startingPrice > 0, anchor: "pricing" },
    { id: "national-id", label: "تأیید کارت ملی", weight: 15, done: docVerified("national-id"), anchor: "documents" },
    { id: "certificate", label: "تأیید مدرک مهارت", weight: 10, done: docVerified("certificate"), anchor: "documents" },
    { id: "portfolio", label: "افزودن حداقل ۳ نمونه‌کار", weight: 10, done: provider.portfolio.length >= 3, anchor: "portfolio" },
    { id: "schedule", label: "تعیین ساعات کاری", weight: 10, done: schedule.some((d) => d.enabled), anchor: "availability" },
  ];

  const percent = items.reduce((sum, i) => sum + (i.done ? i.weight : 0), 0);
  return { percent, items };
}