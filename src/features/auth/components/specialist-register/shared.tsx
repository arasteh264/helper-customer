import { toPersianDigits } from "@/src/utils/format";
import { AlertCircle } from "lucide-react";

export const ICON_CLS =
  "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground/35";

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-xs text-destructive">
      {message}
    </p>
  );
}

export function SectionTitle({ index, title }: { index: number; title: string }) {
  return (
    <div className="flex items-center gap-2.5 pt-1">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
        {toPersianDigits(index)}
      </span>
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <span className="h-px flex-1 bg-foreground/10" />
    </div>
  );
}

export function ServerError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="mb-5 flex items-start gap-2.5 rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive"
    >
      <AlertCircle size={18} className="mt-0.5 shrink-0" />
      <span className="leading-6">{message}</span>
    </div>
  );
}