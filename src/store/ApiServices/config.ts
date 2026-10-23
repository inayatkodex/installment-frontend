export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";

/** true = demo data without a backend. Set NEXT_PUBLIC_USE_MOCK=false when the NestJS API is ready. */
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export const TOKEN_KEY = "shop_token";
export const SHOP_USER_KEY = "shop_user";
export const ADMIN_TOKEN_KEY = "admin_token";
export const ADMIN_USER_KEY = "admin_user";
