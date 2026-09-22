import { Check } from "lucide-react";

import type { RequestStatus } from "../types/customer.types";
import { REQUEST_STEPS, getRequestStep } from "../utils/status-maps";

export function RequestProgress({ status }: { status: RequestStatus }) {
  if (status === "cancelled") {
    return (
      <div className="rounded-xl bg-foreground/[0.04] px-4 py-3 text-center text-sm text-foreground/60">
        این درخواست لغو شده است
      </div>
    );
  }

  const current = getRequestStep(status);

  return (
    <ol className="flex items-center">
      {REQUEST_STEPS.map((label, i) => {
        const done = i < current || status === "completed";
        const isCurrent = i === current && status !== "completed";

        return (
          <li key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <span
                className={[
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  done
                    ? "bg-primary text-primary-foreground"
                    : isCurrent
                      ? "border-2 border-primary bg-primary/10 text-primary"
                      : "border-2 border-foreground/15 text-foreground/35",
                ].join(" ")}
              >
                {done ? <Check size={15} /> : i + 1}
              </span>
              <span
                className={`w-16 text-center text-[11px] leading-4 sm:w-20 ${
                  done || isCurrent ? "font-medium text-foreground" : "text-foreground/40"
                }`}
              >
                {label}
              </span>
            </div>

            {i < REQUEST_STEPS.length - 1 && (
              <span
                className={`mx-1.5 mb-5 h-0.5 flex-1 rounded-full sm:mx-2 ${
                  i < current ? "bg-primary" : "bg-foreground/10"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}