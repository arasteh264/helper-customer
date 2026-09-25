import { CalendarCheck } from "lucide-react";

interface WorkingHour {
  dayOfWeek: number;
  isActive: boolean;
  startTime: string;
  endTime: string;
}

const ALL_DAYS = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
];

export function ProfileAvailability({
  workingHours,
}: {
  workingHours: WorkingHour[];
}) {
  return (
    <div className="rounded-2xl border border-foreground/10 bg-card p-5 sm:p-6">
      <h2 className="flex items-center gap-1.5 text-base font-semibold text-foreground">
        <CalendarCheck size={17} className="text-primary" />
        ساعات کاری
      </h2>

      <ul className="mt-4 space-y-2">
        {ALL_DAYS.map((day, index) => {
          const workingHour = workingHours.find(
            (item) => item.dayOfWeek === index,
          );

          const on = workingHour?.isActive ?? false;

          return (
            <li
              key={day}
              className="flex items-center justify-between rounded-xl border border-foreground/10 px-3 py-2.5"
            >
              <span
                className={[
                  "text-sm",
                  on
                    ? "font-medium text-foreground"
                    : "text-foreground/35 line-through",
                ].join(" ")}
              >
                {day}
              </span>

              {on ? (
                <span className="text-xs text-foreground/60" dir="ltr">
                  {workingHour.startTime} تا {workingHour.endTime}
                </span>
              ) : (
                <span className="text-xs text-foreground/35">
                  تعطیل
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}