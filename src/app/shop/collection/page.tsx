"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ClipboardCheck, PartyPopper } from "lucide-react";
import CollectionRow from "@/components/shop/collection-row/CollectionRow";
import ReceivedToday from "@/components/shop/received-today/ReceivedToday";
import ReceivePaymentForm, {
  ReceiveTarget,
} from "@/components/shop/receive-payment-form/ReceivePaymentForm";
import { CollectionTopSkeleton } from "@/components/shop/skeletons/ShopSkeletons";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import CommonBtn from "@/components/common/CommonButton/Button";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import {
  fetchTodayCollection,
  fetchTodayReceived,
} from "@/store/slices/shop/collection/shopCollectionSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { formatRs } from "@/shared/formatUtils";
import { CollectionItem } from "@/types/payment";
import "./collection.scss";

const CollectionPage = () => {
  const dispatch = useAppDispatch();
  const {
    items,
    cashToday,
    received,
    loading,
    error,
    hasFetchedTodayCollection,
  } = useAppSelector((s) => s.shopCollection);
  const [q, setQ] = useState("");
  const [target, setTarget] = useState<ReceiveTarget | null>(null);

  const refresh = useCallback(() => {
    dispatch(fetchTodayCollection());
    dispatch(fetchTodayReceived());
  }, [dispatch]);
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Only customers who still have to pay stay in this list. Paid ones move to "Aaj mil gaye" below.
  const pending = useMemo(
    () => items.filter((i) => i.status !== "paid"),
    [items],
  );
  const shown = useMemo(() => {
    const t = q.trim().toLowerCase().replace(/-/g, "");
    return pending.filter(
      (i) =>
        !t ||
        i.name.toLowerCase().includes(t) ||
        i.phone.replace(/-/g, "").includes(t),
    );
  }, [pending, q]);

  const open = (i: CollectionItem) =>
    setTarget({
      customerId: i.customerId,
      name: i.name,
      installmentNo: i.installmentNo,
      dueDate: i.dueDate,
      amount: i.expected - i.paid,
    });

  const due = pending.reduce((a, i) => a + i.expected - i.paid, 0);
  return (
    <div className="collection-page">
      <h1 className="page-title">
        Aaj ki wasooli{" "}
        <span className="ur" lang="ur">
          آج کی وصولی
        </span>
      </h1>

      {error ? (
        <div className="cp-error" role="alert">
          <p>{error}</p>
          <CommonBtn text="Dobara koshish karein" onClick={refresh} />
        </div>
      ) : (loading || !hasFetchedTodayCollection) &&
        !items.length &&
        !received.length ? (
        <CollectionTopSkeleton />
      ) : (
        <>
          <div className="cp-top">
            <div>
              <strong>{pending.length}</strong>
              <span>Customers baaki</span>
            </div>
            <div>
              <strong>{formatRs(due)}</strong>
              <span>Lena baaki hai</span>
            </div>
            <div>
              <strong className="ok">{formatRs(cashToday.total)}</strong>
              <span>Aaj mila</span>
            </div>
          </div>

          <SearchBar
            value={q}
            onChange={setQ}
            placeholder="Naam ya mobile number se dhoondein"
            label="Aaj ke customers dhoondein"
          />

          {items.length === 0 ? (
            <EmptyState
              icon={<ClipboardCheck size={30} />}
              title="Aaj koi qist due nahi"
              text="Jab kisi ki qist due hogi to yahan nazar aayegi."
            />
          ) : pending.length === 0 ? (
            <EmptyState
              icon={<PartyPopper size={30} />}
              title="Shabash! Aaj ki saari wasooli ho gayi"
              text="Neeche dekhein kis kis se raqam mili."
            />
          ) : (
            <>
              {shown.length === 0 ? (
                <p className="cp-empty">“{q}” se koi customer nahi mila.</p>
              ) : (
                <ul className="cp-list">
                  {shown.map((i) => (
                    <CollectionRow key={i.id} item={i} onReceive={open} />
                  ))}
                </ul>
              )}
            </>
          )}

          <ReceivedToday
            items={received}
            cashTotal={cashToday.total}
            onChanged={refresh}
          />
        </>
      )}

      {target && (
        <ReceivePaymentForm
          target={target}
          onClose={() => setTarget(null)}
          onDone={refresh}
        />
      )}
    </div>
  );
};

export default CollectionPage;
