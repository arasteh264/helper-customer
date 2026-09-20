import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "start" | "center";
  tone?: "default" | "inverted";
  action?: ReactNode;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "start",
  tone = "default",
  action,
  className = "",
}: SectionHeadingProps) {
  const isCenter = align === "center";
  const inverted = tone === "inverted";

  return (
    <div
      className={[
        "flex flex-col gap-4",
        isCenter
          ? "items-center text-center"
          : "sm:flex-row sm:items-end sm:justify-between",
        className,
      ].join(" ")}
    >
      <div className="max-w-2xl">
        {eyebrow && (
          <span
            className={[
              "mb-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
              inverted
                ? "bg-white/10 text-white/80"
                : "bg-primary/10 text-primary",
            ].join(" ")}
          >
            {eyebrow}
          </span>
        )}
        <h2
          className={[
            "text-2xl font-bold leading-snug tracking-tight sm:text-3xl",
            inverted ? "text-white" : "text-foreground",
          ].join(" ")}
        >
          {title}
        </h2>
        {description && (
          <p
            className={[
              "mt-3 text-sm leading-7 sm:text-base",
              inverted ? "text-white/65" : "text-foreground/60",
            ].join(" ")}
          >
            {description}
          </p>
        )}
      </div>

      {!isCenter && action}
    </div>
  );
}