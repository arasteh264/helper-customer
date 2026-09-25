import type { DaySchedule } from "../types/types";

export const WEEK_DAYS = [
  { id: "0", label: "شنبه" },
  { id: "1", label: "یکشنبه" },
  { id: "2", label: "دوشنبه" },
  { id: "3", label: "سه‌شنبه" },
  { id: "4", label: "چهارشنبه" },
  { id: "5", label: "پنجشنبه" },
  { id: "6", label: "جمعه" },
];

export function buildAvailabilityDays(
  workingHours: {
    dayOfWeek: number;
    isActive: boolean;
    startTime: string;
    endTime: string;
  }[],
): DaySchedule[] {
  return WEEK_DAYS.map((day) => {
    const existing = workingHours.find(
      (item) => item.dayOfWeek === Number(day.id),
    );

    return {
      id: day.id,
      label: day.label,
      enabled: existing?.isActive ?? false,
      from: existing?.startTime ?? "08:00",
      to: existing?.endTime ?? "17:00",
    };
  });
}