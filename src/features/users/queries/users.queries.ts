"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/features/users/queries/users.keys";
import { usersService } from "@/features/users/services/users.services";
import type {
  AdminUsersPaginatedResponse,
  UserListParams,
} from "@/features/users/schemas/users.schemas";
import {
  AssignLocationsPayload,
  CreateAdminUserPayload,
  UpdateAdminUserPayload,
} from "@/features/users/types/users.type";

export const useGetAdminUsers = (params: UserListParams) => {
  return useQuery<AdminUsersPaginatedResponse, Error>({
    queryKey: userKeys.list.paginated(params),
    queryFn: () => usersService.getAdminUsers(params),
    staleTime: 1000 * 60 * 2,
  });
};

import type { AdminUserSingleResponse } from "@/features/users/schemas/users.schemas";

export const useGetAdminUserById = (adminId: string) => {
  return useQuery<AdminUserSingleResponse, Error>({
    queryKey: userKeys.detail.byId(adminId),
    queryFn: () => usersService.getAdminUserById(adminId),
    enabled: Boolean(adminId),
    staleTime: 1000 * 60 * 2,
  });
};

export const useCreateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdminUserPayload) =>
      usersService.createAdminUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      adminId,
      payload,
    }: {
      adminId: string;
      payload: UpdateAdminUserPayload;
    }) => usersService.updateAdminUser(adminId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail.byId(variables.adminId),
      });
    },
  });
};

export const useDeleteAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (adminId: string) => usersService.removeAdminUser(adminId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

export const useAssignUserLocations = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      adminId,
      payload,
    }: {
      adminId: string;
      payload: AssignLocationsPayload;
    }) => usersService.assignLocations(adminId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail.byId(variables.adminId),
      });
    },
  });
};
