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

export interface CustomerDetail extends CustomerListItem {
  fatherName?: string;
  cnic?: string;
  address?: string;
  total: number;
  paid: number;
  downPayment: number;
  monthly: number;
  firstDueDate: string;
  items: CustomerItem[];
  installments: InstallmentRow[];
  documents?: { cnicFront?: string; cnicBack?: string; other?: string };
  late?: { amount: number; days: number; installmentNo: number };
  next?: { no: number; dueDate: string; amount: number };
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
  months: number;
  firstDueDate: string;
  documents: { cnicFront?: string; cnicBack?: string; other?: string };
}
