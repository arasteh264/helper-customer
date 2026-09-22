import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "نام و نام خانوادگی را وارد کنید")
    .max(60, "نام و نام خانوادگی خیلی طولانی است"),

  phone: z
    .string()
    .regex(/^09\d{9}$/, "شماره موبایل را به‌صورت صحیح وارد کنید (مثال: ۰۹۱۲۳۴۵۶۷۸۹)"),

  email: z
    .string()
    .trim()
    .email("ایمیل واردشده معتبر نیست"),
    

  password: z
    .string()
    .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
    .regex(/[A-Za-z]/, "رمز عبور باید شامل حداقل یک حرف انگلیسی باشد")
    .regex(/\d/, "رمز عبور باید شامل حداقل یک عدد باشد"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;