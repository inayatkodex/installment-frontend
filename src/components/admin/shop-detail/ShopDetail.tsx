"use client";

import { useState } from "react";
import { Maximize2, User } from "lucide-react";
import FeeCard from "../fee-card/FeeCard";
import StatusControl from "../status-control/StatusControl";
import PhotoViewer from "@/components/common/PhotoViewer/PhotoViewer";
import StatusBadge from "@/components/common/StatusBadge/StatusBadge";
import { useShopStatusChange } from "@/hooks/useShopStatusChange";
import { setAdminShopFee } from "@/store/slices/admin/shops/adminShopsSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { formatDate } from "@/shared/formatUtils";
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
  const updating = useAppSelector((st) => st.adminShops.updating);
  const { ask, dialog } = useShopStatusChange();
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);

  const changeFee = async (month: string, status: FeeStatus) => {
    try {
      await dispatch(setAdminShopFee({ id: s.id, month, status })).unwrap();
      showToast(
        status === "paid"
          ? "Platform fee marked as paid"
          : "Platform fee marked as unpaid",
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
              onClick={() => setPhotoSrc(s.profilePic!)}
              title="Click to enlarge profile photo"
            >
              <img
                src={s.profilePic}
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
        <StatusControl value={s.status} onSelect={(st) => ask(s, st)} />
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
              onClick={() => setPhotoSrc(s.profilePic!)}
            >
              <img src={s.profilePic} alt={`${s.ownerName} profile`} />
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
    </div>
  );
};

export default ShopDetail;
