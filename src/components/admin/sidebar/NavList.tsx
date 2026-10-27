"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Store } from "lucide-react";
import { ROUTES } from "@/constant/appRoutes";
import "./sidebar.scss";

export const ADMIN_NAV = [
  {
    href: ROUTES.ADMIN.DASHBOARD,
    label: "Dashboard",
    short: "Dashboard",
    ur: "ڈیش بورڈ",
    Icon: LayoutDashboard,
  },
  {
    href: ROUTES.ADMIN.SHOPS,
    label: "Shops",
    short: "Shops",
    ur: "دکانیں",
    Icon: Store,
  },
];

const NavList = ({ onNavigate }: { onNavigate?: () => void }) => {
  const path = usePathname();
  return (
    <nav className="admin-nav" aria-label="Admin menu">
      {ADMIN_NAV.map(({ href, label, ur, Icon }) => {
        const active = path === href || path.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={active ? "active" : ""}
            aria-current={active ? "page" : undefined}
            onClick={onNavigate}
          >
            <Icon size={22} />
            <span>{label}</span>
            {ur && (
              <span className="ur" lang="ur">
                {ur}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default NavList;
