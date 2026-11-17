import { createListenerMiddleware } from "@reduxjs/toolkit";
import {
  fetchTodayCollection,
  fetchTodayReceived,
} from "@/store/slices/shop/collection/shopCollectionSlice";
import { fetchShopDashboard } from "@/store/slices/shop/dashboard/shopDashboardSlice";
import { fetchLate } from "@/store/slices/shop/late/shopLateSlice";
import type { RootState } from "@/store/store";

/**
 * Socket ke baghair "instant" sync (web). Jab bhi shop ka data badalne wala koi
 * mutation kaamyab hota hai, yeh listener foran mutalliq (affected) data —
 * dashboard totals, aaj ki wasooli aur late count — dobara load karwa deta hai.
 *
 * Is tarah acting page ke ilawa persistent layout (sidebar ke badges aur mobile
 * bottom-tabs) bhi foran taza ho jate hain, bina poori page reload kiye. Baqi
 * pages route change par khud refresh ho jate hain.
 */
const MUTATION_FULFILLED = new Set<string>([
  "shopCustomers/create/fulfilled",
  "shopCustomers/update/fulfilled",
  "shopCustomers/delete/fulfilled",
  "shopCustomers/archive/fulfilled",
  "shopCustomers/restoreArchived/fulfilled",
  "shopCustomers/undoDelete/fulfilled",
  "shopCustomers/addPurchase/fulfilled",
  "shopCustomers/updatePurchaseDate/fulfilled",
  "shopCustomers/updateBasePayment/fulfilled",
  "shopCustomers/updatePurchasePayment/fulfilled",
  "shopCollection/receive/fulfilled",
  "shopCollection/reverse/fulfilled",
]);

export const shopRevalidation = createListenerMiddleware<RootState>();

shopRevalidation.startListening({
  predicate: (action) =>
    MUTATION_FULFILLED.has((action as { type: string }).type),
  effect: (_action, api) => {
    api.dispatch(fetchShopDashboard());
    api.dispatch(fetchTodayCollection());
    api.dispatch(fetchTodayReceived());
    api.dispatch(fetchLate());
  },
});
