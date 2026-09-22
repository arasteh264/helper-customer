import type { PanelNavItem } from "@/src/components/layout/panel-shell";

export const providerNav: PanelNavItem[] = [
  { label: "نمای کلی", href: "/provider", icon: "layoutDashboard", exact: true, mobile: true },
  { label: "درخواست‌ها", href: "/provider/requests", icon: "listChecks", mobile: true },
  // بقیه‌ی آیتم‌های منوی provider رو با همین الگو اضافه کن
];