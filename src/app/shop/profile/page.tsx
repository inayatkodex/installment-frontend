"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Store, UserRound } from "lucide-react";
import CommonBtn from "@/components/common/CommonButton/Button";
import Loader from "@/components/common/Loader/Loader";
import StatusBadge from "@/components/common/StatusBadge/StatusBadge";
import { ROUTES } from "@/constant/appRoutes";
import api from "@/store/ApiServices/api";
import API_URLS from "@/store/ApiServices/apiUrls";
import { getErrorMessage } from "@/shared/apiError";
import { formatRs } from "@/shared/formatUtils";
import { resolveMediaUrl } from "@/shared/imageUtils";
import { ShopProfile } from "@/types/auth";
import "./profile.scss";

const ShopProfilePage = () => {
  const [profile, setProfile] = useState<ShopProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            {profile.profilePic ? (
              <img
                src={resolveMediaUrl(profile.profilePic)}
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
            <StatusBadge status={profile.status} />
          </div>

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
        </section>
      )}
    </div>
  );
};

export default ShopProfilePage;
