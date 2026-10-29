"use client";

import { useEffect, useMemo, useState } from "react";
import { PartyPopper } from "lucide-react";
import LateCard from "@/components/shop/late-card/LateCard";
import ReceivePaymentForm, {
  ReceiveTarget,
} from "@/components/shop/receive-payment-form/ReceivePaymentForm";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import Loader from "@/components/common/Loader/Loader";
import CommonBtn from "@/components/common/CommonButton/Button";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import { useDebounce } from "@/hooks/useDebounce";
import { fetchLate } from "@/store/slices/shop/late/shopLateSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { formatRs } from "@/shared/formatUtils";
import { LateItem } from "@/types/payment";
import "./late.scss";

const LatePage = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((s) => s.shopLate);
  const [target, setTarget] = useState<ReceiveTarget | null>(null);
  const [query, setQuery] = useState("");
  const search = useDebounce(query, 300);

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

  const filteredItems = useMemo(() => {
    const normalizedQuery = search.trim().toLocaleLowerCase();
    if (!normalizedQuery) return items;
    const phoneQuery = normalizedQuery.replace(/\D/g, "");
    return items.filter(
      (item) =>
        item.name.toLocaleLowerCase().includes(normalizedQuery) ||
        (phoneQuery.length > 0 &&
          item.phone.replace(/\D/g, "").includes(phoneQuery)),
    );
  }, [items, search]);

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
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Naam ya mobile number se dhoondein"
            label="Late customers search"
          />
          <p className="lp-summary">
            <b>{filteredItems.length}</b> customers ·{" "}
            <b>
              {formatRs(filteredItems.reduce((a, i) => a + i.lateAmount, 0))}
            </b>{" "}
            late hain
          </p>
          {filteredItems.length === 0 ? (
            <EmptyState
              title="Koi customer nahi mila"
              text="Naam ya mobile number check karke dobara dhoondein."
            />
          ) : (
            <ul className="lp-list">
              {filteredItems.map((i) => (
                <LateCard key={i.customerId} item={i} onReceive={open} />
              ))}
            </ul>
          )}
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
