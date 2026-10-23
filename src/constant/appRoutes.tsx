export const ROUTES = {
  HOME: { INDEX: "/" },

  ADMIN: {
    SIGNIN: "/admin/signin",
    DASHBOARD: "/admin/dashboard",
    SHOPS: "/admin/shops",
    SHOP_DETAIL: (id: string) => `/admin/shops/${id}`,
  },

  SHOP: {
    LOGIN: "/shop/login",
    SIGNUP: "/shop/signup",
    DASHBOARD: "/shop/dashboard",
    COLLECTION: "/shop/collection",
    CUSTOMERS: "/shop/customers",
    CUSTOMER_DETAIL: (id: string) => `/shop/customers/${id}`,
    CUSTOMER_EDIT: (id: string) => `/shop/customers/${id}/edit`,
    ADD_CUSTOMER: "/shop/customers/add",
    LATE: "/shop/late",
    STATUS: "/shop/status",
  },
};
