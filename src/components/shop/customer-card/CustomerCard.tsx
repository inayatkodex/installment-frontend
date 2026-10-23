import Link from "next/link";
import { ChevronRight, MoreVertical } from "lucide-react";
import DropdownMenu from "@/components/common/DropdownMenu/DropdownMenu";
import StatusBadge from "@/components/common/StatusBadge/StatusBadge";
import { ROUTES } from "@/constant/appRoutes";
import { formatRs, initials } from "@/shared/formatUtils";
import { CustomerListItem } from "@/types/customer";
import "./customer-card.scss";

interface Props { customer: CustomerListItem; onDelete?: (c: CustomerListItem) => void }

const CustomerCard = ({ customer, onDelete }: Props) => {
  const canDelete = customer.status === "completed" && !!onDelete;
  return (
  <li className="cc-wrap">
    <Link href={ROUTES.SHOP.CUSTOMER_DETAIL(customer.id)} className={`customer-card ${canDelete ? "has-menu" : ""}`}>
      {customer.photo ? (
        <img src={customer.photo} alt="" className="cc-avatar cc-avatar-img" />
      ) : (
        <span className="cc-avatar" aria-hidden="true">{initials(customer.name)}</span>
      )}
      <div className="cc-body">
        <div className="cc-top">
          <strong>{customer.name}</strong>
          <StatusBadge status={customer.status === "overdue" ? "overdue" : customer.status} label={customer.status === "overdue" ? "Late" : undefined} />
        </div>
        <p className="cc-sub">{customer.phone} · {customer.code}</p>
        <div className="cc-bottom">
          <span>Baaki: <b>{formatRs(customer.remaining)}</b></span>
          <span className="cc-count">{customer.paidCount} of {customer.totalCount} qistein</span>
        </div>
        <div className="cc-progress" role="progressbar" aria-valuenow={customer.progress} aria-valuemin={0} aria-valuemax={100} aria-label="Kitni raqam ada hui">
          <i style={{ width: `${customer.progress}%` }} />
        </div>
      </div>
      <ChevronRight size={20} className="cc-arrow" aria-hidden="true" />
    </Link>
    {canDelete && (
      <div className="cc-menu">
        <DropdownMenu ariaLabel={`${customer.name} ke options`} trigger={<MoreVertical size={20} />} triggerClassName="icon-only"
          items={[{ label: "Customer delete karein", tone: "danger", onClick: () => onDelete!(customer) }]} />
      </div>
    )}
  </li>
  );
};

export default CustomerCard;
