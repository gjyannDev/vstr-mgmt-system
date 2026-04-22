import { apiClient } from "@/lib/api/api.client";
import {
  VisitTypePaginatedResponseSchema,
  VisitTypeSingleResponseSchema,
  type VisitTypePaginatedResponse,
  type VisitTypeSingleResponse,
  type CreateVisitTypeValues,
} from "@/features/visit-types/schemas/visit-type.schemas";

class VisitTypesService {
  private basePath = "/api/admin/locations";

  async getVisitTypes(
    locationId: string,
    params: { pageIndex: number; pageSize: number; search?: string },
  ): Promise<VisitTypePaginatedResponse> {
    const query = new URLSearchParams();
    query.append("pageIndex", String(params.pageIndex));
    query.append("pageSize", String(params.pageSize));
    if (params.search) query.append("search", params.search);
    // ensure formFields are included by default
    query.append("with", "formFields");

    const response = await apiClient.get<unknown>(
      `${this.basePath}/${locationId}/visit-types?${query.toString()}`,
    );

    return VisitTypePaginatedResponseSchema.parse(response);
  }

  async getVisitTypeById(
    locationId: string,
    visitTypeId: string,
  ): Promise<VisitTypeSingleResponse> {
    const response = await apiClient.get<unknown>(
      `${this.basePath}/${locationId}/visit-types/${visitTypeId}`,
    );

    return VisitTypeSingleResponseSchema.parse(response);
  }

  async createVisitType(
    locationId: string,
    body: CreateVisitTypeValues,
  ): Promise<VisitTypeSingleResponse> {
    const response = await apiClient.post<unknown, CreateVisitTypeValues>(
      `${this.basePath}/${locationId}/visit-types`,
      body,
    );

    return VisitTypeSingleResponseSchema.parse(response);
  }

  async updateVisitType(
    locationId: string,
    visitTypeId: string,
    body: any,
  ): Promise<VisitTypeSingleResponse> {
    const response = await apiClient.put<unknown, any>(
      `${this.basePath}/${locationId}/visit-types/${visitTypeId}`,
      body,
    );

    return VisitTypeSingleResponseSchema.parse(response);
  }

  async deleteVisitType(
    locationId: string,
    visitTypeId: string,
  ): Promise<null> {
    return apiClient.delete<null>(
      `${this.basePath}/${locationId}/visit-types/${visitTypeId}`,
    );
  }

  async createFormField(
    locationId: string,
    visitTypeId: string,
    body: any,
  ): Promise<any> {
    const response = await apiClient.post<unknown, any>(
      `${this.basePath}/${locationId}/visit-types/${visitTypeId}/form-fields`,
      body,
    );

    return response;
  }
}

export const visitTypesService = new VisitTypesService();
