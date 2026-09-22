import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "رمز عبور فعلی را وارد کنید"),
    newPassword: z
      .string()
      .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
      .regex(/[A-Za-z]/, "رمز عبور باید شامل حداقل یک حرف انگلیسی باشد")
      .regex(/\d/, "رمز عبور باید شامل حداقل یک عدد باشد"),
    confirmPassword: z.string().min(1, "تکرار رمز عبور را وارد کنید"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "تکرار رمز عبور با رمز جدید یکسان نیست",
  })
  .refine((d) => d.newPassword !== d.currentPassword, {
    path: ["newPassword"],
    message: "رمز جدید باید با رمز فعلی متفاوت باشد",
  });

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;