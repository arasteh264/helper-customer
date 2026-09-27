import { Check, Wrench } from "lucide-react";
import type { ServiceCategory } from "../api/request.api";

export function CategoryStep({
  value,
  onChange,
  categories,
}: {
  value: string;
  onChange: (id: string) => void;
  categories: ServiceCategory[];
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground">
        چه نوع تعمیری نیاز دارید؟
      </h2>
      <p className="mt-1 text-sm text-foreground/55">
        این تخصص‌ها درخواست شما را دریافت می‌کنند.
      </p>

      {categories.length === 0 ? (
        <p className="mt-5 rounded-xl bg-foreground/[0.04] p-4 text-sm text-foreground/60">
          فعلاً متخصص تأییدشده‌ای در این دسته‌ها فعال نیست.
        </p>
      ) : (
        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {categories.map((category) => {
            const selected = value === category.name;
            return (
              <li key={category.id}>
                <button
                  type="button"
                  onClick={() => onChange(category.name)}
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
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Wrench size={21} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {category.name}
                    </p>
                    <p className="mt-0.5 text-xs leading-5 text-foreground/55">
                      {new Intl.NumberFormat("fa-IR").format(
                        category.providerCount,
                      )}{" "}
                      متخصص فعال
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
