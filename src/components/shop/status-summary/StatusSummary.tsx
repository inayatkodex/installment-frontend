import { CheckCircle2, Clock, Users, AlertCircle } from "lucide-react";
import CollectionDonut from "@/components/common/CollectionDonut/CollectionDonut";
import StatCard from "@/components/common/StatCard/StatCard";
import { formatRs } from "@/shared/formatUtils";
import { StatusReport } from "@/types/payment";
import "./status-summary.scss";

const StatusSummary = ({ report: r }: { report: StatusReport }) => (
  <div className="status-summary">
    {/* One simple line under the month: how much came in, how much is left */}
    <p className="ss-line">
      Is mahine <b>{formatRs(r.expected)}</b> mein se{" "}
      <b>{formatRs(r.received)}</b> wasool ho gaye aur{" "}
      <b>{formatRs(r.remaining)}</b> baaki hain.
    </p>

    <div className="ss-grid">
      <StatCard
        tone="blue"
        label="Total wasooli"
        labelUr="کل وصولی"
        value={formatRs(r.expected)}
      />
      <StatCard
        tone="green"
        label="Received"
        labelUr="وصول"
        value={formatRs(r.received)}
      />
      <StatCard
        tone="yellow"
        label="Remaining"
        labelUr="باقی"
        value={formatRs(r.remaining)}
      />
      <StatCard
        tone="red"
        label="Late"
        labelUr="لیٹ"
        value={formatRs(r.overdue)}
      />
    </div>

    <div className="ss-chart">
      <CollectionDonut
        percent={r.collectedPercent}
        received={r.received}
        remaining={r.remaining}
      />
    </div>

    <div className="ss-grid">
      <StatCard
        tone="gray"
        icon={<Users size={18} aria-hidden="true" />}
        label="Total customers"
        value={String(r.totalCustomers)}
      />
      <StatCard
        tone="gray"
        icon={<CheckCircle2 size={18} aria-hidden="true" />}
        label="Paid qistein"
        value={String(r.paidInstallments)}
      />
      <StatCard
        tone="gray"
        icon={<Clock size={18} aria-hidden="true" />}
        label="Baaki qistein"
        value={String(r.pendingInstallments)}
      />
      <StatCard
        tone="gray"
        icon={<AlertCircle size={18} aria-hidden="true" />}
        label="Late customers"
        value={String(r.overdueCustomers)}
      />
    </div>
  </div>
);

export default StatusSummary;
