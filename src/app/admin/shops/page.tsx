"use client";

import { useCallback, useEffect, useState } from "react";
import { Store } from "lucide-react";
import ShopsTable from "@/components/admin/shops-table/ShopsTable";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import FilterChips from "@/components/common/FilterChips/FilterChips";
import Loader from "@/components/common/Loader/Loader";
import Pagination from "@/components/common/Pagination/Pagination";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import { useDebounce } from "@/hooks/useDebounce";
import { useShopStatusChange } from "@/hooks/useShopStatusChange";
import {
  fetchAdminShops,
  setAdminShopFee,
} from "@/store/slices/admin/shops/adminShopsSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { currentMonthKey } from "@/shared/planUtils";
import { showToast } from "@/shared/toastUtils";
import { AdminShop, FeeStatus } from "@/types/adminShop";
import "./shops.scss";

const AdminShopsPage = () => {
  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector((s) => s.adminShops);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [fee, setFee] = useState("all");
  const [page, setPage] = useState(1);
  const search = useDebounce(q, 300);

  // Links from the dashboard open this page already filtered (?status=active&fee=unpaid)
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("status")) setStatus(p.get("status")!);
    if (p.get("fee")) setFee(p.get("fee")!);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, status, fee]);

  const load = useCallback(() => {
    dispatch(fetchAdminShops({ status, fee, search, page }));
  }, [dispatch, status, fee, search, page]);
  useEffect(() => {
    load();
  }, [load]);

  const { ask, dialog } = useShopStatusChange(load);

  const changeFee = async (shop: AdminShop, next: FeeStatus) => {
    try {
      await dispatch(
        setAdminShopFee({
          id: shop.id,
          month: currentMonthKey(),
          status: next,
        }),
      ).unwrap();
      showToast(
        next === "paid"
          ? `Rs. ${shop.monthlyFee.toLocaleString()} fee received for ${shop.shopName}`
          : `Fee marked as unpaid for ${shop.shopName}`,
        "success",
      );
      load();
    } catch (e) {
      showToast(
        typeof e === "string" ? e : "Failed to update fee status",
        "error",
      );
    }
  };

  const c = list?.counts;
  const statusFilters = [
    { value: "all", label: "All", count: c?.all },
    { value: "pending", label: "Pending", count: c?.pending },
    { value: "active", label: "Active", count: c?.active },
    { value: "inactive", label: "Inactive", count: c?.inactive },
    { value: "archived", label: "Archived", count: c?.archived },
  ];
  const feeFilters = [
    { value: "all", label: "All" },
    { value: "paid", label: "Paid" },
    { value: "unpaid", label: "Unpaid" },
  ];

  return (
    <div className="admin-shops">
      <h1 className="page-title">Shops</h1>
      <SearchBar
        value={q}
        onChange={setQ}
        placeholder="Search by shop, owner, mobile, or Shop ID"
        label="Shops search"
      />
      <div className="as-filters">
        <FilterChips
          options={statusFilters}
          value={status}
          onChange={setStatus}
          label="Status filter"
        />
        <div className="as-fee">
          <span>Fee (This Month):</span>
          <FilterChips
            options={feeFilters}
            value={fee}
            onChange={setFee}
            label="Fee filter"
          />
        </div>
      </div>

      {error ? (
        <p className="as-error" role="alert">
          {error}
        </p>
      ) : !list ? (
        <Loader />
      ) : list.items.length === 0 ? (
        <EmptyState
          icon={<Store size={30} />}
          title="No shops found"
          text="Try adjusting your search or filters."
        />
      ) : (
        <div className={loading ? "as-loading" : ""}>
          <ShopsTable shops={list.items} onStatus={ask} onFee={changeFee} />
          <Pagination
            page={list.page}
            pageSize={list.pageSize}
            total={list.total}
            onChange={setPage}
          />
        </div>
      )}

      {dialog}
    </div>
  );
};

export default AdminShopsPage;
