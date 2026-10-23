/** Installment maths in whole rupees. The last installment absorbs any rounding. */
export function calcPlan(total: number, down: number, months: number) {
  const remaining = Math.max(total - down, 0);
  if (!months || remaining === 0) return { remaining, monthly: 0, last: 0 };
  const monthly = Math.ceil(remaining / months);
  return { remaining, monthly, last: remaining - monthly * (months - 1) };
}

export const toIsoDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const defaultFirstDue = () => {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return toIsoDate(d);
};

export const currentMonthKey = () => toIsoDate(new Date()).slice(0, 7);
