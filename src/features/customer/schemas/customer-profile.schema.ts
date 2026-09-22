import { z } from "zod";

export const customerProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "نام و نام خانوادگی را وارد کنید")
    .max(60, "نام خیلی طولانی است"),
  email: z.string().trim().email("ایمیل معتبر نیست").or(z.literal("")),
});

export type CustomerProfileValues = z.infer<typeof customerProfileSchema>;