import { z } from "zod";

const IRAN_MOBILE_REGEX = /^09\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "وارد کردن موبایل یا ایمیل الزامی است")
    .refine(
      (val) => IRAN_MOBILE_REGEX.test(val) || EMAIL_REGEX.test(val),
      "شماره موبایل یا ایمیل معتبر وارد کنید"
    ),
  password: z
    .string()
    .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;