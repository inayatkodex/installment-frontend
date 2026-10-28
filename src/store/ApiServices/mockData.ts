/**
 * Demo data used when NEXT_PUBLIC_USE_MOCK=true (no backend needed).
 * All business rules (schedule, payment order, late days) live here only as a stand-in
 * for the NestJS API. Delete this file when the real API is connected.
 */
import { AdminDashboardStats, AdminShop, AdminShopsResponse, FeeMonth } from "@/types/adminShop";
import { ShopStatus } from "@/types/common";
import {
  CustomerDetail, CustomerItem, CustomerListItem, InstallmentRow, NewCustomerPayload,
} from "@/types/customer";
import {
  CollectionItem, LateItem, ReceivedItem, ReceivePaymentPayload, ShopDashboardData, StatusReport,
} from "@/types/payment";
import { ShopSignupPayload } from "@/types/auth";
import { currentMonthKey, toIsoDate } from "@/shared/planUtils";

export class MockError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

/* ---------------- date helpers ---------------- */
const now = () => new Date();
const today = () => toIsoDate(now());
const addDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
const addMonths = (d: Date, n: number) => {
  const r = new Date(d);
  const day = r.getDate();
  r.setDate(1);
  r.setMonth(r.getMonth() + n);
  r.setDate(Math.min(day, new Date(r.getFullYear(), r.getMonth() + 1, 0).getDate()));
  return r;
};
const diffDays = (a: string, b: string) => Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
const monthLabel = (month: string) =>
  new Date(`${month}-01`).toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

/* ---------------- shop customers (logged-in shop) ---------------- */
interface MockPayment { id: string; amount: number; date: string; method: string; note?: string; time?: string; reversed?: boolean }
let payCounter = 0;
const nextPayId = () => `p${++payCounter}`;
const TIMES = ["11:20 am", "09:45 am", "12:05 pm"];
const nowTime = () => now().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }).toLowerCase();
interface MockCustomer {
  id: string; code: string; name: string; fatherName?: string; phone: string; cnic?: string; address?: string;
  items: CustomerItem[]; downPayment: number; initialMonthlyPayment: number;
  monthlyPayment: number; firstDue: string; payments: MockPayment[];
  rateChanges: { fromInstallmentNo: number; monthlyPayment: number }[];
  photo?: string;
  documents?: { cnicFront?: string; cnicBack?: string; other?: string };
}
interface Seed {
  name: string; phone: string; items: [string, number][]; down: number; months: number;
  k: number; shift: number; full: number; extra?: number; extraAgo?: number;
}
const total = (c: MockCustomer) => c.items.reduce((s, i) => s + i.price, 0);

function makeCustomer(i: number, s: Seed): MockCustomer {
  const firstDue = addDays(addMonths(now(), -s.k), s.shift);
  const boughtOn = toIsoDate(addMonths(firstDue, -1));
  const items = s.items.map(([name, price]) => ({ name, price, boughtOn }));
  const sum = items.reduce((a, b) => a + b.price, 0);
  const monthly = Math.ceil((sum - s.down) / s.months);
  const payments: MockPayment[] = [];
  for (let j = 0; j < s.full; j++) {
    payments.push({ id: nextPayId(), amount: monthly, date: toIsoDate(addMonths(firstDue, j)), method: j % 3 === 2 ? "Easypaisa" : "Cash" });
  }
  if (s.extra) payments.push({ id: nextPayId(), amount: s.extra, date: toIsoDate(addDays(now(), -(s.extraAgo ?? 0))), method: "Cash", time: (s.extraAgo ?? 0) === 0 ? TIMES[i % TIMES.length] : undefined });
  return {
    id: `c${i}`, code: `C-${String(40 + i).padStart(4, "0")}`, name: s.name,
    fatherName: `Muhammad ${s.name.split(" ")[0]}`, phone: s.phone,
    cnic: `35201-${String(1000000 + i * 111111).slice(0, 7)}-${(i % 9) + 1}`,
    address: "Main Bazaar, Lahore", items, downPayment: s.down,
    initialMonthlyPayment: monthly, monthlyPayment: monthly,
    firstDue: toIsoDate(firstDue), payments, rateChanges: [],
  };
}

const SEEDS: Seed[] = [
  { name: "Ahmed Khan", phone: "0300-1234567", items: [['LED TV 32"', 25000], ["Refrigerator", 30000], ["Washing Machine", 35000]], down: 18000, months: 12, k: 3, shift: -3, full: 3, extra: 4000, extraAgo: 1 },
  { name: "Sana Ullah", phone: "0345-9988776", items: [["Sofa Set", 60000]], down: 10000, months: 10, k: 2, shift: 0, full: 2, extra: 1000, extraAgo: 0 },
  { name: "Usman Ali", phone: "0333-1112223", items: [["Mobile Phone", 45000]], down: 15000, months: 6, k: 1, shift: 0, full: 1 },
  { name: "Bilal Khan", phone: "0321-7654321", items: [["Laptop", 85000]], down: 25000, months: 10, k: 4, shift: -20, full: 3 },
  { name: "Zubair Ahmed", phone: "0312-4455667", items: [["Air Conditioner 1.5 Ton", 120000]], down: 30000, months: 12, k: 5, shift: -10, full: 2 },
  { name: "Faisal Ahmed", phone: "0312-5544332", items: [["Motorbike", 150000]], down: 30000, months: 6, k: 6, shift: -5, full: 6 },
  { name: "Kamran Ali", phone: "0301-8899776", items: [["Washing Machine", 38000]], down: 8000, months: 6, k: 2, shift: 0, full: 2, extra: 5000, extraAgo: 0 },
  { name: "Hina Bibi", phone: "0322-1100229", items: [["Refrigerator", 52000]], down: 12000, months: 8, k: 1, shift: 0, full: 1 },
  { name: "Asif Mehmood", phone: "0334-5566778", items: [["Air Cooler", 20000]], down: 5000, months: 3, k: 0, shift: 10, full: 0 },
];
const customers: MockCustomer[] = SEEDS.map((s, i) => makeCustomer(i + 1, s));
customers[0].payments[2].note = "Son paid";
customers[0].documents = {
  cnicFront: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80",
  cnicBack: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
};

function buildSchedule(c: MockCustomer): InstallmentRow[] {
  const t = today();
  const remaining = total(c) - c.downPayment;
  const rows: InstallmentRow[] = [];
  let scheduled = 0;
  let installmentNo = 1;
  let changeIndex = 0;
  let activeMonthly = c.initialMonthlyPayment;
  while (scheduled < remaining && installmentNo <= 1200) {
    while (
      changeIndex < c.rateChanges.length &&
      c.rateChanges[changeIndex].fromInstallmentNo <= installmentNo
    ) {
      activeMonthly = c.rateChanges[changeIndex].monthlyPayment;
      changeIndex += 1;
    }
    if (activeMonthly <= 0) break;
    const expected = Math.min(activeMonthly, remaining - scheduled);
    rows.push({
      no: installmentNo,
      dueDate: toIsoDate(addMonths(new Date(c.firstDue), installmentNo - 1)),
      expected, paid: 0, status: "pending", daysLate: 0,
    });
    scheduled += expected;
    installmentNo += 1;
  }
  let idx = 0;
  for (const p of c.payments.filter((x) => !x.reversed)) {
    let amt = p.amount;
    while (amt > 0 && idx < rows.length) {
      const use = Math.min(rows[idx].expected - rows[idx].paid, amt);
      rows[idx].paid += use;
      rows[idx].paidOn = p.date;
      rows[idx].method = p.method;
      if (p.note) rows[idx].note = p.note;
      amt -= use;
      if (rows[idx].paid >= rows[idx].expected) idx++;
    }
  }
  rows.forEach((r) => {
    const late = r.dueDate < t && r.paid < r.expected;
    r.daysLate = late ? diffDays(r.dueDate, t) : 0;
    r.status = r.paid >= r.expected ? "paid" : r.paid > 0 ? "partial" : late ? "overdue" : "pending";
  });
  return rows;
}

const livePayments = (c: MockCustomer) => c.payments.filter((p) => !p.reversed);
const paidTotal = (c: MockCustomer) => c.downPayment + livePayments(c).reduce((s, p) => s + p.amount, 0);

function toListItem(c: MockCustomer): CustomerListItem {
  const rows = buildSchedule(c);
  const remaining = total(c) - paidTotal(c);
  return {
    id: c.id, code: c.code, name: c.name, phone: c.phone, photo: c.photo,
    status: remaining <= 0 ? "completed" : rows.some((r) => r.daysLate > 0) ? "overdue" : "active",
    remaining, paidCount: rows.filter((r) => r.status === "paid").length, totalCount: rows.length,
    progress: Math.round((paidTotal(c) / total(c)) * 100),
  };
}

export function getCustomers(params: { search?: string; status?: string }): CustomerListItem[] {
  const q = (params.search || "").trim().toLowerCase().replace(/-/g, "");
  return customers
    .map(toListItem)
    .filter((c) => !params.status || params.status === "all" || c.status === params.status)
    .filter((c) => !q || c.name.toLowerCase().includes(q) || c.phone.replace(/-/g, "").includes(q) || c.code.toLowerCase().includes(q));
}

export function getCustomerDetail(id: string): CustomerDetail {
  const c = customers.find((x) => x.id === id);
  if (!c) throw new MockError("Customer nahi mila", 404);
  const rows = buildSchedule(c);
  const lateRows = rows.filter((r) => r.daysLate > 0);
  const next = rows.find((r) => r.status !== "paid" && r.daysLate === 0 && r.dueDate >= today());
  const remaining = total(c) - c.downPayment;
  return {
    ...toListItem(c), fatherName: c.fatherName, cnic: c.cnic, address: c.address, photo: c.photo, documents: c.documents,
    total: total(c), paid: paidTotal(c), downPayment: c.downPayment, monthly: c.monthlyPayment,
    firstDueDate: c.firstDue,
    items: c.items, installments: rows,
    late: lateRows.length
      ? { amount: lateRows.reduce((s, r) => s + r.expected - r.paid, 0), days: lateRows[0].daysLate, installmentNo: lateRows[0].no }
      : undefined,
    next: next ? { no: next.no, dueDate: next.dueDate, amount: next.expected - next.paid } : undefined,
  };
}

export function createCustomer(p: NewCustomerPayload): { id: string } {
  const id = `c${customers.length + 1}`;
  const boughtOn = today();
  customers.unshift({
    id, code: `C-${String(40 + customers.length + 1).padStart(4, "0")}`, name: p.name, fatherName: p.fatherName,
    phone: p.mobile, cnic: p.cnic, address: p.address,
    items: p.items.map((i) => ({ ...i, boughtOn })), downPayment: p.downPayment,
    initialMonthlyPayment: p.monthlyPayment, monthlyPayment: p.monthlyPayment,
    firstDue: p.firstDueDate, payments: [], rateChanges: [],
    photo: p.photo,
    documents: p.documents ? { ...p.documents } : undefined,
  });
  return { id };
}

export function getTodayCollection(): CollectionItem[] {
  const t = today();
  const out: CollectionItem[] = [];
  customers.forEach((c) =>
    buildSchedule(c).forEach((r) => {
      if (r.dueDate === t) {
        out.push({
          id: `${c.id}-${r.no}`, customerId: c.id, name: c.name, phone: c.phone, photo: c.photo, installmentNo: r.no,
          dueDate: r.dueDate, expected: r.expected, paid: r.paid, status: r.status === "overdue" ? "pending" : r.status,
        });
      }
    }),
  );
  return out;
}

export function getLate(): LateItem[] {
  const out: LateItem[] = [];
  customers.forEach((c) => {
    const rows = buildSchedule(c).filter((r) => r.daysLate > 0);
    if (!rows.length) return;
    const lp = livePayments(c);
    const last = lp.length ? lp[lp.length - 1].date : toIsoDate(new Date(c.firstDue));
    out.push({
      customerId: c.id, name: c.name, phone: c.phone, photo: c.photo,
      lateAmount: rows.reduce((s, r) => s + r.expected - r.paid, 0), lateCount: rows.length, daysLate: rows[0].daysLate,
      lastPayment: last, oldestInstallmentNo: rows[0].no, oldestRemaining: rows[0].expected - rows[0].paid,
      oldestDueDate: rows[0].dueDate,
    });
  });
  return out.sort((a, b) => b.daysLate - a.daysLate);
}

export function receivePayment(p: ReceivePaymentPayload): { ok: true } {
  const c = customers.find((x) => x.id === p.customerId);
  if (!c) throw new MockError("Customer nahi mila", 404);
  if (!Number.isInteger(p.amount) || p.amount <= 0) throw new MockError("Sahi raqam likhein");
  const left = total(c) - paidTotal(c);
  if (p.amount > left) throw new MockError("Raqam baaki hisaab se zyada hai");
  c.payments.push({ id: nextPayId(), amount: p.amount, date: today(), method: "Cash", note: p.note, time: nowTime() });
  return { ok: true };
}

/** Payments received today (not reversed). Shown in "Aaj mil gaye". */
export function getTodayReceived(): ReceivedItem[] {
  const t = today();
  const out: ReceivedItem[] = [];
  customers.forEach((c) =>
    c.payments.forEach((p) => {
      if (p.date === t && !p.reversed) out.push({ id: p.id, customerId: c.id, name: c.name, amount: p.amount, time: p.time ?? "aaj", installmentNo: 0 });
    }),
  );
  return out.reverse();
}

/** Undo (reverse) a payment. The record stays; only today's payments can be undone. */
export function reversePayment(id: string): { ok: true } {
  for (const c of customers) {
    const p = c.payments.find((x) => x.id === id);
    if (!p) continue;
    if (p.date !== today()) throw new MockError("Sirf aaj ki payment wapas ho sakti hai");
    p.reversed = true;
    return { ok: true };
  }
  throw new MockError("Payment nahi mili", 404);
}

/** Only a completed customer can be deleted. (The real API should soft-delete and keep the records.) */
export function deleteCustomer(id: string): { ok: true } {
  const i = customers.findIndex((c) => c.id === id);
  if (i < 0) throw new MockError("Customer nahi mila", 404);
  if (toListItem(customers[i]).status !== "completed") throw new MockError("Sirf wahi customer delete ho sakta hai jis ki saari qistein poori ho chuki hon");
  customers.splice(i, 1);
  return { ok: true };
}

export function updateCustomer(
  id: string,
  data: {
    name?: string;
    fatherName?: string;
    phone?: string;
    cnic?: string;
    address?: string;
    firstDueDate?: string;
    monthlyPayment?: number;
  }
): CustomerDetail {
  const c = customers.find((x) => x.id === id);
  if (!c) throw new MockError("Customer nahi mila", 404);
  let newRateChanges = c.rateChanges;
  if (data.monthlyPayment !== undefined && data.monthlyPayment !== c.monthlyPayment) {
    if (!Number.isSafeInteger(data.monthlyPayment) || data.monthlyPayment < 1)
      throw new MockError("Mahine ki qist ki raqam sahi likhein");
    const currentSchedule = buildSchedule(c);
    const current = currentSchedule.find((row) => row.status !== "paid");
    if (!current) throw new MockError("Mukammal customer ki qist ki raqam tabdeel nahi ho sakti");
    const fromInstallmentNo = current.paid > 0 ? current.no + 1 : current.no;
    if (fromInstallmentNo > currentSchedule.length)
      throw new MockError("Current qist mukammal karein, phir nayi raqam set karein");
    newRateChanges = c.rateChanges.map((change) => ({ ...change }));
    const existing = newRateChanges.find((change) => change.fromInstallmentNo === fromInstallmentNo);
    if (existing) existing.monthlyPayment = data.monthlyPayment;
    else newRateChanges.push({ fromInstallmentNo, monthlyPayment: data.monthlyPayment });
    newRateChanges.sort((a, b) => a.fromInstallmentNo - b.fromInstallmentNo);
    const proposedSchedule = buildSchedule({
      ...c,
      rateChanges: newRateChanges,
    });
    const scheduledBalance = proposedSchedule.reduce((sum, row) => sum + row.expected, 0);
    if (
      proposedSchedule.length >= 1200 &&
      scheduledBalance < total(c) - c.downPayment
    )
      throw new MockError("Qiston ka schedule bohat lamba hai");
  }
  if (data.name !== undefined) c.name = data.name;
  if (data.fatherName !== undefined) c.fatherName = data.fatherName;
  if (data.phone !== undefined) c.phone = data.phone;
  if (data.cnic !== undefined) c.cnic = data.cnic;
  if (data.address !== undefined) c.address = data.address;
  if (data.firstDueDate !== undefined) c.firstDue = data.firstDueDate;
  if (data.monthlyPayment !== undefined) {
    c.rateChanges = newRateChanges;
    c.monthlyPayment = data.monthlyPayment;
  }
  return getCustomerDetail(id);
}

export function updateCustomerDocument(customerId: string, docKey: string, photo: string): { ok: true } {
  const c = customers.find((x) => x.id === customerId);
  if (!c) throw new MockError("Customer nahi mila", 404);
  if (!c.documents) c.documents = {};
  c.documents[docKey as "cnicFront" | "cnicBack" | "other"] = photo;
  return { ok: true };
}

export function deleteCustomerDocument(customerId: string, docKey: string): { ok: true } {
  const c = customers.find((x) => x.id === customerId);
  if (!c) throw new MockError("Customer nahi mila", 404);
  if (c.documents) {
    delete c.documents[docKey as "cnicFront" | "cnicBack" | "other"];
  }
  return { ok: true };
}

export function getStatus(month: string): StatusReport {
  const rows = customers.flatMap((c) => buildSchedule(c)).filter((r) => r.dueDate.startsWith(month));
  const expected = rows.reduce((s, r) => s + r.expected, 0);
  const received = rows.reduce((s, r) => s + r.paid, 0);
  const late = getLate();
  return {
    month, label: monthLabel(month), expected, received, remaining: expected - received,
    overdue: rows.filter((r) => r.daysLate > 0).reduce((s, r) => s + r.expected - r.paid, 0),
    collectedPercent: expected ? Math.round((received / expected) * 100) : 0,
    totalCustomers: customers.length,
    paidInstallments: rows.filter((r) => r.status === "paid").length,
    pendingInstallments: rows.filter((r) => r.status !== "paid").length,
    overdueCustomers: late.length,
  };
}

export function getShopDashboard(): ShopDashboardData {
  const items = getTodayCollection();
  const expected = items.reduce((s, i) => s + i.expected, 0);
  const received = items.reduce((s, i) => s + i.paid, 0);
  const late = getLate();
  const m = getStatus(currentMonthKey());
  return {
    dueCount: items.filter((i) => i.status !== "paid").length, expected, received, remaining: expected - received,
    lateCount: late.length, lateAmount: late.reduce((s, l) => s + l.lateAmount, 0),
    month: { label: m.label, expected: m.expected, received: m.received },
  };
}

/* ---------------- admin: shops + monthly fee ---------------- */
const FEE = 2500;
const DOCS = [
  { label: "CNIC front", fileName: "cnic-front.jpg" }, { label: "CNIC back", fileName: "cnic-back.jpg" },
  { label: "Shop paper", fileName: "shop-paper.pdf" }, { label: "Owner photo", fileName: "owner.jpg" },
];
const monthKey = (offset: number) => toIsoDate(addMonths(now(), -offset)).slice(0, 7);

function makeFeeHistory(i: number, status: ShopStatus): FeeMonth[] {
  if (status === "pending" || status === "archived") return [];
  return [0, 1, 2, 3].map((off) => {
    const unpaid = off === 0 ? status === "inactive" || i % 4 === 0 : status === "inactive" ? off <= 1 : off === 3 && i % 5 === 0;
    return unpaid
      ? { month: monthKey(off), status: "unpaid" as const }
      : { month: monthKey(off), status: "paid" as const, paidOn: toIsoDate(addDays(addMonths(now(), -off), -(i % 5))), method: i % 3 === 0 ? "Easypaisa" : "Cash" };
  });
}
const thisMonthFee = (s: AdminShop) => (s.status === "active" || s.status === "inactive" ? s.feeHistory.find((h) => h.month === monthKey(0))?.status ?? null : null);

function makeAvatarSvg(name: string, idx: number): string {
  const colors = ["#1565c0", "#2e7d32", "#c2185b", "#7b1fa2", "#e65100", "#00838f", "#455a64"];
  const bg = colors[idx % colors.length];
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" rx="60" fill="${bg}"/><text x="50%" y="54%" font-family="Arial,sans-serif" font-size="44" font-weight="bold" fill="#ffffff" dominant-baseline="middle" text-anchor="middle">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function makeShop(i: number, name: string, owner: string, mobile: string, city: string, status: ShopStatus, ago: number): AdminShop {
  const avatar = makeAvatarSvg(owner, i);
  const s: AdminShop = {
    id: `s${i}`, shopCode: `SH-${100 + i}`, shopName: name, ownerName: owner, mobile, email: `${owner.split(" ")[0].toLowerCase()}@example.com`,
    cnic: `3520${i % 10}-${1000000 + i * 91}-${i % 9}`, address: `Main Market, ${city}`, city, status,
    registeredAt: toIsoDate(addDays(now(), -ago)), monthlyFee: FEE, feeStatus: null, feeHistory: makeFeeHistory(i, status),
    profilePic: avatar,
    documents: [{ label: "Profile Photo", fileName: "profile.jpg", url: avatar }],
  };
  s.feeStatus = thisMonthFee(s);
  return s;
}

const SEED: [string, string, string, string, ShopStatus, number][] = [
  ["Al-Rehman Electronics", "Ahmed Khan", "0300-1234567", "Lahore", "active", 120],
  ["Madina Furniture House", "Bilal Sheikh", "0321-5551234", "Faisalabad", "active", 95],
  ["City Mobile Zone", "Usman Tariq", "0333-7778899", "Karachi", "active", 80],
  ["Noor Home Appliances", "Kashif Noor", "0345-1122334", "Multan", "active", 60],
  ["Star Electronics", "Zeeshan Ali", "0312-9988776", "Rawalpindi", "active", 45],
  ["Gulshan Bike Centre", "Rashid Khan", "0301-4455667", "Karachi", "active", 33],
  ["Lahore Cooler House", "Naeem Butt", "0322-6677889", "Lahore", "inactive", 70],
  ["Super Mobile Mart", "Irfan Malik", "0334-2233445", "Gujranwala", "inactive", 55],
  ["Hassan Traders", "Hassan Raza", "0302-8899001", "Sialkot", "pending", 2],
  ["Fatima Electronics", "Fatima Noor", "0313-3344556", "Lahore", "pending", 1],
  ["Quetta Furniture Mart", "Ghulam Rasool", "0346-7788990", "Quetta", "pending", 0],
  ["Bismillah Electronics", "Tahir Mehmood", "0303-1239874", "Peshawar", "archived", 12],
];
const PRE = ["Al-Noor", "Madina", "City", "Star", "Gulshan", "Super", "Royal", "Zam Zam", "Pak", "Sunrise", "Metro", "Taj"];
const TYPE = ["Electronics", "Furniture House", "Mobile Zone", "Home Appliances", "Bike Centre", "Cooler House", "Mobile Mart", "Traders"];
const OWN = ["Imran Sheikh", "Nadia Parveen", "Tariq Mehmood", "Shahid Iqbal", "Farah Naz", "Adnan Qureshi", "Saima Akram", "Javed Iqbal", "Mubeen Raza", "Ayesha Siddiqui", "Naveed Anjum", "Sajid Hussain", "Rabia Khan", "Asad Mirza"];
const CITY = ["Lahore", "Karachi", "Multan", "Faisalabad", "Rawalpindi", "Peshawar", "Sialkot", "Gujranwala"];
const shops: AdminShop[] = SEED.map((s, i) => makeShop(i + 1, ...s));
for (let i = 13; i <= 40; i++) {
  const st: ShopStatus = i % 7 === 0 ? "inactive" : i % 11 === 0 ? "pending" : i % 17 === 0 ? "archived" : "active";
  shops.push(makeShop(i, `${PRE[i % PRE.length]} ${TYPE[(i * 3) % TYPE.length]}`, OWN[i % OWN.length], `03${10 + (i % 40)}-${String(1000000 + i * 7919).slice(0, 7)}`, CITY[i % CITY.length], st, 5 + i * 3));
}
shops[11].statusNote = "CNIC ki tasveer saaf nahi thi.";

export function getAdminShops(p: { status?: string; fee?: string; search?: string; page?: number; pageSize?: number }): AdminShopsResponse {
  const q = (p.search || "").trim().toLowerCase().replace(/-/g, "");
  const searched = shops.filter((s) => !q || [s.shopName, s.ownerName, s.shopCode].some((v) => v.toLowerCase().includes(q)) || s.mobile.replace(/-/g, "").includes(q));
  const filtered = searched
    .filter((s) => !p.status || p.status === "all" || s.status === p.status)
    .filter((s) => !p.fee || p.fee === "all" || s.feeStatus === p.fee);
  const page = Number(p.page) || 1;
  const pageSize = Number(p.pageSize) || 8;
  const count = (st: ShopStatus) => searched.filter((s) => s.status === st).length;
  return {
    items: filtered.slice((page - 1) * pageSize, page * pageSize).map((s) => ({ ...s })), total: filtered.length, page, pageSize,
    counts: { all: searched.length, pending: count("pending"), active: count("active"), inactive: count("inactive"), archived: count("archived") },
  };
}
export function getAdminShop(id: string): AdminShop {
  const s = shops.find((x) => x.id === id);
  if (!s) throw new MockError("Shop not found", 404);
  return { ...s };
}
/** Any status can be set from any status. */
export function setAdminShopStatus(id: string, status: ShopStatus, reason?: string): AdminShop {
  const s = shops.find((x) => x.id === id);
  if (!s) throw new MockError("Shop not found", 404);
  s.status = status;
  s.statusNote = status === "inactive" || status === "archived" ? reason : undefined;
  if ((status === "active" || status === "inactive") && !s.feeHistory.some((h) => h.month === monthKey(0))) s.feeHistory.unshift({ month: monthKey(0), status: "unpaid" });
  s.feeStatus = thisMonthFee(s);
  return { ...s };
}
export function setAdminShopFee(id: string, month: string, status: "paid" | "unpaid", method?: string): AdminShop {
  const s = shops.find((x) => x.id === id);
  if (!s) throw new MockError("Shop not found", 404);
  let h = s.feeHistory.find((x) => x.month === month);
  if (!h) {
    h = { month, status: "unpaid" };
    s.feeHistory.unshift(h);
  }
  h.status = status;
  if (status === "paid") {
    h.paidOn = today();
    h.method = method || "Cash";
  } else {
    delete h.paidOn;
    delete h.method;
  }
  s.feeStatus = thisMonthFee(s);
  return { ...s };
}
export function getAdminDashboard(): AdminDashboardStats {
  const count = (st: ShopStatus) => shops.filter((s) => s.status === st).length;
  const active = shops.filter((s) => s.status === "active");
  const paid = active.filter((s) => s.feeStatus === "paid");
  const unpaid = active.filter((s) => s.feeStatus !== "paid");
  return {
    totalShops: shops.length, activeShops: count("active"), pendingShops: count("pending"), inactiveShops: count("inactive"), archivedShops: count("archived"),
    monthLabel: monthLabel(monthKey(0)),
    feeCollected: paid.reduce((a, s) => a + s.monthlyFee, 0), feePaidShops: paid.length,
    feeRemaining: unpaid.reduce((a, s) => a + s.monthlyFee, 0), feeUnpaidShops: unpaid.length,
    feePercent: active.length ? Math.round((paid.length / active.length) * 100) : 0,
  };
}

/* ---------------- auth ---------------- */
const digitsOnly = (v: string) => v.replace(/\D/g, "");
export function shopLogin(mobile: string, password: string) {
  const shop = shops.find((s) => digitsOnly(s.mobile) === digitsOnly(mobile));
  if (!shop || !password) throw new MockError("Mobile number ya password sahi nahi hai", 401);
  if (shop.status === "pending") throw new MockError("Aap ki registration abhi pending hai. Admin approve karega to login ho jayega.", 403);
  if (shop.status === "archived") throw new MockError("Aap ka account archive ho chuka hai. Admin se rabta karein.", 403);
  if (shop.status === "inactive") throw new MockError("Aap ka account band hai. Admin se rabta karein.", 403);
  return { access_token: "mock-shop-token", user: { id: shop.id, shopName: shop.shopName, ownerName: shop.ownerName, mobile: shop.mobile } };
}
export function shopSignup(p: ShopSignupPayload) {
  if (shops.some((s) => digitsOnly(s.mobile) === digitsOnly(p.mobile))) throw new MockError("Yeh mobile number pehle se registered hai", 409);
  const s = makeShop(shops.length + 1, p.shopName, p.ownerName, p.mobile, p.city, "pending", 0);
  s.address = p.address;
  s.email = p.email;
  s.cnic = p.cnic;
  if (p.profilePic) {
    s.profilePic = p.profilePic;
    s.documents = [{ label: "Profile Photo", fileName: "profile.jpg", url: p.profilePic }];
  }
  shops.unshift(s);
  return { id: s.id };
}
export function adminLogin(email: string, password: string) {
  if (email.trim().toLowerCase() !== "admin@installmentpro.pk" || password !== "Admin@123") throw new MockError("Invalid email or password", 401);
  return { access_token: "mock-admin-token", user: { id: "a1", name: "Admin", email: "admin@installmentpro.pk" } };
}
