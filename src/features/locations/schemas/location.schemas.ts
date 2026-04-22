import { z } from "zod";

export const LocationSchema = z.object({
  id: z.string(),
  tenant_id: z.string(),
  name: z.string(),
  type: z.string().nullable().optional(),
  address_line1: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const LocationPaginatedResponseSchema = z.object({
  rows: z.array(LocationSchema),
  totalCount: z.number(),
});

export const LocationSingleResponseSchema = z.object({
  location: LocationSchema,
});

export const LocationFiltersSchema = z.object({
  createdDate: z.string().optional(),
  type: z.string().optional(),
  state: z.string().optional(),
  search: z.string().optional(),
});

export const LocationMutationSchema = z.object({
  name: z.string().min(1, "Location name is required"),
  type: z.string().optional(),
  address_line1: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

export type Location = z.infer<typeof LocationSchema>;
export type LocationPaginatedResponse = z.infer<
  typeof LocationPaginatedResponseSchema
>;
export type LocationSingleResponse = z.infer<
  typeof LocationSingleResponseSchema
>;
export type LocationFiltersValues = z.infer<typeof LocationFiltersSchema>;
export type LocationMutationValues = z.infer<typeof LocationMutationSchema>;

export type LocationListParams = {
  pageIndex: number;
  pageSize: number;
  createdDate?: string;
  search?: string;
  type?: string;
  state?: string;
};

export const LocationSimpleSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const LocationSimpleListSchema = z.object({
  rows: z.array(LocationSimpleSchema),
});

export type LocationSimpleList = z.infer<typeof LocationSimpleListSchema>;
