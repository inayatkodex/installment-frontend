"use client";

import { useState } from "react";
import ConfirmModal from "@/components/common/modal/confirm-modal/ConfirmModal";
import { STATUS_ACTIONS } from "@/constant/shopStatus";
import { updateAdminShopStatus } from "@/store/slices/admin/shops/adminShopsSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { showToast } from "@/shared/toastUtils";
import { AdminShop } from "@/types/adminShop";
import { ShopStatus } from "@/types/common";

/**
 * One place for "change a shop's status" so the list and the detail page behave the same.
 * Any status can be set from any status. A confirm box always asks first.
 */
export function useShopStatusChange(onDone?: () => void) {
  const dispatch = useAppDispatch();
  const updating = useAppSelector((s) => s.adminShops.updating);
  const [pending, setPending] = useState<{ shop: AdminShop; status: ShopStatus } | null>(null);

  const ask = (shop: AdminShop, status: ShopStatus) => {
    if (shop.status !== status) setPending({ shop, status });
  };

  const confirm = async (reason?: string) => {
    if (!pending) return;
    try {
      await dispatch(updateAdminShopStatus({ id: pending.shop.id, status: pending.status, reason })).unwrap();
      showToast(STATUS_ACTIONS[pending.status].done, "success");
      setPending(null);
      onDone?.();
    } catch (e) {
      showToast(typeof e === "string" ? e : "Failed to update shop status", "error");
    }
  };

  const a = pending ? STATUS_ACTIONS[pending.status] : null;
  const dialog =
    pending && a ? (
      <ConfirmModal
        title={a.title(pending.shop.shopName)}
        message={a.message}
        confirmText={a.confirm}
        cancelText="Cancel"
        loadingText="Updating…"
        tone={a.tone}
        askReason={a.askReason}
        reasonLabel="Reason (optional)"
        reasonPlaceholder="e.g. Incomplete verification or requested by owner"
        loading={updating}
        onConfirm={confirm}
        onCancel={() => setPending(null)}
      />
    ) : null;

  return { ask, dialog };
}
