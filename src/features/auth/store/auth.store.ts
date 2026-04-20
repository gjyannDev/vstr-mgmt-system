import { AuthState } from "@/features/auth/types/auth.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const AUTH_TOKEN_COOKIE = "auth_token";
const AUTH_ROLE_COOKIE = "auth_role";
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

function setCookie(name: string, value: string, maxAge = AUTH_COOKIE_MAX_AGE) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

function clearCookie(name: string) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

function syncAuthCookies(token: string | null, role: string | null) {
  if (token) {
    setCookie(AUTH_TOKEN_COOKIE, token);
  } else {
    clearCookie(AUTH_TOKEN_COOKIE);
  }

  if (role) {
    setCookie(AUTH_ROLE_COOKIE, role);
  } else {
    clearCookie(AUTH_ROLE_COOKIE);
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      user: null,
      token: null,

      setAuth: ({ user, token }) => {
        syncAuthCookies(token, user.role);
        set({ hydrated: true, user, token });
      },
      setUser: (user) => {
        syncAuthCookies(get().token, user?.role ?? null);
        set({ hydrated: true, user });
      },
      setToken: (token) => {
        syncAuthCookies(token, get().user?.role ?? null);
        set({ hydrated: true, token });
      },

      clearAuth: () => {
        syncAuthCookies(null, null);
        set({ hydrated: true, user: null, token: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => {
        syncAuthCookies(state?.token ?? null, state?.user?.role ?? null);
      },
    },
  ),
);
