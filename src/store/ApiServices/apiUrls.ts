const API_URLS = {
  SHOP_AUTH: {
    LOGIN: "api/shop-auth/login",
    SIGNUP: "api/shop-auth/signup",
  },
  ADMIN_AUTH: {
    LOGIN: "api/admin-auth/login",
  },
  SHOP: {
    DASHBOARD: "api/shop/dashboard",
    COLLECTION_TODAY: "api/shop/collection/today",
    RECEIVE_PAYMENT: "api/shop/payments/receive",
    PAYMENTS_TODAY: "api/shop/payments/today",
    REVERSE_PAYMENT: (id: string) => `api/shop/payments/${id}/reverse`,
    CUSTOMERS: "api/shop/customers",
    CUSTOMER_DETAIL: (id: string) => `api/shop/customers/${id}`,
    CUSTOMER_DOCUMENT: (id: string, docKey: string) => `api/shop/customers/${id}/documents/${docKey}`,
    LATE: "api/shop/late",
    STATUS: "api/shop/status",
  },
  ADMIN: {
    DASHBOARD: "api/admin/dashboard",
    SHOPS: "api/admin/shops",
    SHOP_DETAIL: (id: string) => `api/admin/shops/${id}`,
    SHOP_STATUS: (id: string) => `api/admin/shops/${id}/status`,
    SHOP_FEE: (id: string) => `api/admin/shops/${id}/fee`,
  },
};

export default API_URLS;
