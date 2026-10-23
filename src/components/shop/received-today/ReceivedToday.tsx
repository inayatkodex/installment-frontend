"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, ChevronUp, Undo2 } from "lucide-react";
import CommonBtn from "@/components/common/CommonButton/Button";
import ConfirmModal from "@/components/common/modal/confirm-modal/ConfirmModal";
import { reversePayment } from "@/store/slices/shop/collection/shopCollectionSlice";
import { useAppDispatch } from "@/store/store";
import { formatRs } from "@/shared/formatUtils";
import { showToast } from "@/shared/toastUtils";
import { ReceivedItem } from "@/types/payment";
import "./received-today.scss";

interface Props {
  items: ReceivedItem[];
  onChanged: () => void;
}

/** Closed line under the list: "Aaj mil gaye". Tap to see who paid, with a "Wapas karein" (undo) button. */
const ReceivedToday = ({ items, onChanged }: Props) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [undo, setUndo] = useState<ReceivedItem | null>(null);
  const [busy, setBusy] = useState(false);

  if (!items.length) return null;
  const total = items.reduce((a, i) => a + i.amount, 0);
  const people = new Set(items.map((i) => i.customerId)).size;

  const confirmUndo = async () => {
    if (!undo) return;
    setBusy(true);
    try {
      await dispatch(reversePayment(undo.id)).unwrap();
      showToast("Payment wapas ho gayi", "success");
      setUndo(null);
      onChanged();
    } catch (e) {
      showToast(
        typeof e === "string" ? e : "Payment wapas nahi ho saki",
        "error",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="received-today" aria-label="Aaj mil gaye">
      <button
        type="button"
        className="rt-band"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span>
          <CheckCircle2 size={20} aria-hidden="true" /> Aaj mil gaye ({people}{" "}
          {people === 1 ? "customer" : "customers"})
        </span>
        <span>
          {formatRs(total)}{" "}
          {open ? (
            <ChevronUp size={20} aria-hidden="true" />
          ) : (
            <ChevronDown size={20} aria-hidden="true" />
          )}
        </span>
      </button>

      {open && (
        <ul className="rt-list">
          {items.map((i) => (
            <li key={i.id}>
              <div>
                <strong>{i.name}</strong>
                <span>
                  {formatRs(i.amount)} · {i.time}
                </span>
              </div>
              <CommonBtn
                text="Wapas karein"
                icon={<Undo2 size={18} />}
                className="outline-btn sm-btn"
                onClick={() => setUndo(i)}
              />
            </li>
          ))}
        </ul>
      )}

      {undo && (
        <ConfirmModal
          title={`${undo.name} ki payment wapas karein?`}
          message={`${formatRs(undo.amount)} hat jayenge aur ${undo.name} dobara list mein aa jayega. Payment ka record rahega.`}
          confirmText="Yes"
          cancelText="No"
          tone="danger"
          loading={busy}
          onConfirm={confirmUndo}
          onCancel={() => setUndo(null)}
        />
      )}
    </section>
  );
};

export default ReceivedToday;
