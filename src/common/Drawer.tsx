"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import "./Drawer.scss";

interface Props { open: boolean; title: string; onClose: () => void; children: ReactNode }

/** Side menu that slides in from the left (used by the Admin panel on phones). */
const Drawer = ({ open, title, onClose, children }: Props) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside className="drawer-panel" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <strong>{title}</strong>
          <button type="button" onClick={onClose} aria-label="Menu band karein"><X size={22} /></button>
        </div>
        {children}
      </aside>
    </div>
  );
};

export default Drawer;
