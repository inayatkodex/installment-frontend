import { ShopStatus } from "@/types/common";

export const STATUS_LIST: { value: ShopStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "archived", label: "Archived" },
];

interface StatusAction {
  menuLabel: string;
  title: (shopName: string) => string;
  message: string;
  confirm: string;
  tone: "primary" | "danger" | "success";
  askReason: boolean;
  done: string;
}

/** Texts used when the admin moves a shop to another status. Any status can be reached from any status. */
export const STATUS_ACTIONS: Record<ShopStatus, StatusAction> = {
  active: {
    menuLabel: "Activate",
    title: (n) => `Activate ${n}?`,
    message: "The shopkeeper will be able to log in and use the application.",
    confirm: "Yes, Activate",
    tone: "success",
    askReason: false,
    done: "Shop activated successfully",
  },
  inactive: {
    menuLabel: "Deactivate",
    title: (n) => `Deactivate ${n}?`,
    message: "The shop account will be deactivated and the shopkeeper will not be able to log in. You can reactivate it at any time.",
    confirm: "Yes, Deactivate",
    tone: "danger",
    askReason: true,
    done: "Shop deactivated successfully",
  },
  archived: {
    menuLabel: "Archive",
    title: (n) => `Archive ${n}?`,
    message: "The shop will be archived and the shopkeeper will not be able to log in. You can restore it at any time.",
    confirm: "Yes, Archive",
    tone: "danger",
    askReason: true,
    done: "Shop archived successfully",
  },
  pending: {
    menuLabel: "Move to Pending",
    title: (n) => `Move ${n} to Pending?`,
    message: "The shop will require administrative review before the shopkeeper can log in.",
    confirm: "Yes, Move to Pending",
    tone: "primary",
    askReason: false,
    done: "Shop moved to Pending",
  },
};
