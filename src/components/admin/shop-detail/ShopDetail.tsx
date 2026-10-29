"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Maximize2, MoreVertical, User } from "lucide-react";
import FeeCard from "../fee-card/FeeCard";
import StatusControl from "../status-control/StatusControl";
import DropdownMenu from "@/components/common/DropdownMenu/DropdownMenu";
import ConfirmModal from "@/components/common/modal/confirm-modal/ConfirmModal";
import PhotoViewer from "@/components/common/PhotoViewer/PhotoViewer";
import StatusBadge from "@/components/common/StatusBadge/StatusBadge";
import { ROUTES } from "@/constant/appRoutes";
import { useShopStatusChange } from "@/hooks/useShopStatusChange";
import {
  deleteAdminShop,
  setAdminShopFee,
} from "@/store/slices/admin/shops/adminShopsSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { formatDate } from "@/shared/formatUtils";
import { resolveMediaUrl } from "@/shared/imageUtils";
import { showToast } from "@/shared/toastUtils";
import { AdminShop, FeeStatus } from "@/types/adminShop";
import "./shop-detail.scss";

const Row = ({ k, v }: { k: string; v: string }) => (
  <div className="sd-row">
    <span>{k}</span>
    <b>{v}</b>
  </div>
);

const ShopDetail = ({ shop: s }: { shop: AdminShop }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const updating = useAppSelector((st) => st.adminShops.updating);
  const { ask, dialog } = useShopStatusChange();
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const deleteShop = async () => {
    try {
      await dispatch(deleteAdminShop(s.id)).unwrap();
      showToast(`${s.shopName} deleted. Undo is available for 24 hours.`, "success");
      router.push(ROUTES.ADMIN.SHOPS);
    } catch (e) {
      showToast(
        typeof e === "string" ? e : "Failed to schedule shop deletion",
        "error",
      );
    }
  };

  const changeFee = async (month: string, status: FeeStatus) => {
    try {
      await dispatch(setAdminShopFee({ id: s.id, month, status })).unwrap();
      showToast(
        status === "paid"
          ? `Rs. ${s.monthlyFee.toLocaleString()} fee received for ${s.shopName}`
          : `Fee marked as unpaid for ${s.shopName}`,
        "success",
      );
    } catch (e) {
      showToast(
        typeof e === "string" ? e : "Failed to update fee status",
        "error",
      );
    }
  };

  return (
    <div className="shop-detail">
      <div className="sd-head">
        <div className="sd-head-main">
          {s.profilePic ? (
            <button
              type="button"
              className="sd-avatar-btn"
              onClick={() => setPhotoSrc(resolveMediaUrl(s.profilePic)!)}
              title="Click to enlarge profile photo"
            >
              <img
                src={resolveMediaUrl(s.profilePic)}
                alt={s.ownerName}
                className="sd-head-avatar"
              />
            </button>
          ) : (
            <div className="sd-head-avatar-fallback">
              <User size={36} />
            </div>
          )}
          <div>
            <div className="sd-title">
              <h1>{s.shopName}</h1>
              <StatusBadge status={s.status} />
            </div>
            <p>
              {s.shopCode} · {s.city} · Registered on{" "}
              {formatDate(s.registeredAt)}
            </p>
          </div>
        </div>
        <div className="sd-head-actions">
          <StatusControl value={s.status} onSelect={(st) => ask(s, st)} />
          <DropdownMenu
            ariaLabel={`More actions for ${s.shopName}`}
            trigger={<MoreVertical size={22} aria-hidden="true" />}
            triggerClassName="icon-only"
            items={[
              {
                label: "Archive shop",
                tone: "danger",
                disabled: s.status === "archived",
                onClick: () => ask(s, "archived"),
              },
              {
                label: "Delete shop",
                tone: "danger",
                onClick: () => setConfirmDelete(true),
              },
            ]}
          />
        </div>
      </div>

      {s.statusNote && (
        <p className="sd-note" role="note">
          Reason: {s.statusNote}
        </p>
      )}

      <div className="sd-two">
        <section className="sd-card" aria-label="Shop Details">
          <h2>Shop Details</h2>
          <Row k="Owner Name" v={s.ownerName} />
          <Row k="Mobile" v={s.mobile} />
          <Row k="Email" v={s.email ?? "—"} />
          <Row k="CNIC" v={s.cnic} />
          <Row k="Address" v={s.address} />
          <Row k="City" v={s.city} />
        </section>
        <FeeCard shop={s} busy={updating} onChange={changeFee} />
      </div>

      <section className="sd-card" aria-label="Owner Profile Picture">
        <h2>Owner Profile Picture</h2>
        {s.profilePic ? (
          <div className="sd-profile-card">
            <button
              type="button"
              className="sd-profile-preview"
              onClick={() => setPhotoSrc(resolveMediaUrl(s.profilePic)!)}
            >
              <img
                src={resolveMediaUrl(s.profilePic)}
                alt={`${s.ownerName} profile`}
              />
              <span className="sd-preview-overlay">
                <Maximize2 size={20} /> View Full Photo
              </span>
            </button>
            <div className="sd-profile-meta">
              <strong>{s.ownerName}</strong>
              <p>Uploaded during shop registration</p>
            </div>
          </div>
        ) : (
          <p className="sd-no-photo">
            No profile picture uploaded by this shop.
          </p>
        )}
      </section>

      {photoSrc && (
        <PhotoViewer
          src={photoSrc}
          title={`${s.ownerName} · Profile Photo`}
          onClose={() => setPhotoSrc(null)}
        />
      )}
      {dialog}
      {confirmDelete && (
        <ConfirmModal
          title={`Delete ${s.shopName}?`}
          message="The shop will be disabled. Undo within 24 hours, or its data will be permanently deleted."
          confirmText="Delete"
          cancelText="Cancel"
          loadingText="Deleting…"
          tone="danger"
          loading={updating}
          onConfirm={deleteShop}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
};

export default ShopDetail;
