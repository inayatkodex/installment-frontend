"use client";

import { useEffect, useRef, useState } from "react";
import "./date-parts-picker.scss";

interface Props {
  label: string;
  labelUr?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const toDisplayDate = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match ? `${Number(match[3])}/${Number(match[2])}/${match[1]}` : "";
};

const toIsoDate = (value: string) => {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value.trim());
  if (!match) return "";

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return "";
  }

  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

const DatePartsPicker = ({
  label,
  labelUr,
  value,
  onChange,
  error,
}: Props) => {
  const [displayValue, setDisplayValue] = useState(() => toDisplayDate(value));
  const previousValue = useRef(value);

  useEffect(() => {
    if (previousValue.current !== value) {
      previousValue.current = value;
      setDisplayValue(toDisplayDate(value));
    }
  }, [value]);

  const handleChange = (nextValue: string) => {
    const cleaned = nextValue.replace(/[^\d/]/g, "").slice(0, 10);
    setDisplayValue(cleaned);
    const isoDate = toIsoDate(cleaned);
    previousValue.current = isoDate;
    onChange(isoDate);
  };

  return (
    <div className={`date-parts-field ${error ? "has-error" : ""}`}>
      <label className="date-parts-label">
        <span>{label}</span>
        {labelUr && (
          <span className="ur" lang="ur">
            {labelUr}
          </span>
        )}
      </label>
      <input
        className="date-parts-input"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="DD/MM/YYYY"
        value={displayValue}
        aria-label={label}
        aria-invalid={!!error}
        onChange={(event) => handleChange(event.target.value)}
      />
      {error && (
        <p className="date-parts-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default DatePartsPicker;
