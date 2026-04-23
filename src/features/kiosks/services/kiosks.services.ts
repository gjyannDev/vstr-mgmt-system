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

  async regenerateCode(
    kioskId: string,
  ): Promise<{ activation_code: string; activation_expires_at?: string }> {
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
}

export const kiosksService = new KiosksService();
