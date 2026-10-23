import "./statusbadge.scss";

export type BadgeKind =
  | "paid" | "pending" | "overdue" | "partial"      // installments
  | "active" | "inactive" | "archived" | "completed" // shops & customers
  | "next";

const LABEL: Record<BadgeKind, string> = {
  paid: "Paid",
  pending: "Pending",
  overdue: "Late",
  partial: "Partly paid",
  active: "Active",
  inactive: "Inactive",
  archived: "Archived",
  completed: "Completed",
  next: "Next",
};

/** Always shows text, so status is never told by colour alone. */
const StatusBadge = ({ status, label }: { status: BadgeKind; label?: string }) => (
  <span className={`status-badge ${status}`}>{label ?? LABEL[status]}</span>
);

export default StatusBadge;
