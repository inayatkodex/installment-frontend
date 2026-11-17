import type { CSSProperties } from "react";
import Image from "next/image";

interface BrandLogoProps {
  size?: number;
  variant?: "color" | "white";
  className?: string;
  title?: string;
}

const BrandLogo = ({
  size = 40,
  variant = "color",
  className,
  title,
}: BrandLogoProps) => (
  <Image
    src={
      variant === "white"
        ? "/qistpro-logos/svg/05-logo-white-transparent.svg"
        : "/qistpro-logos/svg/01-logo-primary.svg"
    }
    width={Math.round(size * (879 / 258))}
    height={size}
    loading="eager"
    className={["brand-logo", className].filter(Boolean).join(" ")}
    style={{ "--brand-logo-height": `${size}px` } as CSSProperties}
    alt={title ?? ""}
    aria-hidden={title ? undefined : true}
  />
);

export default BrandLogo;
