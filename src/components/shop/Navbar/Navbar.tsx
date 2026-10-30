"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, UserRound } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { shopLogout } from "@/store/slices/shop/auth/shopAuthSlice";
import { ROUTES } from "@/constant/appRoutes";
import BrandLogo from "@/components/common/BrandLogo";
import ConfirmModal from "@/components/common/modal/confirm-modal/ConfirmModal";
import DropdownMenu from "@/components/common/DropdownMenu/DropdownMenu";
import { resolveMediaUrl } from "@/shared/imageUtils";
import "./navbar.scss";

const Navbar = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.shopAuth.user);
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
        <DropdownMenu
          ariaLabel="Shop account menu"
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
              label: "Profile",
              onClick: () => router.push(ROUTES.SHOP.PROFILE),
            },
            {
              label: "Logout",
              tone: "danger",
              onClick: () => setConfirm(true),
            },
          ]}
        />
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
