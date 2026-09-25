import { z } from "zod";

export const providerProfileSchema = z.object({
  bio: z
    .string()
    .trim()
    .min(50, "حداقل ۵۰ کاراکتر درباره‌ی خودتان و تجربه‌تان بنویسید")
    .max(600, "حداکثر ۶۰۰ کاراکتر"),
});

export type ProviderProfileValues = z.infer<typeof providerProfileSchema>;

