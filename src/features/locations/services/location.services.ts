import { apiClient } from "@/lib/api/api.client";
import {
  LocationPaginatedResponseSchema,
  LocationSingleResponseSchema,
  type LocationListParams,
  type LocationMutationValues,
  type LocationPaginatedResponse,
  type LocationSingleResponse,
} from "@/features/locations/schemas/location.schemas";

class LocationService {
  private basePath = "/api/super-admin/locations";

  async getLocations(
    params: LocationListParams,
  ): Promise<LocationPaginatedResponse> {
    const query = new URLSearchParams();

    query.append("pageIndex", String(params.pageIndex));
    query.append("pageSize", String(params.pageSize));
    query.append("createdDate", params.createdDate);

    if (params.search) query.append("search", params.search);
    if (params.type) query.append("type", params.type);
    if (params.state) query.append("state", params.state);

    const response = await apiClient.get<unknown>(
      `${this.basePath}?${query.toString()}`,
    );

    return LocationPaginatedResponseSchema.parse(response);
  }

  async getLocationById(locationId: string): Promise<LocationSingleResponse> {
    const response = await apiClient.get<unknown>(
      `${this.basePath}/${locationId}`,
    );

    return LocationSingleResponseSchema.parse(response);
  }

  async createLocation(
    body: LocationMutationValues,
  ): Promise<LocationSingleResponse> {
    const response = await apiClient.post<unknown, LocationMutationValues>(
      this.basePath,
      body,
    );

    return LocationSingleResponseSchema.parse(response);
  }

  async updateLocation(
    locationId: string,
    body: LocationMutationValues,
  ): Promise<LocationSingleResponse> {
    const response = await apiClient.put<unknown, LocationMutationValues>(
      `${this.basePath}/${locationId}`,
      body,
    );

    return LocationSingleResponseSchema.parse(response);
  }

  async deleteLocation(locationId: string): Promise<null> {
    return apiClient.delete<null>(`${this.basePath}/${locationId}`);
  }
}

export const locationService = new LocationService();
