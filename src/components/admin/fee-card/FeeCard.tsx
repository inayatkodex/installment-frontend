"use client";

import { type FormEvent, useEffect, useState } from "react";
import { Clock3, Save, WalletCards } from "lucide-react";
import { formatMonth, formatRs } from "@/shared/formatUtils";
import { AdminShop } from "@/types/adminShop";
import "./fee-card.scss";

interface Props {
  shop: AdminShop;
  busy?: boolean;
  onSetAmount: (amount: number) => void;
}

const FeeCard = ({ shop, busy, onSetAmount }: Props) => {
  const [amount, setAmount] = useState(
    shop.nextMonthlyFee ?? shop.monthlyFee ?? "",
  );
  useEffect(() => {
    setAmount(shop.nextMonthlyFee ?? shop.monthlyFee ?? "");
  }, [shop.monthlyFee, shop.nextMonthlyFee]);

  const saveAmount = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedAmount = Number(amount);
    if (Number.isSafeInteger(parsedAmount) && parsedAmount > 0) {
      onSetAmount(parsedAmount);
    }
  };

  return (
    <section className="fee-card" aria-label="Monthly Platform Fee">
      <header className="fc-head">
        <div className="fc-title">
          <span className="fc-icon">
            <WalletCards size={19} aria-hidden="true" />
          </span>
          <div>
            <h2>Monthly shop fee</h2>
            <span className="fc-sub">Set and track this shop’s fee</span>
          </div>
        </div>
        <span className={`fc-current-pill ${shop.monthlyFee ? "set" : ""}`}>
          {shop.monthlyFee ? "Fee set" : "Not set"}
        </span>
      </header>

      <div className="fc-summary">
        <div className="fc-summary-current">
          <span>Current monthly fee</span>
          <strong>
            {shop.monthlyFee ? formatRs(shop.monthlyFee) : "Not set"}
          </strong>
        </div>
        <div className="fc-summary-next">
          <span>From {formatMonth(shop.feeChangeEffectiveMonth)}</span>
          <strong>
            {shop.nextMonthlyFee
              ? formatRs(shop.nextMonthlyFee)
              : shop.monthlyFee
                ? formatRs(shop.monthlyFee)
                : "—"}
          </strong>
        </div>
      </div>

      <form className="fc-amount-form" onSubmit={saveAmount}>
        <label htmlFor="shop-monthly-fee">
          <span>Set monthly amount</span>
          <span className="fc-input-wrap">
            <span>Rs.</span>
            <input
              id="shop-monthly-fee"
              type="number"
              min="1"
              max="2147483647"
              step="1"
              required
              value={amount}
              onChange={(event) =>
                setAmount(
                  event.target.value === "" ? "" : Number(event.target.value),
                )
              }
              placeholder="Enter amount"
            />
          </span>
        </label>
        <button type="submit" disabled={busy || !amount}>
          <Save size={15} aria-hidden="true" />
          {busy ? "Saving…" : "Save fee"}
        </button>
      </form>
      <p className="fc-effective" role="note">
        <Clock3 size={15} aria-hidden="true" />
        <span>
          {shop.monthlyFee
            ? `Any change applies from ${formatMonth(shop.feeChangeEffectiveMonth)}.`
            : `First fee starts from ${formatMonth(shop.feeChangeEffectiveMonth)}.`}
        </span>
      </p>
    </section>
  );
};

export default FeeCard;
