import { z } from "zod";

export const addressSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "یک عنوان برای آدرس بنویسید (مثلاً: منزل)")
    .max(30, "حداکثر ۳۰ کاراکتر"),
  type: z.enum(["home", "work", "other"]),
  receiverName: z.string().trim().min(3, "نام تحویل‌گیرنده را وارد کنید").max(60),
  receiverPhone: z
    .string()
    .regex(/^09\d{9}$/, "شماره موبایل را صحیح وارد کنید (مثال: ۰۹۱۲۳۴۵۶۷۸۹)"),
  city: z.string().trim().min(2, "شهر را وارد کنید"),
  fullAddress: z
    .string()
    .trim()
    .min(10, "آدرس را کامل‌تر بنویسید (خیابان، کوچه و …)")
    .max(200, "حداکثر ۲۰۰ کاراکتر"),
  plaque: z.string().trim().min(1, "پلاک را وارد کنید").max(10),
  unit: z.string().trim().max(10, "حداکثر ۱۰ کاراکتر"),
  postalCode: z.string().regex(/^\d{10}$/, "کد پستی باید ۱۰ رقم باشد"),
  isDefault: z.boolean(),
});

export type AddressValues = z.infer<typeof addressSchema>;