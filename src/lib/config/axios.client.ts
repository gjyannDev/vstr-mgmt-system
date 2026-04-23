import axios from "axios";

const options = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
};

const API = axios.create(options);

const clearAuthCookies = () => {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = "auth_token=; Path=/; Max-Age=0; SameSite=Lax";
  document.cookie = "auth_role=; Path=/; Max-Age=0; SameSite=Lax";
};

API.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    return config;
  }

  const raw = localStorage.getItem("auth-storage");
  const token = raw ? JSON.parse(raw)?.state?.token : null;

  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth-storage");
        clearAuthCookies();
        window.location.href = "/admin/signin";
      }
    }
    return Promise.reject(error);
  },
);

export default API;
