import type { LocationListParams } from "@/features/locations/schemas/location.schemas";

export const locationKeys = {
  all: ["locations"] as const,

  list: {
    all: () => [...locationKeys.all, "list"] as const,
    paginated: (filters: LocationListParams) =>
      [...locationKeys.list.all(), filters] as const,
  },

  detail: {
    all: () => [...locationKeys.all, "detail"] as const,
    byId: (locationId: string) =>
      [...locationKeys.detail.all(), locationId] as const,
  },
};
