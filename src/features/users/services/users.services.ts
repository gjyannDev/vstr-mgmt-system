import { apiClient } from "@/lib/api/api.client";
import {
  AdminUserSingleResponseSchema,
  AdminUsersPaginatedResponseSchema,
  type AdminUserSingleResponse,
  type AdminUsersPaginatedResponse,
  type UserListParams,
} from "@/features/users/schemas/users.schemas";
import {
  AssignLocationsPayload,
  CreateAdminUserPayload,
  UpdateAdminUserPayload,
} from "@/features/users/types/users.type";

class UsersService {
  private basePath = "/api/super-admin/admins";

  async getAdminUsers(
    params: UserListParams,
  ): Promise<AdminUsersPaginatedResponse> {
    const query = new URLSearchParams({
      pageIndex: String(params.pageIndex),
      pageSize: String(params.pageSize),
    });

    if (params.search) query.append("search", params.search);

    const response = await apiClient.get<unknown>(
      `${this.basePath}?${query.toString()}`,
    );
    return AdminUsersPaginatedResponseSchema.parse(response);
  }

  async getAdminUserById(adminId: string): Promise<AdminUserSingleResponse> {
    const response = await apiClient.get<unknown>(
      `${this.basePath}/${adminId}`,
    );
    return AdminUserSingleResponseSchema.parse(response);
  }

  async createAdminUser(
    payload: CreateAdminUserPayload,
  ): Promise<AdminUserSingleResponse> {
    const response = await apiClient.post<unknown, CreateAdminUserPayload>(
      this.basePath,
      payload,
    );
    return AdminUserSingleResponseSchema.parse(response);
  }

  async updateAdminUser(
    adminId: string,
    payload: UpdateAdminUserPayload,
  ): Promise<AdminUserSingleResponse> {
    const response = await apiClient.patch<unknown, UpdateAdminUserPayload>(
      `${this.basePath}/${adminId}`,
      payload,
    );
    return AdminUserSingleResponseSchema.parse(response);
  }

  async removeAdminUser(adminId: string): Promise<null> {
    return apiClient.delete<null>(`${this.basePath}/${adminId}`);
  }

  async assignLocations(
    adminId: string,
    payload: AssignLocationsPayload,
  ): Promise<{ admin_id: string; assigned_locations: string[] }> {
    return apiClient.put<
      { admin_id: string; assigned_locations: string[] },
      AssignLocationsPayload
    >(`${this.basePath}/${adminId}/locations`, payload);
  }
}

export const usersService = new UsersService();
