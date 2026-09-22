/**
 * فرمت‌کننده‌های مشترک بین feature ها (پول، تاریخ، اعداد فارسی)
 */
const TZ = "Asia/Tehran";

const num = new Intl.NumberFormat("fa-IR");

export const formatNumber = (n: number) => num.format(n);

export const formatMoney = (n: number) => `${num.format(Math.abs(n))} تومان`;

/** مبلغ کوتاه‌شده برای برچسب نمودار: ۱۲٫۶ م  یا  ۵۰۰ هزار */
export const formatCompactMoney = (n: number) => {
  if (n >= 1_000_000) return `${num.format(Math.round(n / 100_000) / 10)} م`;
  if (n >= 1_000) return `${num.format(Math.round(n / 1_000))} هزار`;
  return num.format(n);
};

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeZone: TZ }).format(
    new Date(iso)
  );

export const formatDateTime = (iso: string) =>
  new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: TZ,
  }).format(new Date(iso));

/** تبدیل ارقام فارسی و عربی به انگلیسی */
export const toEnglishDigits = (value: string) =>
  value
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));

/** تبدیل ارقام انگلیسی به فارسی */
export const toPersianDigits = (value: string | number) =>
  String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

export const maskSheba = (sheba: string) =>
  `${sheba.slice(0, 4)} •••• •••• •••• •••• ${sheba.slice(-4)}`;