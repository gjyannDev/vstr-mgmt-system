"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  authService,
  type AuthPayload,
  type LocationCheckParams,
  type LoginParams,
  type RegisterParams,
  type SessionCheckPayload,
  type UserPayload,
} from "@/features/auth/services/auth.services";
import { authKeys } from "@/features/auth/queries/auth.keys";
import { useAuthStore } from "@/features/auth/store/auth.store";

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

export const useKioskLocationCheck = () => {
  return useMutation({
    mutationFn: (payload: LocationCheckParams) =>
      authService.kioskLocationCheck(payload),
    onError: (err) => {
      console.error(err);
    },
  });
};
