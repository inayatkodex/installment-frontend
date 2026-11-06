"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Archive, ArrowLeft, CalendarDays, RotateCcw } from "lucide-react";
import CommonBtn from "@/components/common/CommonButton/Button";
import Loader from "@/components/common/Loader/Loader";
import { ROUTES } from "@/constant/appRoutes";
import { showToast } from "@/shared/toastUtils";
import {
  fetchArchivedCustomers,
  restoreArchivedCustomer,
} from "@/store/slices/shop/customers/shopCustomersSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import "./archived.scss";

const ArchivedCustomersPage = () => {
  const dispatch = useAppDispatch();
  const { archived, archivedLoading, archivedError } = useAppSelector(
    (state) => state.shopCustomers,
  );
  const [restoreId, setRestoreId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchArchivedCustomers());
  }, [dispatch]);

  const restore = async (id: string, name: string) => {
    setRestoreId(id);
    try {
      await dispatch(restoreArchivedCustomer(id)).unwrap();
      showToast(`${name} wapas aa gaya`, "success");
      dispatch(fetchArchivedCustomers());
    } catch (error) {
      showToast(
        typeof error === "string" ? error : "Customer wapas nahi aa saka",
        "error",
      );
    } finally {
      setRestoreId(null);
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
        <h1 className="page-title">Archived customers</h1>
        <p className="cl-description">
          Mukammal customers yahan mehfooz rehte hain. Zaroorat par unhein
          wapas active list mein la sakte hain.
        </p>
      </header>
      {archivedLoading ? (
        <Loader />
      ) : archivedError ? (
        <div className="cl-panel cl-state cl-error" role="alert">
          <Archive size={26} aria-hidden="true" />
          <p>{archivedError}</p>
          <div className="cl-retry">
            <CommonBtn
              text="Dobara koshish karein"
              onClick={() => dispatch(fetchArchivedCustomers())}
            />
          </div>
        </div>
      ) : archived.length === 0 ? (
        <div className="cl-panel cl-state">
          <Archive size={30} aria-hidden="true" />
          <strong>Koi archived customer nahi hai</strong>
          <p>Complete customers archive hone ke baad yahan dikhaye jayenge.</p>
        </div>
      ) : (
        <ul className="cl-list">
          {archived.map((customer) => (
            <li className="cl-item" key={customer.id}>
              <div>
                <strong>{customer.name}</strong>
                <span className="cl-meta">
                  <span className="cl-code">{customer.code}</span>
                </span>
                {customer.archivedAt && (
                  <span className="cl-date">
                    <CalendarDays size={15} aria-hidden="true" />
                    Archive kiya:{" "}
                    {new Date(customer.archivedAt).toLocaleDateString("en-PK", {
                      timeZone: "Asia/Karachi",
                    })}
                  </span>
                )}
              </div>
              <button
                className="cl-restore"
                type="button"
                disabled={restoreId === customer.id}
                onClick={() => void restore(customer.id, customer.name)}
              >
                <RotateCcw size={16} aria-hidden="true" />
                {restoreId === customer.id
                  ? "Wapas la rahe hain…"
                  : "Wapas layein"}
              </button>
            </li>
          ))}
        </ul>
      )}
      {!archivedLoading && archived.length > 0 && (
        <CommonBtn
          text="Dobara load karein"
          onClick={() => dispatch(fetchArchivedCustomers())}
        />
      )}
    </div>
  );
};

export default ArchivedCustomersPage;
