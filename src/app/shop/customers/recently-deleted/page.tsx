"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, RotateCcw, Trash2 } from "lucide-react";
import CommonBtn from "@/components/common/CommonButton/Button";
import Loader from "@/components/common/Loader/Loader";
import { ROUTES } from "@/constant/appRoutes";
import { showToast } from "@/shared/toastUtils";
import {
  fetchPendingCustomerDeletions,
  undoDeleteCustomer,
} from "@/store/slices/shop/customers/shopCustomersSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import "./recently-deleted.scss";

const RecentlyDeletedPage = () => {
  const dispatch = useAppDispatch();
  const { pendingDeletion, pendingDeletionLoading, pendingDeletionError } =
    useAppSelector((state) => state.shopCustomers);
  const [undoingId, setUndoingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchPendingCustomerDeletions());
  }, [dispatch]);

  const undo = async (id: string, name: string) => {
    setUndoingId(id);
    try {
      await dispatch(undoDeleteCustomer(id)).unwrap();
      showToast(`${name} wapas aa gaya`, "success");
      dispatch(fetchPendingCustomerDeletions());
    } catch (error) {
      showToast(
        typeof error === "string" ? error : "Customer wapas nahi aa saka",
        "error",
      );
    } finally {
      setUndoingId(null);
    }
  };

  return (
    <div className="customer-lifecycle-page">
      <Link href={ROUTES.SHOP.CUSTOMERS} className="cl-back">
        <ArrowLeft size={17} aria-hidden="true" />
        Customers par wapas
      </Link>
      <header className="cl-header">
        <span className="cl-eyebrow">Customer record</span>
        <h1 className="page-title">Recently deleted</h1>
        <p className="cl-description">
          Delete kiye gaye customer 7 din tak wapas aa sakte hain.
        </p>
      </header>
      {pendingDeletionLoading ? (
        <Loader />
      ) : pendingDeletionError ? (
        <div className="cl-panel cl-state cl-error" role="alert">
          <Trash2 size={26} aria-hidden="true" />
          <p>{pendingDeletionError}</p>
          <div className="cl-retry">
            <CommonBtn
              text="Dobara koshish karein"
              onClick={() => dispatch(fetchPendingCustomerDeletions())}
            />
          </div>
        </div>
      ) : pendingDeletion.length === 0 ? (
        <div className="cl-panel cl-state">
          <Trash2 size={30} aria-hidden="true" />
          <strong>Koi recently deleted customer nahi hai</strong>
          <p>Delete kiye gaye customers yahan 7 din tak nazar aayenge.</p>
        </div>
      ) : (
        <ul className="cl-list">
          {pendingDeletion.map((customer) => (
            <li className="cl-item" key={customer.id}>
              <div>
                <strong>{customer.name}</strong>
                <span className="cl-meta">
                  <span className="cl-code">{customer.customerCode}</span>
                </span>
                <span className="cl-date">
                  <CalendarDays size={15} aria-hidden="true" />
                  Delete kiya:{" "}
                  {new Date(customer.deletionRequestedAt).toLocaleDateString(
                    "en-PK",
                    { timeZone: "Asia/Karachi" },
                  )}
                </span>
              </div>
              <button
                className="cl-restore"
                type="button"
                disabled={undoingId === customer.id}
                onClick={() => void undo(customer.id, customer.name)}
              >
                <RotateCcw size={16} aria-hidden="true" />
                {undoingId === customer.id
                  ? "Wapas la rahe hain…"
                  : "Wapas layein"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentlyDeletedPage;
