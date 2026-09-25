"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

interface ChipsInputProps {
  id?: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  max?: number;
  suggestions?: string[];
  invalid?: boolean;
}

export function ChipsInput({
  id,
  value = [],
  onChange,
  placeholder,
  max = 10,
  suggestions = [],
  invalid = false,
}: ChipsInputProps) {
  const [draft, setDraft] = useState("");
  const full = value.length >= max;
  const add = (raw: string) => {
    const item = raw.trim();
    if (!item || full || value.includes(item)) return;
    onChange([...value, item]);
    setDraft("");
  };

 const remove = (item: string) => onChange(value.filter((v) => v !== item));

  const remaining = suggestions.filter((s) => !value.includes(s)).slice(0, 6);

  return (
    <div>
      <div
        className={[
          "flex min-h-12 flex-wrap items-center gap-2 rounded-xl border bg-background px-3 py-2 transition-colors focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10",
          invalid ? "border-destructive/50" : "border-foreground/15",
        ].join(" ")}
      >
        {value.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 py-1 pe-1.5 ps-3 text-sm text-primary"
          >
            {item}
            <button
              type="button"
              onClick={() => remove(item)}
              aria-label={`حذف ${item}`}
              className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X size={12} />
            </button>
          </span>
        ))}

        <input
          id={id}
          value={draft}
          disabled={full}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "," || e.key === "،") {
              e.preventDefault();
              add(draft);
            } else if (e.key === "Backspace" && !draft && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={() => add(draft)}
          placeholder={full ? `حداکثر ${max} مورد` : placeholder}
          className="min-w-[8rem] flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-foreground/40 disabled:cursor-not-allowed"
        />
      </div>

      {remaining.length > 0 && !full && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs text-foreground/45">پیشنهاد:</span>
          {remaining.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="inline-flex items-center gap-1 rounded-full border border-dashed border-foreground/20 px-2.5 py-1 text-xs text-foreground/60 transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Plus size={12} />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}