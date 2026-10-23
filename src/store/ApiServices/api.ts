import axios from "axios";
import Cookies from "js-cookie";
import { ADMIN_TOKEN_KEY, BASE_URL, TOKEN_KEY, USE_MOCK } from "./config";
import { mockAdapter } from "./mockAdapter";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  ...(USE_MOCK ? { adapter: mockAdapter } : {}),
});

api.interceptors.request.use((config) => {
  const isAdminCall = (config.url || "").includes("admin");
  const token = Cookies.get(isAdminCall ? ADMIN_TOKEN_KEY : TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const requestUrl: string = error.config?.url || "";
    const isAuthRequest = requestUrl.includes("-auth/");

    if (error.response?.status === 401 && !isAuthRequest && typeof window !== "undefined") {
      const pathname = window.location.pathname;
      window.location.href = pathname.startsWith("/admin") ? "/admin/signin" : "/shop/login";
    }
    return Promise.reject(error);
  },
);

export default api;
