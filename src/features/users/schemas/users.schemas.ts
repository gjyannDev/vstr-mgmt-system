import { z } from "zod";

// Raw location object returned by the backend
const RawLocationSchema = z.object({
  id: z.string().optional(),
  location_id: z.string().optional(),
});

// Raw admin user shape returned by API (has `name`, `locations` objects)
const RawAdminUserSchema = z.object({
  id: z.string(),
  legacy_id: z.any().optional(),
  tenant_id: z.string().optional(),
  name: z.string().optional(),
  full_name: z.string().optional(),
  email: z.string().email(),
  role: z.string(),
  status: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  locations: z.array(RawLocationSchema).optional(),
});

// Canonical frontend admin user schema
export const AdminUserSchema = z.object({
  id: z.string(),
  full_name: z.string(),
  email: z.string().email(),
  role: z.string(),
  status: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  locations: z.array(z.string()).optional(),
});

// Transform raw API user into canonical shape
const AdminUserFromRaw = RawAdminUserSchema.transform((r) => ({
  id: r.id,
  full_name: r.full_name ?? r.name ?? "",
  email: r.email,
  role: r.role,
  status: r.status ?? undefined,
  created_at: r.created_at,
  updated_at: r.updated_at,
  locations: Array.isArray(r.locations)
    ? r.locations.map((l) => l.id ?? l.location_id).filter(Boolean)
    : undefined,
}));

export const AdminUsersPaginatedResponseSchema = z.object({
  rows: z.array(AdminUserFromRaw),
  totalCount: z.number(),
});

export const AdminUserSingleResponseSchema = z.object({
  admin: AdminUserFromRaw,
});

export const AdminUserFiltersSchema = z.object({
  search: z.string().optional(),
  role: z.string().optional(),
  status: z.string().optional(),
});

export const AdminUserMutationSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().optional(),
  location_ids: z.array(z.string()).optional(),
});

// Schema for updating an admin: password may be omitted/blank
export const AdminUserUpdateSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  // Treat empty string as omitted so edit form can leave password blank
  password: z.preprocess(
    (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
    z.string().min(6, "Password must be at least 6 characters").optional(),
  ),
  role: z.string().optional(),
  location_ids: z.array(z.string()).optional(),
});

export type AdminUser = z.infer<typeof AdminUserFromRaw>;
export type AdminUsersPaginatedResponse = z.infer<
  typeof AdminUsersPaginatedResponseSchema
>;
export type AdminUserSingleResponse = z.infer<
  typeof AdminUserSingleResponseSchema
>;
export type AdminUserFiltersValues = z.infer<typeof AdminUserFiltersSchema>;
export type AdminUserMutationValues = z.infer<typeof AdminUserMutationSchema>;

export type UserListParams = {
  pageIndex: number;
  pageSize: number;
  search?: string;
  role?: string;
  status?: string;
};
