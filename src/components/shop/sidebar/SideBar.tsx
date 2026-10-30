"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  AlertCircle,
  BarChart3,
  ClipboardList,
  Home,
  Users,
} from "lucide-react";
import { ROUTES } from "@/constant/appRoutes";
import { fetchShopDashboard } from "@/store/slices/shop/dashboard/shopDashboardSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import "./sidebar.scss";

const NAV = [
  {
    href: ROUTES.SHOP.DASHBOARD,
    label: "Home",
    short: "Home",
    ur: "ہوم",
    Icon: Home,
  },
  {
    href: ROUTES.SHOP.COLLECTION,
    label: "Aaj ki wasooli",
    short: "Aaj",
    ur: "آج کی وصولی",
    Icon: ClipboardList,
  },
  {
    href: ROUTES.SHOP.CUSTOMERS,
    label: "Customers",
    short: "Customers",
    ur: "کسٹمرز",
    Icon: Users,
  },
  {
    href: ROUTES.SHOP.LATE,
    label: "Late qistein",
    short: "Late",
    ur: "لیٹ قسطیں",
    Icon: AlertCircle,
  },
  {
    href: ROUTES.SHOP.STATUS,
    label: "Status",
    short: "Status",
    ur: "اسٹیٹس",
    Icon: BarChart3,
  },
];

/** Desktop = left menu. Phone = bottom tabs. */
const SideBar = () => {
  const path = usePathname();
  const dispatch = useAppDispatch();
  const requestedDashboard = useRef(false);
  const { data: dashboard, loading } = useAppSelector(
    (state) => state.shopDashboard,
  );
  useEffect(() => {
    if (!dashboard && !loading && !requestedDashboard.current) {
      requestedDashboard.current = true;
      dispatch(fetchShopDashboard());
    }
  }, [dashboard, dispatch, loading]);

  const countFor = (href: string) => {
    if (href === ROUTES.SHOP.COLLECTION) return dashboard?.dueCount ?? 0;
    if (href === ROUTES.SHOP.LATE) return dashboard?.lateCount ?? 0;
    return 0;
  };
  const badge = (count: number, href: string) =>
    count > 0 ? (
      <span
        className={`shop-nav-count ${
          href === ROUTES.SHOP.COLLECTION ? "today" : "late"
        }`}
        aria-label={`${count}`}
      >
        {count > 99 ? "99+" : count}
      </span>
    ) : null;
  const isActive = (href: string) =>
    path === href || path.startsWith(href + "/");

  return (
    <>
      <aside className="shop-sidebar" aria-label="Main menu">
        <nav>
          {NAV.map(({ href, label, ur, Icon }) => (
            <Link
              key={href}
              href={href}
              className={isActive(href) ? "active" : ""}
              aria-current={isActive(href) ? "page" : undefined}
            >
              <Icon size={22} />
              <span>{label}</span>
              <span className="ur" lang="ur">
                {ur}
              </span>
            </Link>
          ))}
        </nav>
      </aside>

      <nav className="shop-tabs" aria-label="Quick menu">
        {NAV.map(({ href, short, Icon }) => (
          <Link
            key={href}
            href={href}
            className={isActive(href) ? "active" : ""}
            aria-current={isActive(href) ? "page" : undefined}
          >
            <span className="shop-nav-icon">
              <Icon size={24} />
              {badge(countFor(href), href)}
            </span>
            <span>{short}</span>
          </Link>
        ))}
      </nav>
    </>
  );
};

export default SideBar;
