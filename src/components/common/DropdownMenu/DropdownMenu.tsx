"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import "./dropdownmenu.scss";

export interface MenuItem {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  tone?: "default" | "danger" | "success" | "primary";
  hint?: string; // small grey text on the right (for example "abhi")
  disabled?: boolean;
}

interface Props {
  trigger: ReactNode;
  ariaLabel: string;
  items: MenuItem[];
  menuHeader?: ReactNode;
  menuHeight?: number;
  menuWidth?: number;
  triggerClassName?: string;
  menuClassName?: string;
}

const MENU_W = 236;

/** Small menu that opens under a button. Uses fixed position so tables never cut it off. */
const DropdownMenu = ({
  trigger,
  ariaLabel,
  items,
  menuHeader,
  menuHeight,
  menuWidth = MENU_W,
  triggerClassName = "",
  menuClassName = "",
}: Props) => {
  const btn = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const close = () => setPos(null);

  const toggle = () => {
    if (pos) return close();
    const r = btn.current!.getBoundingClientRect();
    const h = menuHeight ?? items.length * 46 + 16 + (menuHeader ? 124 : 0);
    const width = Math.min(menuWidth, window.innerWidth - 16);
    const top =
      r.bottom + h + 8 > window.innerHeight
        ? Math.max(8, r.top - h - 4)
        : r.bottom + 4;
    const left = Math.max(
      8,
      Math.min(r.right - width, window.innerWidth - width - 8),
    );
    setPos({ top, left, width });
  };

  useEffect(() => {
    if (!pos) return;
    const onDoc = (e: MouseEvent) => {
      if (
        !menu.current?.contains(e.target as Node) &&
        !btn.current?.contains(e.target as Node)
      )
        close();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [pos]);

  return (
    <span className="dd" onClick={(e) => e.stopPropagation()}>
      <button
        ref={btn}
        type="button"
        className={`dd-trigger ${triggerClassName}`}
        aria-haspopup="menu"
        aria-expanded={!!pos}
        aria-label={ariaLabel}
        onClick={toggle}
      >
        {trigger}
      </button>
      {pos && (
        <div
          ref={menu}
          className={`dd-menu ${menuClassName}`}
          role="menu"
          style={{ top: pos.top, left: pos.left, width: pos.width }}
        >
          {menuHeader && (
            <div className="dd-menu-header" onClick={close}>
              {menuHeader}
            </div>
          )}
          {items.map((it) => (
            <button
              key={it.label}
              type="button"
              role="menuitem"
              disabled={it.disabled}
              className={`dd-item ${it.tone ?? "default"}`}
              onClick={() => {
                close();
                it.onClick();
              }}
            >
              {it.icon}
              <span>{it.label}</span>
              {it.hint && <small>{it.hint}</small>}
            </button>
          ))}
        </div>
      )}
    </span>
  );
};

export default DropdownMenu;
