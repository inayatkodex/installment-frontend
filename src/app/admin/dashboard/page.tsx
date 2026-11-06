"use client";

import { useEffect } from "react";
import { ArrowUpRight, ChartNoAxesCombined } from "lucide-react";
import Link from "next/link";
import DashboardStats from "@/components/admin/dashboard-stats/DashboardStats";
import PendingRequests from "@/components/admin/pending-requests/PendingRequests";
import CommonBtn from "@/components/common/CommonButton/Button";
import Loader from "@/components/common/Loader/Loader";
import { fetchAdminDashboard } from "@/store/slices/admin/dashboard/adminDashboardSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { ROUTES } from "@/constant/appRoutes";
import "./dashboard.scss";

const AdminDashboardPage = () => {
  const dispatch = useAppDispatch();
  const { stats, loading, error } = useAppSelector((s) => s.adminDashboard);
  const { list } = useAppSelector((s) => s.adminShops);

  useEffect(() => {
    dispatch(fetchAdminDashboard());
  }, [dispatch]);

  return (
    <div className="admin-dashboard">
      <h1 className="page-title">Dashboard</h1>
      <header className="ad-welcome">
        <div className="ad-welcome-icon">
          <ChartNoAxesCombined size={22} aria-hidden="true" />
        </div>
        <div>
          <p>Platform overview</p>
          <h2>Manage your shops at a glance</h2>
        </div>
        <Link href={ROUTES.ADMIN.SHOPS} className="ad-view-shops">
          View all shops <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </header>
      {error ? (
        <div className="ad-error" role="alert">
          <p>{error}</p>
          <CommonBtn
            text="Try again"
            onClick={() => dispatch(fetchAdminDashboard())}
          />
        </div>
      ) : !stats && loading ? (
        <Loader />
      ) : (
        <div className="ad-body">
          {stats && <DashboardStats stats={stats} />}
          <PendingRequests />
          {loading && list?.items.length ? (
            <span className="ad-refreshing" role="status">
              Updating dashboard…
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
