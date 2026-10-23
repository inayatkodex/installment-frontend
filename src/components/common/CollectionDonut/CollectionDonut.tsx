import { formatRs } from "@/shared/formatUtils";
import "./collectiondonut.scss";

interface Props { percent: number; received: number; remaining: number }

const R = 54;
const C = 2 * Math.PI * R;

const CollectionDonut = ({ percent, received, remaining }: Props) => (
  <div className="collection-donut">
    <svg width="150" height="150" viewBox="0 0 150 150" role="img" aria-label={`${percent} percent wasool hua`}>
      <circle cx="75" cy="75" r={R} fill="none" stroke="#d6e4f5" strokeWidth="18" />
      <circle cx="75" cy="75" r={R} fill="none" stroke="#1565c0" strokeWidth="18" strokeLinecap="round"
        strokeDasharray={`${(C * Math.min(percent, 100)) / 100} ${C}`} transform="rotate(-90 75 75)" />
      <text x="75" y="76" textAnchor="middle" fontSize="30" fontWeight="700" fill="#1f2937">{percent}%</text>
      <text x="75" y="98" textAnchor="middle" fontSize="13" fill="#4b5563">Wasool</text>
    </svg>
    <div className="donut-legend">
      <p><i className="dot received" /> Wasool hue</p>
      <strong>{formatRs(received)}</strong>
      <p><i className="dot remaining" /> Baaki</p>
      <strong>{formatRs(remaining)}</strong>
    </div>
  </div>
);

export default CollectionDonut;
