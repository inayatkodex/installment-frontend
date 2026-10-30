"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";
import { useAppDispatch } from "@/store/store";
import { shopLogout } from "@/store/slices/shop/auth/shopAuthSlice";
import { ROUTES } from "@/constant/appRoutes";
import BrandLogo from "@/components/common/BrandLogo";
import ConfirmModal from "@/components/common/modal/confirm-modal/ConfirmModal";
import DropdownMenu from "@/components/common/DropdownMenu/DropdownMenu";
import "./navbar.scss";

const Navbar = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
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
      <DropdownMenu
        ariaLabel="Shop account menu"
        trigger={<MoreVertical size={22} aria-hidden="true" />}
        triggerClassName="icon-only shop-navbar-menu-trigger"
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
