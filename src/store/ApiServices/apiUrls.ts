const API_URLS = {
  SHOP_AUTH: {
    LOGIN: "api/shop-auth/login",
    SIGNUP: "api/shop-auth/signup",
  },
  ADMIN_AUTH: {
    LOGIN: "api/admin-auth/login",
  },
  SHOP: {
    PROFILE: "api/shop/profile",
    DASHBOARD: "api/shop/dashboard",
    COLLECTION_TODAY: "api/shop/collection/today",
    RECEIVE_PAYMENT: "api/shop/payments/receive",
    PAYMENTS_TODAY: "api/shop/payments/today",
    REVERSE_PAYMENT: (id: string) => `api/shop/payments/${id}/reverse`,
    CUSTOMERS: "api/shop/customers",
    CUSTOMERS_PENDING_DELETION: "api/shop/customers/pending-deletion",
    CUSTOMER_DETAIL: (id: string) => `api/shop/customers/${id}`,
    CUSTOMER_UNDO_DELETE: (id: string) => `api/shop/customers/${id}/undo-delete`,
    CUSTOMER_INSTALLMENT: (id: string) => `api/shop/customers/${id}/installment`,
    CUSTOMER_PURCHASES: (id: string) => `api/shop/customers/${id}/purchases`,
    CUSTOMER_PURCHASE_DATE: (customerId: string, purchaseId: string) =>
      `api/shop/customers/${customerId}/purchases/${purchaseId}/date`,
    CUSTOMER_PURCHASE_INSTALLMENT: (customerId: string, purchaseId: string) =>
      `api/shop/customers/${customerId}/purchases/${purchaseId}/installment`,
    CUSTOMER_DOCUMENT: (id: string, docKey: string) => `api/shop/customers/${id}/documents/${docKey}`,
    LATE: "api/shop/late",
    STATUS: "api/shop/status",
  },
  ADMIN: {
    DASHBOARD: "api/admin/dashboard",
    SHOPS: "api/admin/shops",
    SHOPS_PENDING_DELETION: "api/admin/shops/pending-deletion",
    SHOP_DETAIL: (id: string) => `api/admin/shops/${id}`,
    SHOP_DELETE: (id: string) => `api/admin/shops/${id}`,
    SHOP_UNDO_DELETE: (id: string) => `api/admin/shops/${id}/undo-delete`,
    SHOP_STATUS: (id: string) => `api/admin/shops/${id}/status`,
    SHOP_FEE: (id: string) => `api/admin/shops/${id}/fee`,
  },
};

export default API_URLS;
