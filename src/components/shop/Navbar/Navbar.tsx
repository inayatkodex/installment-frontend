"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAppDispatch } from "@/store/store";
import { shopLogout } from "@/store/slices/shop/auth/shopAuthSlice";
import { ROUTES } from "@/constant/appRoutes";
import BrandLogo from "@/components/common/BrandLogo";
import ConfirmModal from "@/components/common/modal/confirm-modal/ConfirmModal";
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
      <button
        type="button"
        className="shop-navbar-logout"
        onClick={() => setConfirm(true)}
        aria-label="Logout"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>

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
