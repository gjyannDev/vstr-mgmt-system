import { z } from "zod";

export const VisitorSchema = z.object({
  id: z.string().uuid().optional(),
  full_name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
});

export const CreateVisitResponseSchema = z.object({
  visit_type_id: z.string().uuid(),
  session_key: z.string().uuid().optional(),
  is_final: z.boolean().optional(),
  visitor: VisitorSchema.optional(),
  form_data: z.record(z.any()).optional(),
  image_url: z.string().url().optional(),
  image_base64: z.string().optional(),
});

export type CreateVisitResponseValues = z.infer<
  typeof CreateVisitResponseSchema
>;

export const VisitCreateResponseSchema = z.object({
  visit_id: z.string().optional(),
  visitor_id: z.string().optional(),
  session_key: z.string().optional(),
  status: z.string().optional(),
  qr_code: z.string().optional(),
  qr_payload: z.string().optional(),
  card: z.record(z.any()).optional(),
  created_at: z.string().optional(),
});

export type VisitCreateResponse = z.infer<typeof VisitCreateResponseSchema>;
