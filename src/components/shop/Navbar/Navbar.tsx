"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, Store, UserRound } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { shopLogout } from "@/store/slices/shop/auth/shopAuthSlice";
import { ROUTES } from "@/constant/appRoutes";
import BrandLogo from "@/components/common/BrandLogo";
import { Skeleton, SkeletonGroup } from "@/components/common/Skeleton/Skeleton";
import ConfirmModal from "@/components/common/modal/confirm-modal/ConfirmModal";
import DropdownMenu from "@/components/common/DropdownMenu/DropdownMenu";
import { resolveMediaUrl } from "@/shared/imageUtils";
import "./navbar.scss";

const Navbar = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.shopAuth.user);
  const authRehydrated = useAppSelector((state) => state.shopAuth.rehydrated);
  const [confirm, setConfirm] = useState(false);

  const logout = () => {
    dispatch(shopLogout());
    router.push(ROUTES.SHOP.LOGIN);
  };

  return (
    <header className="shop-navbar">
      <div className="shop-navbar-brand">
        <BrandLogo size={34} />
      </div>
      <div className="shop-navbar-actions">
        {!authRehydrated ? (
          <SkeletonGroup
            className="shop-navbar-account-skeleton"
            label="Ruk jayen…"
          >
            <Skeleton className="shop-navbar-skeleton-avatar" />
            <Skeleton className="shop-navbar-skeleton-name" />
            <Skeleton className="shop-navbar-skeleton-chevron" />
          </SkeletonGroup>
        ) : (
          <DropdownMenu
            ariaLabel="Shop account menu"
            menuWidth={440}
            menuHeight={220}
            menuClassName="shop-account-menu"
            menuHeader={
              <button
                type="button"
                className="shop-account-menu-profile"
                role="menuitem"
                onClick={() => router.push(ROUTES.SHOP.PROFILE)}
              >
                {user?.profilePic ? (
                  <img
                    src={resolveMediaUrl(user.profilePic)}
                    alt=""
                    className="shop-account-menu-photo"
                  />
                ) : (
                  <span className="shop-account-menu-initial" aria-hidden="true">
                    {user?.ownerName?.trim().charAt(0).toUpperCase() || "S"}
                  </span>
                )}
                <span className="shop-account-menu-details">
                  <strong>{user?.ownerName || "Profile"}</strong>
                  <span className="shop-account-menu-shop">
                    <Store size={20} aria-hidden="true" />
                    <span>Dukaan: {user?.shopName || "—"}</span>
                  </span>
                </span>
              </button>
            }
            trigger={
              <>
                {user?.profilePic ? (
                  <img
                    src={resolveMediaUrl(user.profilePic)}
                    alt=""
                    className="shop-navbar-profile-photo"
                  />
                ) : (
                  <span className="shop-navbar-profile-fallback">
                    <UserRound size={19} aria-hidden="true" />
                  </span>
                )}
                <span className="shop-navbar-owner-name">
                  {user?.ownerName || "Profile"}
                </span>
                <ChevronDown
                  className="shop-navbar-chevron"
                  size={17}
                  aria-hidden="true"
                />
              </>
            }
            triggerClassName="shop-navbar-account-trigger"
            items={[
              {
                label: "Logout",
                tone: "danger",
                icon: <LogOut size={25} aria-hidden="true" />,
                onClick: () => setConfirm(true),
              },
            ]}
          />
        )}
      </div>

      {confirm && (
        <ConfirmModal
          title="Logout karna hai?"
          message="Aap dobara login karke wapas aa sakte hain."
          confirmText="Haan, Logout"
          centered
          onConfirm={logout}
          onCancel={() => setConfirm(false)}
        />
      )}
    </header>
  );
};

export default Navbar;
