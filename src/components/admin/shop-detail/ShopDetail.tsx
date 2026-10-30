"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Maximize2, MoreVertical, User } from "lucide-react";
import FeeCard from "../fee-card/FeeCard";
import StatusControl from "../status-control/StatusControl";
import DropdownMenu from "@/components/common/DropdownMenu/DropdownMenu";
import ConfirmModal from "@/components/common/modal/confirm-modal/ConfirmModal";
import PhotoViewer from "@/components/common/PhotoViewer/PhotoViewer";
import StatusBadge from "@/components/common/StatusBadge/StatusBadge";
import FormInput from "@/components/common/ui/FormInput";
import { ROUTES } from "@/constant/appRoutes";
import { useShopStatusChange } from "@/hooks/useShopStatusChange";
import {
  deleteAdminShop,
  resetAdminShopPassword,
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
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const closePasswordForm = () => {
    setShowPasswordForm(false);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setConfirmPasswordError("");
  };

  const resetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordError("");
    setConfirmPasswordError("");

    if (!newPassword) {
      setPasswordError("Please enter a password.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    }
    if (!/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) {
      setPasswordError("Password must include at least one letter and one number.");
      return;
    }
    if (new TextEncoder().encode(newPassword).length > 72) {
      setPasswordError("Password must be no more than 72 bytes.");
      return;
    }
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm the new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return;
    }

    try {
      await dispatch(
        resetAdminShopPassword({ id: s.id, newPassword }),
      ).unwrap();
      closePasswordForm();
      showToast(
        `Password updated. ${s.shopName} will be signed out on the next request and can log in with the new password.`,
        "success",
      );
    } catch (e) {
      showToast(
        typeof e === "string" ? e : "Failed to reset shop password",
        "error",
      );
    }
  };

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

      <section className="sd-card sd-password-card" aria-label="Shop password">
        <div className="sd-password-heading">
          <div>
            <h2>Shop Password</h2>
            <p>
              Set a password for the shopkeeper. Existing shop
              sessions will be signed out on their next request.
            </p>
          </div>
          {!showPasswordForm && (
            <button
              type="button"
              className="sd-password-button"
              disabled={updating}
              onClick={() => setShowPasswordForm(true)}
            >
              <KeyRound size={16} />
              Reset password
            </button>
          )}
        </div>
        {showPasswordForm && (
          <form className="sd-password-form" onSubmit={resetPassword}>
            <FormInput
              label="New password"
              name="newPassword"
              type="password"
              value={newPassword}
              onChange={(event) => {
                setNewPassword(event.target.value);
                setPasswordError("");
              }}
              placeholder="At least 6 characters"
              autoComplete="new-password"
              maxLength={72}
              error={passwordError}
            />
            <FormInput
              label="Confirm new password"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                setConfirmPasswordError("");
              }}
              placeholder="Re-enter password"
              autoComplete="new-password"
              maxLength={72}
              error={confirmPasswordError}
            />
            <div className="sd-password-actions">
              <button
                type="button"
                className="sd-password-cancel"
                disabled={updating}
                onClick={closePasswordForm}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="sd-password-button"
                disabled={updating}
              >
                {updating ? "Updating…" : "Set new password"}
              </button>
            </div>
          </form>
        )}
      </section>

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
