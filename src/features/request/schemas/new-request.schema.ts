import { z } from "zod";

export const newRequestSchema = z
  .object({
    categoryId: z.string().min(1, "یک دسته انتخاب کنید"),
    title: z.string().trim().min(5, "عنوان را کامل‌تر بنویسید").max(80, "حداکثر ۸۰ کاراکتر"),
    description: z
      .string()
      .trim()
      .min(20, "توضیحات را کامل‌تر بنویسید (حداقل ۲۰ کاراکتر)")
      .max(1000, "حداکثر ۱۰۰۰ کاراکتر"),
    photos: z.array(z.string()).max(6, "حداکثر ۶ عکس"),
    urgency: z.enum(["asap", "this_week", "scheduled"]),
    scheduledAt: z.string().optional(),
    addressId: z.string().min(1, "یک آدرس انتخاب کنید"),
    hasBudget: z.boolean(),
    budgetMin: z.number().optional(),
    budgetMax: z.number().optional(),
  })
  .refine((d) => d.urgency !== "scheduled" || !!d.scheduledAt, {
    path: ["scheduledAt"],
    message: "زمان مدنظر خود را انتخاب کنید",
  })
  .refine(
    (d) =>
      !d.hasBudget ||
      (d.budgetMin !== undefined && d.budgetMax !== undefined && d.budgetMin <= d.budgetMax),
    { path: ["budgetMax"], message: "بازه‌ی بودجه را درست وارد کنید" }
  );

export type NewRequestValues = z.infer<typeof newRequestSchema>;