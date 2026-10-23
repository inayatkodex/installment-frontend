import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import CommonBtn from "@/components/common/CommonButton/Button";
import StatusBadge from "@/components/common/StatusBadge/StatusBadge";
import { ROUTES } from "@/constant/appRoutes";
import { formatRs, initials } from "@/shared/formatUtils";
import { CollectionItem } from "@/types/payment";
import "./collection-row.scss";

interface Props { item: CollectionItem; onReceive: (item: CollectionItem) => void }

const CollectionRow = ({ item, onReceive }: Props) => {
  const pathname = usePathname();
  const isCollection = pathname === ROUTES.SHOP.COLLECTION;
  const left = item.expected - item.paid;
  return (
    <li className="collection-row">
      {item.photo ? (
        <img src={item.photo} alt="" className="cr-avatar cr-avatar-img" />
      ) : (
        <span className="cr-avatar" aria-hidden="true">{initials(item.name)}</span>
      )}
      <div className="cr-info">
        <Link href={ROUTES.SHOP.CUSTOMER_DETAIL(item.customerId)} className="cr-name">{item.name}</Link>
        <span className="cr-phone">{item.phone}</span>
        <StatusBadge status={item.status} />
      </div>
      <div className="cr-end">
        <strong>{formatRs(item.status === "paid" ? item.expected : left)}</strong>
        <div className="cr-actions">
          {isCollection && (
            <a
              href={`tel:${item.phone.replace(/[^\d+]/g, "")}`}
              className="cr-call-btn"
              aria-label={`${item.name} ko call karein`}
            >
              <Phone size={20} aria-hidden="true" />
            </a>
          )}
          {item.status === "paid" ? (
            <Link href={ROUTES.SHOP.CUSTOMER_DETAIL(item.customerId)} className="cr-view" aria-label={`${item.name} dekhein`}>View</Link>
          ) : (
            <CommonBtn text="Receive" className="sm-btn" onClick={() => onReceive(item)} ariaLabel={`${item.name} se raqam lein`} />
          )}
        </div>
      </div>
    </li>
  );
};

export default CollectionRow;
