"use client";

import { useEffect, useState } from "react";
import { Camera, Trash2, X, ZoomIn, ZoomOut } from "lucide-react";
import "./photoviewer.scss";

interface Props {
  src: string;
  title: string;
  onClose: () => void;
  onReplace?: () => void;
  onDelete?: () => void;
}

/** Full screen photo. Pinch to zoom on phones, or use the zoom button. */
const PhotoViewer = ({ src, title, onClose, onReplace, onDelete }: Props) => {
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  return (
    <div className="photo-viewer" role="dialog" aria-modal="true" aria-label={title}>
      <header>
        <button type="button" onClick={onClose} aria-label="Band karein"><X size={24} /></button>
        <strong>{title}</strong>
        <button type="button" onClick={() => setZoom((z) => !z)} aria-label={zoom ? "Chhota karein" : "Bara karein"}>{zoom ? <ZoomOut size={22} /> : <ZoomIn size={22} />}</button>
      </header>
      <div className="pv-stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={title} style={{ width: zoom ? "220%" : "100%" }} />
      </div>
      {(onReplace || onDelete) && (
        <div className="pv-actions">
          {onReplace && (
            <button type="button" className="pv-btn pv-replace" onClick={onReplace}>
              <Camera size={18} />
              <span>Badlein</span>
            </button>
          )}
          {onDelete && (
            <button type="button" className="pv-btn pv-delete" onClick={onDelete}>
              <Trash2 size={18} />
              <span>Hata dein</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PhotoViewer;
