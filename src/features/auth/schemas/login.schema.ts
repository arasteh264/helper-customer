import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "ایمیل یا شماره موبایل را وارد کنید")
    .refine(
      (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRegex = /^09\d{9}$/;

        return emailRegex.test(value) || mobileRegex.test(value);
      },
      {
        message: "ایمیل یا شماره موبایل معتبر نیست",
      }
    ),

  password: z
    .string()
    .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;