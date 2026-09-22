import type { ReactNode } from "react";

interface SectionCardProps {
  /** شناسه برای لینک‌های لنگر (مثلاً از کارت تکمیل پروفایل) */
  id?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SectionCard({
  id,
  title,
  description,
  action,
  children,
  className = "",
}: SectionCardProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 rounded-2xl border border-foreground/10 bg-card p-5 sm:p-6 ${className}`}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-foreground sm:text-lg">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-sm leading-6 text-foreground/55">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}