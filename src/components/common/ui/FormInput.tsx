"use client";

import React, { ReactNode, useId, useState } from "react";
import { EyeHideIcon, EyeIcon } from "@/svgs";
import "./formInput.scss";

type ChangeEv = React.ChangeEvent<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;

interface FormInputProps {
  label?: string;
  labelUr?: string; // Urdu label shown on the right of the English one
  optional?: boolean;
  name?: string;
  type?: string;
  value?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "tel" | "email" | "search";
  maxLength?: number;
  min?: string;
  max?: string;
  Icon?: ReactNode;
  options?: { label: string; value: string | number }[]; // renders a select
  multiline?: boolean;
  rows?: number;
  onChange?: (e: ChangeEv) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

const FormInput = ({
  label,
  labelUr,
  optional = false,
  name,
  type = "text",
  value,
  placeholder,
  error,
  disabled = false,
  autoFocus,
  autoComplete,
  inputMode,
  maxLength,
  min,
  max,
  Icon = null,
  options,
  multiline = false,
  rows = 3,
  onChange,
  onKeyDown,
}: FormInputProps) => {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const common = {
    id,
    name,
    value,
    disabled,
    onChange,
    onKeyDown,
    autoFocus,
    "aria-invalid": !!error,
    "aria-describedby": error ? `${id}-err` : undefined,
  };

  return (
    <div className={`form-field ${error ? "has-error" : ""}`}>
      {label && (
        <label className="form-label" htmlFor={id}>
          <span>
            {label}
            {optional && <em className="form-optional"> (optional)</em>}
          </span>
          {labelUr && (
            <span className="ur" lang="ur">
              {labelUr}
            </span>
          )}
        </label>
      )}

      <div className={`form-control-wrap ${Icon ? "with-icon" : ""}`}>
        {Icon && <span className="form-icon">{Icon}</span>}

        {options ? (
          <select className="form-control" {...common}>
            <option value="" disabled hidden>
              {placeholder || "Chunein"}
            </option>
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ) : multiline ? (
          <textarea
            className="form-control"
            rows={rows}
            placeholder={placeholder}
            maxLength={maxLength}
            {...common}
          />
        ) : (
          <input
            className="form-control"
            type={isPassword && showPassword ? "text" : type}
            lang={type === "date" ? "en-GB" : undefined}
            placeholder={placeholder}
            autoComplete={autoComplete}
            inputMode={inputMode}
            maxLength={maxLength}
            min={min}
            max={max}
            {...common}
          />
        )}

        {isPassword && (
          <button
            type="button"
            className="form-eye"
            onClick={() => setShowPassword((p) => !p)}
            aria-label={
              showPassword ? "Password chupayen" : "Password dikhayen"
            }
          >
            {showPassword ? <EyeHideIcon /> : <EyeIcon />}
          </button>
        )}
      </div>

      {error && (
        <p id={`${id}-err`} className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;
