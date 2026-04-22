export const userKeys = {
  all: ["users"] as const,
  list: {
    paginated: (params?: Record<string, string | number>) =>
      [...userKeys.all, "list", params] as const,
  },
  detail: {
    byId: (id: string) => [...userKeys.all, "detail", id] as const,
  },
};
