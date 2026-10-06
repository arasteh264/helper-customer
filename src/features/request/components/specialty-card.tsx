import {
  Briefcase,
  Car,
  Droplets,
  Hammer,
  GraduationCap,
  Laptop,
  Paintbrush,
  ShieldCheck,
  Sparkles,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

import type { Specialty } from "../types/specialty.types";

const iconMap: Record<string, LucideIcon> = {
  wrench: Wrench,
  hammer: Hammer,
  paintbrush: Paintbrush,
  sparkles: Sparkles,
  droplets: Droplets,
  zap: Zap,
  car: Car,
  laptop: Laptop,
  graduationcap: GraduationCap,
  shieldcheck: ShieldCheck,
  briefcase: Briefcase,
};

function getSpecialtyIcon(iconName?: string | null) {
  if (!iconName) return Wrench;
  const key = iconName.toLowerCase().replace(/[^a-z]/g, "");
  return iconMap[key] ?? Wrench;
}

const SpecialtyIcon = ({ iconName }: { iconName?: string | null }) => {
  const Icon = getSpecialtyIcon(iconName);
  return <Icon size={21} />;
};

export function SpecialtyCard({
  specialty,
  selected,
  onSelect,
}: {
  specialty: Specialty;
  selected: boolean;
  onSelect: (specialty: Specialty) => void;
}) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(specialty);
    }
  };

  return (
    <button
      type="button"
      onClick={() => onSelect(specialty)}
      onKeyDown={handleKeyDown}
      aria-pressed={selected}
      className={[
        "group relative flex h-full w-full flex-col items-start gap-2.5 rounded-xl border p-3 text-start transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:gap-3 sm:rounded-2xl sm:p-4",
        selected
          ? "border-primary bg-primary/8 shadow-sm"
          : "border-foreground/10 bg-card hover:border-primary/30 hover:bg-primary/[0.02]",
      ].join(" ")}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-11 sm:w-11">
        <SpecialtyIcon iconName={specialty.icon} />
      </span>
      <div className="w-full">
        <p className="text-[12px] font-semibold leading-5 text-foreground sm:text-sm">
          {specialty.name}
        </p>
        <p className="mt-1 text-[10px] leading-4 text-foreground/55 sm:text-xs sm:leading-5">
          {new Intl.NumberFormat("fa-IR").format(
            specialty.activeProvidersCount,
          )}{" "}
          متخصص فعال
        </p>
      </div>
      {selected && (
        <span className="absolute end-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <span className="text-[10px]">✓</span>
        </span>
      )}
    </button>
  );
}
