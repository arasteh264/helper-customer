import {
  Heart,
  LayoutDashboard,
  ListChecks,
  MapPin,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { PanelNavItem } from "@/src/components/layout/panel-shell";

export const customerNav: PanelNavItem[] = [
  { label: "نمای کلی", href: "/customer", icon: "layoutDashboard", exact: true, mobile: true },
  { label: "درخواست‌ها", href: "/customer/requests", icon: "listChecks", mobile: true },
  { label: "آدرس‌ها", href: "/customer/addresses", icon: "mapPin", mobile: true },
  { label: "علاقه‌مندی‌ها", href: "/customer/favorites", icon: "heart", mobile: true },
  { label: "کیف پول", href: "/customer/wallet", icon: "wallet", mobile: true },
];