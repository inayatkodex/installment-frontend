import React from "react";
import "./Button.scss";

interface btnProps {
  icon?: React.ReactNode;
  text: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  iconPosition?: "left" | "right";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  ariaLabel?: string;
}

/** className options: "outline-btn", "danger-btn", "success-btn", "sm-btn", "full-btn" */
const CommonBtn = ({
  icon,
  text,
  className = "",
  onClick,
  style,
  iconPosition = "left",
  type = "button",
  disabled = false,
  ariaLabel,
}: btnProps) => {
  return (
    <button
      className={`common-btn ${className}`}
      onClick={onClick}
      style={style}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {icon && iconPosition === "left" && icon}
      <span>{text}</span>
      {icon && iconPosition === "right" && icon}
    </button>
  );
};

export default CommonBtn;
