"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AlertCircle, ChevronRight, Plus, Store } from "lucide-react";
import CollectionRow from "@/components/shop/collection-row/CollectionRow";
import ReceivePaymentForm, {
  ReceiveTarget,
} from "@/components/shop/receive-payment-form/ReceivePaymentForm";
import StatCard from "@/components/common/StatCard/StatCard";
import Loader from "@/components/common/Loader/Loader";
import CommonBtn from "@/components/common/CommonButton/Button";
import { ROUTES } from "@/constant/appRoutes";
import { fetchShopDashboard } from "@/store/slices/shop/dashboard/shopDashboardSlice";
import { fetchTodayCollection } from "@/store/slices/shop/collection/shopCollectionSlice";
import { fetchCustomers } from "@/store/slices/shop/customers/shopCustomersSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { formatRs } from "@/shared/formatUtils";
import { CollectionItem } from "@/types/payment";
import "./dashboard.scss";

const ShopDashboardPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.shopAuth.user);
  const { data: sum, loading } = useAppSelector((s) => s.shopDashboard);
  const {
    items,
    loading: collectionLoading,
    error: collectionError,
  } = useAppSelector((s) => s.shopCollection);
  const { list: customers, loading: customersLoading, error: customersError } =
    useAppSelector((s) => s.shopCustomers);
  const [target, setTarget] = useState<ReceiveTarget | null>(null);

  const refresh = useCallback(() => {
    dispatch(fetchShopDashboard());
    dispatch(fetchTodayCollection());
  }, [dispatch]);
  useEffect(() => {
    refresh();
  }, [refresh]);
  useEffect(() => {
    dispatch(fetchCustomers({ status: "all" }));
  }, [dispatch]);

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
          <span className="sd-eyebrow">WELCOME TO YOUR DASHBOARD</span>
          <p className="sd-greeting">Assalam o Alaikum, {user?.ownerName}</p>
          <h1>{user?.shopName || "Your Shop"}</h1>
          <p className="sd-welcome-description">
            Your business at a glance. Let&apos;s make today productive.
          </p>
        </div>
        <div className="sd-welcome-mark" aria-hidden="true">
          <span className="sd-welcome-mark-icon">
            <Store size={28} strokeWidth={1.8} />
          </span>
          <span className="sd-welcome-mark-label">BUSINESS DASHBOARD</span>
        </div>
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
          {customersLoading ? (
            <Loader />
          ) : customersError ? (
            <div role="alert">
              <p>{customersError}</p>
              <CommonBtn
                text="Dobara koshish karein"
                onClick={() => dispatch(fetchCustomers({ status: "all" }))}
              />
            </div>
          ) : customers.length === 0 ? (
            <div className="sd-empty">
              <p>Abhi koi customer add nahi kiya.</p>
              <Link href={ROUTES.SHOP.ADD_CUSTOMER} className="sd-add">
                <Plus size={19} aria-hidden="true" /> Pehla customer add karein
              </Link>
            </div>
          ) : collectionLoading ? (
            <Loader />
          ) : collectionError ? (
            <div role="alert">
              <p>{collectionError}</p>
              <CommonBtn
                text="Dobara koshish karein"
                onClick={() => dispatch(fetchTodayCollection())}
              />
            </div>
          ) : items.length === 0 ? (
            <p className="sd-no-collection">
              Aaj kisi customer ki qist wasool nahi ha.
            </p>
          ) : pending.length === 0 ? (
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
