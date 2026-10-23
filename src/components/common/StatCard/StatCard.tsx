import { ReactNode } from "react";
import "./statcard.scss";

type Tone = "blue" | "green" | "yellow" | "red" | "gray";

interface Props {
  label: string;
  labelUr?: string;
  value: string;
  hint?: string;
  tone?: Tone;
  icon?: ReactNode;
}

const StatCard = ({ label, labelUr, value, hint, tone = "blue", icon }: Props) => (
  <div className={`stat-card ${tone}`}>
    <p className="stat-label">
      {icon}
      <span>{label}</span>
      {labelUr && <span className="ur" lang="ur">{labelUr}</span>}
    </p>
    <p className="stat-value">{value}</p>
    {hint && <p className="stat-hint">{hint}</p>}
  </div>
);

export default StatCard;
