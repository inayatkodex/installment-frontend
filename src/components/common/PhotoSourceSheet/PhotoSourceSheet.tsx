"use client";

import { useRef, useState } from "react";
import { Camera, ImageIcon } from "lucide-react";
import Modal from "../modal/Modal";
import CommonBtn from "../CommonButton/Button";
import { compressImage } from "@/shared/imageUtils";
import "./photosourcesheet.scss";

interface Props {
  title: string;
  titleUr?: string;
  onPick: (file: File) => void;
  onClose: () => void;
}

/**
 * Asks "Camera or Gallery?".
 * Camera  = input with capture (opens the phone camera).
 * Gallery = normal file input. The phone's own photo picker opens, so the app does NOT need
 *           gallery / storage permission. (A camera-only input is why gallery did not work before.)
 */
const PhotoSourceSheet = ({ title, titleUr, onPick, onClose }: Props) => {
  const cam = useRef<HTMLInputElement>(null);
  const gal = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setBusy(true);
    const small = await compressImage(f);
    setBusy(false);
    onPick(small);
    onClose();
  };

  return (
    <Modal title={title} titleUr={titleUr} onClose={onClose}>
      <p className="ps-ask">Photo kaise lena chahte hain?</p>
      <input ref={cam} type="file" accept="image/*" capture="environment" className="visually-hidden" tabIndex={-1} onChange={handle} />
      <input ref={gal} type="file" accept="image/*" className="visually-hidden" tabIndex={-1} onChange={handle} />
      <div className="ps-actions">
        <CommonBtn text="Camera se photo lein" icon={<Camera size={22} />} className="full-btn" onClick={() => cam.current?.click()} disabled={busy} />
        <CommonBtn text="Gallery se chunein" icon={<ImageIcon size={22} />} className="outline-btn full-btn" onClick={() => gal.current?.click()} disabled={busy} />
        <CommonBtn text={busy ? "Photo chhoti ho rahi hai…" : "Cancel"} className="gray-btn full-btn" onClick={onClose} disabled={busy} />
      </div>
      <p className="ps-help">Camera ya Gallery na khule to phone ki Settings mein jaa kar browser ko Camera aur Photos ki ijazat dein.</p>
    </Modal>
  );
};

export default PhotoSourceSheet;
