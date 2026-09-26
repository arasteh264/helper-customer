import { z } from "zod";

export const specialistRegisterSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "نام و نام خانوادگی را وارد کنید")
    .max(60, "نام و نام خانوادگی خیلی طولانی است"),

  mobile: z
    .string()
    .regex(/^09\d{9}$/, "شماره موبایل را به‌صورت صحیح وارد کنید (مثال: ۰۹۱۲۳۴۵۶۷۸۹)"),

  email: z.string().trim().email("ایمیل واردشده معتبر نیست").or(z.literal("")),

  categoryId: z.string().min(1, "دسته‌ی کاری اصلی خود را انتخاب کنید"),

  city: z.string().trim().min(2, "شهر را وارد کنید").max(40, "حداکثر ۴۰ کاراکتر"),

  password: z
    .string()
    .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
    .regex(/[A-Za-z]/, "رمز عبور باید شامل حداقل یک حرف انگلیسی باشد")
    .regex(/\d/, "رمز عبور باید شامل حداقل یک عدد باشد"),

  terms: z
    .boolean()
    .refine((v) => v === true, "برای ادامه باید قوانین را بپذیرید"),
});

export type SpecialistRegisterValues = z.infer<typeof specialistRegisterSchema>;