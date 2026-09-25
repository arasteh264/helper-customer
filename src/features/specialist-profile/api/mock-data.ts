// داده‌ی نمونه. در پروژه‌ی واقعی از API / دیتابیس گرفته شود.
import type { ProfileReview, SpecialistProfile } from "../types/specialist-profile.types";

/** پروفایل کامل برای چند متخصص نمونه؛ بقیه‌ی متخصصانِ دایرکتوری با یک نسخه‌ی خلاصه‌شده ساخته می‌شوند */
export const fullProfiles: Record<
  string,
  Omit<SpecialistProfile, "id" | "name" | "field" | "city" | "rating" | "reviewsCount" | "startingPrice" | "verified">
> = {
  "ali-rezaei": {
    headline: "لوله‌کش ساختمان",
    avatar: undefined,
    completedJobs: 210,
    responseRate: 96,
    experienceYears: 9,
    memberSince: "2024-03-10T00:00:00+03:30",
    bio: "لوله‌کش با ۹ سال سابقه در رفع نشتی، نصب شیرآلات و تأسیسات ساختمان. با تعهد به زمان و ضمانت کار، تا رضایت کامل شما همراه‌تان هستم.",
    skills: ["لوله‌کشی", "رفع نشتی", "نصب شیرآلات", "تأسیسات", "نصب آبگرمکن"],
    serviceAreas: ["تهران - منطقه ۳", "تهران - منطقه ۵"],
    portfolioTints: [
      "from-cyan-500/25 via-cyan-500/10 to-transparent",
      "from-sky-500/25 via-sky-500/10 to-transparent",
      "from-cyan-500/20 via-transparent to-transparent",
    ],
    availableDays: ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه"],
    reviews: [
      { id: "r-1", customerName: "نگار مرادی", rating: 5, text: "سر وقت آمدند و نشتی را در کمتر از یک ساعت رفع کردند. خیلی مرتب و حرفه‌ای.", date: "2026-09-18T18:00:00+03:30" },
      { id: "r-2", customerName: "بهرام یزدانی", rating: 5, text: "آبگرمکن را تمیز نصب کردند و نکات نگهداری را هم توضیح دادند.", date: "2026-09-14T20:00:00+03:30" },
      { id: "r-3", customerName: "پگاه ملکی", rating: 4, text: "کار خوب بود، فقط کمی دیر رسیدند.", date: "2026-09-08T12:00:00+03:30" },
    ],
    hasFullProfile: true,
  },
  "sara-ahmadi": {
    headline: "نقاش و دکوراتور",
    avatar: undefined,
    completedJobs: 80,
    responseRate: 91,
    experienceYears: 6,
    memberSince: "2024-11-02T00:00:00+03:30",
    bio: "نقاشی ساختمان و مشاوره‌ی رنگ داخلی با نگاه دکوراتیو. کارهایم را با پوشش کامل وسایل و تمیزکاری بعد از کار تحویل می‌دهم.",
    skills: ["رنگ‌آمیزی داخلی", "کنیتکس", "مشاوره‌ی رنگ", "رفع ترک دیوار"],
    serviceAreas: ["اصفهان - منطقه مرکزی", "اصفهان - شمال"],
    portfolioTints: [
      "from-rose-500/25 via-rose-500/10 to-transparent",
      "from-orange-500/20 via-transparent to-transparent",
    ],
    availableDays: ["شنبه", "دوشنبه", "چهارشنبه", "پنجشنبه"],
    reviews: [
      { id: "r-1", customerName: "الهام ر.", rating: 5, text: "نقاش‌مان در یک آخر هفته نشیمن را کامل عوض کرد. رزرو و پرداخت هم خیلی راحت بود.", date: "2026-09-10T14:00:00+03:30" },
      { id: "r-2", customerName: "کیوان ش.", rating: 4, text: "کیفیت کار خوب بود، رنگ دقیقاً همانی شد که مشاوره داده بودند.", date: "2026-08-30T10:00:00+03:30" },
    ],
    hasFullProfile: true,
  },
  "elham-rostami": {
    headline: "برقکار ساختمان",
    avatar: undefined,
    completedJobs: 190,
    responseRate: 94,
    experienceYears: 7,
    memberSince: "2024-05-20T00:00:00+03:30",
    bio: "برقکار ساختمان با تخصص در رفع قطعی برق، نصب پریز و کلید، و ایمن‌سازی سیم‌کشی خانه‌های قدیمی.",
    skills: ["رفع قطعی برق", "نصب پریز و کلید", "سیم‌کشی", "نصب لوستر"],
    serviceAreas: ["تهران - منطقه ۲", "تهران - منطقه ۶"],
    portfolioTints: [
      "from-amber-500/25 via-amber-500/10 to-transparent",
      "from-yellow-500/20 via-transparent to-transparent",
    ],
    availableDays: ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه"],
    reviews: [
      { id: "r-1", customerName: "حامد ک.", rating: 5, text: "خیلی سریع مشکل قطعی برق رو پیدا و رفع کرد.", date: "2026-09-12T09:00:00+03:30" },
    ],
    hasFullProfile: true,
  },
  "narges-jafari": {
    headline: "نظافت منزل و اداری",
    avatar: undefined,
    completedJobs: 500,
    responseRate: 98,
    experienceYears: 5,
    memberSince: "2024-01-15T00:00:00+03:30",
    bio: "نظافت منزل و محیط اداری با وسایل و مواد شوینده‌ی حرفه‌ای. دقت روی جزئیات، اولویت همیشگی کارم است.",
    skills: ["نظافت منزل", "نظافت اداری", "نظافت بعد از بازسازی", "شیشه‌شویی"],
    serviceAreas: ["تهران - همه‌ی مناطق"],
    portfolioTints: [
      "from-sky-500/20 via-transparent to-transparent",
    ],
    availableDays: ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"],
    reviews: [
      { id: "r-1", customerName: "نازنین ک.", rating: 5, text: "خانه رو بی‌نقص تمیز کردن، حتی گوشه‌هایی که خودم یادم نبود.", date: "2026-09-19T11:00:00+03:30" },
      { id: "r-2", customerName: "آرمان ص.", rating: 5, text: "برای دفتر کار هم رزرو کردیم، عالی بود.", date: "2026-09-01T08:00:00+03:30" },
    ],
    hasFullProfile: true,
  },
  "maryam-hosseini": {
    headline: "وکیل پایه یک دادگستری",
    avatar: undefined,
    completedJobs: 150,
    responseRate: 89,
    experienceYears: 12,
    memberSince: "2023-08-01T00:00:00+03:30",
    bio: "وکیل پایه یک دادگستری با ۱۲ سال سابقه در پرونده‌های ملکی، قراردادها و دعاوی خانواده. مشاوره‌ی اولیه به‌صورت آنلاین هم انجام می‌شود.",
    skills: ["حقوق ملکی", "تنظیم قرارداد", "دعاوی خانواده", "مشاوره‌ی حقوقی آنلاین"],
    serviceAreas: ["تهران"],
    portfolioTints: [],
    availableDays: ["شنبه", "دوشنبه", "چهارشنبه"],
    reviews: [
      { id: "r-1", customerName: "فرهاد ن.", rating: 5, text: "توضیحات کامل و شفاف بود، پرونده رو به بهترین شکل پیش برد.", date: "2026-09-05T16:00:00+03:30" },
    ],
    hasFullProfile: true,
  },
};

/** برای متخصصانی که پروفایل کامل ندارند، یک نسخه‌ی خلاصه ساخته می‌شود */
export function buildFallbackReviews(): ProfileReview[] {
  return [];
}