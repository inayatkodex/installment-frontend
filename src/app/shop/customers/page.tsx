"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, Users } from "lucide-react";
import CustomerCard from "@/components/shop/customer-card/CustomerCard";
import { CustomerCardSkeleton } from "@/components/shop/skeletons/ShopSkeletons";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import FilterChips from "@/components/common/FilterChips/FilterChips";
import CommonBtn from "@/components/common/CommonButton/Button";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import { ROUTES } from "@/constant/appRoutes";
import { useDebounce } from "@/hooks/useDebounce";
import ConfirmModal from "@/components/common/modal/confirm-modal/ConfirmModal";
import {
  deleteCustomer,
  fetchCustomers,
  undoDeleteCustomer,
} from "@/store/slices/shop/customers/shopCustomersSlice";
import { showToast } from "@/shared/toastUtils";
import { formatRs } from "@/shared/formatUtils";
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
  const { list, loading, error } = useAppSelector((s) => s.shopCustomers);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const search = useDebounce(q, 300);
  const [requested, setRequested] = useState(false);
  const [toDelete, setToDelete] = useState<CustomerListItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await dispatch(deleteCustomer(toDelete.id)).unwrap();
      const deleted = toDelete;
      showToast(
        <span>
          Delete ho gaya. 7 din tak wapas la sakte hain{" "}
          <button
            type="button"
            onClick={() => {
              void dispatch(undoDeleteCustomer(deleted.id))
                .unwrap()
                .then(() => {
                  showToast("Customer wapas aa gaya", "success");
                  dispatch(fetchCustomers({ search, status }));
                })
                .catch((e: unknown) =>
                  showToast(
                    typeof e === "string" ? e : "Customer wapas nahi aa saka",
                    "error",
                  ),
                );
            }}
          >
            Undo
          </button>
        </span>,
        "success",
        undefined,
        { autoClose: false },
      );
      setToDelete(null);
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
    setRequested(true);
  }, [dispatch, search, status]);
  return (
    <div className="customers-page">
      <div className="cu-head">
        <h1 className="page-title">
          Customers{" "}
          <span className="ur" lang="ur">
            کسٹمرز
          </span>
        </h1>
        <div className="cu-head-actions">
          <Link href={ROUTES.SHOP.ADD_CUSTOMER} className="cu-add-desktop">
            <Plus size={20} aria-hidden="true" /> Naya customer
          </Link>
          <Link href={ROUTES.SHOP.RECENTLY_DELETED}>Recently deleted</Link>
          <Link href={ROUTES.SHOP.ARCHIVED_CUSTOMERS}>Archived</Link>
        </div>
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

      {error ? (
        <div className="cu-error" role="alert">
          <p>{error}</p>
          <CommonBtn
            text="Dobara koshish karein"
            onClick={() => dispatch(fetchCustomers({ search, status }))}
          />
        </div>
      ) : (loading || !requested) && !list.length ? (
        <CustomerCardSkeleton />
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
          title="Customer delete karein?"
          message={
            <>
              Kya aap {toDelete.name} ko delete karna chahte hain?
              {(toDelete.remaining > 0 || toDelete.hasPayments) && (
                <strong className="cu-delete-warning">
                  Is customer ka {formatRs(toDelete.remaining)} baqaya hai /{" "}
                  {formatRs(toDelete.paid)} wasool ho chuka hai. Phir bhi delete
                  karein?
                </strong>
              )}
            </>
          }
          confirmText="Haan"
          cancelText="Nahi"
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
