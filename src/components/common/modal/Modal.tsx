"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import "./modal.scss";

interface Props {
  title: string;
  titleUr?: string;
  onClose: () => void;
  children: ReactNode;
  centered?: boolean;
  headerAction?: ReactNode;
}

/** Bottom sheet on phones, centered box on tablet / desktop. */
const Modal = ({
  title,
  titleUr,
  onClose,
  children,
  centered = false,
  headerAction,
}: Props) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className={`modal-backdrop${centered ? " modal-centered" : ""}`}
      onClick={onClose}
    >
      <div
        className={`modal-sheet${centered ? " modal-centered" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="modal-handle" aria-hidden="true" />
        <div className="modal-head">
          <div className="modal-title-wrap">
            <h2>
              {title}
              {titleUr && <span className="ur" lang="ur">{titleUr}</span>}
            </h2>
            {headerAction}
          </div>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Band karein"
          >
            <X size={22} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
