"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { kioskKeys } from "@/features/kiosks/queries/kiosk.keys";
import { kiosksService } from "@/features/kiosks/services/kiosks.services";
import type {
  KioskPaginatedResponse,
  KioskSingleResponse,
  KioskListParams,
  CreateKioskValues,
} from "@/features/kiosks/schemas/kiosk.schemas";

export const useGetKiosks = (params: KioskListParams) => {
  return useQuery<KioskPaginatedResponse, Error>({
    queryKey: kioskKeys.list.paginated(params),
    queryFn: () => kiosksService.getKiosks(params),
    enabled: true,
    staleTime: 1000 * 60 * 2,
  });
};

export const useGetKioskById = (kioskId: string) => {
  return useQuery<KioskSingleResponse, Error>({
    queryKey: kioskKeys.detail.byId(kioskId),
    queryFn: () => kiosksService.getKioskById(kioskId),
    enabled: Boolean(kioskId),
    staleTime: 1000 * 60 * 2,
  });
};

export const useCreateKiosk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateKioskValues) => kiosksService.createKiosk(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: kioskKeys.list.all() });
    },
  });
};

export const useRegenerateKioskCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (kioskId: string) => kiosksService.regenerateCode(kioskId),
    onSuccess: (_, kioskId) => {
      queryClient.invalidateQueries({ queryKey: kioskKeys.list.all() });
      queryClient.invalidateQueries({
        queryKey: kioskKeys.detail.byId(kioskId),
      });
    },
  });
};

export const useRevokeKioskTokens = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (kioskId: string) => kiosksService.revokeTokens(kioskId),
    onSuccess: (_, kioskId) => {
      queryClient.invalidateQueries({ queryKey: kioskKeys.list.all() });
      queryClient.invalidateQueries({
        queryKey: kioskKeys.detail.byId(kioskId),
      });
    },
  });
};
