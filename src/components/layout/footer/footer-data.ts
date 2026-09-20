export interface FooterLink {
  label: string;
  href: string;
  highlight?: boolean;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export const footerColumns: FooterColumn[] = [
  {
    title: "خدمات پرطرفدار",
    links: [
      { label: "نظافت و خدمات منزل", href: "/services/cleaning" },
      { label: "تعمیرات ساختمان", href: "/services/repairs" },
      { label: "لوله‌کشی و تأسیسات", href: "/services/plumbing" },
      { label: "برق‌کاری", href: "/services/electrical" },
      { label: "تدریس خصوصی", href: "/services/education" },
      { label: "مشاوره حقوقی", href: "/services/legal" },
      { label: "طراحی و برنامه‌نویسی", href: "/services/tech" },
      { label: "همه‌ی خدمات", href: "/services", highlight: true },
    ],
  },
  {
    title: "هلپر",
    links: [
      { label: "درباره‌ی ما", href: "/about" },
      { label: "تماس با ما", href: "/contact" },
      { label: "وبلاگ", href: "/blog" },
      { label: "فرصت‌های شغلی", href: "/careers" },
      {
        label: "پیوستن به‌عنوان متخصص",
        href: "/register?role=specialist",
        highlight: true,
      },
    ],
  },
  {
    title: "پشتیبانی",
    links: [
      { label: "مرکز راهنما", href: "/help" },
      { label: "سؤالات متداول", href: "/faq" },
      { label: "پیگیری درخواست", href: "/dashboard/requests" },
      { label: "قوانین و مقررات", href: "/terms" },
      { label: "حریم خصوصی", href: "/privacy" },
    ],
  },
];

export const contactInfo = {
  phone: "۰۲۱-۱۲۳۴۵۶۷۸",
  phoneHref: "tel:+982112345678",
  email: "support@helper.ir",
  hours: "همه‌روزه ۸ تا ۲۲",
};

export const socials = [
  { id: "instagram", label: "اینستاگرام", href: "https://instagram.com/" },
  { id: "telegram", label: "تلگرام", href: "https://t.me/" },
  { id: "linkedin", label: "لینکدین", href: "https://linkedin.com/" },
] as const;