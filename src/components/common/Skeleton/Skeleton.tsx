import type { CSSProperties, ReactNode } from "react";
import "./skeleton.scss";

interface SkeletonProps {
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  radius?: CSSProperties["borderRadius"];
  className?: string;
}

export const Skeleton = ({
  width,
  height,
  radius,
  className = "",
}: SkeletonProps) => {
  const style: CSSProperties = {
    ...(width !== undefined && { width }),
    ...(height !== undefined && { height }),
    ...(radius !== undefined && { borderRadius: radius }),
  };

  return (
    <span
      className={`skeleton ${className}`.trim()}
      style={style}
      aria-hidden="true"
    />
  );
};

export const SkeletonGroup = ({
  children,
  className = "",
  label = "Loading…",
}: {
  children: ReactNode;
  className?: string;
  label?: string;
}) => (
  <div
    className={`skeleton-group ${className}`.trim()}
    role="status"
    aria-busy="true"
  >
    <span className="skeleton-visually-hidden">{label}</span>
    <div className="skeleton-content" aria-hidden="true">
      {children}
    </div>
  </div>
);
