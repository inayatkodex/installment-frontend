"use client";

import { useState } from "react";
import Modal from "../Modal";
import CommonBtn from "../../CommonButton/Button";
import FormInput from "../../ui/FormInput";
import "./confirmmodal.scss";

interface Props {
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  loadingText?: string;
  tone?: "primary" | "danger" | "success";
  loading?: boolean;
  askReason?: boolean; // shows a "reason" box (used for Reject)
  reasonLabel?: string;
  reasonPlaceholder?: string;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
}

const ConfirmModal = ({
  title, message, confirmText, cancelText = "Wapas", loadingText, tone = "primary", loading = false,
  askReason = false, reasonLabel = "Wajah likhein", reasonPlaceholder = "Jaise: CNIC ki tasveer saaf nahi hai", onConfirm, onCancel,
}: Props) => {
  const [reason, setReason] = useState("");
  const toneClass = tone === "danger" ? "danger-btn" : tone === "success" ? "success-btn" : "";

  return (
    <Modal title={title} onClose={onCancel}>
      <p className="confirm-message">{message}</p>
      {askReason && (
        <FormInput label={reasonLabel} optional multiline rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder={reasonPlaceholder} />
      )}
      <div className="confirm-actions">
        <CommonBtn text={cancelText} className="gray-btn" onClick={onCancel} disabled={loading} />
        <CommonBtn text={loading ? (loadingText ?? "Ruk jayen…") : confirmText} className={`${toneClass} full-btn`} onClick={() => onConfirm(reason.trim() || undefined)} disabled={loading} />
      </div>
    </Modal>
  );
};

export default ConfirmModal;
