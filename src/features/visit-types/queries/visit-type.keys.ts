export const visitTypeKeys = {
  all: ["visit_types"] as const,

  list: {
    all: () => [...visitTypeKeys.all, "list"] as const,
    paginated: (locationId: string, filters: any) =>
      [...visitTypeKeys.list.all(), locationId, filters] as const,
  },

  detail: {
    all: () => [...visitTypeKeys.all, "detail"] as const,
    byId: (locationId: string, visitTypeId: string) =>
      [...visitTypeKeys.detail.all(), locationId, visitTypeId] as const,
  },
};
