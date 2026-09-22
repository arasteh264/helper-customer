import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  /** توضیح کوچک زیر مقدار، مثلاً «۱۴٪ بیشتر از ماه قبل» */
  hint?: string;
  hintTone?: "positive" | "negative" | "neutral";
}

const HINT_TONES = {
  positive: "text-green-600",
  negative: "text-destructive",
  neutral: "text-foreground/50",
};

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  hintTone = "neutral",
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-foreground/10 bg-card p-4 sm:p-5">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon size={20} />
      </span>
      <p className="mt-4 text-xs text-foreground/55 sm:text-sm">{label}</p>
      <p className="mt-1 text-xl font-bold text-foreground sm:text-2xl">
        {value}
      </p>
      {hint && (
        <p className={`mt-1 text-xs ${HINT_TONES[hintTone]}`}>{hint}</p>
      )}
    </div>
  );
}