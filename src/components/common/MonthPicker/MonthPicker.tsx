"use client";

import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import Modal from "../modal/Modal";
import CommonBtn from "../CommonButton/Button";
import "./monthpicker.scss";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

interface Props {
  value: string;      // "YYYY-MM"
  maxValue: string;   // latest month that can be chosen
  onChange: (month: string) => void;
}

const shift = (v: string, n: number) => {
  const [y, m] = v.split("-").map(Number);
  const d = new Date(y, m - 1 + n, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const MonthPicker = ({ value, maxValue, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(Number(value.slice(0, 4)));
  const [y, m] = value.split("-").map(Number);
  const maxYear = Number(maxValue.slice(0, 4));

  const choose = (i: number) => {
    onChange(`${year}-${String(i + 1).padStart(2, "0")}`);
    setOpen(false);
  };

  return (
    <>
      <div className="month-picker">
        <button type="button" className="mp-arrow" aria-label="Pichla mahina" onClick={() => onChange(shift(value, -1))}><ChevronLeft size={22} /></button>
        <button type="button" className="mp-current" aria-label="Mahina chunein" onClick={() => { setYear(y); setOpen(true); }}>
          <CalendarDays size={20} aria-hidden="true" />
          {FULL[m - 1]} {y}
        </button>
        <button type="button" className="mp-arrow" aria-label="Agla mahina" disabled={value >= maxValue} onClick={() => onChange(shift(value, 1))}><ChevronRight size={22} /></button>
      </div>

      {open && (
        <Modal title="Month chunein" titleUr="مہینہ چنیں" onClose={() => setOpen(false)}>
          <div className="mp-year">
            <button type="button" aria-label="Pichla saal" onClick={() => setYear(year - 1)}><ChevronLeft size={22} /></button>
            <strong>{year}</strong>
            <button type="button" aria-label="Agla saal" disabled={year >= maxYear} onClick={() => setYear(year + 1)}><ChevronRight size={22} /></button>
          </div>
          <div className="mp-grid">
            {MONTHS.map((name, i) => {
              const key = `${year}-${String(i + 1).padStart(2, "0")}`;
              return (
                <button key={name} type="button" disabled={key > maxValue} aria-pressed={key === value} className={key === value ? "on" : ""} onClick={() => choose(i)}>
                  {name}
                </button>
              );
            })}
          </div>
          <CommonBtn text="Cancel" className="gray-btn full-btn" onClick={() => setOpen(false)} />
        </Modal>
      )}
    </>
  );
};

export default MonthPicker;
