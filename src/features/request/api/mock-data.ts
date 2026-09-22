import { Droplets, Hammer, LayoutGrid, Paintbrush, Settings2, Zap } from "lucide-react";
import type { RepairCategory } from "../types/request.types";

export const repairCategories: RepairCategory[] = [
  {
    id: "plumbing",
    label: "لوله‌کشی",
    description: "نشتی، گرفتگی، نصب و تعویض شیرآلات",
    icon: Droplets,
    tint: "bg-cyan-500/10 text-cyan-600",
    commonIssues: ["نشتی لوله", "گرفتگی فاضلاب", "تعویض شیرآلات", "نصب سینک یا توالت"],
    priceRange: { min: 250000, max: 900000 },
  },
  {
    id: "electrical",
    label: "برق‌کاری",
    description: "قطعی برق، نصب پریز و کلید، سیم‌کشی",
    icon: Zap,
    tint: "bg-amber-500/10 text-amber-600",
    commonIssues: ["قطعی برق", "نصب پریز/کلید", "تعویض فیوز و کنتور", "نصب لوستر"],
    priceRange: { min: 200000, max: 800000 },
  },
  {
    id: "carpentry",
    label: "نجاری، درب و پنجره",
    description: "تعمیر و نصب درب، کمد و کابینت",
    icon: Hammer,
    tint: "bg-orange-500/10 text-orange-600",
    commonIssues: ["تعمیر درب", "تعویض قفل و یراق", "ساخت یا تعمیر کمد", "تعمیر پنجره"],
    priceRange: { min: 300000, max: 1200000 },
  },
  {
    id: "tiling",
    label: "کاشی‌کاری و سرامیک",
    description: "تعویض کاشی شکسته، درزگیری، سرامیک‌کاری",
    icon: LayoutGrid,
    tint: "bg-slate-500/10 text-slate-600",
    commonIssues: ["کاشی شکسته", "درزگیری حمام", "سرامیک‌کاری آشپزخانه"],
    priceRange: { min: 400000, max: 2000000 },
  },
  {
    id: "painting",
    label: "رنگ‌آمیزی",
    description: "رنگ دیوار، سقف و نمای داخلی",
    icon: Paintbrush,
    tint: "bg-rose-500/10 text-rose-600",
    commonIssues: ["رنگ دیوار اتاق", "رنگ سقف", "رفع ترک و لکه‌گیری"],
    priceRange: { min: 500000, max: 3000000 },
  },
  {
    id: "general",
    label: "تعمیرات عمومی",
    description: "کارهای کوچک و متفرقه‌ی خانه",
    icon: Settings2,
    tint: "bg-violet-500/10 text-violet-600",
    commonIssues: ["نصب پرده و میله", "نصب تلویزیون روی دیوار", "تعمیرات جزئی"],
    priceRange: { min: 150000, max: 600000 },
  },
];