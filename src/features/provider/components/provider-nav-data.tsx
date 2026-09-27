import type { PanelNavItem } from "@/src/components/layout/panel-shell";

export const providerNav: PanelNavItem[] = [
  {
    label: "نمای کلی",
    href: "/provider",
    icon: "layoutDashboard",
    exact: true,
    mobile: true,
  },
    {
    label: "پروفایل",
    href: "/provider/profile",
    icon: "user",
    mobile: true,
  },
  {
    label: "درخواست‌ها",
    href: "/provider/jobs",
    icon: "listChecks",
    mobile: true,
  },
  {
    label: "کیف پول",
    href: "/provider/finance",
    icon: "wallet",
    mobile: true,
  },
];
