import { AuthState } from "@/features/auth/types/auth.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      setAuth: ({ user, token }) => set({ user, token }),
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),

      clearAuth: () => set({ user: null, token: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
);
