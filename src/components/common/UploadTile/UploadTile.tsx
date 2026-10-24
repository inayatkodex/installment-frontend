"use client";

import { useEffect, useState } from "react";
import { Camera, X } from "lucide-react";
import PhotoSourceSheet from "../PhotoSourceSheet/PhotoSourceSheet";
import "./uploadtile.scss";

interface Props {
  label: string;
  labelUr: string;
  hint?: string;
  file?: File;
  onChange: (file?: File) => void;
}

/** Tap = choose Camera or Gallery. Works for CNIC, photos and papers. */
const UploadTile = ({
  label,
  labelUr,
  hint = "Photo ke liye dabayen",
  file,
  onChange,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    if (!file) {
      setUrl(undefined);
      return;
    }
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);

  return (
    <div className="upload-tile">
      <button
        type="button"
        className="upload-pick"
        onClick={() => setOpen(true)}
        aria-label={file ? `Photo badlein: ${label}` : `Photo lein: ${label}`}
      >
        {url ? (
          <img src={url} alt={label} />
        ) : (
          <Camera size={34} aria-hidden="true" />
        )}
        <b>{label}</b>
        <b className="ur" lang="ur">
          {labelUr}
        </b>
        {!url && <span>{hint}</span>}
      </button>
      {file && (
        <button
          type="button"
          className="upload-remove"
          onClick={() => onChange(undefined)}
          aria-label={`Hata dein: ${label}`}
        >
          <X size={18} />
        </button>
      )}
      {open && (
        <PhotoSourceSheet
          title={label}
          titleUr={labelUr}
          onPick={(f) => onChange(f)}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default UploadTile;
