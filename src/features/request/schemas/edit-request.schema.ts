import { z } from "zod";

export const editRequestSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(5, "عنوان را کامل‌تر بنویسید")
      .max(80, "حداکثر ۸۰ کاراکتر"),
    description: z
      .string()
      .trim()
      .min(20, "توضیحات را کامل‌تر بنویسید")
      .max(1000, "حداکثر ۱۰۰۰ کاراکتر"),
    address: z
      .string()
      .trim()
      .min(8, "آدرس را دقیق‌تر وارد کنید")
      .max(500, "حداکثر ۵۰۰ کاراکتر"),
    scheduledAt: z
      .string()
      .refine(
        (value) => !value || !Number.isNaN(new Date(value).getTime()),
        "زمان انتخاب‌شده معتبر نیست",
      ),
    budgetMin: z.string().regex(/^\d*$/, "فقط عدد وارد کنید"),
    budgetMax: z.string().regex(/^\d*$/, "فقط عدد وارد کنید"),
  })
  .refine(
    (values) =>
      (values.budgetMin === "" && values.budgetMax === "") ||
      (values.budgetMin !== "" &&
        values.budgetMax !== "" &&
        Number(values.budgetMin) <= Number(values.budgetMax)),
    {
      path: ["budgetMax"],
      message: "حداقل و حداکثر بودجه را درست وارد کنید",
    },
  );

export type EditRequestValues = z.infer<typeof editRequestSchema>;
