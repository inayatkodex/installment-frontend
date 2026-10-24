import { useId } from "react";

interface Props {
  size?: number;
  /** "color" = blue tile (light backgrounds). "white" = white tile (blue / dark backgrounds). */
  variant?: "color" | "white";
  className?: string;
  /** Pass a title only when the mark is used alone (no text next to it). */
  title?: string;
}

/**
 * Installment Pro logo mark: a ring of 4 qistein.
 * 3 paid (solid), 1 pending (amber), with a tick in the middle.
 * Geometry is identical to the delivered SVG files (512 x 512 grid).
 */
const LogoMark = ({ size = 40, variant = "color", className, title }: Props) => {
  const gradientId = `lp-grad-${useId().replace(/:/g, "")}`;
  const white = variant === "white";
  const ring = white ? "#1565c0" : "#ffffff";
  const accent = white ? "#f5a000" : "#ffc233";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {!white && (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1976d2" />
            <stop offset="1" stopColor="#0d47a1" />
          </linearGradient>
        </defs>
      )}
      <rect width="512" height="512" rx="116" fill={white ? "#ffffff" : `url(#${gradientId})`} />
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <g stroke={ring} strokeWidth="46">
          <path d="M284.62 125.09A134 134 0 0 1 386.91 227.38" />
          <path d="M386.91 284.62A134 134 0 0 1 284.62 386.91" />
          <path d="M227.38 386.91A134 134 0 0 1 125.09 284.62" />
        </g>
        <path d="M125.09 227.38A134 134 0 0 1 227.38 125.09" stroke={accent} strokeWidth="46" />
        <polyline points="200.88 258.12 239.04 296.28 311.12 215.72" stroke={ring} strokeWidth="36.04" />
      </g>
    </svg>
  );
};

export default LogoMark;
