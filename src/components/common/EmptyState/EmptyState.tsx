import { ReactNode } from "react";
import "./emptystate.scss";

interface Props {
  icon?: ReactNode;
  title: string;
  text?: string;
  action?: ReactNode;
}

const EmptyState = ({ icon, title, text, action }: Props) => (
  <div className="empty-state">
    {icon && <span className="empty-icon">{icon}</span>}
    <h3>{title}</h3>
    {text && <p>{text}</p>}
    {action}
  </div>
);

export default EmptyState;
