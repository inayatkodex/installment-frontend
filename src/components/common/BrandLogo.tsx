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
        ? "/logo/installment-pro-logo-horizontal-white.svg"
        : "/logo/installment-pro-logo-horizontal.svg"
    }
    width={Math.round(size * 4.711)}
    height={size}
    loading="eager"
    className={className}
    alt={title ?? ""}
    aria-hidden={title ? undefined : true}
  />
);

export default BrandLogo;
