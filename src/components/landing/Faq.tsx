"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FaqItem {
  q: string;
  a: string;
}

const Faq = ({ items }: { items: FaqItem[] }) => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ul className="lp-faq">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <li key={item.q} className={`lp-faq-item ${isOpen ? "open" : ""}`}>
            <h3>
              <button
                type="button"
                id={`faq-btn-${i}`}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{item.q}</span>
                <span className="lp-faq-chevron">
                  <ChevronDown size={18} />
                </span>
              </button>
            </h3>
            <div
              id={`faq-panel-${i}`}
              role="region"
              aria-labelledby={`faq-btn-${i}`}
              className="lp-faq-panel"
              inert={!isOpen}
            >
              <div>
                <p>{item.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default Faq;
