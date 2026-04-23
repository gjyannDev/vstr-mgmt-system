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
import type { CreateVisitResponseValues } from "@/lib/schemas/kiosk";

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

// Kiosk client hooks (moved from features/kiosk/queries/kiosk.queries.ts)
export const useFetchVisitTypes = (locationId?: string) => {
  return useQuery({
    queryKey: ["kiosk", "visitTypes", locationId],
    queryFn: () => kiosksService.fetchVisitTypes(locationId ?? ""),
    enabled: Boolean(locationId),
  });
};

export const useFetchVisitTypeById = (
  locationId?: string,
  visitTypeId?: string,
) => {
  return useQuery({
    queryKey: ["kiosk", "visitType", locationId, visitTypeId],
    queryFn: () =>
      kiosksService.fetchVisitTypeById(locationId ?? "", visitTypeId ?? ""),
    enabled: Boolean(locationId && visitTypeId),
  });
};

export const useCreateOrSaveVisit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateVisitResponseValues) =>
      kiosksService.createOrSaveVisit(payload),
    onSuccess: () => {
      qc.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === "kiosk" &&
          query.queryKey[1] === "visitTypes",
      });
    },
  });
};
