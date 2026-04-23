"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/features/auth/services/auth.services";
import type {
  ActivateKioskParams,
  AuthPayload,
  KioskActivationPayload,
  KioskProfilePayload,
  LocationCheckParams,
  LoginParams,
  RegisterParams,
  SessionCheckPayload,
  UserPayload,
} from "@/features/auth/types/auth.type";
import { authKeys } from "@/features/auth/queries/auth.keys";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { User } from "@/features/auth/types/auth.type";

function mapKioskActivationToAuthPayload(
  payload: KioskActivationPayload,
): AuthPayload {
  const kioskUser: User = {
    id: payload.kiosk.id,
    name: payload.kiosk.name,
    email: "kiosk@device.local",
    role: "kiosk",
    tenant_id: payload.kiosk.tenant_id,
    location_id: payload.kiosk.location_id,
  };

  return {
    user: kioskUser,
    token: payload.token,
  };
}

export const useSignUp = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const queryClient = useQueryClient();

  return useMutation<AuthPayload, Error, RegisterParams>({
    mutationFn: (payload: RegisterParams) => authService.register(payload),
    onSuccess: (data) => {
      setAuth(data);
      queryClient.setQueryData(authKeys.profile.me(), { user: data.user });
    },
    onError: (err) => {
      console.error(err);
    },
  });
};

export const useSignIn = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const queryClient = useQueryClient();

  return useMutation<AuthPayload, Error, LoginParams>({
    mutationFn: (payload: LoginParams) => authService.signIn(payload),
    onSuccess: (data) => {
      setAuth(data);
      queryClient.setQueryData(authKeys.profile.me(), { user: data.user });
    },
    onError: (err) => {
      console.error(err);
    },
  });
};

export const useKioskActivate = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const queryClient = useQueryClient();

  return useMutation<KioskActivationPayload, Error, ActivateKioskParams>({
    mutationFn: (payload: ActivateKioskParams) =>
      authService.activateKiosk(payload),
    onSuccess: (data) => {
      setAuth(mapKioskActivationToAuthPayload(data));
      queryClient.setQueryData(authKeys.kiosk.me(), { kiosk: data.kiosk });
    },
    onError: (err) => {
      console.error(err);
    },
  });
};

export const useLogout = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const queryClient = useQueryClient();

  return useMutation<null, Error, void>({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
    onError: (err) => {
      console.error(err);
    },
  });
};

export const useMe = () => {
  const token = useAuthStore((state) => state.token);

  return useQuery<UserPayload, Error>({
    queryKey: authKeys.profile.me(),
    queryFn: () => authService.getMe(),
    enabled: Boolean(token),
  });
};

export const useSessionCheck = () => {
  const token = useAuthStore((state) => state.token);

  return useQuery<SessionCheckPayload, Error>({
    queryKey: authKeys.profile.sessionCheck(),
    queryFn: () => authService.sessionCheck(),
    enabled: Boolean(token),
  });
};

export const useAdminPing = () => {
  const token = useAuthStore((state) => state.token);

  return useQuery<SessionCheckPayload, Error>({
    queryKey: authKeys.access.adminPing(),
    queryFn: () => authService.adminPing(),
    enabled: Boolean(token),
  });
};

export const useKioskPing = () => {
  const token = useAuthStore((state) => state.token);

  return useQuery<SessionCheckPayload, Error>({
    queryKey: authKeys.access.kioskPing(),
    queryFn: () => authService.kioskPing(),
    enabled: Boolean(token),
  });
};

export const useGetKioskMe = () => {
  return useQuery<KioskProfilePayload, Error>({
    queryKey: authKeys.kiosk.me(),
    queryFn: () => authService.getKioskMe(),
    staleTime: 1000 * 60 * 2,
  });
};

export const useKioskLocationCheck = () => {
  return useMutation({
    mutationFn: (payload: LocationCheckParams) =>
      authService.kioskLocationCheck(payload),
    onError: (err) => {
      console.error(err);
    },
  });
};
