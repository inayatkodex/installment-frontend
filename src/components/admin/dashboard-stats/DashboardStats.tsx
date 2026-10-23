import Link from "next/link";
import { ROUTES } from "@/constant/appRoutes";
import { formatRs } from "@/shared/formatUtils";
import { AdminDashboardStats } from "@/types/adminShop";
import "./dashboard-stats.scss";

interface Props { stats: AdminDashboardStats }

const DashboardStats = ({ stats: s }: Props) => {
  const cards = [
    { key: "active", label: "Active", value: s.activeShops, link: "View", tone: "green" },
    { key: "pending", label: "Pending", value: s.pendingShops, link: "Review", tone: "yellow" },
    { key: "inactive", label: "Inactive", value: s.inactiveShops, link: "View", tone: "red" },
    { key: "archived", label: "Archived", value: s.archivedShops, link: "View", tone: "gray" },
  ];

  return (
    <div className="dashboard-stats">
      <section aria-label="Shop Status Overview">
        <h2>Shop Status Overview</h2>
        <p className="ds-sub">Total {s.totalShops} shops registered</p>
        <div className="ds-grid">
          {cards.map((c) => (
            <Link key={c.key} href={`${ROUTES.ADMIN.SHOPS}?status=${c.key}`} className={`ds-card ${c.tone}`}>
              <span>{c.label}</span>
              <strong>{c.value}</strong>
              <b>{c.link}</b>
            </Link>
          ))}
        </div>
      </section>

      <section aria-label="Monthly Platform Fees">
        <h2>Monthly Platform Fees <span className="ds-month">{s.monthLabel}</span></h2>
        <p className="ds-sub">Monthly fee per Active shop: Rs. 2,500</p>
        <div className="ds-fees">
          <div className="ds-fee green"><span>Collected</span><strong>{formatRs(s.feeCollected)}</strong><p>{s.feePaidShops} shops have paid</p></div>
          <div className="ds-fee red"><span>Remaining</span><strong>{formatRs(s.feeRemaining)}</strong><p>{s.feeUnpaidShops} shops pending</p></div>
          <div className="ds-fee white">
            <span>{s.feePercent}% shops have paid</span>
            <div className="ds-bar" role="progressbar" aria-valuenow={s.feePercent} aria-valuemin={0} aria-valuemax={100} aria-label="Shops fee payment progress"><i style={{ width: `${s.feePercent}%` }} /></div>
            <Link href={`${ROUTES.ADMIN.SHOPS}?status=active&fee=unpaid`} className="ds-link">View unpaid shops</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardStats;
