import { ShopStatus } from "./common";

export type FeeStatus = "paid" | "unpaid";

export interface FeeMonth {
  month: string; // "YYYY-MM"
  status: FeeStatus;
  paidOn?: string;
  method?: string;
}

export interface AdminShop {
  id: string;
  shopCode: string;
  shopName: string;
  ownerName: string;
  mobile: string;
  email?: string;
  cnic: string;
  address: string;
  city: string;
  status: ShopStatus;
  registeredAt: string;
  monthlyFee: number;
  feeStatus: FeeStatus | null; // this month's fee (null if the shop has no fee yet)
  feeHistory: FeeMonth[];
  statusNote?: string;
  profilePic?: string;
  documents: { label: string; fileName: string; url?: string }[];
}

export interface AdminDashboardStats {
  totalShops: number;
  activeShops: number;
  pendingShops: number;
  inactiveShops: number;
  archivedShops: number;
  monthLabel: string;
  feeCollected: number;
  feePaidShops: number;
  feeRemaining: number;
  feeUnpaidShops: number;
  feePercent: number;
}

export interface AdminShopsResponse {
  items: AdminShop[];
  total: number;
  page: number;
  pageSize: number;
  counts: Record<"all" | ShopStatus, number>;
}
