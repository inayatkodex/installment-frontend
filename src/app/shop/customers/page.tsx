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
import { deleteCustomer, fetchCustomers } from "@/store/slices/shop/customers/shopCustomersSlice";
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
  const { list, loading, error } = useAppSelector((s) => s.shopCustomers);
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
      showToast("Customer delete ho gaya", "success");
      setToDelete(null);
    } catch (e) {
      showToast(typeof e === "string" ? e : "Customer delete nahi ho saka", "error");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => { dispatch(fetchCustomers({ search, status })); }, [dispatch, search, status]);

  return (
    <div className="customers-page">
      <div className="cu-head">
        <h1 className="page-title">Customers <span className="ur" lang="ur">کسٹمرز</span></h1>
        <Link href={ROUTES.SHOP.ADD_CUSTOMER} className="cu-add-desktop"><Plus size={20} aria-hidden="true" /> Naya customer</Link>
      </div>

      <SearchBar value={q} onChange={setQ} placeholder="Naam, mobile ya ID se dhoondein" />
      <div className="cu-filters"><FilterChips options={FILTERS} value={status} onChange={setStatus} label="Customers filter" /></div>

      {error ? (
        <div className="cu-error" role="alert"><p>{error}</p><CommonBtn text="Dobara koshish karein" onClick={() => dispatch(fetchCustomers({ search, status }))} /></div>
      ) : loading && !list.length ? <Loader /> : list.length === 0 ? (
        <EmptyState icon={<Users size={30} />} title={q || status !== "all" ? "Koi customer nahi mila" : "Abhi koi customer nahi"} text={q || status !== "all" ? "Search ya filter badal kar dekhein." : "Pehla customer add karke shuru karein."}
          action={<Link href={ROUTES.SHOP.ADD_CUSTOMER} className="cu-empty-btn">Naya customer add karein</Link>} />
      ) : (
        <ul className="cu-list">{list.map((c) => <CustomerCard key={c.id} customer={c} onDelete={setToDelete} />)}</ul>
      )}

      {toDelete && (
        <ConfirmModal title={`${toDelete.name} ko delete karein?`} message="Is ki saari qistein poori ho chuki hain. Delete karne ke baad yeh customer list se hat jayega." confirmText="Haan, delete karein" cancelText="Nahi" tone="danger" loading={deleting} onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />
      )}

      <Link href={ROUTES.SHOP.ADD_CUSTOMER} className="cu-fab" aria-label="Naya customer add karein"><Plus size={22} aria-hidden="true" /> Add Customer</Link>
    </div>
  );
};

export default CustomersPage;
