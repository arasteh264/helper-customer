export interface FileRule {
  /** انواع مجاز، مثل "image/*" یا "application/pdf" */
  accept: string[];
  maxBytes: number;
  typeError: string;
  sizeError: string;
}

const MB = 1024 * 1024;

export const FILE_RULES = {
  avatar: {
    accept: ["image/*"],
    maxBytes: 2 * MB,
    typeError: "فقط فایل تصویری انتخاب کنید",
    sizeError: "حجم عکس باید کمتر از ۲ مگابایت باشد",
  },
  document: {
    accept: ["image/*", "application/pdf"],
    maxBytes: 5 * MB,
    typeError: "فقط تصویر یا فایل PDF مجاز است",
    sizeError: "حجم فایل باید کمتر از ۵ مگابایت باشد",
  },
} satisfies Record<string, FileRule>;

/** اگر فایل معتبر باشد null، وگرنه متن خطا را برمی‌گرداند */
export function validateFile(file: File, rule: FileRule): string | null {
  const okType = rule.accept.some((pattern) =>
    pattern.endsWith("/*")
      ? file.type.startsWith(pattern.slice(0, -1))
      : file.type === pattern
  );
  if (!okType) return rule.typeError;
  if (file.size > rule.maxBytes) return rule.sizeError;
  return null;
}