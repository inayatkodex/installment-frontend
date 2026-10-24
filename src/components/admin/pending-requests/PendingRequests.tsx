"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import Loader from "@/components/common/Loader/Loader";
import StatusBadge from "@/components/common/StatusBadge/StatusBadge";
import { ROUTES } from "@/constant/appRoutes";
import { fetchAdminShops } from "@/store/slices/admin/shops/adminShopsSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { formatDate } from "@/shared/formatUtils";
import "./pending-requests.scss";

/** Latest shops waiting for approval. Shown on the dashboard. */
const PendingRequests = () => {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.adminShops);

  useEffect(() => {
    dispatch(fetchAdminShops({ status: "pending" }));
  }, [dispatch]);

  const items = (list?.items ?? []).filter((s) => s.status === "pending");

  return (
    <section className="pending-requests" aria-label="Pending Approvals">
      <div className="pr-head">
        <h2>Pending Approvals</h2>
        <Link href={ROUTES.ADMIN.SHOPS}>All Shops</Link>
      </div>
      {loading && !list ? (
        <Loader />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<CheckCircle2 size={30} />}
          title="No pending requests"
          text="New shop registrations will appear here for review."
        />
      ) : (
        <ul>
          {items.map((s) => (
            <li key={s.id}>
              {s.profilePic ? (
                <img
                  src={s.profilePic}
                  alt={s.ownerName}
                  className="pr-avatar"
                />
              ) : (
                <div className="pr-avatar-fallback">
                  {s.ownerName.charAt(0)}
                </div>
              )}
              <div>
                <strong>{s.shopName}</strong>
                <span>
                  {s.ownerName} · {s.city} · {formatDate(s.registeredAt)}
                </span>
              </div>
              <StatusBadge status="pending" label="Pending" />
              <Link href={ROUTES.ADMIN.SHOP_DETAIL(s.id)} className="pr-review">
                Review
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default PendingRequests;
