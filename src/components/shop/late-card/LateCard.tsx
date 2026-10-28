import Link from "next/link";
import CommonBtn from "@/components/common/CommonButton/Button";
import StatusBadge from "@/components/common/StatusBadge/StatusBadge";
import { ROUTES } from "@/constant/appRoutes";
import { formatDate, formatRs, initials } from "@/shared/formatUtils";
import { resolveMediaUrl } from "@/shared/imageUtils";
import { LateItem } from "@/types/payment";
import "./late-card.scss";

interface Props {
  item: LateItem;
  onReceive: (item: LateItem) => void;
}

const LateCard = ({ item, onReceive }: Props) => (
  <li className="late-card">
    <div className="lc-top">
      {item.photo ? (
        <img
          src={resolveMediaUrl(item.photo)}
          alt=""
          className="lc-avatar lc-avatar-img"
        />
      ) : (
        <span className="lc-avatar" aria-hidden="true">
          {initials(item.name)}
        </span>
      )}
      <div className="lc-name">
        <Link href={ROUTES.SHOP.CUSTOMER_DETAIL(item.customerId)}>
          {item.name}
        </Link>
        <span>{item.phone}</span>
      </div>
      <StatusBadge status="overdue" label={`${item.daysLate} din late`} />
    </div>
    <div className="lc-mid">
      <strong>{formatRs(item.lateAmount)}</strong>
      <span>
        {item.lateCount} {item.lateCount === 1 ? "qist" : "qistein"} baaki
      </span>
    </div>
    <p className="lc-last">Aakhri payment: {formatDate(item.lastPayment)}</p>
    <CommonBtn
      text="Receive"
      className="full-btn"
      onClick={() => onReceive(item)}
      ariaLabel={`${item.name} se raqam lein`}
    />
  </li>
);

export default LateCard;
