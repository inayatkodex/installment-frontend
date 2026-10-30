"use client";

import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Camera,
  ChevronLeft,
  LockKeyhole,
  Pencil,
  Store,
  UserRound,
} from "lucide-react";
import CommonBtn from "@/components/common/CommonButton/Button";
import Loader from "@/components/common/Loader/Loader";
import StatusBadge from "@/components/common/StatusBadge/StatusBadge";
import FormInput from "@/components/common/ui/FormInput";
import { ROUTES } from "@/constant/appRoutes";
import api from "@/store/ApiServices/api";
import API_URLS from "@/store/ApiServices/apiUrls";
import { getErrorMessage } from "@/shared/apiError";
import { formatRs } from "@/shared/formatUtils";
import {
  compressImage,
  fileToDataUrl,
  resolveMediaUrl,
} from "@/shared/imageUtils";
import { showToast } from "@/shared/toastUtils";
import { shopLogout, shopProfileUpdated } from "@/store/slices/shop/auth/shopAuthSlice";
import { useAppDispatch } from "@/store/store";
import { ShopProfile } from "@/types/auth";
import "./profile.scss";

type EditableProfile = Pick<
  ShopProfile,
  "shopName" | "ownerName" | "email" | "city" | "address"
>;

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ShopProfilePage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [profile, setProfile] = useState<ShopProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editValues, setEditValues] = useState<EditableProfile | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaveError, setProfileSaveError] = useState<string | null>(null);
  const [photoEditing, setPhotoEditing] = useState(false);
  const [profilePicData, setProfilePicData] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [savingPhoto, setSavingPhoto] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordValues, setPasswordValues] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [currentPasswordError, setCurrentPasswordError] = useState<string | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(API_URLS.SHOP.PROFILE);
      setProfile(response.data.data as ShopProfile);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Profile load nahi ho saki"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const startEditing = () => {
    if (!profile) return;
    setEditValues({
      shopName: profile.shopName,
      ownerName: profile.ownerName,
      email: profile.email,
      city: profile.city,
      address: profile.address,
    });
    setProfileSaveError(null);
    setEditing(true);
  };

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editValues) return;
    setSavingProfile(true);
    setProfileSaveError(null);
    try {
      const response = await api.put(API_URLS.SHOP.UPDATE_PROFILE, editValues);
      const updatedProfile = response.data.data as ShopProfile;
      setProfile(updatedProfile);
      dispatch(
        shopProfileUpdated({
          shopName: updatedProfile.shopName,
          ownerName: updatedProfile.ownerName,
        }),
      );
      setEditing(false);
      showToast("Profile update ho gayi", "success");
    } catch (requestError) {
      setProfileSaveError(
        getErrorMessage(requestError, "Profile update nahi ho saki"),
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const selectProfilePhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setProfilePicData(null);
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setPhotoError("JPG, PNG ya WebP tasveer select karein");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setPhotoError("Tasveer 10 MB se chhoti honi chahiye");
      return;
    }

    setPhotoError(null);
    try {
      const compressed = await compressImage(file);
      const dataUrl = await fileToDataUrl(compressed);
      if (dataUrl.length > 10 * 1024 * 1024) {
        setPhotoError("Tasveer bohat bari hai; chhoti tasveer select karein");
        return;
      }
      setProfilePicData(dataUrl);
    } catch (requestError) {
      setPhotoError(
        getErrorMessage(requestError, "Tasveer load nahi ho saki"),
      );
    }
  };

  const saveProfilePhoto = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profilePicData) {
      setPhotoError("Pehle tasveer select karein");
      return;
    }

    setSavingPhoto(true);
    setPhotoError(null);
    try {
      const response = await api.put(API_URLS.SHOP.UPDATE_PROFILE, {
        profilePic: profilePicData,
      });
      const updatedProfile = response.data.data as ShopProfile;
      setProfile(updatedProfile);
      dispatch(
        shopProfileUpdated({ profilePic: updatedProfile.profilePic }),
      );
      setProfilePicData(null);
      setPhotoEditing(false);
      showToast("Profile photo update ho gayi", "success");
    } catch (requestError) {
      setPhotoError(getErrorMessage(requestError, "Tasveer update nahi ho saki"));
    } finally {
      setSavingPhoto(false);
    }
  };

  const changePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordError(null);
    setCurrentPasswordError(null);
    if (!passwordValues.currentPassword) {
      setCurrentPasswordError("Pehle apna maujooda password likhein");
      return;
    }
    if (!passwordValues.newPassword) {
      setPasswordError("Naya password likhein");
      return;
    }
    if (!passwordValues.confirmPassword) {
      setPasswordError("Naya password dobara likhein");
      return;
    }
    if (passwordValues.newPassword !== passwordValues.confirmPassword) {
      setPasswordError("Naya password aur confirmation match nahi karte");
      return;
    }
    if (passwordValues.newPassword.length < 6) {
      setPasswordError("Naya password kam az kam 6 huroof ka hona chahiye");
      return;
    }
    if (
      !/[A-Za-z]/.test(passwordValues.newPassword) ||
      !/\d/.test(passwordValues.newPassword)
    ) {
      setPasswordError(
        "Naye password mein kam az kam aik English letter aur aik number zaroor ho.",
      );
      return;
    }
    if (new TextEncoder().encode(passwordValues.newPassword).length > 72) {
      setPasswordError("Naya password 72 bytes se zyada nahi ho sakta");
      return;
    }

    setChangingPassword(true);
    try {
      await api.put(API_URLS.SHOP.CHANGE_PASSWORD, {
        currentPassword: passwordValues.currentPassword,
        newPassword: passwordValues.newPassword,
      });
      dispatch(shopLogout());
      showToast("Password change ho gaya. Dobara login karein.", "success");
      router.replace(ROUTES.SHOP.LOGIN);
    } catch (requestError) {
      setPasswordError(
        getErrorMessage(requestError, "Password change nahi ho saka"),
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const registrationDate = profile
    ? new Date(profile.createdAt).toLocaleDateString("en-PK", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Karachi",
      })
    : "";

  return (
    <div className="shop-profile-page">
      <Link href={ROUTES.SHOP.DASHBOARD} className="sp-back">
        <ChevronLeft size={20} aria-hidden="true" />
        Dashboard
      </Link>

      <div className="sp-title">
        <h1 className="page-title">
          Dukaan ki tafseel{" "}
          <span className="ur" lang="ur">
            دکان کی تفصیل
          </span>
        </h1>
        <p>Yahan aap apni registered shop details dekh sakte hain.</p>
      </div>

      {error ? (
        <div className="sp-error" role="alert">
          <p>{error}</p>
          <CommonBtn text="Dobara koshish karein" onClick={loadProfile} />
        </div>
      ) : loading || !profile ? (
        <Loader />
      ) : (
        <section className="sp-card" aria-label="Shop profile details">
          <div className="sp-heading">
            {(profilePicData || profile.profilePic) ? (
              <img
                src={resolveMediaUrl(profilePicData ?? profile.profilePic)}
                alt=""
                className="sp-photo"
              />
            ) : (
              <span className="sp-photo sp-photo-placeholder">
                <Store size={26} aria-hidden="true" />
              </span>
            )}
            <div className="sp-shop-name">
              <h2>{profile.shopName}</h2>
              <span>{profile.shopCode}</span>
            </div>
            <div className="sp-heading-actions">
              <StatusBadge status={profile.status} />
              {!photoEditing && (
                <button
                  type="button"
                  className="sp-photo-edit-button"
                  onClick={() => {
                    setPhotoError(null);
                    setPhotoEditing(true);
                  }}
                >
                  <Camera size={16} aria-hidden="true" />
                  Tasveer badlein
                </button>
              )}
            </div>
          </div>

          {photoEditing && (
            <form className="sp-photo-form" onSubmit={saveProfilePhoto}>
              <input
                id="shop-profile-photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={selectProfilePhoto}
              />
              <label className="sp-photo-file-label" htmlFor="shop-profile-photo">
                <Camera size={17} aria-hidden="true" />
                Tasveer chunein
              </label>
              <p className="sp-photo-help">JPG, PNG ya WebP · 10 MB tak</p>
              {photoError && (
                <p className="sp-form-error" role="alert">
                  {photoError}
                </p>
              )}
              <div className="sp-actions">
                <button
                  type="button"
                  className="sp-photo-cancel"
                  disabled={savingPhoto}
                  onClick={() => {
                    setPhotoEditing(false);
                    setProfilePicData(null);
                    setPhotoError(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="sp-photo-save"
                  disabled={savingPhoto}
                >
                  {savingPhoto ? "Save ho raha hai…" : "Photo save karein"}
                </button>
              </div>
            </form>
          )}

          {editing && editValues ? (
            <form className="sp-edit-form" onSubmit={saveProfile}>
              <FormInput
                label="Dukaan ka naam"
                value={editValues.shopName}
                onChange={(event) =>
                  setEditValues({ ...editValues, shopName: event.target.value })
                }
                autoComplete="organization"
              />
              <FormInput
                label="Malik ka naam"
                value={editValues.ownerName}
                onChange={(event) =>
                  setEditValues({ ...editValues, ownerName: event.target.value })
                }
                autoComplete="name"
              />
              <FormInput
                label="Email"
                type="email"
                optional
                value={editValues.email ?? ""}
                onChange={(event) =>
                  setEditValues({ ...editValues, email: event.target.value || null })
                }
                autoComplete="email"
              />
              <FormInput
                label="Shehar"
                value={editValues.city}
                onChange={(event) =>
                  setEditValues({ ...editValues, city: event.target.value })
                }
                autoComplete="address-level2"
              />
              <FormInput
                label="Dukaan ka pata"
                multiline
                rows={2}
                value={editValues.address}
                onChange={(event) =>
                  setEditValues({ ...editValues, address: event.target.value })
                }
                autoComplete="street-address"
              />
              {profileSaveError && (
                <p className="sp-form-error" role="alert">
                  {profileSaveError}
                </p>
              )}
              <p className="sp-note">
                Mobile number aur CNIC yahan se change nahi ho sakte.
              </p>
              <div className="sp-actions">
                <CommonBtn
                  text="Cancel"
                  className="gray-btn"
                  onClick={() => setEditing(false)}
                  disabled={savingProfile}
                />
                <CommonBtn
                  text={savingProfile ? "Save ho raha hai…" : "Tabdeeli save karein"}
                  type="submit"
                  disabled={savingProfile}
                />
              </div>
            </form>
          ) : (
            <>
              <div className="sp-owner">
                <span className="sp-owner-icon" aria-hidden="true">
                  <UserRound size={20} />
                </span>
                <div>
                  <span>Malik</span>
                  <strong>{profile.ownerName}</strong>
                </div>
              </div>
              <dl className="sp-details">
                <div>
                  <dt>Mobile number</dt>
                  <dd>{profile.mobile}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{profile.email || "—"}</dd>
                </div>
                <div>
                  <dt>CNIC</dt>
                  <dd>{profile.cnic}</dd>
                </div>
                <div>
                  <dt>Shehar</dt>
                  <dd>{profile.city}</dd>
                </div>
                <div>
                  <dt>Dukaan ka pata</dt>
                  <dd>{profile.address}</dd>
                </div>
                <div>
                  <dt>Mahina fee</dt>
                  <dd>{formatRs(profile.monthlyFee)}</dd>
                </div>
                <div>
                  <dt>Registration ki tareekh</dt>
                  <dd>{registrationDate}</dd>
                </div>
              </dl>
              <div className="sp-card-actions">
                <CommonBtn
                  text="Profile edit karein"
                  icon={<Pencil size={18} aria-hidden="true" />}
                  onClick={startEditing}
                />
              </div>
            </>
          )}
        </section>
      )}

      {!loading && profile && (
        <section className="sp-password">
          <div className="sp-password-heading">
            <div>
              <h2>Password aur security</h2>
              <p>Apne account ko mehfooz rakhne ke liye password update karein.</p>
            </div>
            {!passwordOpen && (
              <CommonBtn
                text="Password change karein"
                icon={<LockKeyhole size={18} aria-hidden="true" />}
                onClick={() => {
                  setPasswordError(null);
                  setCurrentPasswordError(null);
                  setPasswordOpen(true);
                }}
              />
            )}
          </div>
          {passwordOpen && (
            <form className="sp-password-form" onSubmit={changePassword}>
              <FormInput
                label="Maujooda password"
                type="password"
                autoComplete="current-password"
                value={passwordValues.currentPassword}
                error={currentPasswordError ?? undefined}
                onChange={(event) =>
                  {
                    setPasswordValues({
                      ...passwordValues,
                      currentPassword: event.target.value,
                    });
                    setCurrentPasswordError(null);
                  }
                }
              />
              <FormInput
                label="Naya password"
                type="password"
                autoComplete="new-password"
                value={passwordValues.newPassword}
                onChange={(event) =>
                  setPasswordValues({
                    ...passwordValues,
                    newPassword: event.target.value,
                  })
                }
              />
              <p className="sp-note">
                Password mein kam az kam aik English letter aur aik number
                zaroor shamil karein.
              </p>
              <p className="sp-password-example">
                Misal: <strong>Dukaan123</strong>
              </p>
              <FormInput
                label="Naya password dobara likhein"
                type="password"
                autoComplete="new-password"
                value={passwordValues.confirmPassword}
                onChange={(event) =>
                  setPasswordValues({
                    ...passwordValues,
                    confirmPassword: event.target.value,
                  })
                }
              />
              <p className="sp-note">
                Password change hone ke baad aapko dobara login karna hoga.
              </p>
              {passwordError && (
                <p className="sp-form-error" role="alert">
                  {passwordError}
                </p>
              )}
              <div className="sp-actions">
                <CommonBtn
                  text="Cancel"
                  className="gray-btn"
                  onClick={() => {
                    setPasswordOpen(false);
                    setPasswordValues({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                    setPasswordError(null);
                    setCurrentPasswordError(null);
                  }}
                  disabled={changingPassword}
                />
                <CommonBtn
                  text={
                    changingPassword ? "Password change ho raha hai…" : "Password save karein"
                  }
                  type="submit"
                  disabled={changingPassword}
                />
              </div>
            </form>
          )}
        </section>
      )}
    </div>
  );
};

export default ShopProfilePage;
