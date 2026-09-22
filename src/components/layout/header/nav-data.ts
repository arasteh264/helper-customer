import { IconKey } from "@/src/features/provider/lib/icons";


export interface HeaderUser {
  name: string;
  image?: string | null;
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

export const serviceMenuItems: ServiceMenuItem[] = [
  {
    label: "تعمیرات ساختمان",
    description: "نجار، جوشکار، کاشی‌کار و …",
    href: "/services/repairs",
    icon: "hammer",
    tint: "bg-orange-500/10 text-orange-600",
  },
  {
    label: "نظافت و خدمات منزل",
    description: "منزل، اداره، پس از بازسازی",
    href: "/services/cleaning",
    icon: "sparkles",
    tint: "bg-sky-500/10 text-sky-600",
  },
  {
    label: "برق و لوله‌کشی",
    description: "تعمیر، نصب و تأسیسات",
    href: "/services/electrical",
    icon: "zap",
    tint: "bg-amber-500/10 text-amber-600",
  },
  {
    label: "نقاشی و دکوراسیون",
    description: "نقاشی ساختمان و طراحی داخلی",
    href: "/services/painting",
    icon: "paintbrush",
    tint: "bg-rose-500/10 text-rose-600",
  },
  {
    label: "آموزش و تدریس خصوصی",
    description: "درسی، زبان، موسیقی و مهارت",
    href: "/services/education",
    icon: "graduationCap",
    tint: "bg-indigo-500/10 text-indigo-600",
  },
  {
    label: "حقوقی و مشاوره",
    description: "وکیل، مشاور مالیاتی و کسب‌وکار",
    href: "/services/legal",
    icon: "scale",
    tint: "bg-violet-500/10 text-violet-600",
  },
  {
    label: "طراحی و برنامه‌نویسی",
    description: "سایت، اپلیکیشن، UI/UX",
    href: "/services/tech",
    icon: "laptop",
    tint: "bg-teal-500/10 text-teal-600",
  },
  {
    label: "عکاسی و فیلم‌برداری",
    description: "مراسم، محصول، تبلیغاتی",
    href: "/services/photo",
    icon: "camera",
    tint: "bg-pink-500/10 text-pink-600",
  },
  {
    label: "سلامت و زیبایی",
    description: "آرایشگر، مربی، مراقبت در منزل",
    href: "/services/health",
    icon: "heartPulse",
    tint: "bg-red-500/10 text-red-600",
  },
  {
    label: "خودرو و مکانیکی",
    description: "تعمیر، امداد و خدمات در محل",
    href: "/services/auto",
    icon: "car",
    tint: "bg-lime-500/10 text-lime-700",
  },
  {
    label: "اسباب‌کشی و حمل‌ونقل",
    description: "باربری، بسته‌بندی و جابه‌جایی",
    href: "/services/moving",
    icon: "droplets",
    tint: "bg-cyan-500/10 text-cyan-600",
  },
];

export function isActivePath(pathname: string, href: string) {
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}