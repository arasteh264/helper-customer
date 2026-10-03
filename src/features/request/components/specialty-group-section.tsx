import { ChevronDown } from "lucide-react";

import type { Specialty, SpecialtyGroup } from "../types/specialty.types";
import { SpecialtyCard } from "./specialty-card";

export function SpecialtyGroupSection({
  group,
  selectedId,
  expanded,
  onToggle,
  onSelect,
}: {
  group: SpecialtyGroup;
  selectedId: string | null;
  expanded: boolean;
  onToggle: (groupId: string) => void;
  onSelect: (specialty: Specialty) => void;
}) {
  const specialties = group.specialties ?? [];

  return (
    <section className="rounded-2xl border border-foreground/10 bg-background/40">
      <button
        type="button"
        onClick={() => onToggle(group.id)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-start"
        aria-expanded={expanded}
      >
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {group.name}
          </h3>
          <p className="mt-0.5 text-xs text-foreground/50">
            {new Intl.NumberFormat("fa-IR").format(specialties.length)} تخصص
          </p>
        </div>

        <span
          className={[
            "flex h-7 w-7 items-center justify-center rounded-full bg-foreground/[0.03] text-foreground/60 transition-transform",
            expanded ? "rotate-180" : "",
          ].join(" ")}
        >
          <ChevronDown size={16} />
        </span>
      </button>

      {expanded && (
        <div className="border-t border-foreground/10 px-3 pb-3 pt-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {specialties.map((specialty) => (
              <SpecialtyCard
                key={specialty.id}
                specialty={specialty}
                selected={selectedId === specialty.id}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
