import api from "@/lib/config/axios.client";

export interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: unknown;
}

class ApiClient {
  get defaults() {
    return api.defaults;
  }

  async get<T>(url: string, config?: object): Promise<T> {
    const res = await api.get<ApiResponse<T>>(url, config);
    return res.data.data;
  }

  async post<T, B = unknown>(
    url: string,
    body: B,
    config?: object,
  ): Promise<T> {
    const res = await api.post<ApiResponse<T>>(url, body, config);
    return res.data.data;
  }

  async put<T, B = unknown>(url: string, body: B): Promise<T> {
    const res = await api.put<ApiResponse<T>>(url, body);
    return res.data.data;
  }

  async patch<T, B = unknown>(url: string, body?: B): Promise<T> {
    const res = await api.patch<ApiResponse<T>>(url, body);

    return res.data.data;
  }

  async delete<T>(url: string): Promise<T> {
    const res = await api.delete<ApiResponse<T>>(url);
    return res.data.data;
  }

  async downloadBlob(url: string): Promise<Blob> {
    const res = await api.get(url, { responseType: "blob" });
    return res.data as Blob;
  }
}

export const apiClient = new ApiClient();
