"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import DataTable, { Column } from "@/components/common/DataTable/DataTable";
import DropdownMenu, {
  MenuItem,
} from "@/components/common/DropdownMenu/DropdownMenu";
import StatusBadge from "@/components/common/StatusBadge/StatusBadge";
import { ROUTES } from "@/constant/appRoutes";
import { STATUS_ACTIONS, STATUS_LIST } from "@/constant/shopStatus";
import { formatDate } from "@/shared/formatUtils";
import { AdminShop, FeeStatus } from "@/types/adminShop";
import { ShopStatus } from "@/types/common";
import "./shops-table.scss";

interface Props {
  shops: AdminShop[];
  onStatus: (shop: AdminShop, status: ShopStatus) => void;
  onFee: (shop: AdminShop, status: FeeStatus) => void;
}

const menuFor = (
  s: AdminShop,
  onStatus: Props["onStatus"],
  onFee: Props["onFee"],
): MenuItem[] => {
  const now = STATUS_LIST.find((x) => x.value === s.status)!.label;
  const items: MenuItem[] = [
    { label: now, onClick: () => undefined, disabled: true, hint: "current" },
  ];
  for (const st of STATUS_LIST) {
    if (st.value === s.status) continue;
    const label =
      s.status === "pending" && st.value === "active"
        ? "Approve"
        : STATUS_ACTIONS[st.value].menuLabel;
    items.push({
      label,
      onClick: () => onStatus(s, st.value),
      tone:
        st.value === "active"
          ? "success"
          : st.value === "pending"
            ? "primary"
            : "danger",
    });
  }
  if (s.feeStatus)
    items.push({
      label: s.feeStatus === "paid" ? "Mark fee as Unpaid" : "Mark fee as Paid",
      tone: "primary",
      onClick: () => onFee(s, s.feeStatus === "paid" ? "unpaid" : "paid"),
    });
  return items;
};

const ShopsTable = ({ shops, onStatus, onFee }: Props) => {
  const router = useRouter();
  const columns: Column<AdminShop>[] = [
    {
      key: "shop",
      header: "Shop",
      primary: true,
      render: (s) => (
        <div className="st-shop-cell">
          {s.profilePic ? (
            <img src={s.profilePic} alt={s.ownerName} className="st-avatar" />
          ) : (
            <div className="st-avatar-fallback">{s.ownerName.charAt(0)}</div>
          )}
          <div className="st-shop">
            <strong>{s.shopName}</strong>
            <span>
              {s.shopCode} · {s.city}
            </span>
          </div>
        </div>
      ),
    },
    { key: "owner", header: "Owner", render: (s) => s.ownerName },
    { key: "phone", header: "Phone", render: (s) => s.mobile },
    {
      key: "date",
      header: "Registered",
      render: (s) => formatDate(s.registeredAt),
    },
    {
      key: "status",
      header: "Status",
      render: (s) => <StatusBadge status={s.status} />,
    },
    {
      key: "fee",
      header: "Fee (This Month)",
      render: (s) =>
        s.feeStatus ? (
          <StatusBadge
            status={s.feeStatus === "paid" ? "paid" : "overdue"}
            label={s.feeStatus === "paid" ? "Paid" : "Unpaid"}
          />
        ) : (
          "—"
        ),
    },
    {
      key: "action",
      header: "Action",
      render: (s) => (
        <div className="st-actions">
          <DropdownMenu
            ariaLabel={`Change status for ${s.shopName}`}
            trigger={
              <>
                Change Status <ChevronDown size={16} aria-hidden="true" />
              </>
            }
            items={menuFor(s, onStatus, onFee)}
          />
          <Link
            href={ROUTES.ADMIN.SHOP_DETAIL(s.id)}
            className="st-view"
            onClick={(e) => e.stopPropagation()}
          >
            View
          </Link>
        </div>
      ),
    },
  ];
  return (
    <DataTable
      columns={columns}
      rows={shops}
      rowKey={(s) => s.id}
      onRowClick={(s) => router.push(ROUTES.ADMIN.SHOP_DETAIL(s.id))}
    />
  );
};

export default ShopsTable;
