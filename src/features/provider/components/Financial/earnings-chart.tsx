import { formatCompactMoney, formatMoney } from "../../utils/format";

interface Props {
  data: { label: string; amount: number }[];
}

/** نمودار میله‌ای ساده با CSS (بدون وابستگی به کتابخانه‌ی نمودار) */
export function EarningsChart({ data }: Props) {
  const max = Math.max(...data.map((d) => d.amount), 1);
  const lastIndex = data.length - 1;

  const summary = data
    .map((d) => `${d.label}: ${formatMoney(d.amount)}`)
    .join("، ");

  return (
    <div role="img" aria-label={`نمودار درآمد ماهانه. ${summary}`}>
      <div className="flex h-52 items-end gap-2 sm:gap-4" aria-hidden>
        {data.map((d, i) => {
          const height = Math.max((d.amount / max) * 100, 4);
          const current = i === lastIndex;
          return (
            <div
              key={d.label}
              className="group flex h-full flex-1 flex-col items-center justify-end gap-2"
              title={`${d.label}: ${formatMoney(d.amount)}`}
            >
              <span
                className={`text-[11px] font-medium ${
                  current ? "text-primary" : "text-foreground/50"
                }`}
              >
                {formatCompactMoney(d.amount)}
              </span>
              <div
                className={[
                  "w-full max-w-[3.5rem] rounded-t-lg transition-all duration-500 group-hover:opacity-80",
                  current
                    ? "bg-gradient-to-t from-primary to-primary/70"
                    : "bg-primary/25",
                ].join(" ")}
                style={{ height: `${height}%` }}
              />
            </div>
          );
        })}
      </div>

      <div
        className="mt-3 flex gap-2 border-t border-foreground/10 pt-3 sm:gap-4"
        aria-hidden
      >
        {data.map((d, i) => (
          <span
            key={d.label}
            className={`flex-1 text-center text-[11px] sm:text-xs ${
              i === lastIndex
                ? "font-semibold text-foreground"
                : "text-foreground/50"
            }`}
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}
