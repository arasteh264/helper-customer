import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "نام باید حداقل ۲ کاراکتر باشد"),

    phone: z
      .string()
      .min(10, "شماره موبایل معتبر نیست")
      .max(11, "شماره موبایل معتبر نیست"),

    email: z
      .email("ایمیل معتبر نیست")
      .optional()
      .or(z.literal("")),

    password: z
      .string()
      .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),

    confirmPassword: z
      .string()
      .min(8, "تکرار رمز عبور الزامی است"),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "رمز عبور و تکرار آن یکسان نیستند",
      path: ["confirmPassword"],
    }
  );

export type RegisterFormValues = z.infer<typeof registerSchema>;