import { apiClient } from "@/lib/api/api.client";
import type { CreateVisitResponseValues } from "@/lib/schemas/kiosk";
import { VisitCreateResponseSchema } from "@/lib/schemas/kiosk";
import {
  VisitTypePaginatedResponseSchema,
  VisitTypeSingleResponseSchema,
  type VisitTypePaginatedResponse,
  type VisitTypeSingleResponse,
} from "@/features/visit-types/schemas/visit-type.schemas";

class KioskService {
  async fetchVisitTypes(
    locationId: string,
  ): Promise<VisitTypePaginatedResponse> {
    const response = await apiClient.get<unknown>(
      `/api/kiosk/locations/${locationId}/visit-types?with=formFields`,
    );

    return VisitTypePaginatedResponseSchema.parse(response);
  }

  async fetchVisitTypeById(
    locationId: string,
    visitTypeId: string,
  ): Promise<VisitTypeSingleResponse> {
    const response = await apiClient.get<unknown>(
      `/api/kiosk/locations/${locationId}/visit-types/${visitTypeId}`,
    );

    return VisitTypeSingleResponseSchema.parse(response);
  }

  async createOrSaveVisit(body: CreateVisitResponseValues) {
    const response = await apiClient.post<unknown, CreateVisitResponseValues>(
      `/api/kiosk/visit-responses`,
      body,
    );

    return VisitCreateResponseSchema.parse(response);
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

  async checkoutVisit(visitId: string) {
    // Attempts to call kiosk checkout endpoint; backend may need to implement this route.
    const response = await apiClient.patch<unknown, any>(
      `/api/kiosk/visits/${visitId}/checkout`,
      {},
    );
    return response;
  }
}

export const kioskService = new KioskService();
