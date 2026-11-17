import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import shopAuthReducer from "./slices/shop/auth/shopAuthSlice";
import shopDashboardReducer from "./slices/shop/dashboard/shopDashboardSlice";
import shopCollectionReducer from "./slices/shop/collection/shopCollectionSlice";
import shopCustomersReducer from "./slices/shop/customers/shopCustomersSlice";
import shopLateReducer from "./slices/shop/late/shopLateSlice";
import shopStatusReducer from "./slices/shop/status/shopStatusSlice";

import adminAuthReducer from "./slices/admin/auth/adminAuthSlice";
import adminDashboardReducer from "./slices/admin/dashboard/adminDashboardSlice";
import adminShopsReducer from "./slices/admin/shops/adminShopsSlice";

import { shopRevalidation } from "./middleware/shopRevalidation";

// Root reducer alag define kiya gaya hai taake `RootState` sirf reducers par
// munhasir rahe — warna middleware (jo RootState istemal karta hai) aur store
// ke darmiyan circular type reference ban jata hai.
const rootReducer = combineReducers({
  shopAuth: shopAuthReducer,
  shopDashboard: shopDashboardReducer,
  shopCollection: shopCollectionReducer,
  shopCustomers: shopCustomersReducer,
  shopLate: shopLateReducer,
  shopStatus: shopStatusReducer,
  adminAuth: adminAuthReducer,
  adminDashboard: adminDashboardReducer,
  adminShops: adminShopsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  // Har shop mutation ke baad mutalliq data khud-ba-khud taza hota hai
  // (socket ke baghair instant sync).
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(shopRevalidation.middleware),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
