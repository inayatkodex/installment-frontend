import { InstallmentStatus } from "./common";

export interface CollectionItem {
  id: string;
  customerId: string;
  name: string;
  phone: string;
  photo?: string;
  installmentNo: number;
  dueDate: string;
  expected: number;
  paid: number;
  status: InstallmentStatus;
}

export interface ReceivePaymentPayload {
  customerId: string;
  installmentNo: number;
  amount: number;
  note?: string;
  idempotencyKey?: string;
}

export interface LateItem {
  customerId: string;
  name: string;
  phone: string;
  photo?: string;
  lateAmount: number;
  lateCount: number;
  daysLate: number;
  lastPayment: string;
  oldestInstallmentNo: number;
  oldestRemaining: number;
  oldestDueDate: string;
}

export interface ShopDashboardData {
  dueCount: number;
  expected: number;
  received: number;
  remaining: number;
  lateCount: number;
  lateAmount: number;
  month: { label: string; expected: number; received: number };
}

export interface StatusReport {
  month: string;
  label: string;
  expected: number;
  received: number;
  remaining: number;
  overdue: number;
  collectedPercent: number;
  totalCustomers: number;
  paidInstallments: number;
  pendingInstallments: number;
  overdueCustomers: number;
}

export interface ReceivedItem {
  id: string;
  customerId: string;
  name: string;
  amount: number;
  time: string;
  installmentNo: number;
}
