import CommonBtn from "@/components/common/CommonButton/Button";
import StatusBadge from "@/components/common/StatusBadge/StatusBadge";
import { formatDate, formatMonth, formatRs } from "@/shared/formatUtils";
import { AdminShop, FeeStatus } from "@/types/adminShop";
import "./fee-card.scss";

interface Props {
  shop: AdminShop;
  busy?: boolean;
  onChange: (month: string, status: FeeStatus) => void;
}

const FeeCard = ({ shop, busy, onChange }: Props) => {
  const hasFee = shop.feeHistory.length > 0;
  return (
    <section className="fee-card" aria-label="Monthly Platform Fee">
      <div className="fc-head">
        <h2>Monthly Platform Fee</h2>
        <strong>{formatRs(shop.monthlyFee)}</strong>
      </div>
      {!hasFee ? (
        <p className="fc-note">
          Platform fees apply to Active shops only. Once activated, monthly fee
          records will appear here.
        </p>
      ) : (
        <ul>
          {shop.feeHistory.map((h) => (
            <li key={h.month} className={h.status}>
              <div>
                <b>{formatMonth(h.month)}</b>
                <span>
                  {h.status === "paid"
                    ? `${formatDate(h.paidOn!)} · ${h.method}`
                    : "Unpaid"}
                </span>
              </div>
              <div className="fc-right">
                <StatusBadge
                  status={h.status === "paid" ? "paid" : "overdue"}
                  label={h.status === "paid" ? "Paid" : "Unpaid"}
                />
                <CommonBtn
                  text={h.status === "paid" ? "Mark as Unpaid" : "Mark as Paid"}
                  className={`sm-btn ${h.status === "paid" ? "gray-btn" : ""}`}
                  disabled={busy}
                  onClick={() =>
                    onChange(h.month, h.status === "paid" ? "unpaid" : "paid")
                  }
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default FeeCard;
