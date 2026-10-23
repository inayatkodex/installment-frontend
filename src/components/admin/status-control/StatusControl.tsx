import { STATUS_LIST } from "@/constant/shopStatus";
import { ShopStatus } from "@/types/common";
import "./status-control.scss";

interface Props { value: ShopStatus; onSelect: (status: ShopStatus) => void }

/** Shows all 4 statuses. The current one is filled. Tapping another one asks "pakka?" first. */
const StatusControl = ({ value, onSelect }: Props) => (
  <div className="status-control">
    <span className="sc-label" id="status-control-label">Change Status</span>
    <div className="sc-seg" role="radiogroup" aria-labelledby="status-control-label">
      {STATUS_LIST.map((s) => (
        <button key={s.value} type="button" role="radio" aria-checked={value === s.value} className={`${s.value} ${value === s.value ? "on" : ""}`} onClick={() => onSelect(s.value)}>
          {s.label}
        </button>
      ))}
    </div>
  </div>
);

export default StatusControl;
