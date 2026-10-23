"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import Modal from "@/components/common/modal/Modal";
import FormInput from "@/components/common/ui/FormInput";
import CommonBtn from "@/components/common/CommonButton/Button";
import { receivePayment } from "@/store/slices/shop/collection/shopCollectionSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  formatDate,
  formatRs,
  maskMoney,
  toNumber,
} from "@/shared/formatUtils";
import { showToast } from "@/shared/toastUtils";
import "./receive-payment-form.scss";

export interface ReceiveTarget {
  customerId: string;
  name: string;
  installmentNo: number;
  dueDate: string;
  amount: number; // amount still due on this installment
  daysLate?: number;
}

interface Props {
  target: ReceiveTarget;
  onClose: () => void;
  onDone: () => void;
}

/** The form that opens when the shopkeeper taps "Receive". Amount is pre-filled. */
const ReceivePaymentForm = ({ target, onClose, onDone }: Props) => {
  const dispatch = useAppDispatch();
  const receiving = useAppSelector((s) => s.shopCollection.receiving);
  const [amount, setAmount] = useState(maskMoney(String(target.amount)));
  const [note, setNote] = useState("");
  const [error, setError] = useState<string>();
  const [done, setDone] = useState(false);

  const confirm = async () => {
    const value = toNumber(amount);
    if (value <= 0) {
      setError("Sahi raqam likhein");
      return;
    }
    setError(undefined);
    try {
      await dispatch(
        receivePayment({
          customerId: target.customerId,
          installmentNo: target.installmentNo,
          amount: value,
          note: note.trim() || undefined,
        }),
      ).unwrap();
      setDone(true);
      onDone();
    } catch (e) {
      const msg = typeof e === "string" ? e : "Raqam save nahi ho saki";
      setError(msg);
      showToast(msg, "error");
    }
  };

  if (done) {
    return (
      <Modal title="Raqam mil gayi" titleUr="رقم مل گئی" onClose={onClose}>
        <div className="rp-done">
          <span className="rp-tick">
            <Check size={40} aria-hidden="true" />
          </span>
          <p>
            <strong>{formatRs(toNumber(amount))}</strong> {target.name} se mil
            gaye.
          </p>
          <CommonBtn text="Theek hai" className="full-btn" onClick={onClose} />
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="Receive Payment" titleUr="رقم وصول کریں" onClose={onClose}>
      <div className="rp-who">
        <strong>{target.name}</strong>
        <span>
          Qist {target.installmentNo} · due {formatDate(target.dueDate)}
        </span>
        {!!target.daysLate && (
          <span className="rp-late">{target.daysLate} din late</span>
        )}
      </div>
      <div className="rp-expected">
        <span>Expected</span>
        <strong>{formatRs(target.amount)}</strong>
      </div>
      <div className="rp-fields">
        <FormInput
          label="Amount received"
          labelUr="وصول شدہ رقم"
          inputMode="numeric"
          value={amount}
          onChange={(e) => setAmount(maskMoney(e.target.value))}
          error={error}
          autoFocus
        />
        <p className="rp-help">
          Zyada raqam di to baaqi raqam agli qist mein lag jayegi.
        </p>
        <FormInput
          label="Note"
          optional
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Jaise: bhai de gaya"
        />
      </div>
      <div className="rp-actions">
        <CommonBtn
          text="Cancel"
          className="gray-btn"
          onClick={onClose}
          disabled={receiving}
        />
        <CommonBtn
          text={receiving ? "Ruk jayen…" : "Confirm Payment"}
          className="full-btn"
          onClick={confirm}
          disabled={receiving || !amount}
        />
      </div>
    </Modal>
  );
};

export default ReceivePaymentForm;
