"use client";

import { useEffect } from "react";
import DashboardStats from "@/components/admin/dashboard-stats/DashboardStats";
import PendingRequests from "@/components/admin/pending-requests/PendingRequests";
import CommonBtn from "@/components/common/CommonButton/Button";
import Loader from "@/components/common/Loader/Loader";
import { fetchAdminDashboard } from "@/store/slices/admin/dashboard/adminDashboardSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import "./dashboard.scss";

const AdminDashboardPage = () => {
  const dispatch = useAppDispatch();
  const { stats, loading, error } = useAppSelector((s) => s.adminDashboard);

  useEffect(() => {
    dispatch(fetchAdminDashboard());
  }, [dispatch]);

  return (
    <div className="admin-dashboard">
      <h1 className="page-title">Dashboard</h1>
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
        stats && (
          <div className="ad-body">
            <PendingRequests />
            <DashboardStats stats={stats} />
          </div>
        )
      )}
    </div>
  );
};

export default AdminDashboardPage;
