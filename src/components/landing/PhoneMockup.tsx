/**
 * Decorative phone that shows the real "Aaj ki wasooli" screen.
 * Pure markup (no buttons / links) and hidden from screen readers.
 */
const STATS = [
  { value: "3", label: "Customers baaki" },
  { value: "Rs. 14,000", label: "Lena baaki hai" },
  { value: "Rs. 6,000", label: "Mil gaye", tone: "green" },
];

const CUSTOMERS = [
  { initials: "SU", name: "Sana Ullah", phone: "0345-9988776", status: "Partly paid", amount: "Rs. 4,000" },
  { initials: "UA", name: "Usman Ali", phone: "0333-1112223", status: "Pending", amount: "Rs. 5,000" },
  { initials: "HB", name: "Hina Bibi", phone: "0322-1100229", status: "Pending", amount: "Rs. 5,000" },
];

const TABS = ["Home", "Aaj", "Customers", "Late", "Status"];

const PhoneMockup = () => (
  <div className="lp-phone" aria-hidden="true">
    <div className="lp-phone-screen">
      <div className="lp-app-bar">
        <span>Al-Rehman Electronics</span>
        <span>Installment Pro</span>
      </div>

      <div className="lp-app-title">
        <b>Aaj ki wasooli</b>
        <span className="ur" lang="ur">آج کی وصولی</span>
      </div>

      <div className="lp-app-stats">
        {STATS.map((s) => (
          <div key={s.label} className={`lp-app-stat ${s.tone ?? ""}`}>
            <b>{s.value}</b>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      <ul className="lp-app-list">
        {CUSTOMERS.map((c) => (
          <li key={c.name} className="lp-app-row">
            <span className="lp-app-avatar">{c.initials}</span>
            <div className="lp-app-info">
              <b>{c.name}</b>
              <span>{c.phone}</span>
              <em>{c.status}</em>
            </div>
            <div className="lp-app-amount">
              <b>{c.amount}</b>
              <span className="lp-app-receive">Receive</span>
            </div>
          </li>
        ))}
      </ul>

      <div className="lp-app-done">
        <span>Aaj mil gaye (1 customer)</span>
        <b>Rs. 6,000</b>
      </div>

      <div className="lp-app-tabs">
        {TABS.map((t) => (
          <span key={t} className={t === "Aaj" ? "active" : ""}>{t}</span>
        ))}
      </div>
    </div>
  </div>
);

export default PhoneMockup;
