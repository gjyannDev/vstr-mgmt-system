import { z } from "zod";

export const VisitTypeFieldSchema = z.object({
  id: z.string().optional(),
  tenant_id: z.string().optional(),
  location_id: z.string().optional(),
  visit_type_id: z.string().optional(),
  label: z.string(),
  name: z.string(),
  type: z.string(),
  required: z.boolean().optional(),
  options: z.array(z.string()).nullable().optional(),
  validation_rules: z.any().optional(),
  placeholder: z.string().nullable().optional(),
  is_system: z.boolean().optional(),
  sort_order: z.number().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const VisitTypeSchema = z.object({
  id: z.string(),
  tenant_id: z.string(),
  location_id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  is_camera_active: z.boolean().optional(),
  requires_approval: z.boolean(),
  active: z.boolean(),
  form_fields: z.array(VisitTypeFieldSchema).nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const VisitTypePaginatedResponseSchema = z.object({
  rows: z.array(VisitTypeSchema),
  totalCount: z.number(),
});

export const VisitTypeSingleResponseSchema = z.object({
  visit_type: VisitTypeSchema,
});

export const CreateFormFieldSchema = z.object({
  label: z.string().min(1),
  name: z.string().min(1),
  type: z.string().min(1),
  required: z.boolean().optional(),
  options: z.array(z.string()).optional(),
  placeholder: z.string().optional(),
  sort_order: z.number().optional(),
});

export const CreateVisitTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  is_camera_active: z.boolean().optional(),
  requires_approval: z.boolean().optional(),
  active: z.boolean().optional(),
  form_fields: z.array(CreateFormFieldSchema).optional(),
});

export const UpdateVisitTypeSchema = CreateVisitTypeSchema.extend({
  // form_fields items may include id for upsert
  form_fields: z
    .array(CreateFormFieldSchema.extend({ id: z.string().optional() }))
    .optional(),
});

export type VisitType = z.infer<typeof VisitTypeSchema>;
export type VisitTypeField = z.infer<typeof VisitTypeFieldSchema>;
export type VisitTypePaginatedResponse = z.infer<
  typeof VisitTypePaginatedResponseSchema
>;
export type VisitTypeSingleResponse = z.infer<
  typeof VisitTypeSingleResponseSchema
>;
export type CreateVisitTypeValues = z.infer<typeof CreateVisitTypeSchema>;
export type UpdateVisitTypeValues = z.infer<typeof UpdateVisitTypeSchema>;
