"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import Drawer from "@/common/Drawer";
import NavList from "../sidebar/NavList";
import ConfirmModal from "@/components/common/modal/confirm-modal/ConfirmModal";
import { ROUTES } from "@/constant/appRoutes";
import { adminLogout } from "@/store/slices/admin/auth/adminAuthSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import BrandLogo from "@/components/common/BrandLogo";
import "./navbar.scss";

const Navbar = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.adminAuth.user);
  const [menu, setMenu] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const logout = () => {
    dispatch(adminLogout());
    router.push(ROUTES.ADMIN.SIGNIN);
  };

  return (
    <header className="admin-navbar">
      <button
        type="button"
        className="an-menu"
        onClick={() => setMenu(true)}
        aria-label="Open navigation menu"
      >
        <Menu size={24} />
      </button>
      <div className="an-brand">
        <BrandLogo size={28} />
        <span>Admin</span>
      </div>
      <div className="an-right">
        <span className="an-user">{user?.name ?? "Admin"}</span>
        <button
          type="button"
          className="an-logout"
          onClick={() => setConfirm(true)}
          aria-label="Sign Out"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>

      <Drawer
        open={menu}
        title="Installment Pro · Admin"
        onClose={() => setMenu(false)}
      >
        <NavList onNavigate={() => setMenu(false)} />
      </Drawer>
      {confirm && (
        <ConfirmModal
          title="Sign Out"
          message="Are you sure you want to sign out of the Admin panel?"
          confirmText="Yes, Sign Out"
          cancelText="Cancel"
          loadingText="Signing out…"
          onConfirm={logout}
          onCancel={() => setConfirm(false)}
        />
      )}
    </header>
  );
};

export default Navbar;
