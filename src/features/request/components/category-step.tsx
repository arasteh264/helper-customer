import { Check } from "lucide-react";

import { repairCategories } from "../api/mock-data";

export function CategoryStep({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground">چه نوع تعمیری نیاز دارید؟</h2>
      <p className="mt-1 text-sm text-foreground/55">
        نزدیک‌ترین دسته به مشکل‌تان را انتخاب کنید.
      </p>

      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {repairCategories.map((cat) => {
          const Icon = cat.icon;
          const selected = value === cat.id;
          return (
            <li key={cat.id}>
              <button
                type="button"
                onClick={() => onChange(cat.id)}
                aria-pressed={selected}
                className={[
                  "relative flex h-full w-full flex-col items-start gap-3 rounded-2xl border p-4 text-start transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  selected
                    ? "border-primary bg-primary/[0.05] shadow-sm"
                    : "border-foreground/10 bg-card hover:border-primary/30",
                ].join(" ")}
              >
                {selected && (
                  <span className="absolute end-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check size={12} />
                  </span>
                )}
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${cat.tint}`}>
                  <Icon size={22} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{cat.label}</p>
                  <p className="mt-0.5 text-xs leading-5 text-foreground/55">{cat.description}</p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}