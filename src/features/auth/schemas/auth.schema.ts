import { z } from "zod";

export const activationSchema = z.object({
  activationCode: z
    .string()
    .min(1, "Activation code is required")
    .max(64, "Activation code is too long"),
});

export type ActivationValues = z.infer<typeof activationSchema>;
