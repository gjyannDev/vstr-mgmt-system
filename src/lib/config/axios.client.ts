import axios from "axios";

const options = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
};

const API = axios.create(options);

API.interceptors.request.use((config) => {
  const raw = localStorage.getItem("auth-storage");
  const token = raw ? JSON.parse(raw)?.state?.token : null;

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth-storage");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default API;
