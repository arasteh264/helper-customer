import { Check } from "lucide-react";

import type { RequestStatus } from "../types/customer.types";
import {
  REQUEST_STEPS,
  getRequestNextAction,
  getRequestStep,
} from "../utils/status-maps";

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
    <div>
      <ol className="flex items-start">
        {REQUEST_STEPS.map((label, i) => {
          const done = i < current || status === "completed";
          const isCurrent = i === current && status !== "completed";

          return (
            <li key={label} className="flex min-w-0 flex-1 items-start last:flex-none">
              <div className="flex w-11 shrink-0 flex-col items-center gap-2 sm:w-20">
                <span
                  className={[
                    "flex size-8 items-center justify-center rounded-full text-xs font-semibold transition-colors",
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
                  className={`w-full text-center text-[10px] leading-4 sm:text-xs ${
                    done || isCurrent
                      ? "font-medium text-foreground"
                      : "text-foreground/40"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < REQUEST_STEPS.length - 1 && (
                <span
                  className={`mt-4 h-0.5 min-w-1 flex-1 rounded-full ${
                    i < current ? "bg-primary" : "bg-foreground/10"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
      <p className="mt-5 rounded-xl border border-primary/15 bg-primary/[0.04] px-4 py-3 text-sm leading-6 text-foreground/75">
        <span className="font-semibold text-foreground">اقدام بعدی شما: </span>
        {getRequestNextAction(status)}
      </p>
    </div>
  );
}
