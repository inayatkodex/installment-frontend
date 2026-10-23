"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertCircle, BarChart3, ClipboardList, Home, Users } from "lucide-react";
import { ROUTES } from "@/constant/appRoutes";
import "./sidebar.scss";

const NAV = [
  { href: ROUTES.SHOP.DASHBOARD, label: "Home", short: "Home", ur: "ہوم", Icon: Home },
  { href: ROUTES.SHOP.COLLECTION, label: "Aaj ki wasooli", short: "Aaj", ur: "آج کی وصولی", Icon: ClipboardList },
  { href: ROUTES.SHOP.CUSTOMERS, label: "Customers", short: "Customers", ur: "کسٹمرز", Icon: Users },
  { href: ROUTES.SHOP.LATE, label: "Late qistein", short: "Late", ur: "لیٹ قسطیں", Icon: AlertCircle },
  { href: ROUTES.SHOP.STATUS, label: "Status", short: "Status", ur: "اسٹیٹس", Icon: BarChart3 },
];

/** Desktop = left menu. Phone = bottom tabs. */
const SideBar = () => {
  const path = usePathname();
  const isActive = (href: string) => path === href || path.startsWith(href + "/");

  return (
    <>
      <aside className="shop-sidebar" aria-label="Main menu">
        <nav>
          {NAV.map(({ href, label, ur, Icon }) => (
            <Link key={href} href={href} className={isActive(href) ? "active" : ""} aria-current={isActive(href) ? "page" : undefined}>
              <Icon size={22} />
              <span>{label}</span>
              <span className="ur" lang="ur">{ur}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <nav className="shop-tabs" aria-label="Quick menu">
        {NAV.map(({ href, short, Icon }) => (
          <Link key={href} href={href} className={isActive(href) ? "active" : ""} aria-current={isActive(href) ? "page" : undefined}>
            <Icon size={24} />
            <span>{short}</span>
          </Link>
        ))}
      </nav>
    </>
  );
};

export default SideBar;
