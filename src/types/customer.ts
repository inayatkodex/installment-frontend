import { InstallmentStatus } from "./common";

export type CustomerStatus = "active" | "overdue" | "completed";

export interface CustomerItem {
  name: string;
  price: number;
  boughtOn: string;
  photo?: string; // optional picture of the item
}

export interface InstallmentRow {
  no: number;
  dueDate: string;
  expected: number;
  paid: number;
  status: InstallmentStatus;
  daysLate: number;
  paidOn?: string;
  method?: string;
  note?: string;
  planId?: string;
  planLabel?: string;
}

export interface CustomerListItem {
  id: string;
  code: string;
  name: string;
  phone: string;
  photo?: string;
  status: CustomerStatus;
  remaining: number;
  paidCount: number;
  totalCount: number;
  progress: number;
}

export interface PendingCustomerDeletion {
  id: string;
  customerNo: number;
  customerCode: string;
  name: string;
  deletionRequestedAt: string;
}

export interface CustomerDetail extends CustomerListItem {
  fatherName?: string;
  cnic?: string;
  address?: string;
  total: number;
  paid: number;
  downPayment: number;
  monthly: number;
  monthlyTotal: number;
  firstDueDate: string;
  items: CustomerItem[];
  plans: CustomerPurchasePlan[];
  installments: InstallmentRow[];
  documents?: { cnicFront?: string; cnicBack?: string; other?: string };
  late?: { amount: number; days: number; installmentNo: number };
  next?: {
    no: number;
    planId: string;
    planLabel?: string;
    dueDate?: string;
    amount: number;
    daysLate: number;
  };
}

export interface CustomerPurchasePlan {
  id: string;
  label: string;
  total: number;
  paid: number;
  remaining: number;
  downPayment: number;
  monthly: number;
  firstDueDate?: string;
  receivedInstallments: number;
  totalInstallments: number;
  items: CustomerItem[];
  installments: InstallmentRow[];
}

export interface NewCustomerPurchasePayload {
  items: { name: string; price: number; photo?: string }[];
  downPayment: number;
  monthlyPayment: number;
  firstDueDate: string;
}

export interface NewCustomerPayload {
  name: string;
  photo?: string;
  fatherName?: string;
  mobile: string;
  cnic?: string;
  address?: string;
  items: { name: string; price: number; photo?: string }[];
  downPayment: number;
  monthlyPayment: number;
  firstDueDate: string;
  documents: { cnicFront?: string; cnicBack?: string; other?: string };
}
