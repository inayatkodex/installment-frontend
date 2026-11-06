"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowUpRight, RotateCcw, Store, Trash2 } from "lucide-react";
import Link from "next/link";
import ShopsTable from "@/components/admin/shops-table/ShopsTable";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import FilterChips from "@/components/common/FilterChips/FilterChips";
import Loader from "@/components/common/Loader/Loader";
import Pagination from "@/components/common/Pagination/Pagination";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import { useDebounce } from "@/hooks/useDebounce";
import { useShopStatusChange } from "@/hooks/useShopStatusChange";
import {
  fetchPendingShopDeletions,
  fetchAdminShops,
  setAdminShopFee,
  undoDeleteAdminShop,
} from "@/store/slices/admin/shops/adminShopsSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { currentMonthKey } from "@/shared/planUtils";
import { showToast } from "@/shared/toastUtils";
import { ROUTES } from "@/constant/appRoutes";
import { AdminShop, FeeStatus } from "@/types/adminShop";
import "./shops.scss";

const AdminShopsPage = () => {
  const dispatch = useAppDispatch();
  const { list, loading, error, pendingDeletion, updating } = useAppSelector(
    (s) => s.adminShops,
  );
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
  useEffect(() => {
    dispatch(fetchPendingShopDeletions());
  }, [dispatch]);

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
          ? `Rs. ${(shop.monthlyFee ?? 0).toLocaleString()} fee received for ${shop.shopName}`
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

  const undoDeletion = async (id: string, shopName: string) => {
    try {
      await dispatch(undoDeleteAdminShop(id)).unwrap();
      showToast(`${shopName} restored`, "success");
      dispatch(fetchPendingShopDeletions());
      load();
    } catch (e) {
      showToast(typeof e === "string" ? e : "Failed to restore shop", "error");
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
      <header className="as-header">
        <div>
          <span className="as-eyebrow">Shop management</span>
          <h1 className="page-title">Shops</h1>
          <p>Review registrations, update status, and track monthly fees.</p>
        </div>
        <Link href={ROUTES.ADMIN.DASHBOARD} className="as-dashboard-link">
          Dashboard <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </header>

      <section className="as-toolbar" aria-label="Search and filter shops">
        <div className="as-search-row">
          <div className="as-search">
            <SearchBar
              value={q}
              onChange={setQ}
              placeholder="Shop, owner, mobile, or ID"
              label="Shops search"
            />
          </div>
          <FilterChips
            options={statusFilters}
            value={status}
            onChange={setStatus}
            label="Status filter"
          />
        </div>
        <div className="as-filter-bottom">
          <div className="as-filter-caption">
            <span>Filter by fee</span>
            <small>This month</small>
          </div>
          <FilterChips
            options={feeFilters}
            value={fee}
            onChange={setFee}
            label="Fee filter"
          />
        </div>
      </section>

      {list && (
        <div className="as-result-summary" aria-live="polite">
          <span>
            Showing <strong>{list.items.length}</strong> of{" "}
            <strong>{list.total}</strong> shops
          </span>
          {loading && <small>Updating…</small>}
        </div>
      )}

      {pendingDeletion.length > 0 && (
        <section
          className="as-recently-deleted"
          aria-labelledby="as-recent-title"
        >
          <div className="as-recent-heading">
            <span className="as-recent-icon">
              <Trash2 size={17} aria-hidden="true" />
            </span>
            <div>
              <h2 id="as-recent-title">Recently deleted</h2>
              <p>Shops are permanently deleted after 7 days.</p>
            </div>
          </div>
          <ul>
            {pendingDeletion.map((shop) => (
              <li key={shop.id}>
                <div>
                  <strong>{shop.shopName}</strong>
                  <span>
                    {shop.shopCode} · {shop.ownerName}
                  </span>
                  <small className="as-deleted-date">
                    <span>Deleted</span>
                    {new Date(shop.requestedAt).toLocaleString("en-PK", {
                      timeZone: "Asia/Karachi",
                    })}
                  </small>
                </div>
                <button
                  className="as-undo"
                  type="button"
                  disabled={updating}
                  onClick={() => undoDeletion(shop.id, shop.shopName)}
                >
                  <RotateCcw size={15} aria-hidden="true" />
                  Restore
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {error ? (
        <p className="as-error" role="alert">
          {error}
        </p>
      ) : !list ? (
        <Loader />
      ) : list.items.length === 0 ? (
        <div className="as-empty">
          <EmptyState
            icon={<Store size={30} />}
            title="No shops found"
            text="Try adjusting your search or filters."
          />
          {(q || status !== "all" || fee !== "all") && (
            <button
              type="button"
              onClick={() => {
                setQ("");
                setStatus("all");
                setFee("all");
              }}
            >
              Clear search and filters
            </button>
          )}
        </div>
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
