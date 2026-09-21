import { z } from "zod";

export const providerProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "نام و نام خانوادگی را وارد کنید")
    .max(60, "نام خیلی طولانی است"),
  headline: z
    .string()
    .trim()
    .min(3, "عنوان تخصصی را وارد کنید (مثلاً: لوله‌کش ساختمان)")
    .max(80, "حداکثر ۸۰ کاراکتر"),
  city: z.string().trim().min(2, "شهر را وارد کنید"),
  // اعداد به‌صورت رشته نگه داشته می‌شوند تا با ورودی فرم سازگار باشند
  experienceYears: z
    .string()
    .regex(/^\d{1,2}$/, "سابقه را به‌صورت عدد وارد کنید (۰ تا ۹۹)"),
  bio: z
    .string()
    .trim()
    .min(50, "حداقل ۵۰ کاراکتر درباره‌ی خودتان و تجربه‌تان بنویسید")
    .max(600, "حداکثر ۶۰۰ کاراکتر"),
  skills: z
    .array(z.string())
    .min(1, "حداقل یک تخصص اضافه کنید")
    .max(10, "حداکثر ۱۰ تخصص"),
  serviceAreas: z
    .array(z.string())
    .min(1, "حداقل یک محدوده اضافه کنید")
    .max(10, "حداکثر ۱۰ محدوده"),
  startingPrice: z
    .string()
    .regex(/^\d{4,9}$/, "قیمت را به تومان و به‌صورت عدد وارد کنید"),
  email: z.string().trim().email("ایمیل معتبر نیست").or(z.literal("")),
});

export type ProviderProfileValues = z.infer<typeof providerProfileSchema>;