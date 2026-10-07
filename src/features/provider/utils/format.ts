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

export const normalizeSheba = (value: string) => {
  const compact = toEnglishDigits(value).replace(/\s+/g, "").toUpperCase();
  if (compact.startsWith("IR")) return compact;
  return /^\d{24}$/.test(compact) ? `IR${compact}` : compact;
};

export const isValidIranianSheba = (value: string) => {
  const sheba = normalizeSheba(value);
  if (!/^IR\d{24}$/.test(sheba)) return false;

  const rearranged = sheba.slice(4) + sheba.slice(0, 4);
  let remainder = 0;
  for (const character of rearranged) {
    const digits = /[A-Z]/.test(character)
      ? String(character.charCodeAt(0) - 55)
      : character;
    for (const digit of digits) {
      remainder = (remainder * 10 + Number(digit)) % 97;
    }
  }
  return remainder === 1;
};

const IRANIAN_BANKS: Record<string, string> = {
  "010": "بانک مرکزی",
  "011": "بانک صنعت و معدن",
  "012": "بانک ملت",
  "013": "بانک رفاه کارگران",
  "014": "بانک مسکن",
  "015": "بانک سپه",
  "016": "بانک کشاورزی",
  "017": "بانک ملی ایران",
  "018": "بانک تجارت",
  "019": "بانک صادرات ایران",
  "020": "بانک توسعه صادرات",
  "021": "پست بانک ایران",
  "022": "بانک توسعه تعاون",
  "051": "بانک توسعه",
  "052": "بانک قرض‌الحسنه مهر ایران",
  "053": "بانک کارآفرین",
  "054": "بانک پارسیان",
  "055": "بانک اقتصاد نوین",
  "056": "بانک سامان",
  "057": "بانک پاسارگاد",
  "058": "بانک سرمایه",
  "059": "بانک سینا",
  "060": "بانک مهر اقتصاد",
  "062": "بانک آینده",
  "063": "بانک انصار",
  "064": "بانک گردشگری",
  "065": "بانک حکمت ایرانیان",
  "066": "بانک دی",
  "069": "بانک ایران‌زمین",
  "070": "بانک رسالت",
  "073": "بانک قرض‌الحسنه مهر ایران",
  "075": "بانک ICT",
  "078": "بانک خاورمیانه",
  "079": "بانک مشترک ایران و ونزوئلا",
};

export const getIranianBankName = (sheba: string) => {
  const normalized = normalizeSheba(sheba);
  if (!isValidIranianSheba(normalized)) return null;
  return IRANIAN_BANKS[normalized.slice(4, 7)] ?? null;
};

export const maskSheba = (sheba: string) =>
  `${sheba.slice(0, 4)} •••• •••• •••• •••• ${sheba.slice(-4)}`;