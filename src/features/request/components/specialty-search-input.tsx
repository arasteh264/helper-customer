import { Search, X } from "lucide-react";

export function SpecialtySearchInput({
  value,
  onChange,
  onClear,
}: {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="relative">
      <Search
        size={18}
        className="pointer-events-none absolute inset-y-0 start-4 my-auto text-foreground/45"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="جستجوی تخصص..."
        className="h-12 w-full rounded-2xl border border-foreground/10 bg-background ps-11 pe-11 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/15"
        aria-label="جستجوی تخصص"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="پاک‌کردن جستجو"
          className="absolute inset-y-0 end-3 my-auto inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground/55 transition-colors hover:bg-foreground/[0.05] hover:text-foreground"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
