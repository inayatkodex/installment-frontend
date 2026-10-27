import axios, { AxiosAdapter, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import * as db from "./mockData";

type Params = Record<string, string | number | undefined>;

/**
 * Routes that bypass the mock adapter and go to the real backend.
 * Remove entries as backend modules get built.
 */
export const REAL_ROUTES: (string | RegExp)[] = [
  // Auth APIs
  "api/shop-auth/login",
  "api/shop-auth/signup",
  "api/admin-auth/login",

  // Admin APIs (Dashboard, Shops list, Detail, Status, Fee)
  "api/admin/dashboard",
  "api/admin/shops",
  /^api\/admin\/shops\//,

  // Shop APIs (Dashboard, Collection, Payments, Customers, Late, Status)
  "api/shop/dashboard",
  "api/shop/collection/today",
  "api/shop/payments/today",
  "api/shop/payments/receive",
  /^api\/shop\/payments\//,
  "api/shop/customers",
  /^api\/shop\/customers\//,
  "api/shop/late",
  "api/shop/status",
];

const isRealRoute = (url: string = ""): boolean => {
  const clean = url.replace(/^\//, "").split("?")[0];
  return REAL_ROUTES.some((route) =>
    typeof route === "string"
      ? clean === route || clean.endsWith(`/${route}`)
      : route.test(clean)
  );
};

/** Routes a request to the demo data. Mirrors the URLs in apiUrls.ts. */
function route(method: string, url: string, params: Params, body: Record<string, any>): unknown {
  const u = url.replace(/^\//, "").split("?")[0];
  let m: RegExpMatchArray | null;

  // shop
  if (u === "api/shop/dashboard") return db.getShopDashboard();
  if (u === "api/shop/collection/today") return db.getTodayCollection();
  if (u === "api/shop/payments/receive") return db.receivePayment(body as never);
  if (u === "api/shop/payments/today") return db.getTodayReceived();
  if ((m = u.match(/^api\/shop\/payments\/([^/]+)\/reverse$/))) return db.reversePayment(m[1]);
  if (u === "api/shop/late") return db.getLate();
  if (u === "api/shop/status") return db.getStatus(String(params.month));
  if (u === "api/shop/customers") {
    return method === "post" ? db.createCustomer(body as never) : db.getCustomers({ search: String(params.search ?? ""), status: String(params.status ?? "") });
  }
  if ((m = u.match(/^api\/shop\/customers\/([^/]+)\/documents\/([^/]+)$/))) {
    if (method === "delete") return db.deleteCustomerDocument(m[1], m[2]);
    return db.updateCustomerDocument(m[1], m[2], String(body.photo || ""));
  }
  if ((m = u.match(/^api\/shop\/customers\/([^/]+)$/))) {
    if (method === "delete") return db.deleteCustomer(m[1]);
    if (method === "put") return db.updateCustomer(m[1], body as never);
    return db.getCustomerDetail(m[1]);
  }

  // admin (preserved static mock fallback)
  if (u === "api/admin/dashboard") return db.getAdminDashboard();
  if (u === "api/admin/shops") return db.getAdminShops(params as never);
  if ((m = u.match(/^api\/admin\/shops\/([^/]+)\/status$/))) return db.setAdminShopStatus(m[1], body.status, body.reason);
  if ((m = u.match(/^api\/admin\/shops\/([^/]+)\/fee$/))) return db.setAdminShopFee(m[1], body.month, body.status);
  if ((m = u.match(/^api\/admin\/shops\/([^/]+)$/))) return db.getAdminShop(m[1]);

  throw new db.MockError("Yeh page nahi mila", 404);
}

export const mockAdapter: AxiosAdapter = async (config: InternalAxiosRequestConfig) => {
  if (isRealRoute(config.url)) {
    const defaultAdapter = axios.getAdapter(axios.defaults.adapter);
    return defaultAdapter(config);
  }

  await new Promise((r) => setTimeout(r, 250));
  const method = (config.method || "get").toLowerCase();
  const body = typeof config.data === "string" ? JSON.parse(config.data) : config.data || {};
  try {
    const data = route(method, config.url || "", (config.params || {}) as Params, body);
    return { data: { status: "success", data }, status: 200, statusText: "OK", headers: {}, config } as AxiosResponse;
  } catch (e) {
    const err = e as db.MockError;
    const response = { data: { message: err.message }, status: err.status ?? 500, statusText: "Error", headers: {}, config } as AxiosResponse;
    throw new AxiosError(err.message, "ERR_BAD_REQUEST", config, {}, response);
  }
};
