"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { locationKeys } from "@/features/locations/queries/location.keys";
import { locationService } from "@/features/locations/services/location.services";
import type {
  LocationListParams,
  LocationMutationValues,
  LocationPaginatedResponse,
  LocationSingleResponse,
  LocationSimpleList,
} from "@/features/locations/schemas/location.schemas";

export const useGetLocations = (filters: LocationListParams) => {
  return useQuery<LocationPaginatedResponse, Error>({
    queryKey: locationKeys.list.paginated(filters),
    queryFn: () => locationService.getLocations(filters),
    enabled: Boolean(filters.createdDate),
    staleTime: 1000 * 60 * 2,
  });
};

export const useGetLocationById = (locationId: string) => {
  return useQuery<LocationSingleResponse, Error>({
    queryKey: locationKeys.detail.byId(locationId),
    queryFn: () => locationService.getLocationById(locationId),
    enabled: Boolean(locationId),
    staleTime: 1000 * 60 * 2,
  });
};

export const useGetLocationsSimple = (filters?: { search?: string }) => {
  return useQuery<LocationSimpleList, Error>({
    queryKey: locationKeys.list.simple(filters),
    queryFn: () => locationService.getSimpleList(filters?.search),
    staleTime: 1000 * 60 * 2,
  });
};

export const useCreateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: LocationMutationValues) =>
      locationService.createLocation(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: locationKeys.all });
    },
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      locationId,
      body,
    }: {
      locationId: string;
      body: LocationMutationValues;
    }) => locationService.updateLocation(locationId, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: locationKeys.all });
      queryClient.invalidateQueries({
        queryKey: locationKeys.detail.byId(variables.locationId),
      });
    },
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (locationId: string) =>
      locationService.deleteLocation(locationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: locationKeys.all });
    },
  });
};
