import {
  BrushCleaning,
  Car,
  Droplets,
  FileText,
  GraduationCap,
  Hammer,
  HeartPulse,
  Laptop,
  Paintbrush,
  Scale,
  Sparkles,
  Truck,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { SpecialtyGroup } from "@/src/features/request/types/specialty.types";

export interface CatalogCategory {
  id: string;
  slug: string;
  label: string;
  icon: LucideIcon;
  svgKey: string;
  imageUrl: string | null;
  tint: string;
  href: string;
}

const fallbackSvgKeys: Record<string, string> = {
  "building-renovation": "repair",
  "appliance-repair": "repair",
  "cleaning-services": "cleaning",
  transportation: "moving",
  "beauty-services": "beauty",
  "gardening-services": "gardening",
  "installation-services": "home",
  "care-services": "health",
  "education-services": "education",
  "automotive-services": "auto",
  repairs: "repair",
  cleaning: "cleaning",
  electrical: "electrical",
  plumbing: "plumbing",
  painting: "painting",
  moving: "moving",
  education: "education",
  legal: "legal",
  tech: "tech",
  photo: "painting",
  health: "health",
  auto: "auto",
  home: "home",
  default: "default",
};

const fallbackIcons: Record<string, LucideIcon> = {
  "building-renovation": Hammer,
  "appliance-repair": Wrench,
  "cleaning-services": Sparkles,
  transportation: Truck,
  "beauty-services": HeartPulse,
  "gardening-services": Sparkles,
  "installation-services": Zap,
  "care-services": HeartPulse,
  "education-services": GraduationCap,
  "automotive-services": Car,
  repairs: Hammer,
  cleaning: Sparkles,
  electrical: Zap,
  plumbing: Droplets,
  painting: Paintbrush,
  moving: Truck,
  education: GraduationCap,
  legal: Scale,
  tech: Laptop,
  photo: BrushCleaning,
  health: HeartPulse,
  auto: Car,
  home: Wrench,
  default: FileText,
};

const fallbackTints: Record<string, string> = {
  "building-renovation": "bg-orange-500/10 text-orange-600",
  "appliance-repair": "bg-amber-500/10 text-amber-600",
  "cleaning-services": "bg-sky-500/10 text-sky-600",
  transportation: "bg-emerald-500/10 text-emerald-600",
  "beauty-services": "bg-rose-500/10 text-rose-600",
  "gardening-services": "bg-lime-500/10 text-lime-700",
  "installation-services": "bg-cyan-500/10 text-cyan-600",
  "care-services": "bg-red-500/10 text-red-600",
  "education-services": "bg-indigo-500/10 text-indigo-600",
  "automotive-services": "bg-teal-500/10 text-teal-600",
  repairs: "bg-orange-500/10 text-orange-600",
  cleaning: "bg-sky-500/10 text-sky-600",
  electrical: "bg-amber-500/10 text-amber-600",
  plumbing: "bg-cyan-500/10 text-cyan-600",
  painting: "bg-rose-500/10 text-rose-600",
  moving: "bg-emerald-500/10 text-emerald-600",
  education: "bg-indigo-500/10 text-indigo-600",
  legal: "bg-violet-500/10 text-violet-600",
  tech: "bg-teal-500/10 text-teal-600",
  photo: "bg-pink-500/10 text-pink-600",
  health: "bg-red-500/10 text-red-600",
  auto: "bg-lime-500/10 text-lime-700",
  default: "bg-primary/10 text-primary",
};

export function normalizeSpecialtyGroup(item: SpecialtyGroup): CatalogCategory {
  const slug = item.slug ?? item.id;
  const key = slug.toLowerCase();
  const icon = fallbackIcons[key] ?? fallbackIcons.default;
  const tint = fallbackTints[key] ?? fallbackTints.default;
  const svgKey = fallbackSvgKeys[key] ?? fallbackSvgKeys.default;

  return {
    id: item.id,
    slug,
    label: item.name,
    icon,
    svgKey,
    imageUrl: item.icon ?? null,
    tint,
    href: `/services/${slug}`,
  };
}
