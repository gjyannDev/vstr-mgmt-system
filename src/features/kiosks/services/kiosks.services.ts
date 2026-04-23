import { apiClient } from "@/lib/api/api.client";
import {
  KioskPaginatedResponseSchema,
  KioskSingleResponseSchema,
  ActivationCodeResponseSchema,
  CreateKioskResponseSchema,
  type KioskPaginatedResponse,
  type KioskSingleResponse,
  type CreateKioskResponse,
  type KioskListParams,
  type CreateKioskValues,
} from "@/features/kiosks/schemas/kiosk.schemas";
import type { CreateVisitResponseValues } from "@/lib/schemas/kiosk";
import { VisitCreateResponseSchema } from "@/lib/schemas/kiosk";
import {
  KioskVisitTypePaginatedResponseSchema,
  KioskVisitTypeSingleResponseSchema,
  type KioskVisitTypePaginatedResponse,
  type KioskVisitTypeSingleResponse,
} from "@/features/visit-types/schemas/visit-type.schemas";

class KiosksService {
  private basePath = "/api/admin/kiosks";

  async getKiosks(params: KioskListParams): Promise<KioskPaginatedResponse> {
    const query = new URLSearchParams();
    query.append("pageIndex", String(params.pageIndex));
    query.append("pageSize", String(params.pageSize));
    if (params.search) query.append("search", params.search);
    if (params.location_id) query.append("location_id", params.location_id);

    const response = await apiClient.get<unknown>(
      `${this.basePath}?${query.toString()}`,
    );

    return KioskPaginatedResponseSchema.parse(response);
  }

  async getKioskById(kioskId: string): Promise<KioskSingleResponse> {
    const response = await apiClient.get<unknown>(
      `${this.basePath}/${kioskId}`,
    );

    return KioskSingleResponseSchema.parse(response);
  }

  async createKiosk(body: CreateKioskValues): Promise<CreateKioskResponse> {
    const response = await apiClient.post<unknown, CreateKioskValues>(
      `${this.basePath}`,
      body,
    );

    return CreateKioskResponseSchema.parse(response);
  }

  async regenerateCode(kioskId: string): Promise<{
    activation_code: string;
    activation_expires_at?: string | null;
  }> {
    const response = await apiClient.post<unknown, unknown>(
      `${this.basePath}/${kioskId}/regenerate`,
      {},
    );

    return ActivationCodeResponseSchema.parse(response);
  }

  async revokeTokens(kioskId: string): Promise<null> {
    return apiClient.post<null, unknown>(
      `${this.basePath}/${kioskId}/revoke-tokens`,
      {},
    );
  }

  // Kiosk client methods (moved from lib/api/kiosk)
  async fetchVisitTypes(
    locationId: string,
  ): Promise<KioskVisitTypePaginatedResponse> {
    const response = await apiClient.get<unknown>(
      `/api/kiosk/locations/${locationId}/visit-types?with=formFields`,
    );

    return KioskVisitTypePaginatedResponseSchema.parse(response);
  }

  async fetchVisitTypeById(
    locationId: string,
    visitTypeId: string,
  ): Promise<KioskVisitTypeSingleResponse> {
    const response = await apiClient.get<unknown>(
      `/api/kiosk/locations/${locationId}/visit-types/${visitTypeId}`,
    );

    return KioskVisitTypeSingleResponseSchema.parse(response);
  }

  async createOrSaveVisit(body: CreateVisitResponseValues) {
    const response = await apiClient.post<unknown, CreateVisitResponseValues>(
      `/api/kiosk/visit-responses`,
      body,
    );

    return VisitCreateResponseSchema.passthrough().parse(response);
  }

  async getVisitById(visitId: string) {
    const response = await apiClient.get<unknown>(
      `/api/kiosk/visit-responses/${visitId}`,
    );
    return response;
  }

  async getVisitByQr(qrCode: string) {
    const response = await apiClient.get<unknown>(
      `/api/visits/by-qr/${qrCode}`,
    );
    return response;
  }

  async getVisitByIdNumber(idNumber: string) {
    const response = await apiClient.get<unknown>(
      `/api/kiosk/visits/by-id/${encodeURIComponent(idNumber)}`,
    );
    return response;
  }

  async checkoutVisit(visitId: string) {
    const response = await apiClient.patch<unknown, any>(
      `/api/kiosk/visits/${visitId}/checkout`,
      {},
    );
    return response;
  }
}

export const kiosksService = new KiosksService();
