import { z } from "zod";

export const KioskSchema = z.object({
  id: z.string(),
  tenant_id: z.string(),
  location_id: z.string(),
  name: z.string(),
  status: z.string(),
  last_seen_at: z.string().nullable().optional(),
  active_code_expires_at: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const KioskPaginatedResponseSchema = z.object({
  rows: z.array(KioskSchema),
  totalCount: z.number(),
});

export const KioskSingleResponseSchema = z.object({ kiosk: KioskSchema });

export const ActivationCodeResponseSchema = z.object({
  activation_code: z.string(),
  activation_expires_at: z.string().nullable().optional(),
});

export const CreateKioskResponseSchema = KioskSingleResponseSchema.extend({
  activation_code: z.string(),
  activation_expires_at: z.string().nullable().optional(),
});

export const CreateKioskSchema = z.object({
  name: z.string().min(1),
  location_id: z.string().uuid(),
  status: z.string().optional(),
});

export const KioskFiltersSchema = z.object({
  search: z.string().optional(),
  location_id: z.string().optional(),
});

export type Kiosk = z.infer<typeof KioskSchema>;
export type KioskPaginatedResponse = z.infer<
  typeof KioskPaginatedResponseSchema
>;
export type KioskSingleResponse = z.infer<typeof KioskSingleResponseSchema>;
export type CreateKioskResponse = z.infer<typeof CreateKioskResponseSchema>;
export type CreateKioskValues = z.infer<typeof CreateKioskSchema>;
export type KioskFiltersValues = z.infer<typeof KioskFiltersSchema>;

export type KioskListParams = {
  pageIndex: number;
  pageSize: number;
  search?: string;
  location_id?: string;
};
