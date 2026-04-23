export const kioskKeys = {
  all: ["kiosks"] as const,

  list: {
    all: () => [...kioskKeys.all, "list"] as const,
    paginated: (filters: any) => [...kioskKeys.list.all(), filters] as const,
  },

  detail: {
    all: () => [...kioskKeys.all, "detail"] as const,
    byId: (kioskId: string) => [...kioskKeys.detail.all(), kioskId] as const,
  },
};
