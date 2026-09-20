import { z } from "zod";
import { registerSchema } from "./register.schema";

export const resetPasswordSchema = registerSchema.pick({ password: true });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;