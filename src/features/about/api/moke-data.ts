// داده‌ی نمونه. در پروژه‌ی واقعی از API / دیتابیس گرفته شود.
import {
  BadgeCheck,
  Coins,
  Handshake,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface Stat {
  label: string;
  value: string;
}

export const stats: Stat[] = [
  { label: "کاربر فعال", value: "۱۲,۰۰۰+" },
  { label: "متخصص تأییدشده", value: "۳,۰۰۰+" },
  { label: "کار تکمیل‌شده", value: "۴۵,۰۰۰+" },
  { label: "شهر تحت پوشش", value: "۶" },
];

export interface Value {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const values: Value[] = [
  {
    icon: ShieldCheck,
    title: "اعتماد، پیش از هر چیز",
    description: "همه‌ی متخصصان قبل از فعالیت، از نظر هویت و سابقه بررسی و تأیید می‌شوند.",
  },
  {
    icon: Coins,
    title: "شفافیت در قیمت",
    description: "قیمت پایه را پیش از انتخاب متخصص می‌بینید، بدون هیچ هزینه‌ی پنهانی.",
  },
  {
    icon: Sparkles,
    title: "کیفیت، نه فقط سرعت",
    description: "به هر کار به اندازه‌ی خودش اهمیت می‌دهیم، حتی کوچک‌ترین تعمیرات.",
  },
  {
    icon: HeartHandshake,
    title: "احترام به وقت شما",
    description: "از رزرو تا انجام کار، وقت مشتری و متخصص هر دو برایمان مهم است.",
  },
];

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export const timeline: TimelineItem[] = [
  {
    year: "۱۴۰۱",
    title: "شروع کار در تهران",
    description: "هلپر با یک تیم کوچک و چند صد متخصص در حوزه‌ی تعمیرات ساختمان کار خود را آغاز کرد.",
  },
  {
    year: "۱۴۰۲",
    title: "گسترش به حوزه‌های تخصصی جدید",
    description: "خدمات حقوقی، آموزشی و طراحی هم به دسته‌بندی‌های هلپر اضافه شد.",
  },
  {
    year: "۱۴۰۳",
    title: "ورود به شهرهای بزرگ دیگر",
    description: "اصفهان، مشهد، شیراز و تبریز به شهرهای تحت پوشش هلپر پیوستند.",
  },
  {
    year: "۱۴۰۵",
    title: "عبور از مرز ۳٬۰۰۰ متخصص فعال",
    description: "امروز هلپر یکی از بزرگ‌ترین شبکه‌های متخصصان تأییدشده‌ی کشور است.",
  },
];

export interface TeamMember {
  name: string;
  role: string;
}

export const team: TeamMember[] = [
  { name: "سینا کاظمی", role: "مدیرعامل و بنیان‌گذار" },
  { name: "مهسا رضوی", role: "مدیر محصول" },
  { name: "آرش نوروزی", role: "مدیر فنی" },
  { name: "لیلا صادقیان", role: "مدیر عملیات" },
  { name: "پویا امیری", role: "مدیر تجربه‌ی متخصصان" },
  { name: "نازنین کریمی", role: "مدیر پشتیبانی مشتریان" },
];