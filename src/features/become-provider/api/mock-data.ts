// داده‌ی نمونه. در پروژه‌ی واقعی از API / دیتابیس گرفته شود.
import {
  BadgeCheck,
  CalendarClock,
  ClipboardList,
  Coins,
  ShieldCheck,
  Smartphone,
  UserCheck,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export interface Benefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const benefits: Benefit[] = [
  {
    icon: Wallet,
    title: "درآمد از کارهایی که خودتان بلدید",
    description: "بدون واسطه، مستقیم از مشتریانی که به تخصص شما نیاز دارند کار بگیرید.",
  },
  {
    icon: CalendarClock,
    title: "برنامه‌ی کاری دست خودتان",
    description: "ساعات کاری‌تان را خودتان تعیین می‌کنید؛ هر وقت آماده‌اید کار بگیرید.",
  },
  {
    icon: BadgeCheck,
    title: "نشان تأییدشده",
    description: "با تأیید مدارک، نشان اعتماد می‌گیرید و مشتریان راحت‌تر شما را انتخاب می‌کنند.",
  },
  {
    icon: ShieldCheck,
    title: "پرداخت امن و تضمین‌شده",
    description: "پول کار را مستقیم در کیف پول خود دریافت می‌کنید، بدون نگرانی از نکول مشتری.",
  },
];

export interface OnboardingStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const onboardingSteps: OnboardingStep[] = [
  {
    icon: ClipboardList,
    title: "ثبت‌نام و تکمیل پروفایل",
    description: "اطلاعات، تخصص‌ها و نمونه‌کارهای‌تان را وارد کنید.",
  },
  {
    icon: UserCheck,
    title: "احراز هویت",
    description: "کارت ملی و مدرک مهارت را بارگذاری کنید تا نشان تأیید بگیرید.",
  },
  {
    icon: Smartphone,
    title: "دریافت درخواست",
    description: "درخواست‌های نزدیک به شما و متناسب با تخصص‌تان را ببینید.",
  },
  {
    icon: Coins,
    title: "انجام کار و دریافت پول",
    description: "کار را تمام کنید و درآمدتان را در پنل مالی برداشت کنید.",
  },
];

export interface EarningExample {
  field: string;
  jobsPerWeek: number;
  avgPrice: number; // تومان
}

export const earningExamples: EarningExample[] = [
  { field: "لوله‌کش", jobsPerWeek: 6, avgPrice: 400000 },
  { field: "برقکار", jobsPerWeek: 5, avgPrice: 350000 },
  { field: "نظافت‌چی", jobsPerWeek: 8, avgPrice: 250000 },
  { field: "نقاش", jobsPerWeek: 3, avgPrice: 900000 },
];

export interface Faq {
  question: string;
  answer: string;
}

export const providerFaqs: Faq[] = [
  {
    question: "هزینه‌ی عضویت چقدر است؟",
    answer: "ثبت‌نام و ساخت پروفایل کاملاً رایگان است. فقط از کارهایی که از طریق هلپر انجام می‌دهید، کارمزد کمی کسر می‌شود.",
  },
  {
    question: "چقدر طول می‌کشد احراز هویتم انجام شود؟",
    answer: "معمولاً بررسی مدارک بین ۱ تا ۲ روز کاری طول می‌کشد. بعد از تأیید، نشان «تأییدشده» روی پروفایل‌تان می‌آید.",
  },
  {
    question: "کارمزد پلتفرم چقدر است؟",
    answer: "کارمزد بر اساس نوع خدمت متفاوت است و همیشه پیش از تأیید نهاییِ هر کار به‌طور شفاف نمایش داده می‌شود.",
  },
  {
    question: "پول کارها را کِی دریافت می‌کنم؟",
    answer: "بعد از تکمیل و تأیید هر کار، مبلغ به کیف پول شما اضافه می‌شود و می‌توانید هر زمان درخواست برداشت بدهید.",
  },
  {
    question: "آیا می‌توانم هم‌زمان چند نوع خدمت ارائه بدهم؟",
    answer: "بله، می‌توانید چند تخصص را در پروفایل خود ثبت کنید تا درخواست‌های بیشتری ببینید.",
  },
];