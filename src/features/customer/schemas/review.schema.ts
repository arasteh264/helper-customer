import { z } from "zod";

export const reviewSchema = z.object({
  rating: z.number().min(1, "لطفاً امتیاز خود را انتخاب کنید").max(5),
  text: z.string().trim().max(500, "حداکثر ۵۰۰ کاراکتر"),
});

export type ReviewValues = z.infer<typeof reviewSchema>;