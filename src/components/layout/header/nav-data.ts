import type { IconKey } from "@/src/features/provider/lib/icons";


export interface HeaderUser {
  name: string;
  image?: string | null;
  role?: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface ServiceMenuItem {
  label: string;
  description: string;
  href: string;
  icon: IconKey;
  tint: string;
}

export const navLinks: NavLink[] = [
  { label: "متخصصان", href: "/specialists" },
  { label: "نحوه‌ی کار", href: "/#how-it-works" },
  { label: "وبلاگ", href: "/blog" },
  { label: "درباره‌ی ما", href: "/about" },
];

export const fallbackServiceMenuItems: ServiceMenuItem[] = [
  {
    label: "ساختمان و بازسازی",
    description: "خدمات تعمیر و بازسازی خانه",
    href: "/services/building-renovation",
    icon: "hammer",
    tint: "bg-orange-500/10 text-orange-600",
  },
  {
    label: "تعمیرات لوازم",
    description: "تعمیر و سرویس لوازم منزل",
    href: "/services/appliance-repair",
    icon: "hammer",
    tint: "bg-amber-500/10 text-amber-600",
  },
  {
    label: "نظافت",
    description: "نظافت منزل و محل کار",
    href: "/services/cleaning-services",
    icon: "sparkles",
    tint: "bg-sky-500/10 text-sky-600",
  },
  {
    label: "حمل‌ونقل",
    description: "جابجایی و خدمات باربری",
    href: "/services/transportation",
    icon: "droplets",
    tint: "bg-emerald-500/10 text-emerald-600",
  },
  {
    label: "خدمات زیبایی",
    description: "خدمات زیبایی و مراقبت شخصی",
    href: "/services/beauty-services",
    icon: "heartPulse",
    tint: "bg-rose-500/10 text-rose-600",
  },
  {
    label: "خدمات باغبانی",
    description: "نگهداری و رسیدگی به فضای سبز",
    href: "/services/gardening-services",
    icon: "sparkles",
    tint: "bg-lime-500/10 text-lime-700",
  },
  {
    label: "نصب و راه‌اندازی",
    description: "نصب و راه‌اندازی تجهیزات",
    href: "/services/installation-services",
    icon: "zap",
    tint: "bg-cyan-500/10 text-cyan-600",
  },
  {
    label: "مراقبت و پرستاری",
    description: "مراقبت و پرستاری در منزل",
    href: "/services/care-services",
    icon: "heartPulse",
    tint: "bg-red-500/10 text-red-600",
  },
  {
    label: "خدمات آموزشی",
    description: "آموزش و تدریس خصوصی",
    href: "/services/education-services",
    icon: "graduationCap",
    tint: "bg-indigo-500/10 text-indigo-600",
  },
  {
    label: "خدمات خودرو",
    description: "تعمیر و سرویس خودرو",
    href: "/services/automotive-services",
    icon: "car",
    tint: "bg-teal-500/10 text-teal-600",
  },
];

export function isActivePath(pathname: string, href: string) {
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const serviceIconByCategory: Record<string, IconKey> = {
  repair: "hammer",
  cleaning: "sparkles",
  electrical: "zap",
  plumbing: "droplets",
  painting: "paintbrush",
  moving: "droplets",
  beauty: "heartPulse",
  gardening: "sparkles",
  home: "zap",
  health: "heartPulse",
  education: "graduationCap",
  auto: "car",
  legal: "scale",
  tech: "laptop",
  default: "sparkles",
};

export function getServiceIconKey(categoryKey: string): IconKey {
  return serviceIconByCategory[categoryKey] ?? serviceIconByCategory.default;
}