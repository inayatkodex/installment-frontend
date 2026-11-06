import Link from "next/link";
import {
  Archive,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Store,
  Wallet,
} from "lucide-react";
import { ROUTES } from "@/constant/appRoutes";
import { formatRs } from "@/shared/formatUtils";
import { AdminDashboardStats } from "@/types/adminShop";
import "./dashboard-stats.scss";

interface Props {
  stats: AdminDashboardStats;
}

const DashboardStats = ({ stats: s }: Props) => {
  const cards = [
    {
      key: "active",
      label: "Active",
      description: "Currently operating",
      value: s.activeShops,
      link: "View",
      tone: "green",
      icon: Store,
      href: `${ROUTES.ADMIN.SHOPS}?status=active`,
    },
    {
      key: "pending",
      label: "Pending",
      description: "Waiting for review",
      value: s.pendingShops,
      link: "Review",
      tone: "yellow",
      icon: Clock3,
      href: `${ROUTES.ADMIN.SHOPS}?status=pending`,
    },
    {
      key: "inactive",
      label: "Inactive",
      description: "Not currently active",
      value: s.inactiveShops,
      link: "View",
      tone: "red",
      icon: Archive,
      href: `${ROUTES.ADMIN.SHOPS}?status=inactive`,
    },
    {
      key: "archived",
      label: "Archived",
      description: "Archived shops",
      value: s.archivedShops,
      link: "View",
      tone: "gray",
      icon: Archive,
      href: `${ROUTES.ADMIN.SHOPS}?status=archived`,
    },
  ];

  return (
    <div className="dashboard-stats">
      <section className="ds-section" aria-label="Shop Status Overview">
        <div className="ds-section-heading">
          <div>
            <span className="ds-eyebrow">Shops</span>
            <h2>Shop overview</h2>
          </div>
          <span className="ds-total">
            <strong>{s.totalShops}</strong> registered
          </span>
        </div>
        <div className="ds-grid">
          {cards.map((c) => (
            <Link key={c.key} href={c.href} className={`ds-card ${c.tone}`}>
              <span className="ds-card-top">
                <span>{c.label}</span>
                <i>
                  <c.icon size={17} aria-hidden="true" />
                </i>
              </span>
              <strong>{c.value}</strong>
              <span className="ds-card-bottom">
                <small>{c.description}</small>
                <b>
                  {c.link} <ArrowUpRight size={14} aria-hidden="true" />
                </b>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section
        className="ds-section ds-fee-section"
        aria-label="Monthly Platform Fees"
      >
        <div className="ds-section-heading">
          <div>
            <span className="ds-eyebrow">Revenue</span>
            <h2>Monthly platform fees</h2>
          </div>
          <span className="ds-month">{s.monthLabel}</span>
        </div>
        <p className="ds-sub">Fees are set individually for each shop.</p>
        <div className="ds-fees">
          <div className="ds-fee green">
            <span className="ds-fee-label">
              <CheckCircle2 size={16} aria-hidden="true" /> Collected
            </span>
            <strong>{formatRs(s.feeCollected)}</strong>
            <p>{s.feePaidShops} shops paid</p>
          </div>
          <div className="ds-fee red">
            <span className="ds-fee-label">
              <Wallet size={16} aria-hidden="true" /> Remaining
            </span>
            <strong>{formatRs(s.feeRemaining)}</strong>
            <p>{s.feeUnpaidShops} shops unpaid</p>
          </div>
          <div className="ds-fee white">
            <div className="ds-progress-heading">
              <span>Collection progress</span>
              <strong>{s.feePercent}%</strong>
            </div>
            <div
              className="ds-bar"
              role="progressbar"
              aria-valuenow={s.feePercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Shops fee payment progress"
            >
              <i style={{ width: `${s.feePercent}%` }} />
            </div>
            <span className="ds-progress-note">
              {s.feePaidShops} of {s.feePaidShops + s.feeUnpaidShops} billed
              shops paid
            </span>
            <Link
              href={`${ROUTES.ADMIN.SHOPS}?status=active&fee=unpaid`}
              className="ds-link"
            >
              View unpaid shops <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardStats;
