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
  overdueInstallmentCount: number;
}

export interface PaymentAllocation {
  planLabel?: string;
  installmentNo: number;
  dueDate: string;
  amount: number;
}

export interface PaymentReceipt {
  ok: true;
  allocations: PaymentAllocation[];
  remainingLateCount: number;
  remainingLateAmount: number;
}

export interface CashBreakdown {
  total: number;
  forPeriod: number;
  late: number;
  advance: number;
  lateByMonth: { month: string; amount: number }[];
}

export interface CollectionTodayResponse {
  items: CollectionItem[];
  cashToday: CashBreakdown;
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
  lateThisMonthAmount: number;
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
  cashToday: CashBreakdown;
  todayInstallments: {
    total: number;
    paid: number;
    remaining: number;
  };
  lateTotal: number;
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
  cashCollected: number;
  cashBreakdown: {
    thisMonth: number;
    late: number;
    advance: number;
  };
  overdue: number;
  collectedPercent: number;
  totalCustomers: number;
  paidInstallments: number;
  pendingInstallments: number;
  lateInstallments: number;
  overdueCustomers: number;
  customers: StatusReportCustomer[];
}

export interface StatusReportCustomer {
  customerId: string;
  name: string;
  phone: string;
  expected: number;
  received: number;
  remaining: number;
  overdue: number;
  paidInstallments: number;
  pendingInstallments: number;
  lateInstallments: number;
  paidInstallmentDates: string[];
  lateInstallmentDates: string[];
  pendingInstallmentDates: string[];
}

export interface ReceivedItem {
  id: string;
  customerId: string;
  name: string;
  amount: number;
  time: string;
  installmentNo: number;
}
