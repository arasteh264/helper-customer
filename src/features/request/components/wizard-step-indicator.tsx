import { Check } from "lucide-react";

import type { WizardStepId } from "../types/request.types";

const LABELS: Record<WizardStepId, string> = {
  category: "نوع کار",
  details: "جزئیات",
  address: "آدرس",
  schedule: "زمان و بودجه",
  review: "تأیید نهایی",
};

export function WizardStepIndicator({
  steps,
  currentIndex,
  onStepClick,
}: {
  steps: WizardStepId[];
  currentIndex: number;
  onStepClick: (id: WizardStepId) => void;
}) {
  return (
    <ol className="flex items-start">
      {steps.map((id, i) => {
        const done = i < currentIndex;
        const current = i === currentIndex;

        return (
          <li key={id} className="flex flex-1 items-start last:flex-none">
            <button
              type="button"
              onClick={() => onStepClick(id)}
              disabled={i > currentIndex}
              aria-current={current ? "step" : undefined}
              className="flex flex-col items-center gap-2 disabled:cursor-not-allowed"
            >
              <span
                className={[
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  done
                    ? "bg-primary text-primary-foreground"
                    : current
                      ? "border-2 border-primary bg-primary/10 text-primary"
                      : "border-2 border-foreground/15 text-foreground/35",
                ].join(" ")}
              >
                {done ? <Check size={15} /> : i + 1}
              </span>
              <span
                className={`hidden w-20 text-center text-[11px] leading-4 sm:block ${
                  done || current ? "font-medium text-foreground" : "text-foreground/40"
                }`}
              >
                {LABELS[id]}
              </span>
            </button>

            {i < steps.length - 1 && (
              <span
                className={`mx-1.5 mt-4 h-0.5 flex-1 rounded-full sm:mt-4 ${
                  i < currentIndex ? "bg-primary" : "bg-foreground/10"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}