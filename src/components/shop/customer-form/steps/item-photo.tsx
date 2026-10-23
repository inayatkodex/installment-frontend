"use client";

import { useEffect, useState } from "react";
import { Camera, X } from "lucide-react";
import PhotoSourceSheet from "@/components/common/PhotoSourceSheet/PhotoSourceSheet";

interface Props { itemName: string; file?: File; onChange: (file?: File) => void }

/** Optional picture of one item. Small on purpose, so the form stays quick. */
const ItemPhoto = ({ itemName, file, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    if (!file) { setUrl(undefined); return; }
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);

  return (
    <div className="cf-photo">
      <button type="button" className="cf-photo-btn" onClick={() => setOpen(true)} aria-label={file ? "Item ki photo badlein" : "Item ki photo lein"}>
        {url ? <img src={url} alt={itemName || "Item"} /> : <Camera size={26} aria-hidden="true" />}
      </button>
      <div className="cf-photo-text">
        <b>Item ki photo</b>
        <span>{file ? "Photo lag gayi" : "Zaroori nahi"}</span>
      </div>
      {file && <button type="button" className="cf-photo-x" onClick={() => onChange(undefined)} aria-label="Photo hata dein"><X size={18} /></button>}
      {open && <PhotoSourceSheet title={itemName ? `${itemName} ki photo` : "Item ki photo"} onPick={(f) => onChange(f)} onClose={() => setOpen(false)} />}
    </div>
  );
};

export default ItemPhoto;
