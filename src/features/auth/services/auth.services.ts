import { apiClient } from "@/lib/api/api.client";

import type {
  KioskDevice,
  User,
  RegisterParams,
  LoginParams,
  AuthPayload,
  UserPayload,
  SessionCheckPayload,
  LocationCheckParams,
  LocationCheckPayload,
  ActivateKioskParams,
  KioskActivationPayload,
  KioskProfilePayload,
} from "@/features/auth/types/auth.type";

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

  activateKiosk(params: ActivateKioskParams) {
    return apiClient.post<KioskActivationPayload, ActivateKioskParams>(
      "/api/kiosk/activate",
      params,
    );
  }

  getKioskMe() {
    return apiClient.get<KioskProfilePayload>("/api/kiosk/me");
  }

  logoutKiosk() {
    return apiClient.post<null, Record<string, never>>("/api/kiosk/logout", {});
  }
}

export const authService = new AuthService();
