import { z } from "zod";

export const kioskActivationSchema = z.object({
  code: z
    .string()
    .trim()
    .min(6, "Activation code must be at least 6 characters")
    .max(32, "Activation code is too long"),
});

export type KioskActivationValues = z.infer<typeof kioskActivationSchema>;

export const activationSchema = kioskActivationSchema;
export type ActivationValues = KioskActivationValues;
