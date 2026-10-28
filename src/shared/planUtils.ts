export const MAX_SCHEDULE_INSTALLMENTS = 1200;

/** Installment maths in whole rupees. The final installment covers the balance. */
export function calcPlan(total: number, down: number, monthlyPayment: number) {
  const remaining = Math.max(total - down, 0);
  if (!remaining) return { remaining, monthly: monthlyPayment, installments: 0, last: 0 };
  if (!monthlyPayment) return { remaining, monthly: 0, installments: 0, last: 0 };
  const installments = Math.ceil(remaining / monthlyPayment);
  return {
    remaining,
    monthly: monthlyPayment,
    installments,
    last: remaining - monthlyPayment * (installments - 1),
  };
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
