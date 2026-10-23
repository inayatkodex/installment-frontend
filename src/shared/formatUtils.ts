const nf = new Intl.NumberFormat("en-PK");
const df = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export const formatRs = (n: number) => `Rs. ${nf.format(n)}`;
export const formatDate = (iso: string) => df.format(new Date(iso));
export const initials = (name: string) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();

export const digits = (v: string) => v.replace(/\D/g, "");
/** 03001234567 -> 0300-1234567 */
export const maskMobile = (v: string) => {
  const d = digits(v).slice(0, 11);
  return d.length > 4 ? `${d.slice(0, 4)}-${d.slice(4)}` : d;
};
/** 4220112345671 -> 42201-1234567-1 */
export const maskCnic = (v: string) => {
  const d = digits(v).slice(0, 13);
  return [d.slice(0, 5), d.slice(5, 12), d.slice(12)].filter(Boolean).join("-");
};
export const maskMoney = (v: string) => {
  const d = digits(v).slice(0, 9);
  return d ? Number(d).toLocaleString("en-PK") : "";
};
export const toNumber = (v: string) => Number(digits(v)) || 0;
export const isValidMobile = (v: string) => /^03\d{9}$/.test(digits(v));

/** "2026-10" -> "October 2026" */
export const formatMonth = (m: string) =>
  new Date(`${m}-01`).toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
