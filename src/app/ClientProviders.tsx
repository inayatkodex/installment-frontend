"use client";

import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { ReduxProvider } from "@/store/Provider/ReduxProvider";
import { useAppDispatch } from "@/store/store";
import { rehydrateShopFromCookies } from "@/store/slices/shop/auth/shopAuthSlice";
import { rehydrateAdminFromCookies } from "@/store/slices/admin/auth/adminAuthSlice";

function RehydrateAuth() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    // Restore login state from cookies when the app opens
    dispatch(rehydrateShopFromCookies());
    dispatch(rehydrateAdminFromCookies());
  }, [dispatch]);
  return null;
}

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <RehydrateAuth />
      <ToastContainer />
      {children}
    </ReduxProvider>
  );
}
