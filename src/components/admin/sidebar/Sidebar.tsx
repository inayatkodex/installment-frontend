"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NavList, { ADMIN_NAV } from "./NavList";
import "./sidebar.scss";

/** Desktop = left menu. Phone = bottom tabs. */
const Sidebar = () => {
  const path = usePathname();
  const isActive = (href: string) =>
    path === href || path.startsWith(href + "/");

  return (
    <>
      <aside className="admin-sidebar" aria-label="Admin menu">
        <NavList />
      </aside>

      <nav className="admin-tabs" aria-label="Quick menu">
        {ADMIN_NAV.map(({ href, short, label, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={active ? "active" : ""}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={24} />
              <span>{short || label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default Sidebar;
