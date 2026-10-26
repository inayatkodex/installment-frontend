import axios from "axios";
import Cookies from "js-cookie";
import { ADMIN_TOKEN_KEY, ADMIN_USER_KEY, BASE_URL, SHOP_USER_KEY, TOKEN_KEY, USE_MOCK } from "./config";
import { mockAdapter } from "./mockAdapter";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
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

    // Never redirect or clear tokens on login/signup 401 failures (e.g. invalid credentials)
    if (error.response?.status === 401 && !isAuthRequest && typeof window !== "undefined") {
      const pathname = window.location.pathname;
      if (pathname.startsWith("/admin")) {
        Cookies.remove(ADMIN_TOKEN_KEY, { path: "/" });
        Cookies.remove(ADMIN_USER_KEY, { path: "/" });
        window.location.href = "/admin/signin";
      } else {
        Cookies.remove(TOKEN_KEY, { path: "/" });
        Cookies.remove(SHOP_USER_KEY, { path: "/" });
        window.location.href = "/shop/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
