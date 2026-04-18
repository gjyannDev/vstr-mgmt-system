export const authKeys = {
  all: ["auth"] as const,

  profile: {
    all: () => [...authKeys.all, "profile"] as const,

    me: () => [...authKeys.profile.all(), "me"] as const,

    sessionCheck: () => [...authKeys.profile.all(), "session-check"] as const,
  },

  access: {
    all: () => [...authKeys.all, "access"] as const,

    adminPing: () => [...authKeys.access.all(), "admin", "ping"] as const,

    kioskPing: () => [...authKeys.access.all(), "kiosk", "ping"] as const,
  },

  location: {
    all: () => [...authKeys.all, "location"] as const,

    kioskCheck: (filters?: { location_id?: number }) =>
      [...authKeys.location.all(), "kiosk-check", filters] as const,
  },
};
