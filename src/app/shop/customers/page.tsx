"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, Users } from "lucide-react";
import CustomerCard from "@/components/shop/customer-card/CustomerCard";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import FilterChips from "@/components/common/FilterChips/FilterChips";
import Loader from "@/components/common/Loader/Loader";
import CommonBtn from "@/components/common/CommonButton/Button";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import { ROUTES } from "@/constant/appRoutes";
import { useDebounce } from "@/hooks/useDebounce";
import ConfirmModal from "@/components/common/modal/confirm-modal/ConfirmModal";
import {
  deleteCustomer,
  fetchCustomers,
  fetchPendingCustomerDeletions,
  undoDeleteCustomer,
} from "@/store/slices/shop/customers/shopCustomersSlice";
import { showToast } from "@/shared/toastUtils";
import { CustomerListItem } from "@/types/customer";
import { useAppDispatch, useAppSelector } from "@/store/store";
import "./customers.scss";

const FILTERS = [
  { value: "all", label: "Sab" },
  { value: "active", label: "Active" },
  { value: "overdue", label: "Late" },
  { value: "completed", label: "Complete" },
];

const CustomersPage = () => {
  const dispatch = useAppDispatch();
  const { list, loading, error, pendingDeletion } = useAppSelector(
    (s) => s.shopCustomers,
  );
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const search = useDebounce(q, 300);
  const [toDelete, setToDelete] = useState<CustomerListItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await dispatch(deleteCustomer(toDelete.id)).unwrap();
      showToast(
        "Customer chup gaya hai. 24 ghantay ke andar 'Haal hi mein delete huay' section se wapas la sakte hain.",
        "success",
      );
      setToDelete(null);
      dispatch(fetchPendingCustomerDeletions());
    } catch (e) {
      showToast(
        typeof e === "string" ? e : "Customer delete nahi ho saka",
        "error",
      );
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    dispatch(fetchCustomers({ search, status }));
  }, [dispatch, search, status]);
  useEffect(() => {
    dispatch(fetchPendingCustomerDeletions());
  }, [dispatch]);

  const undoDeletion = async (id: string, name: string) => {
    try {
      await dispatch(undoDeleteCustomer(id)).unwrap();
      showToast(`${name} wapas aa gaya`, "success");
      dispatch(fetchPendingCustomerDeletions());
      dispatch(fetchCustomers({ search, status }));
    } catch (e) {
      showToast(
        typeof e === "string" ? e : "Customer wapas nahi aa saka",
        "error",
      );
    }
  };

  return (
    <div className="customers-page">
      <div className="cu-head">
        <h1 className="page-title">
          Customers{" "}
          <span className="ur" lang="ur">
            کسٹمرز
          </span>
        </h1>
        <Link href={ROUTES.SHOP.ADD_CUSTOMER} className="cu-add-desktop">
          <Plus size={20} aria-hidden="true" /> Naya customer
        </Link>
      </div>

      <SearchBar
        value={q}
        onChange={setQ}
        placeholder="Naam, mobile ya ID se dhoondein"
      />
      <div className="cu-filters">
        <FilterChips
          options={FILTERS}
          value={status}
          onChange={setStatus}
          label="Customers filter"
        />
      </div>

      {pendingDeletion.length > 0 && (
        <section
          className="cu-recently-deleted"
          aria-labelledby="cu-recent-title"
        >
          <h2 id="cu-recent-title">Deleted customers</h2>
          <p>
            Customer ka data 24 ghantay baad permanently delete hoga.
          </p>
          <ul>
            {pendingDeletion.map((customer) => (
              <li key={customer.id}>
                <div>
                  <strong>{customer.name}</strong>
                  <span>{customer.customerCode}</span>
                  <small>
                    Delete request:{" "}
                    {new Date(customer.deletionRequestedAt).toLocaleString(
                      "en-PK",
                      { timeZone: "Asia/Karachi" },
                    )}{" "}
                    (Pakistan time)
                  </small>
                </div>
                <button
                  type="button"
                  onClick={() => undoDeletion(customer.id, customer.name)}
                >
                  Wapas karein
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {error ? (
        <div className="cu-error" role="alert">
          <p>{error}</p>
          <CommonBtn
            text="Dobara koshish karein"
            onClick={() => dispatch(fetchCustomers({ search, status }))}
          />
        </div>
      ) : loading && !list.length ? (
        <Loader />
      ) : list.length === 0 ? (
        <EmptyState
          icon={<Users size={30} />}
          title={
            q || status !== "all"
              ? "Koi customer nahi mila"
              : "Abhi koi customer nahi"
          }
          text={
            q || status !== "all"
              ? "Search ya filter badal kar dekhein."
              : "Pehla customer add karke shuru karein."
          }
          action={
            <Link href={ROUTES.SHOP.ADD_CUSTOMER} className="cu-empty-btn">
              Naya customer add karein
            </Link>
          }
        />
      ) : (
        <ul className="cu-list">
          {list.map((c) => (
            <CustomerCard key={c.id} customer={c} onDelete={setToDelete} />
          ))}
        </ul>
      )}

      {toDelete && (
        <ConfirmModal
          title={`${toDelete.name} ko delete karein?`}
          message="Is customer ki saari qistein poori hain. Customer abhi list se chhup jayega, lekin us ka data 24 ghantay tak 'Haal hi mein delete huay' section se wapas laya ja sakta hai. 24 ghantay baad data hamesha ke liye delete ho jayega."
          confirmText="Delete"
          cancelText="Cancel"
          tone="danger"
          loading={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}

      <Link
        href={ROUTES.SHOP.ADD_CUSTOMER}
        className="cu-fab"
        aria-label="Naya customer add karein"
      >
        <Plus size={22} aria-hidden="true" /> Add Customer
      </Link>
    </div>
  );
};

export default CustomersPage;
