"use client";

import { useEffect, useState } from "react";
import { PartyPopper } from "lucide-react";
import LateCard from "@/components/shop/late-card/LateCard";
import ReceivePaymentForm, {
  ReceiveTarget,
} from "@/components/shop/receive-payment-form/ReceivePaymentForm";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import Loader from "@/components/common/Loader/Loader";
import CommonBtn from "@/components/common/CommonButton/Button";
import { fetchLate } from "@/store/slices/shop/late/shopLateSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { formatRs } from "@/shared/formatUtils";
import { LateItem } from "@/types/payment";
import "./late.scss";

const LatePage = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((s) => s.shopLate);
  const [target, setTarget] = useState<ReceiveTarget | null>(null);

  useEffect(() => {
    dispatch(fetchLate());
  }, [dispatch]);

  const open = (i: LateItem) =>
    setTarget({
      customerId: i.customerId,
      name: i.name,
      installmentNo: i.oldestInstallmentNo,
      dueDate: i.oldestDueDate,
      amount: i.oldestRemaining,
      daysLate: i.daysLate,
    });

  return (
    <div className="late-page">
      <h1 className="page-title">
        Late qistein{" "}
        <span className="ur" lang="ur">
          لیٹ قسطیں
        </span>
      </h1>

      {error ? (
        <div className="lp-error" role="alert">
          <p>{error}</p>
          <CommonBtn
            text="Dobara koshish karein"
            onClick={() => dispatch(fetchLate())}
          />
        </div>
      ) : loading && !items.length ? (
        <Loader />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<PartyPopper size={30} />}
          title="Shabash! Koi qist late nahi"
          text="Sab customers waqt par ada kar rahe hain."
        />
      ) : (
        <>
          <p className="lp-summary">
            <b>{items.length}</b> customers ·{" "}
            <b>{formatRs(items.reduce((a, i) => a + i.lateAmount, 0))}</b> late
            hain
          </p>
          <ul className="lp-list">
            {items.map((i) => (
              <LateCard key={i.customerId} item={i} onReceive={open} />
            ))}
          </ul>
        </>
      )}

      {target && (
        <ReceivePaymentForm
          target={target}
          onClose={() => setTarget(null)}
          onDone={() => dispatch(fetchLate())}
        />
      )}
    </div>
  );
};

export default LatePage;
