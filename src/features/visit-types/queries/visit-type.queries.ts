"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { visitTypeKeys } from "@/features/visit-types/queries/visit-type.keys";
import { visitTypesService } from "@/features/visit-types/services/visit-types.services";
import type {
  VisitTypePaginatedResponse,
  VisitTypeSingleResponse,
  CreateVisitTypeValues,
} from "@/features/visit-types/schemas/visit-type.schemas";

export const useGetVisitTypes = (
  locationId: string,
  params: { pageIndex: number; pageSize: number; search?: string },
) => {
  return useQuery<VisitTypePaginatedResponse, Error>({
    queryKey: visitTypeKeys.list.paginated(locationId, params),
    queryFn: () => visitTypesService.getVisitTypes(locationId, params),
    enabled: Boolean(locationId),
    staleTime: 1000 * 60 * 2,
  });
};

export const useGetVisitTypeById = (
  locationId: string,
  visitTypeId: string,
) => {
  return useQuery<VisitTypeSingleResponse, Error>({
    queryKey: visitTypeKeys.detail.byId(locationId, visitTypeId),
    queryFn: () => visitTypesService.getVisitTypeById(locationId, visitTypeId),
    enabled: Boolean(locationId && visitTypeId),
    staleTime: 1000 * 60 * 2,
  });
};

export const useCreateVisitType = (locationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateVisitTypeValues) =>
      visitTypesService.createVisitType(locationId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: visitTypeKeys.list.all() });
      queryClient.invalidateQueries({
        queryKey: visitTypeKeys.list.paginated(locationId, {
          pageIndex: 0,
          pageSize: 10,
        }),
      });
    },
  });
};

export const useUpdateVisitType = (locationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ visitTypeId, body }: { visitTypeId: string; body: any }) =>
      visitTypesService.updateVisitType(locationId, visitTypeId, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: visitTypeKeys.list.all() });
      queryClient.invalidateQueries({
        queryKey: visitTypeKeys.detail.byId(locationId, variables.visitTypeId),
      });
    },
  });
};

export const useDeleteVisitType = (locationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (visitTypeId: string) =>
      visitTypesService.deleteVisitType(locationId, visitTypeId),
    onSuccess: (_, visitTypeId) => {
      queryClient.invalidateQueries({ queryKey: visitTypeKeys.list.all() });
      queryClient.invalidateQueries({
        queryKey: visitTypeKeys.detail.byId(locationId, visitTypeId),
      });
    },
  });
};

export const useCreateFormField = (locationId: string, visitTypeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: any) =>
      visitTypesService.createFormField(locationId, visitTypeId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: visitTypeKeys.detail.byId(locationId, visitTypeId),
      });
    },
  });
};
