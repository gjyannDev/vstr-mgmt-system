import { apiClient } from "@/lib/api/api.client";

import type { User } from "@/features/auth/types/auth.type";

export type RegisterParams = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  device_name?: string;
};

export type LoginParams = {
  email: string;
  password: string;
  device_name?: string;
};

export type AuthPayload = {
  user: User;
  token: string;
};

export type UserPayload = {
  user: User;
};

export type SessionCheckPayload = {
  user_id: number | null;
  role: User["role"] | null;
};

export type LocationCheckParams = {
  location_id: number;
};

export type LocationCheckPayload = SessionCheckPayload & {
  location_id: number | null;
};

class AuthService {
  register(params: RegisterParams) {
    return apiClient.post<AuthPayload, RegisterParams>(
      "/api/auth/register",
      params,
    );
  }

  signIn(params: LoginParams) {
    return apiClient.post<AuthPayload, LoginParams>("/api/auth/login", params);
  }

  logout() {
    return apiClient.post<null, Record<string, never>>("/api/auth/logout", {});
  }

  getMe() {
    return apiClient.get<UserPayload>("/api/auth/me");
  }

  sessionCheck() {
    return apiClient.get<SessionCheckPayload>("/api/auth/session-check");
  }

  adminPing() {
    return apiClient.get<SessionCheckPayload>("/api/admin/ping");
  }

  kioskPing() {
    return apiClient.get<SessionCheckPayload>("/api/kiosk/ping");
  }

  kioskLocationCheck(params: LocationCheckParams) {
    return apiClient.post<LocationCheckPayload, LocationCheckParams>(
      "/api/kiosk/location-check",
      params,
    );
  }
}

export const authService = new AuthService();
