"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { kioskService } from "@/lib/api/kiosk";
import type { CreateVisitResponseValues } from "@/lib/schemas/kiosk";

export const useFetchVisitTypes = (locationId?: string) => {
  return useQuery({
    queryKey: ["kiosk", "visitTypes", locationId],
    queryFn: () => kioskService.fetchVisitTypes(locationId ?? ""),
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
      kioskService.fetchVisitTypeById(locationId ?? "", visitTypeId ?? ""),
    enabled: Boolean(locationId && visitTypeId),
  });
};

export const useCreateOrSaveVisit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateVisitResponseValues) =>
      kioskService.createOrSaveVisit(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["kiosk", "visitTypes"] });
    },
  });
};
