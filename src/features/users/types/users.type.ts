export type AdminUser = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status?: string;
  created_at: string;
  updated_at: string;
  locations?: string[];
};

export type CreateAdminUserPayload = {
  name: string;
  email: string;
  password: string;
  location_id?: string | null; // Optional, nullable
  location_ids?: string[]; // Optional array, min:1, distinct
};

export type UpdateAdminUserPayload = {
  name?: string; // Optional, max:255
  email?: string; // Optional, email, max:255, unique
  password?: string; // Optional, min:8
  location_id?: string | null; // Sometimes, nullable
  location_ids?: string[]; // Sometimes, array, min:1, distinct
};

export type AssignLocationsPayload = {
  location_id?: string | null; // Optional, nullable
  location_ids: string[]; // Required, array, min:1
};

// UserQueryParams might still be relevant for future filtering if API expands,
// but for now, the contract does not specify params for list/get.
// We will use these payload types directly in services and queries.
