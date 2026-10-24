"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AlertCircle, ChevronRight, Plus } from "lucide-react";
import CollectionRow from "@/components/shop/collection-row/CollectionRow";
import ReceivePaymentForm, {
  ReceiveTarget,
} from "@/components/shop/receive-payment-form/ReceivePaymentForm";
import StatCard from "@/components/common/StatCard/StatCard";
import Loader from "@/components/common/Loader/Loader";
import { ROUTES } from "@/constant/appRoutes";
import { fetchShopDashboard } from "@/store/slices/shop/dashboard/shopDashboardSlice";
import { fetchTodayCollection } from "@/store/slices/shop/collection/shopCollectionSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { formatRs } from "@/shared/formatUtils";
import { CollectionItem } from "@/types/payment";
import "./dashboard.scss";

const ShopDashboardPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.shopAuth.user);
  const { data: sum, loading } = useAppSelector((s) => s.shopDashboard);
  const items = useAppSelector((s) => s.shopCollection.items);
  const [target, setTarget] = useState<ReceiveTarget | null>(null);

  const refresh = useCallback(() => {
    dispatch(fetchShopDashboard());
    dispatch(fetchTodayCollection());
  }, [dispatch]);
  useEffect(() => {
    refresh();
  }, [refresh]);

  const pending = items.filter((i) => i.status !== "paid");

  const openReceive = (i: CollectionItem) =>
    setTarget({
      customerId: i.customerId,
      name: i.name,
      installmentNo: i.installmentNo,
      dueDate: i.dueDate,
      amount: i.expected - i.paid,
    });

  if (!sum) return loading ? <Loader /> : null;
  const pct = sum.month.expected
    ? Math.min(100, Math.round((sum.month.received / sum.month.expected) * 100))
    : 0;

  return (
    <div className="shop-dashboard">
      <header className="sd-welcome">
        <div className="sd-welcome-copy">
          <span className="sd-eyebrow">SHOP OVERVIEW</span>
          <h1>Assalam o Alaikum, {user?.ownerName}</h1>
          <p>Here is your installment collection at a glance.</p>
        </div>
        <span className="sd-welcome-badge">Installment Pro</span>
      </header>

      <div className="sd-grid">
        <StatCard
          tone="yellow"
          label="Aaj ki wasooli"
          labelUr="آج کی وصول"
          value={String(sum.dueCount)}
          hint="customers"
        />
        <StatCard
          tone="blue"
          label="Expected"
          labelUr="متوقع"
          value={formatRs(sum.expected)}
        />
        <StatCard
          tone="green"
          label="Received"
          labelUr="وصول"
          value={formatRs(sum.received)}
        />
        <StatCard
          tone="red"
          label="Remaining"
          labelUr="باقی"
          value={formatRs(sum.remaining)}
        />
      </div>

      <div className="sd-actions">
        <Link href={ROUTES.SHOP.COLLECTION} className="sd-cta">
          Aaj ki wasooli dekhein
          <ChevronRight size={20} aria-hidden="true" />
        </Link>
        <Link href={ROUTES.SHOP.ADD_CUSTOMER} className="sd-add">
          <Plus size={19} aria-hidden="true" /> Naya customer
        </Link>
      </div>

      <div className="sd-dashboard-grid">
        <section className="sd-panel sd-customers">
          <div className="sd-head">
            <div>
              <h2>Aaj ke customers</h2>
              <p>Installments due today</p>
            </div>
            <Link href={ROUTES.SHOP.COLLECTION}>See all</Link>
          </div>
          {pending.length === 0 ? (
            <p className="sd-all-done">
              Aaj ki saari wasooli ho gayi. Shabash!
            </p>
          ) : (
            <ul className="sd-list">
              {pending.slice(0, 3).map((i) => (
                <CollectionRow key={i.id} item={i} onReceive={openReceive} />
              ))}
            </ul>
          )}
        </section>

        <aside className="sd-side">
          <Link href={ROUTES.SHOP.LATE} className="sd-late">
            <span>
              <AlertCircle size={20} aria-hidden="true" />
            </span>
            <div>
              <strong>Late qistein</strong>
              <p>{sum.lateCount} customers ki qistein late hain</p>
            </div>
            <b>{formatRs(sum.lateAmount)}</b>
          </Link>

          <section className="sd-panel sd-month">
            <div className="sd-head">
              <div>
                <h2>{sum.month.label}</h2>
                <p>Monthly collection progress</p>
              </div>
              <strong>{pct}%</strong>
            </div>
            <div
              className="sd-bar"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Is mahine kitna wasool hua"
            >
              <i style={{ width: `${pct}%` }} />
            </div>
            <p className="sd-meta">
              <span>Expected {formatRs(sum.month.expected)}</span>
              <span>Received {formatRs(sum.month.received)}</span>
            </p>
          </section>
        </aside>
      </div>

      {target && (
        <ReceivePaymentForm
          target={target}
          onClose={() => setTarget(null)}
          onDone={refresh}
        />
      )}
    </div>
  );
};

export default ShopDashboardPage;
