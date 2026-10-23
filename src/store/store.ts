import { configureStore } from "@reduxjs/toolkit";
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

export const store = configureStore({
  reducer: {
    shopAuth: shopAuthReducer,
    shopDashboard: shopDashboardReducer,
    shopCollection: shopCollectionReducer,
    shopCustomers: shopCustomersReducer,
    shopLate: shopLateReducer,
    shopStatus: shopStatusReducer,
    adminAuth: adminAuthReducer,
    adminDashboard: adminDashboardReducer,
    adminShops: adminShopsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
