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
      { label: "همه‌ی خدمات", href: "/services", highlight: true },
    ],
  },
  {
    title: "هلپر",
    links: [
      { label: "درباره‌ی ما", href: "/about" },
      { label: "ایمیل پشتیبانی", href: "mailto:support@helper.ir" },
      { label: "وبلاگ", href: "/blog" },
      {
        label: "پیوستن به‌عنوان متخصص",
        href: "/become-provider",
        highlight: true,
      },
    ],
  },
  {
    title: "پشتیبانی",
    links: [
      { label: "ثبت درخواست", href: "/request" },
      { label: "پیگیری درخواست‌ها", href: "/customer/requests" },
      { label: "قوانین و مقررات", href: "/terms" },
      { label: "حریم خصوصی", href: "/privacy" },
    ],
  },
];

export const contactInfo = {
  email: "support@helper.ir",
};