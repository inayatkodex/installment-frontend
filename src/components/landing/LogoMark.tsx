import Image from "next/image";

interface Props {
  size?: number;
  variant?: "color" | "white";
  className?: string;
  title?: string;
}

const LogoMark = ({ size = 40, variant = "color", className, title }: Props) => {
  return (
    <Image
      src={
        variant === "white"
          ? "/logo/installment-pro-logo-horizontal-white.svg"
          : "/logo/installment-pro-logo-horizontal.svg"
      }
      width={Math.round(size * 4.711)}
      height={size}
      className={className}
      alt={title ?? ""}
      aria-hidden={title ? undefined : true}
    />
  );
};

export default LogoMark;
